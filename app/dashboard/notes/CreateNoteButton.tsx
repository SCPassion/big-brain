"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNoteForm from "./CreateNoteForm";
import React from "react";
import { PlusIcon } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";

export default function CreateNoteButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        {/* aschild: attaching thing clickable inside shadcn components
        Instead of DialogTrigger being clickable, take the styling of the trigger and apply it to the button
         */}
        <Button variant={"default"} className={btnStyles}>
          <PlusIcon className={btnIconStyles} />
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Note</DialogTitle>
          <DialogDescription>
            Type whatever note you want to be searchable later on.
          </DialogDescription>

          <CreateNoteForm onNoteCreated={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
