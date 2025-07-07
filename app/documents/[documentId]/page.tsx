"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import ChatPanel from "./ChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  if (document === undefined) {
    return <div>Loading...</div>;
  }

  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <main className="p-24 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      <div className="flex gap-12">
        <Tabs defaultValue="document" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="document">
            <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[500px]">
              {document.documentUrl && (
                <iframe src={document.documentUrl} className="w-full h-full" />
              )}
            </div>
          </TabsContent>
          <TabsContent value="chat">
            <ChatPanel documentId={document._id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
