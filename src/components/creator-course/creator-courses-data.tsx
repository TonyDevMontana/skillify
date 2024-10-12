import { auth } from "@/server/auth";
import db from "@/server/db";
import { CreatorCoursesTable } from "./creator-courses-table";

async function fetchCourses() {
  const session = await auth();
  return db.creator.findUnique({
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
}

export async function CreatorCoursesData() {
  const courses = await fetchCourses();
  return <CreatorCoursesTable courses={courses?.courses} />;
}
