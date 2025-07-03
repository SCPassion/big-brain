import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoadingButton({
  isLoading,
  children,
  loadingText,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText: string;
}) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="flex gap-2 items-center"
    >
      {/* conditionally diplay the spinner when the form is uploading */}
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
