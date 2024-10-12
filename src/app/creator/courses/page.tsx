import { CreatorCoursesData } from "@/components/creator-course/creator-courses-data";
import { NewCourse } from "@/components/creator-course/new-course-dialog";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const revalidate = 3600;

function Courses() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-128px)]">
          <Spinner />
        </div>
      }
    >
      <div className="px-14 md:mx-0 w-full">
        <NewCourse>
          <Button className="mb-6">Create A New Course</Button>
        </NewCourse>
        <CreatorCoursesData />
      </div>
    </Suspense>
  );
}

export default Courses;
