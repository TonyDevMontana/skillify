import React from "react";
import { CourseCard } from "./course-card";
import db from "@/server/db";

async function BrowseCourses() {
  const courses = await db.course.findMany({
    where: {
      published: true,
    },
    include: {
      creator: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => (
        <CourseCard
          course={course}
          creatorName={course.creator.user.name ?? ""}
          key={course.id}
        />
      ))}
      <CourseCard
        course={courses[0]}
        creatorName={courses[0].creator.user.name ?? ""}
      />
      <CourseCard
        course={courses[0]}
        creatorName={courses[0].creator.user.name ?? ""}
      />
      <CourseCard
        course={courses[0]}
        creatorName={courses[0].creator.user.name ?? ""}
      />
      <CourseCard
        course={courses[0]}
        creatorName={courses[0].creator.user.name ?? ""}
      />
    </section>
  );
}

export default BrowseCourses;
