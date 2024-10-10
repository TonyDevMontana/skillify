import AddVideo from "@/components/course/add-chapter";
import { CourseInfo } from "@/components/course/course-info";
import { Box, ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import db from "@/server/db";

const VideoChapterList = dynamic(
  () => import("@/components/course/chapter-list"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center mt-12">Loading ChaptersList...</div>
    ),
  }
);

export default async function Course({ params }: { params: { id: string } }) {
  const course = await db.course.findUnique({
    where: {
      id: params.id,
    },
    include: {
      chapters: true,
    },
  });

  if (!course) {
    redirect("/creator/courses");
  }

  return (
    <div className="px-14 md:mx-0 w-full">
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
          <AddVideo courseId={course?.id ?? ""} />
          <VideoChapterList courseId={params.id} chapters={course?.chapters} />
        </div>
      </div>
    </div>
  );
}
