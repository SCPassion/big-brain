"use client";

import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateDocumentButton() {
  const createDocument = useMutation(api.documents.createDocument);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* aschild: attaching thing clickable inside shadcn components
        Instead of DialogTrigger being clickable, take the styling of the trigger and apply it to the button
         */}
        <Button
          onClick={() => createDocument({ title: "hello world" })}
          variant={"default"}
        >
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
          <DialogDescription>
            Upload a team document for your to search over in the future.
          </DialogDescription>

          <form></form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
