import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const id = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      text: args.text,
      createdAt: now,
      deleted: false,
      seen: false, // 🔹 Naya: Har naya message default mein unseen hoga
    });

    return { _id: id, ...args, createdAt: now, deleted: false, seen: false };
  },
});

// 🔹 Requirement #9: Messages ko padha hua mark karne ke liye
export const markAsSeen = mutation({
  args: { 
    conversationId: v.id("conversations"), 
    currentUserId: v.string() 
  },
  handler: async (ctx, args) => {
    // Wo saare messages dhundo jo is conversation ke hain, 
    // unseen hain aur samne wale ne bheje hain
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => 
        q.and(
          q.eq(q.field("seen"), false),
          q.neq(q.field("senderId"), args.currentUserId)
        )
      )
      .collect();

    // Sabko seen: true kar do
    for (const msg of unreadMessages) {
      await ctx.db.patch(msg._id, { seen: true });
    }
  },
});