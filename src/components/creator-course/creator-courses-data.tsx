import { auth } from "@/server/auth";
import db from "@/server/db";
import { CreatorCoursesTable } from "@/components/creator-course/creator-courses-table";
import { cache } from "react";

const getCourses = cache(async (id: string) => {
  return db.creator.findUnique({
    where: {
      id,
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
});

export async function CreatorCoursesData() {
  const session = await auth();
  const creatorId = session?.user.creatorId ?? "";
  const courses = await getCourses(creatorId);
  return <CreatorCoursesTable courses={courses?.courses} />;
}
