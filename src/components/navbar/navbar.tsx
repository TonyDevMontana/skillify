"use client";
import { Bird } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/navbar/mode-toggle";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const UserButton = dynamic(() => import("@/components/navbar/user-button"), {
  ssr: false,
  loading: () => null,
});

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 flex items-center py-3 px-7 z-50 h-16",
        pathname === "/" ? "" : "bg-background border-b"
      )}
    >
      <div className=" flex justify-between items-center w-full">
        <Link href={"/browse"}>
          <div className="flex justify-center items-center text-orange-600 gap-x-1">
            <Bird height={25} width={25} />
            <div className="text-2xl text-extrabold uppercase">Skillify</div>
          </div>
        </Link>
        <div className="flex gap-x-3 items-center">
          <div className="mt-2">
            <UserButton />
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
