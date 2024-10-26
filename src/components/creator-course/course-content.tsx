import AddVideo from "@/components/creator-course/add-chapter";
import { CourseInfo } from "@/components/creator-course/course-info";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import db from "@/server/db";
import Link from "next/link";
import { Box, ChevronLeft } from "lucide-react";
import { cache } from "react";
import { auth } from "@/server/auth";
import PublishCourse from "@/components/creator-course/publish-course";

const ChapterList = dynamic(
  () => import("@/components/creator-course/chapter-list"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center mt-12">Loading ChaptersList...</div>
    ),
  }
);

const getCourseData = cache(async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: {
          order: "asc",
        },
      },
      creator: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!course) {
    redirect("/creator/courses");
  }

  if (course.creator.user.id !== session.user.id) {
    redirect("/creator/courses");
  }

  return course;
});

export async function CourseContent({ id }: { id: string }) {
  const course = await getCourseData(id);

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
          <PublishCourse courseId={course.id} published={course.published} />
          <AddVideo courseId={course.id} />
          <ChapterList courseId={id} chapters={course.chapters} />
        </div>
      </div>
    </>
  );
}
