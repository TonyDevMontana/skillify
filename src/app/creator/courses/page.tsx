import { AllCourses } from "@/components/course/all-courses-table";
import { NewCourse } from "@/components/course/new-course-dialog";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import db from "@/server/db";

async function Courses() {
  const session = await auth();

  const courses = await db.creator.findUnique({
    where: {
      id: session?.user.creatorId,
    },
    select: {
      id: true,
      courses: {
        select: {
          id: true,
          name: true,
          price: true,
          published: true,
        },
      },
    },
  });

  return (
    <div className="px-14 md:mx-0 w-full">
      <NewCourse>
        <Button className="mb-6">Create A New Course</Button>
      </NewCourse>
      <AllCourses courses={courses?.courses} />
    </div>
  );
}

export default Courses;
