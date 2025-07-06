# Convex Functions Usage Guide

## When to use different Convex functions and hooks

### Frontend (React Components)

#### **`useQuery`** - Read data from database

```tsx
"use client";
import { useQuery } from "convex/react";

function MyComponent() {
  // ✅ Get data from database
  const documents = useQuery(api.documents.getDocuments);

  return <div>{documents?.map((doc) => <p key={doc._id}>{doc.title}</p>)}</div>;
}
```

#### **`useMutation`** - Write data to database

```tsx
"use client";
import { useMutation } from "convex/react";

function MyComponent() {
  // ✅ Create/update/delete database records
  const createDoc = useMutation(api.documents.createDocument);

  const handleCreate = () => {
    createDoc({ title: "New Doc", fileId: "file123" });
  };

  return <button onClick={handleCreate}>Create Document</button>;
}
```

#### **`useAction`** - Complex operations (external APIs)

```tsx
"use client";
import { useAction } from "convex/react";

function MyComponent() {
  // ✅ Call external APIs, complex workflows
  const askAI = useAction(api.documents.askQuestion);

  const handleAsk = async () => {
    const response = await askAI({
      question: "What is this about?",
      documentId: "doc123",
    });
    console.log(response);
  };

  return <button onClick={handleAsk}>Ask AI</button>;
}
```

### Backend (Convex Functions)

#### **`query`** - Define database read operations

```typescript
// ✅ Define what frontend can query
export const getDocuments = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});
```

#### **`mutation`** - Define database write operations

```typescript
// ✅ Define what frontend can mutate
export const createDocument = mutation({
  args: { title: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", args);
  },
});
```

#### **`action`** - Define complex operations

```typescript
// ✅ Define operations that call external APIs
export const askQuestion = action({
  args: { question: v.string(), documentId: v.id("documents") },
  handler: async (ctx, args) => {
    // Call OpenAI API
    const response = await client.chat.completions.create({...});

    // Store in database via mutations
    await ctx.runMutation(internal.chats.createChatRecord, {...});

    return response;
  },
});
```

### Server-to-Server (Inside Convex Functions)

#### **`ctx.runQuery`** - Call queries from actions

```typescript
export const askQuestion = action({
  handler: async (ctx, args) => {
    // ✅ Actions call queries to read data
    const document = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      }
    );
  },
});
```

#### **`ctx.runMutation`** - Call mutations from actions

```typescript
export const askQuestion = action({
  handler: async (ctx, args) => {
    // ✅ Actions call mutations to write data
    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: response,
      isHuman: false,
    });
  },
});
```

#### **`ctx.runAction`** - Call actions from other actions (rare)

```typescript
export const complexWorkflow = action({
  handler: async (ctx, args) => {
    // ✅ Rarely needed - action calling another action
    const result = await ctx.runAction(api.documents.askQuestion, {
      question: "What is this?",
      documentId: args.documentId,
    });
  },
});
```

## Summary Table

| **Context**            | **Read Data**  | **Write Data**    | **Complex Operations** |
| ---------------------- | -------------- | ----------------- | ---------------------- |
| **Frontend**           | `useQuery`     | `useMutation`     | `useAction`            |
| **Backend Definition** | `query`        | `mutation`        | `action`               |
| **Server-to-Server**   | `ctx.runQuery` | `ctx.runMutation` | `ctx.runAction`        |

## Query vs InternalQuery

### Use `query` when:

- Frontend can call it directly
- Public API endpoint
- User-facing functionality

```typescript
// ✅ Frontend can call this directly
export const getDocuments = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});
```

### Use `internalQuery` when:

- Only server-side Convex functions can call it
- Private/internal business logic
- Helper functions for actions

```typescript
// ✅ Only other Convex functions can call this
export const hasAccessToDocumentQuery = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});
```

## Mutation vs InternalMutation

### Use `mutation` when:

- Frontend can call it directly
- User-triggered actions
- Public API endpoints

```typescript
// ✅ Frontend can call this directly
export const createDocument = mutation({
  args: { title: v.string(), fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", args);
  },
});
```

### Use `internalMutation` when:

- Only server-side Convex functions can call it
- Private data manipulation
- Called from actions/other functions

```typescript
// ✅ Only other Convex functions can call this
export const createChatRecord = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    isHuman: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", args);
  },
});
```

## Rule of thumb:

- **Public** (frontend can call) → `query`/`mutation`
- **Private** (server-only) → `internalQuery`/`internalMutation`

## Why Actions are Necessary

Actions handle **NON-DATABASE operations** that mutations/queries cannot:

### Actions are for:

- **External API calls** (OpenAI, Stripe, SendGrid, etc.)
- **File processing** (PDF parsing, image analysis)
- **Webhooks** (handling third-party callbacks)
- **Complex workflows** that combine multiple operations

### Mutations/Queries are for:

- **Pure database operations**
- **Must be transactional and retriable**
- **Cannot call external APIs**

### Example: Why `askQuestion` must be an action

