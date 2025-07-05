// whatever you data model is, name the file accordingly

import { action, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createDocument = mutation({
  args: {
    // what the user can send from frontend to backend
    title: v.string(),
    fileId: v.id("_storage"),
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

// In convex, there is action function, typically used when you need to contact a third-party library or API.
// Something that is not atomic, aka not just a database operation within convex.
// Whereas, mutation must be transactional, and have to be retriable

// Since we are planning to use OpenAI API to ask questions, we will use action
export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"), // validate that the documentId is a valid ID
  },
  handler: async (ctx, args) => {
    // check authentication
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    // Note in an action, uou cannot access the convex database directly.
    // Why? Because actions are not transactional.
    // You need to invoke mutation / query to access the database, and wait for those to finish before proceeding.

    // This runs a query to get the document with the given ID
    const document = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new ConvexError("Document not found");
    }

    // Get the file
    const file = await ctx.storage.get(document.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const text = await file.text(); // read the file content as text

    // use the content of the file to ask OpenAI to do something, https://github.com/openai/openai-node
    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", // system role: this is the context that OpenAI will use to answer the question, provided by the developer
            content: `Here is a text file: ${text}`,
          },
          {
            role: "user", // user role: this is the question the user asked, the person visiting the website
            content: `Please answer this question: ${args.question}`,
          },
        ],
      });

    return chatCompletion.choices[0].message.content; // return the response from OpenAI
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

export const getDocument = query({
  args: {
    documentId: v.id("documents"), // validate that the documentId is a valid ID for the "documents" table
  },
  handler: async (ctx, args) => {
    // convex is checking the clerk authentication for us
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return null;
    }
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      return null; // document not found
    }
    if (document.tokenIdentifier !== userId) {
      return null;
    }
    // get the document with the given ID
    return {
      ...document,
      documentUrl: await ctx.storage.getUrl(document.fileId),
    };
  },
});
