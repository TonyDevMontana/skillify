import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { CourseInfoDialog } from "@/components/creator-course/course-info-dialog";
import { Course } from "@prisma/client";
import { HtmlContent } from "@/components/html-content";
import { ThumbnailPhoto } from "./thumbnail-photo";
import { DeleteCourseDialog } from "./delete-course-dialog";

export function CourseInfo({ course }: { course: Course | null | undefined }) {
  return (
    <div>
      <DeleteCourseDialog courseId={course?.id ?? ""} />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-x-2">
            <span className="mb-1">Course Data</span>
            <CourseInfoDialog course={course}>
              <Pencil
                height={20}
                width={20}
                className="hover:text-orange-600"
              />
            </CourseInfoDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span>Name:</span>
          <CardDescription>{course?.name}</CardDescription>
        </CardContent>
        <CardContent>
          <span>Amount:</span>
          <CardDescription>{course?.price}</CardDescription>
        </CardContent>
        <CardContent>
          <div className="mb-0 sm:mb-12 md:mb-0 md:w-1/3">
            <span>Thumbnail:</span>
            <ThumbnailPhoto
              imageUrl={course?.thumbnailUrl}
              courseId={course?.id}
            />
          </div>
        </CardContent>
        <CardContent>
          <span>Description:</span>
          <CardDescription className="">
            <HtmlContent html={course?.about || ""} />
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
