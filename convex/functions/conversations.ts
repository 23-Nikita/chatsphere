// convex/functions.ts (Conversation related logic)
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// ------------------- SET TYPING STATUS -------------------
export const setTypingStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      typingStatus: {
        userId: args.senderId,
        isTyping: args.isTyping,
      },
    });
  },
});

// ------------------- CREATE CONVERSATION -------------------
export const createConversation = mutation({
  args: {
    memberIds: v.array(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const sortedMembers = [...args.memberIds].sort();

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_memberIds", (q) =>
        q.eq("memberIds", sortedMembers)
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("conversations", {
      memberIds: sortedMembers,
      createdAt: args.createdAt,
    });
  },
});

// ------------------- GET CONVERSATION WITH USER -------------------
export const getConversationWithUser = query({
  args: {
    currentUserId: v.string(),
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const sortedMembers = [args.currentUserId, args.otherUserId].sort();

    return await ctx.db
      .query("conversations")
      .withIndex("by_memberIds", (q) =>
        q.eq("memberIds", sortedMembers)
      )
      .unique();
  },
});

// ------------------- GET MESSAGES BY CONVERSATION -------------------
export const getMessagesByConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("asc")
      .collect();
  },
});

// ------------------- GET USER CONVERSATIONS (Updated with Unread Count) -------------------
export const getUserConversations = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    // 1. Saari conversations fetch karein
    const allConversations = await ctx.db.query("conversations").collect();

    // 2. Filter karein wahi jisme current user member hai
    const userConversations = allConversations.filter((conv) =>
      conv.memberIds.includes(userId)
    );

    const results = await Promise.all(
      userConversations.map(async (conv) => {
        // Last message nikalne ke liye
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conv._id)
          )
          .order("desc")
          .first();

        // 🔹 REQUIREMENT #9 Logic: Unread messages count karein
        // Wo messages jo is conversation mein hain, seen: false hain, 
        // aur current user ne nahi bheje.
        const unreadMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conv._id)
          )
          .filter((q) =>
            q.and(
              q.eq(q.field("seen"), false),
              q.neq(q.field("senderId"), userId)
            )
          )
          .collect();

        return {
          ...conv,
          lastMessage,
          unreadCount: unreadMessages.length, // Sidebar ko ye number milega
        };
      })
    );

    return results.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.createdAt;
      const bTime = b.lastMessage?.createdAt || b.createdAt;
      return bTime.localeCompare(aTime);
    });
  },
});

// ------------------- MARK AS SEEN (New Mutation) -------------------
export const markAsSeen = mutation({
  args: { 
    conversationId: v.id("conversations"), 
    userId: v.string() 
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => 
        q.and(
          q.eq(q.field("seen"), false),
          q.neq(q.field("senderId"), args.userId)
        )
      )
      .collect();

    // Saare unread messages ko seen: true kar do
    for (const msg of unreadMessages) {
      await ctx.db.patch(msg._id, { seen: true });
    }
  },
});