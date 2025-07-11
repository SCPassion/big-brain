import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNote = mutation({
  args: {
    text: v.string(), // The text of the note
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new Error("You must be logged in to create a note.");
    }

    const note = await ctx.db.insert("notes", {
      text: args.text,
      tokenIdentifier: userId,
    });

    return note;
  },
});

export const getNotes = query({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new Error("You must be logged in to view notes.");
    }

    return await ctx.db
      .query("notes")
      .withIndex("by_tokenIdenifier", (q) => q.eq("tokenIdentifier", userId))
      .order("desc")
      .collect();
  },
});

export const getNote = query({
  args: {
    noteId: v.id("notes"), // The ID of the note to retrieve
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const note = await ctx.db.get(args.noteId);

    if (!note || note.tokenIdentifier !== userId) {
      return null;
    }

    return note;
  },
});
