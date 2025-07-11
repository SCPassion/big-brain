"use client";
import React from "react";
import CreateNoteButton from "./CreateNoteButton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function NotesPage() {
  const notes = useQuery(api.notes.getNotes);
  return (
    <main className="w-full space-y-8">
      <p>Please select a note</p>
    </main>
  );
}
