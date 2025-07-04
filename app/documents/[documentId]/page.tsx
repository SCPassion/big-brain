"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

// This demonstrates how to use convex useQuery to fetch data from backend with the nextjs params
export default function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const [documentId, setDocumentId] = React.useState<Id<"documents"> | null>(
    null
  );
  const document = useQuery(api.documents.getDocument, {
    documentId: documentId as Id<"documents">,
  });

  React.useEffect(() => {
    params.then((p) => setDocumentId(p.documentId as Id<"documents">));
  }, [documentId]);

  if (!document) {
    return <div>You don't have access to view this document</div>;
  }

  return (
    <main className="p-24 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      <div className="flex gap-12">
        <div className="bg-gray-900 p-4 rounded flex-1 h-[600px]">
          {document.documentUrl && (
            <iframe src={document.documentUrl} className="w-full h-full" />
          )}
        </div>

        <div className="w-[300px] bg-gray-900"></div>
      </div>
    </main>
  );
}