```typescript
export const askQuestion = action({
  handler: async (ctx, args) => {
    // 1. Database check (via query)
    const document = await ctx.runQuery(internal.documents.hasAccessToDocumentQuery, {...});

    // 2. File processing (allowed in actions)
    const file = await ctx.storage.get(document.fileId);
    const text = await file.text();

    // 3. ❌ CANNOT DO THIS IN MUTATION - External API call
    const chatCompletion = await client.chat.completions.create({...});

    // 4. Database writes (via mutations)
    await ctx.runMutation(internal.chats.createChatRecord, {...});

    return response;
  },
});
```

If you tried to use only mutations, this would fail because **mutations cannot call external APIs**.

## Database Access Pattern

### Actions cannot access database directly:

```typescript
// ❌ This doesn't work in actions
const document = await ctx.db.get(documentId);
```

### Actions must use runQuery/runMutation:

```typescript
// ✅ This works in actions
const document = await ctx.runQuery(api.documents.getDocument, {
  documentId: args.documentId,
});
```

### The flow:

```
Action → ctx.runQuery → Query → ctx.db (database access)
  ↑           ↑           ↑         ↑
Cannot    Indirect    Direct    Direct
access    access      access    access
db        via query   to db     to db
```

**Actions get database access indirectly** through queries/mutations, maintaining the separation between transactional database operations and external API calls.

## ConvexHttpClient vs Hooks

### Use ConvexHttpClient when:

- **Next.js server components** (can't use hooks)
- **API routes** (server-side)
- **Server-side rendering**

```typescript
// Server component
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function DocumentsPage() {
  const documents = await convex.query(api.documents.getDocuments);
  return <div>{documents.map(doc => <p key={doc._id}>{doc.title}</p>)}</div>;
}
```

### Use hooks when:

- **Client components** (React hooks)
- **Real-time updates**
- **Reactive UI**

```tsx
"use client";
import { useQuery } from "convex/react";

export default function ClientComponent() {
  const documents = useQuery(api.documents.getDocuments);
  return <div>{documents?.map((doc) => <p key={doc._id}>{doc.title}</p>)}</div>;
}
```

## ID Types and Database Queries

### How `ctx.db.get()` knows which table to query:

```typescript
// The ID type tells Convex which table to query
args: {
  documentId: v.id("documents"), // Creates Id<"documents"> type
}

// When you call ctx.db.get()
const document = await ctx.db.get(args.documentId);
//                               ^^^^^^^^^^^^^^^^
//                               Type: Id<"documents">
//                               Convex knows: "Query documents table"
```

### Different ID types → Different tables:

```typescript
const docId: Id<"documents"> = "doc123";
const chatId: Id<"chats"> = "chat456";

// Convex knows which table to query based on ID type
const document = await ctx.db.get(docId); // Queries "documents" table
const chat = await ctx.db.get(chatId); // Queries "chats" table
```

## Database Indexes

### Compound indexes support prefix matching:

```typescript
// Index definition
.index("by_documentId_tokenIdentifier", ["documentId", "tokenIdentifier"])

// ✅ Can query with first field only
.withIndex("by_documentId_tokenIdentifier", (q) =>
  q.eq("documentId", args.documentId)
)

// ✅ Can query with both fields
.withIndex("by_documentId_tokenIdentifier", (q) =>
  q.eq("documentId", args.documentId)
   .eq("tokenIdentifier", userId)
)

// ❌ Cannot query with just second field
.withIndex("by_documentId_tokenIdentifier", (q) =>
  q.eq("tokenIdentifier", userId) // Missing documentId
)
```

### Rule: **Left-to-right prefix matching**

With index `["documentId", "tokenIdentifier"]`:

- ✅ `documentId` only
- ✅ `documentId` + `tokenIdentifier`
- ❌ `tokenIdentifier` only

## OpenAI Roles Explained

### System Role vs User Role:

```typescript
messages: [
  {
    role: "system",
    content: `Here is a text file: ${text}`, // ← Developer sets context
  },
  {
    role: "user",
    content: `Please answer this question: ${args.question}`, // ← End user's question
  },
];
```

- **`system` role** = Instructions from you (the developer)
- **`user` role** = The end user of your application (person using ChatPanel)
- **`assistant` role** = AI's responses

## Common Patterns

### Pattern 1: Simple CRUD

```typescript
// Frontend → Mutation → Database
const createDoc = useMutation(api.documents.createDocument);
```

### Pattern 2: Complex Workflow

```typescript
// Frontend → Action → External API + Database
const askAI = useAction(api.documents.askQuestion);
```

### Pattern 3: Server-side Data Fetching

```typescript
// Server Component → ConvexHttpClient → Database
const documents = await convex.query(api.documents.getDocuments);
```

### Pattern 4: Real-time Updates

```typescript
// Client Component → useQuery → Real-time database updates
const documents = useQuery(api.documents.getDocuments);
```

This guide covers the core concepts and patterns for using Convex functions effectively in your applications.
