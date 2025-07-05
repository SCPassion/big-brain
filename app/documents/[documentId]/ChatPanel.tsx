"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import React from "react";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const askQuestion = useAction(api.documents.askQuestion);

  async function handleAction(formData: FormData) {
    const text = formData.get("text") as string;
    console.log("Form submitted with data:", text);

    console.log(await askQuestion({ question: text, documentId }));
    // To-do: call
  }
  return (
    <div className="w-full bg-gray-900 flex flex-col gap-2 p-4">
      <div className="overflow-y-auto h-[350px] space-y-3">
        <div className="bg-slate-950 rounded p-3">
          AI: Ask any question using AI about this document below:{" "}
        </div>
        <div className={cn({ "bg-slate-800": true }, "rounded p-3 text-right")}>
          YOU: Ask any question using AI about this document below:{" "}
        </div>
      </div>

      <div className="flex gap-1">
        <form action={handleAction} className="flex grow gap-2">
          <Input name="text" required className="flex-1" />
          <Button>Submit</Button>
        </form>
      </div>
    </div>
  );
}
