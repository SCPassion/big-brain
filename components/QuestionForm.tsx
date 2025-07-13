"use client";

import React from "react";
import { Input } from "./ui/input";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import SubmittingBtn from "./SubmittingBtn";

export default function QuestionForm({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const askQuestion = useAction(api.documents.askQuestion);

  async function handleAction(formData: FormData) {
    const text = formData.get("text") as string;

    await askQuestion({ question: text, documentId });
  }

  return (
    <form action={handleAction} className="flex grow gap-2">
      <Input
        name="text"
        required
        className="flex-1"
        placeholder="Ask any question over this document."
      />
      <SubmittingBtn />
    </form>
  );
}
