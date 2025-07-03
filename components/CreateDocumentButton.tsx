"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadDocumentForm from "./UploadDocumentForm";
import React from "react";

export default function CreateDocumentButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        {/* aschild: attaching thing clickable inside shadcn components
        Instead of DialogTrigger being clickable, take the styling of the trigger and apply it to the button
         */}
        <Button variant={"default"}>Upload Document</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
          <DialogDescription>
            Upload a team document for your to search over in the future.
          </DialogDescription>

          <UploadDocumentForm onUpload={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
