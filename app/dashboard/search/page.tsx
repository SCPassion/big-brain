"use client";

import SearchForm from "./SearchForm";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SearchPage() {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);
  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>

      <SearchForm setResults={setResults} />

      <ul className="space-y-4">
        {results?.map((result) => {
          if (result.type === "note") {
            return (
              <Link
                href={`/dashboard/notes/${result.record._id}`}
                key={result.record._id}
              >
                <li className="bg-slate-800 rounded p-4 whitespace-pre-line">
                  type: Note
                  {result.record.text.substring(0, 500)}...
                </li>
              </Link>
            );
          } else {
            return (
              <Link
                href={`/dashboard/documents/${result.record._id}`}
                key={result.record._id}
              >
                <li className="bg-slate-800 rounded p-4 whitespace-pre-line">
                  type: Document
                  {result.record.title}
                  {result.record.description}
                </li>
              </Link>
            );
          }
        })}
      </ul>
    </main>
  );
}
