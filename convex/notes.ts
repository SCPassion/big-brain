import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
