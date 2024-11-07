import { HtmlContent } from "@/components/html-content";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
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

  if (!course) {
    return redirect("/browse");
    return <div className="mt-32 text-4xl">Course not found</div>;
  }

  return (
    <div className="flex flex-col gap-8 mt-24 px-7">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
          <Image
            src={course.thumbnailUrl ?? ""}
            alt="course thumbnail"
            height={600}
            width={600}
          />
          <div className="mt-6">Price: ₹{course.price}</div>
        </div>
      </div>

      <div>
        <div className="text-slate-500">Description: </div>
        <HtmlContent html={course.about ?? ""} className="text-xl" />
      </div>
    </div>
  );
}
