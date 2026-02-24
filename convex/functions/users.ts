import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    // no isOnline here, we set it internally
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) return;

    await ctx.db.insert("users", {
      ...args,
      isOnline: false, // <-- ensures new users have isOnline
    });
  },
});

// ✅ change from mutation to query
export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// ------------------- SET ONLINE STATUS -------------------
export const setOnlineStatus = mutation(
  async ({ db }, { clerkId, isOnline }: { clerkId: string; isOnline: boolean }) => {
    const users = await db.query("users")
      .filter(q => q.eq(q.field("clerkId"), clerkId))
      .collect();

    if (users.length === 0) throw new Error("User not found");

    const userId: Id<"users"> = users[0]._id;
    await db.patch(userId, { isOnline });

    return { success: true };
  }
);