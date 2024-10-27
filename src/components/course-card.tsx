"use client";
import { Course } from "@prisma/client";
import Image from "next/image";

export const CourseCard = ({
  course,
  creatorName,
}: {
  course: Course;
  creatorName: string;
}) => {
  const imageUrl = course.thumbnailUrl ?? "/banner_placeholder.png";

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-primary/5 transition-all duration-300 hover:-translate-y-2 shadow-lg">
      <div className="aspect-video relative w-full">
        <Image
          src={imageUrl}
          alt={course.name}
          fill
          className="rounded-t-2xl object-cover"
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw,
                 (max-width: 1024px) 33vw,
                 25vw"
          priority={false}
          quality={85}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="flex w-full justify-between gap-2">
          <div className="w-full">
            <h3 className="truncate text-xl font-bold capitalize md:text-2xl">
              {course.name}
            </h3>
            <div className="mt-1 text-sm dark:text-orange-100 ">
              {creatorName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CourseSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded-2xl bg-primary/10"></div>
      <div className="mt-4 h-6 w-3/4 rounded bg-primary/10"></div>
      <div className="mt-2 h-4 w-1/2 rounded bg-primary/10"></div>
    </div>
  );
};
