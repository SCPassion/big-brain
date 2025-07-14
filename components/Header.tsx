import Link from "next/link";
import HeaderAction from "./HeaderAction";
import { ModeToggle } from "./ui/mode-toggle";
import Image from "next/image";
import { OrganizationSwitcher } from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="bg-slate-900 py-4 px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-12 items-center">
          <Link className="flex items-center gap-4 text-2xl" href="/">
            <Image
              src="/logo.png"
              alt="main-logo"
              width={40}
              height={40}
              className="rounded"
            />
            BIGBRAIN
          </Link>

          <nav className="flex items-center gap-4">
            <OrganizationSwitcher />
            <Link href="/dashboard" className="hover:text-slate-300">
              Documents
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <HeaderAction />
        </div>
      </div>
    </div>
  );
}
