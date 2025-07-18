import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // When you have table with multiple columns, some columns can be indexed for fast queries and lookups.
  documents: defineTable({
    title: v.string(),
    tokenIdentifier: v.string(),
    description: v.optional(v.string()),
    embedding: v.optional(v.array(v.number())),
    fileId: v.id("_storage"), // This is the file ID from the storage service
  })
    .index("by_tokenIdenifier", ["tokenIdentifier"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tokenIdentifier"], // When vector searching, we only doing it for things that are related to the owner of the note
    }),
  // by_tokenIdenifier: a name/label for the index, you can name it whatever you want
  // ["tokenIdentifier"]: the actual field(s) to index
  // You can have multiple indexes, it will order first by the first field, then by the second field, and so on.

  notes: defineTable({
    text: v.string(),
    tokenIdentifier: v.string(),
    embedding: v.optional(v.array(v.number())),
  })
    .index("by_tokenIdenifier", ["tokenIdentifier"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tokenIdentifier"], // When vector searching, we only doing it for things that are related to the owner of the note
    }),

  chats: defineTable({
    documentId: v.id("documents"), // Reference to the document table
    tokenIdentifier: v.string(),
    isHuman: v.boolean(), // true for human messages, false for AI messages
    text: v.string(),
  }).index("by_documentId_tokenIdenifier", ["documentId", "tokenIdentifier"]),
});
