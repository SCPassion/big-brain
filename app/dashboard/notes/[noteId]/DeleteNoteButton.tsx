"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteNoteButton({ noteId }: { noteId: Id<"notes"> }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const deleteNote = useMutation(api.notes.deleteNote);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute -top-3 -right-3 cursor-pointer"
          variant="destructive"
          size="icon"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your note cannot be recovered after it's been deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await deleteNote({ noteId });
                router.push("/dashboard/notes");
              } catch (error) {
                console.error("Failed to delete document:", error);
                setIsLoading(false);
                setIsOpen(false);
              }
            }}
            loadingText="Deleting..."
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
