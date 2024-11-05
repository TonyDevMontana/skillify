import React from "react";
import { CourseCard } from "@/components/course-card";
import db from "@/server/db";

const getCourses = async () => {
  return await db.course.findMany({
    where: {
      published: true,
    },
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

async function BrowseCourses() {
  const courses = await getCourses();

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => (
        <CourseCard
          course={course}
          creatorName={course.creator.name ?? ""}
          key={course.id}
        />
      ))}
    </section>
  );
}

export default BrowseCourses;
