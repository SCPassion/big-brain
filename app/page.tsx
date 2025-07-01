"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);
  return (
    <>
      <Authenticated>
        <UserButton />
        <button onClick={() => createDocument({ title: "hello world" })}>
          Click me
        </button>

        {documents?.map((doc) => (
          <div key={doc._id}>
            <h2>{doc.title}</h2>
          </div>
        ))}
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
