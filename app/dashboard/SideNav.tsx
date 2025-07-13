"use client";

import { cn } from "@/lib/utils";
import { CogIcon, FileIcon, NotebookPen, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathName = usePathname();

  return (
    <nav>
      <ul className="space-y-6">
        <li>
          <Link
            href="/dashboard/search"
            className={cn(
              "font-light flex items-center gap-2 text-xl hover:text-cyan-100",
              { "text-cyan-300": pathName.endsWith("/search") }
            )}
          >
            <SearchIcon />
            Search
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/documents"
            className={cn(
              "font-light flex items-center gap-2 text-xl hover:text-cyan-100",
              { "text-cyan-300": pathName.endsWith("/documents") }
            )}
          >
            <FileIcon />
            Documents
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/notes"
            className={cn(
              "font-light flex items-center gap-2 text-xl hover:text-cyan-100",
              { "text-cyan-300": pathName.endsWith("/notes") }
            )}
          >
            <NotebookPen />
            Notes
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/settings"
            className={cn(
              "font-light flex items-center gap-2 text-xl hover:text-cyan-100",
              { "text-cyan-300": pathName.endsWith("/settings") }
            )}
          >
            <CogIcon />
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
