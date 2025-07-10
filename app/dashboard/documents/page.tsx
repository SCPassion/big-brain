"use client";

import React from "react";
import UploadDocumentButton from "./[documentId]/UploadDocumentButton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import DocumentCard from "./[documentId]/DocumentCard";
import Image from "next/image";
export default function DocumentsPage() {
  const documents = useQuery(api.documents.getDocuments);
  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <UploadDocumentButton />
      </div>

      {!documents && (
        <div className="grid grid-cols-4 gap-8">
          {new Array(8).fill("").map((_, index) => (
            <Card className="p-6 flex flex-col justify-between" key={index}>
              <Skeleton className="h-[30px] rounded" />
              <Skeleton className="h-[30px] rounded" />
              <Skeleton className="w-[80px] h-[40px] rounded" />
            </Card>
          ))}
        </div>
      )}
      {documents && documents.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
          {documents?.map((doc) => (
            <div key={doc._id}>
              <DocumentCard document={doc} />
            </div>
          ))}
        </div>
      )}
      {documents && documents.length === 0 && (
        <div className="py-12 flex justify-center flex-col items-center gap-8">
          <Image
            src="/noDocuments.svg"
            alt="A picture of a girl holding documents"
            width={200}
            height={200}
          />
          <h2 className="text-2xl">You have no document</h2>
          <UploadDocumentButton />
        </div>
      )}
    </main>
  );
}
