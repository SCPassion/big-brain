import HeaderAction from "./HeaderAction";
import { ModeToggle } from "./ui/mode-toggle";
import Image from "next/image";

export default function Header() {
  return (
    <div className="bg-slate-900 py-4 px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 text-2xl">
          <Image
            src="/logo.png"
            alt="main-logo"
            width={40}
            height={40}
            className="rounded"
          />
          BIGBRAIN
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <HeaderAction />
        </div>
      </div>
    </div>
  );
}
