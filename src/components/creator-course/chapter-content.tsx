import { ChapterInfo } from "@/components/creator-course/chapter-info";
import db from "@/server/db";
import { ChevronLeft, FilePenLine } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";
import { VideoHandler } from "@/components/creator-course/video-handler";
import { auth } from "@/server/auth";

const getChapterData = cache(async (chapterId: string) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      video: true,
      course: {
        include: {
          creator: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!chapter) {
    return null;
  }

  if (chapter.course.creator.user.id !== session.user.id) {
    redirect("/creator/courses");
  }

  return chapter;
});

export default async function ChapterContent({
  chapterId,
}: {
  chapterId: string;
}) {
  const chapter = await getChapterData(chapterId);

  if (!chapter) {
    redirect("/creator/courses");
  }

  return (
    <>
      <div className="flex justify-between">
        <Link
          className="hover:cursor-pointer hover:text-orange-600"
          href={`/creator/course/${chapter.courseId}`}
        >
          <ChevronLeft height={35} width={35} />
        </Link>
        <div className="flex items-center gap-x-2 mb-6">
          <FilePenLine height={35} width={35} />
          <div className="text-2xl sm:text-3xl font-bold">
            Edit your chapter
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-x-6">
        <div className="w-full">
          <ChapterInfo chapter={chapter} />
        </div>
        <div className="w-full mt-6 lg:mt-0">
          <VideoHandler chapter={chapter} />
        </div>
      </div>
    </>
  );
}
