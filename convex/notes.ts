import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embed(text: string) {
  const embedding = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return embedding.data[0].embedding;
}

export const setNoteEmbedding = internalMutation({
  args: {
    noteId: v.id("notes"),
    embedding: v.array(v.number()), // The text of the note
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.patch(args.noteId, {
      embedding: args.embedding,
    });

    return note;
  },
});

export const createNoteEmbedding = internalAction({
  args: {
    noteId: v.id("notes"),
    text: v.string(), // The text of the note
  },
  handler: async (ctx, args) => {
    const embedding = await embed(args.text);

    await ctx.runMutation(internal.notes.setNoteEmbedding, {
      noteId: args.noteId,
      embedding,
    });
  },
});

export const createNote = mutation({
  args: {
    text: v.string(), // The text of the note
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new Error("You must be logged in to create a note.");
    }

    const noteId = await ctx.db.insert("notes", {
      text: args.text,
      tokenIdentifier: userId,
    });

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId: noteId,
      text: args.text,
    });
  },
});

export const getNotes = query({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
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

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"), // The ID of the note to delete
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("You must be logged in to delete a note.");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note || note.tokenIdentifier !== userId) {
      throw new ConvexError("You do not have permission to delete this note.");
    }

    await ctx.db.delete(args.noteId);
  },
});
