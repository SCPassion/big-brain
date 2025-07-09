"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  AlertDialog,
  AlertDialogAction,
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
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { useMutation } from "convex/react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteDocumentButton({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={btnStyles}>
          <TrashIcon className={btnIconStyles} />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this document?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your document cannot be recovered after it's been deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await deleteDocument({ documentId });
                router.push("/");
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
