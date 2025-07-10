import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel"; // to find the schema type that defines the data model
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DocumentCard({
  document,
}: {
  document: Doc<"documents">;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {!document.description ? (
            <div className="text-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            document.description
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2 cursor-pointer"
        >
          <Link href={`/documents/${document._id}`}>
            <Eye className="w-4 h-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
