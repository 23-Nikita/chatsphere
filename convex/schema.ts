import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    isOnline: v.boolean(), // Optional se hatakar boolean kar diya taaki logic simple rahe
  }).index("by_clerkId", ["clerkId"]),

  // Conversations table
  conversations: defineTable({
    memberIds: v.array(v.string()),
    createdAt: v.string(),
    // Typing status ko properly define kiya yahan:
    typingStatus: v.optional(
      v.object({
        userId: v.string(),
        isTyping: v.boolean(),
      })
    ),
  }).index("by_memberIds", ["memberIds"]),

  // Messages table
  messages: defineTable({
    conversationId: v.id("conversations"), // Type safety ke liye v.id use kiya
    senderId: v.string(),
    text: v.string(),
    createdAt: v.string(),
    deleted: v.boolean(),
    seen: v.optional(v.boolean()),
  }).index("by_conversationId", ["conversationId"]),
});