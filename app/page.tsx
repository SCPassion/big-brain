"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Authenticated>
        <UserButton />

        <ModeToggle />
        <Button
          onClick={() => createDocument({ title: "hello world" })}
          variant={"default"}
        >
          Click me
        </Button>

        {documents?.map((doc) => (
          <div key={doc._id}>
            <h2>{doc.title}</h2>
          </div>
        ))}
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </main>
  );
}
