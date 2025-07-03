"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DocumentCard from "@/components/DocumentCard";
import CreateDocumentButton from "@/components/CreateDocumentButton";

export default function Home() {
  // Query the documents from the Convex backend, this will be updated in real-time when there is a change in database documents table
  const documents = useQuery(api.documents.getDocuments);
  return (
    <main className="p-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <CreateDocumentButton />
      </div>

      <div className="grid grid-cols-4 gap-8">
        {documents?.map((doc) => (
          <div key={doc._id}>
            <DocumentCard document={doc} />
          </div>
        ))}
      </div>
    </main>
  );
}
