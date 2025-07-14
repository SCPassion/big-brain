"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function NotesPage() {
  return (
    <main className="w-full space-y-8">
      <p className="text-2xl font-bold">Please select a note</p>
    </main>
  );
}
