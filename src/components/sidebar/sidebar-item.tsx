"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: ReactNode;
  title: string;
  href: string;
}

export function SidebarItem({ icon, title, href }: SidebarItemProps) {
  const pathname = usePathname();
  const selected = pathname === href;
  const router = useRouter();

  return (
    <div
      className={cn(
        "md:flex md:items-center gap-x-2 w-full cursor-pointer py-5 px-4 md:py-6 md:pl-7 relative",
        selected
          ? "text-orange-600 bg-orange-100 dark:bg-orange-950 border-t-2 md:border-t-0 md:border-b-0 md:border-r-2 border-orange-600"
          : "text-slate-500"
      )}
      onClick={() => {
        router.push(href);
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center items-center md:w-auto relative z-10">
              {icon}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="md:hidden">
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="text-xl hidden md:block relative z-10 ml-2">{title}</div>
    </div>
  );
}
