import AddVideo from "@/components/creator-course/add-chapter";
import { CourseInfo } from "@/components/creator-course/course-info";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import db from "@/server/db";
import Link from "next/link";
import { Box, ChevronLeft } from "lucide-react";

const ChapterList = dynamic(
  () => import("@/components/creator-course/chapter-list"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center mt-12">Loading ChaptersList...</div>
    ),
  }
);

export async function CourseContent({ id }: { id: string }) {
  const course = await db.course.findUnique({
    where: { id },
    include: { chapters: true },
  });

  if (!course) {
    redirect("/creator/courses");
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Link
          className="hover:cursor-pointer hover:text-orange-600"
          href={"/creator/courses"}
        >
          <ChevronLeft height={35} width={35} />
        </Link>
        <div className="flex items-center gap-x-2 mb-6">
          <Box height={35} width={35} />
          <div className="text-2xl sm:text-3xl font-bold">Edit Course</div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-x-6">
        <div className="w-full">
          <CourseInfo course={course} />
        </div>
        <div className="w-full mt-6 lg:mt-0">
          <AddVideo courseId={course.id} />
          <ChapterList courseId={id} chapters={course.chapters} />
        </div>
      </div>
    </>
  );
}
