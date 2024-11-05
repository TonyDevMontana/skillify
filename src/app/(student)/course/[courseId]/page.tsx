import { HtmlContent } from "@/components/html-content";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Course({
  params,
}: {
  params: { courseId: string };
}) {
  const prisma = new PrismaClient();
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      creator: true,
      chapters: { where: { visible: true }, orderBy: { order: "asc" } },
    },
  });

  console.log(course);

  if (!course) {
    return redirect("/browse");
    return <div className="mt-32 text-4xl">Course not found</div>;
  }

  return (
    <div className="flex flex-col gap-8 mt-24">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-gray-500">{course.creator.name}</p>
        </div>
      </div>

      <HtmlContent html={course.about ?? ""} />
    </div>
  );
}
