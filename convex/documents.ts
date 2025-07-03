// whatever you data model is, name the file accordingly

import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createDocument = mutation({
  args: {
    // what the user can send from frontend to backend
    title: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    // check authentication
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    // Added the document to the "documents" table with clerk user Id
    await ctx.db.insert("documents", {
      title: args.title,
      fileId: args.fileId, // this is the file ID from the storage service
      tokenIdentifier: userId, // associate the document with the user
    });
  },
});

// Generate a signed URL for uploading files to storage
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getDocuments = query({
  handler: async (ctx) => {
    // convex is checking the clerk authentication for us
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return [];
    }

    // get everything from the "document" table
    return await ctx.db
      .query("documents")
      .withIndex("by_tokenIdenifier", (q) => q.eq("tokenIdentifier", userId)) // query only for documents where the tokenIdentifier matches the user's tokenIdentifier
      .collect();
  },
});
