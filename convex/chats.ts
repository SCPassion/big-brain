import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Use internal mutation here because this is private and cannot be called from clients.
// cannot only be called by other convex functions in the server
export const createChatRecord = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    isHuman: v.boolean(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", {
      documentId: args.documentId,
      text: args.text,
      isHuman: args.isHuman,
      tokenIdentifier: args.tokenIdentifier,
    });
  },
});

export const getChatsForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return [];
    }
    return ctx.db
      .query("chats")
      .withIndex("by_documentId_tokenIdenifier", (q) =>
        q.eq("documentId", args.documentId).eq("tokenIdentifier", userId)
      )
      .collect();
  },
});
