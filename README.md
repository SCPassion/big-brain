# Install convex

```bash
npm install convex
npx convex dev
```

## Install clerk

```bash
npm install @clerk/nextjs
```

follow https://docs.convex.dev/auth/clerk#nextjs

# Avoid running multiple dev cli

In cli, install:

```bash
npm install npm-run-all --save-dev
```

Modify your dev command in the package.json

```
"scripts": {
"dev": "npm-run-all -p dev:frontend dev:backend",
"dev:frontend": "next dev --turbopack",
"dev:backend": "convex dev",
},
```

# Mutation in Convex

```ts
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
```

# Query in Convex

```ts
export const getDocuments = query({
  handler: async (ctx) => {
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }
    // get everything from the "document" table
    return await ctx.db.query("documents").collect();
  },
});
```

# Frontend in Nextjs

```ts
const createDocument = useMutation(api.documents.createDocument);
const documents = useQuery(api.documents.getDocuments);
<button onClick={() => createDocument({ title: "hello world" })}>
```
