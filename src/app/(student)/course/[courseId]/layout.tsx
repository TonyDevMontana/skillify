import { PrismaClient } from "@prisma/client";
import { CourseSidebar } from "@/components/student-course/course-sidebar";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}

async function getCourse(courseId: string) {
  const prisma = new PrismaClient();

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: { visible: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return course;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const course = await getCourse(params.courseId);

  if (!course) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="flex h-full">
        <div className="flex-1 h-full">{children}</div>
        <div className="hidden md:block md:w-60 lg:w-80 border-l">
          <CourseSidebar course={course} />
        </div>
      </div>
    </div>
  );
}
