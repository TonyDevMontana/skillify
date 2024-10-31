import { HtmlContent } from "@/components/html-content";
import { PrismaClient } from "@prisma/client";

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

  if (!course) {
    return <div className="mt-32 text-4xl">Course not found</div>;
  }

  return (
    <div className="flex flex-col gap-8 mt-24">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full">
          <img
            src={course.creator.pictureUrl || "/default-avatar.png"}
            alt={course.creator.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-gray-500">{course.creator.name}</p>
        </div>
      </div>

      <HtmlContent html={course.about ?? ""} />

      <div>
        <h2 className="text-2xl font-bold">Chapters</h2>
        <ul className="mt-4 space-y-2">
          {course.chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`/course/${course.id}/chapter/${chapter.id}`}
                className="block rounded-md px-4 py-2 text-sm transition-colors hover:bg-primary/10"
              >
                {chapter.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
