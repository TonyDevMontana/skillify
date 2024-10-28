import { Suspense } from "react";
import { CourseContent } from "@/components/creator-course/course-content";
import { Spinner } from "@/components/spinner";

export const revalidate = 3600;

export default function Course({ params }: { params: { id: string } }) {
  return (
    <div className="px-4 sm:px-8 md:px-14 md:mx-0 w-full">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-11rem)] md:h-[calc(100vh-128px)]">
            <Spinner />
          </div>
        }
      >
        <CourseContent id={params.id} />
      </Suspense>
    </div>
  );
}
