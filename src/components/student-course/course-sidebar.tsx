"use client";

import { Course, Chapter } from "@prisma/client";
import { Lock, PlayCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface CourseSidebarProps {
  course: Course & {
    chapters: Chapter[];
  };
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="h-screen flex flex-col overflow-y-auto">
      <div className="p-4 flex flex-col border-b mt-20">
        <Link href={`/course/${course.id ?? ""}`} className="font-semibold">
          {course.name}
        </Link>
        <p className="text-sm text-slate-500">Chapters</p>
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/course/${course.id}/chapter/${chapter.id}`}
            className={`flex items-center gap-2 text-sm pl-6 pr-4 py-4 hover:text-orange-600 transition-colors ${
              pathname.includes(chapter.id)
                ? "bg-orange-100 dark:bg-orange-950 text-orange-600"
                : "text-slate-500"
            }`}
          >
            {chapter.freePreview ? (
              <PlayCircle size={20} />
            ) : (
              <Lock size={20} />
            )}
            <span className="truncate">{chapter.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
