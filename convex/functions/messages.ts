import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const sendMessage = mutation({
  args: { 
    conversationId: v.optional(v.id("conversations")), 
    senderId: v.string(), 
    text: v.string(),
    receiverId: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    let convId = args.conversationId;

    // if conversation is not provided, find or create conversation based on sender and receiver
    if (!convId && args.receiverId) {
      // sort the member IDs to maintain consistency in indexing
      const sortedMembers = [args.senderId, args.receiverId].sort();
      
      const existing = await ctx.db
        .query("conversations")
        .withIndex("by_memberIds", (q) => q.eq("memberIds", sortedMembers))
        .unique();

      if (existing) {
        convId = existing._id;
      } else {
        convId = await ctx.db.insert("conversations", {
          memberIds: sortedMembers,
          typingStatus: { isTyping: false, userId: "" },
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (!convId) throw new Error("Conversation ID or Receiver ID is required");

    // insert message 
    await ctx.db.insert("messages", {
      conversationId: convId,
      senderId: args.senderId,
      text: args.text,
      seen: false, 
      createdAt: new Date().toISOString(),
      deleted: false, 
    });

    return convId;
  },
});

export const markAsSeen = mutation({
  args: { 
    conversationId: v.id("conversations"), 
    currentUserId: v.string() 
  },
  handler: async (ctx, args) => {
    //use index instead of filter(Fast performance)
    const unseenMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => 
        q.and(
          q.neq(q.field("senderId"), args.currentUserId), 
          q.eq(q.field("seen"), false) 
        )
      )
      .collect();

    // Seen status update karein
    for (const msg of unseenMessages) {
      await ctx.db.patch(msg._id, { seen: true });
    }
  },
});