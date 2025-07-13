"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import SearchBtn from "@/components/SearchBtn";

export default function SearchForm({
  setResults,
}: {
  setResults: (results: typeof api.search.searchAction._returnType) => void;
}) {
  const searchAction = useAction(api.search.searchAction);

  async function handleAction(formData: FormData) {
    const text = formData.get("text") as string;

    const results = await searchAction({ search: text });
    setResults(results);
  }

  return (
    <form action={handleAction} className="flex grow gap-2">
      <Input
        name="text"
        required
        className="flex-1"
        placeholder="Search over all your notes and documents using vector searching."
      />
      <SearchBtn />
    </form>
  );
}
