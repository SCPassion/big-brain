"use client";

import SearchForm from "./SearchForm";
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { FileIcon, NotebookPen } from "lucide-react";

function SearchResult({
  url,
  score,
  text,
  type,
}: {
  url: string;
  score: number;
  text: string;
  type: "note" | "document";
}) {
  return (
    <Link href={url}>
      <li className="bg-slate-800 rounded p-4 whitespace-pre-line hover:bg-slate-700 space-y-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {type === "note" ? (
              <NotebookPen size={20} />
            ) : (
              <FileIcon size={20} />
            )}
            <span className="text-md text-slate-400 text-xl">
              {type === "note" ? "Note" : "Document"}
            </span>
          </div>
          <div className="text-md text-slate-400">
            Relevancy of {score.toFixed(2)}
          </div>
        </div>

        <div className="text-md text-slate-400">
          {text.substring(0, 500)}...
        </div>
      </li>
    </Link>
  );
}

export default function SearchPage() {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);

  useEffect(() => {
    const searchResults = localStorage.getItem("searchResults");
    if (searchResults) {
      setResults(JSON.parse(searchResults));
    }
  }, []);

  return (
    <main className="w-full space-y-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>

      <SearchForm
        setResults={(searchResults) => {
          setResults(searchResults);
          localStorage.setItem("searchResults", JSON.stringify(searchResults));
        }}
      />

      <ul className="flex flex-col gap-4">
        {results?.map((result) => {
          if (result.type === "note") {
            return (
              <SearchResult
                url={`/dashboard/notes/${result.record._id}`}
                score={result.score}
                text={result.record.text}
                type="note"
                key={result.record._id as string}
              />
            );
          } else {
            return (
              <SearchResult
                url={`/dashboard/documents/${result.record._id}`}
                score={result.score}
                text={result.record.title + " " + result.record.description}
                type="document"
                key={result.record._id as string}
              />
            );
          }
        })}
      </ul>
    </main>
  );
}
