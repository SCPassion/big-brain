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
    // check authentication
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    console.log("User ID:", userId);
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    // Added the document to the "documents" table with clerk user Id
    await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userId, // associate the document with the user
    });
  },
});
```

# Query in Convex

```ts
export const getDocuments = query({
  handler: async (ctx) => {
    // convex is checking the clerk authentication for us
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    console.log("User ID:", userId);
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
```

# Frontend in Nextjs

```ts
const createDocument = useMutation(api.documents.createDocument);
const documents = useQuery(api.documents.getDocuments);
<button onClick={() => createDocument({ title: "hello world" })}>
```

# File Upload to Convex Storage + Database

## 1. Backend: Generate Upload URL + Store File Reference

```ts
// Generate a signed URL for uploading files to storage
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // Check authentication
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Create document with file reference
export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.string(), // This is the file ID from storage
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    // Store file metadata in database
    await ctx.db.insert("documents", {
      title: args.title,
      fileId: args.fileId, // Reference to the uploaded file
      tokenIdentifier: userId,
    });
  },
});
```

## 2. Frontend: Upload File + Create Database Record

```tsx
// In your React component
const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
const createDocument = useMutation(api.documents.createDocument);

async function handleUpload(title: string, file: File) {
  // Step 1: Get upload URL from Convex
  const uploadUrl = await generateUploadUrl();

  // Step 2: Upload file to Convex storage
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  const { storageId } = await response.json();

  // Step 3: Create database record with file reference
  await createDocument({
    title: title,
    fileId: storageId, // Link database record to uploaded file
  });
}
```

## 3. Schema: Include File Reference

```ts
// convex/schema.ts
export default defineSchema({
  documents: defineTable({
    title: v.string(),
    tokenIdentifier: v.string(),
    fileId: v.string(), // File ID from storage service
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
```

## 4. File Input Form (React Hook Form + Zod)

```tsx
const formSchema = z.object({
  title: z.string().min(1).max(250),
  file: z.instanceof(File),
});

// In your form component
<FormField
  control={form.control}
  name="file"
  render={({ field: { value, onChange, ...fieldProps } }) => (
    <FormItem>
      <FormLabel>File</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept=".txt, .xml, .doc"
          {...fieldProps}
          onChange={(event) => {
            const file = event.target.files?.[0];
            onChange(file); // Tell React Hook Form about the file
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

# OpenAI github :

https://github.com/openai/openai-node
npm install openai

# query vs internalQuery

## Use query when:

Frontend can call it directly

Public API endpoint

User-facing functionality

## Use internalQuery when:

- Only server-side Convex functions can call it

- Private/internal business logic

- Helper functions for actions

# mutation vs internalMutation

## Use mutation when:

- Frontend can call it directly

- User-triggered actions

- Public API endpoints

## Use internalMutation when:

- Only server-side Convex functions can call it

- Private data manipulation

- Called from actions/other functions

# Rule of thumb:

- Public (frontend can call) → query/mutation

- Private (server-only) → internalQuery/internalMutation
