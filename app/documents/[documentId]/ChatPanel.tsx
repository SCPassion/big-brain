"use client";

import QuestionForm from "@/components/QuestionForm";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import React from "react";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, {
    documentId: documentId,
  });

  return (
    <div className="w-full bg-gray-900 flex flex-col gap-2 p-6 rounded-xl">
      <div className="overflow-y-auto h-[350px] space-y-3">
        <div className="bg-slate-950 rounded p-3">
          AI: Ask any question using AI about this document below:{" "}
        </div>

        {chats?.map((chat) => (
          <div
            key={chat._id}
            className={cn(
              { "bg-slate-800": chat.isHuman, "text-right": chat.isHuman },
              "rounded p-2 whitespace-pre-line"
            )}
          >
            {chat.isHuman ? "YOU" : "AI"}: {chat.text}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        <QuestionForm documentId={documentId} />
      </div>
    </div>
  );
}
