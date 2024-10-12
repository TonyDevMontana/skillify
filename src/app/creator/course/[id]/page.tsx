import { Suspense } from "react";
import { CourseContent } from "@/components/creator-course/course-content";
import { Spinner } from "@/components/spinner";

export default function Course({ params }: { params: { id: string } }) {
  return (
    <div className="px-14 md:mx-0 w-full">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-128px)]">
            <Spinner />
          </div>
        }
      >
        <CourseContent id={params.id} />
      </Suspense>
    </div>
  );
}
