import { Chapter } from "@prisma/client";
import Link from "next/link";

interface CourseSidebarProps {
  chapters: Chapter[];
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ chapters }) => {
  return (
    <aside className="sticky top-0 h-screen w-64 bg-primary/5 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Chapters</h3>
      </div>
      <div className="flex flex-col gap-4">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/course/${chapter.courseId}/chapter/${chapter.id}`}
            className="block rounded-md px-4 py-2 text-sm transition-colors hover:bg-primary/10"
          >
            {chapter.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};
