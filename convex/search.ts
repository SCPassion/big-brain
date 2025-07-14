import { v } from "convex/values";
import { action } from "./_generated/server";
import { embed } from "./notes";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const searchAction = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const embedding = await embed(args.search);
    // 2. Then search for similar foods!
    const noteResults = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding, // the vector to search for
      limit: 5, // how many results to return
      filter: (q) => q.eq("tokenIdentifier", userId), // only search for notes that are related to the user
    });

    const documentResults = await ctx.vectorSearch(
      "documents",
      "by_embedding",
      {
        vector: embedding, // the vector to search for
        limit: 5, // how many results to return
        filter: (q) => q.eq("tokenIdentifier", userId), // only search for documents that are related to the user
      }
    );

    const records: (
      | {
          type: "note";
          record: Doc<"notes">;
          score: number;
        }
      | {
          type: "document";
          score: number;
          record: Doc<"documents">;
        }
    )[] = [];

    await Promise.all(
      noteResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });

        if (!note) return;

        records.push({ record: note, type: "note", score: result._score });
      })
    );

    await Promise.all(
      documentResults.map(async (result) => {
        const document = await ctx.runQuery(api.documents.getDocument, {
          documentId: result._id,
        });

        if (!document) return;

        records.push({
          record: document,
          type: "document",
          score: result._score,
        });
      })
    );

    return records.sort((a, b) => b.score - a.score); // sort by score descending
  },
});
