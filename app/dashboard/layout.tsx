import { CogIcon, FileIcon, NotebookPen } from "lucide-react";
import Link from "next/link";
import SideNav from "./SideNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-24 mx-auto pt-12 px-6">
      <SideNav />

      <div className="w-full">{children}</div>
    </div>
  );
}
