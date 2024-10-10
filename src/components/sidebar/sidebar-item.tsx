"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface SidebarItemProps {
  icon: ReactNode;
  title: string;
  href: string;
}

export function SidebarItem({ icon, title, href }: SidebarItemProps) {
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <Link
      className={cn(
        "md:flex md:items-center md:gap-x-2 w-full cursor-pointer md:py-6 md:pl-7 relative",
        selected ? "text-orange-600" : "text-slate-500"
      )}
      href={href}
    >
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute inset-0 bg-orange-100 dark:bg-orange-950 border-r-2 border-orange-600"
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3 }}
            layoutId="sidebar"
          />
        )}
      </AnimatePresence>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center items-center w-full py-6 px-7 md:w-auto md:p-0 relative z-10">
              {icon}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="md:hidden">
            <p className="text-lg w-full">{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="text-xl hidden md:block relative z-10 ml-2">{title}</div>
    </Link>
  );
}
