// whatever you data model is, name the file accordingly

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDocument = mutation({
  args: {
    // what the user can send from frontend to backend
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // what is going to be executed on the backend
    await ctx.db.insert("documents", {
      title: args.title,
    });
  },
});

export const getDocuments = query({
  handler: async (ctx) => {
    // get everything from the "document" table
    return await ctx.db.query("documents").collect();
  },
});
