"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import ChatPanel from "./ChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteDocumentButton from "./DeleteDocumentButton";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// This demonstrates how to use convex useQuery to fetch data from backend with the nextjs params
export default function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { theme } = useTheme();
  const [documentId, setDocumentId] = React.useState<Id<"documents"> | null>(
    null
  );
  const document = useQuery(
    api.documents.getDocument,
    documentId ? { documentId } : "skip"
  );

  React.useEffect(() => {
    params.then((p) => setDocumentId(p.documentId as Id<"documents">));
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Invalid Document URL</h1>
        <Button onClick={() => (window.location.href = "/")}>
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <main className="space-y-8">
      {!document && (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-[40px] w-[500px]" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-[40px] w-[80px]" />
            <Skeleton className="h-[40px] w-[80px]" />
          </div>

          <Skeleton className="h-[500px]" />
        </div>
      )}

      {document && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{document.title}</h1>

            <DeleteDocumentButton documentId={document._id} />
          </div>
          <div className="flex gap-12">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="document">
                <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[500px] text-white">
                  {document.documentUrl && (
                    <iframe
                      src={document.documentUrl}
                      className="w-full h-full"
                      style={{
                        filter:
                          theme === "dark"
                            ? "brightness(0) saturate(100%) invert(1)"
                            : "brightness(0) saturate(100%) invert(1)",
                      }}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <ChatPanel documentId={document._id} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </main>
  );
}
