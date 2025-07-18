"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import DeleteNoteButton from "./DeleteNoteButton";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, { noteId });

  if (!note) {
    return null;
  }

  return (
    <div className="relative dark:bg-slate-800 bg-slate-200 rounded p-4 w-full">
      <DeleteNoteButton noteId={noteId} />

      <div className="pr-3 whitespace-pre-wrap">{note.text}</div>
    </div>
  );
}
