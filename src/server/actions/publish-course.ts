"use server";

import { revalidatePath } from "next/cache";
import db from "@/server/db";
import * as z from "zod";
import { auth } from "@/server/auth";

const PublishCourseSchema = z.object({
  courseId: z.string().min(1, "CourseId is required"),
  publish: z.boolean(),
});

type PublishCourseType = z.infer<typeof PublishCourseSchema>;

type PublishCourseReturn = {
  success: boolean;
  notPublishable?: boolean;
  error?: string;
  message?: string;
};

export async function publishCourse(
  input: PublishCourseType
): Promise<PublishCourseReturn> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = PublishCourseSchema.parse(input);
    const { courseId, publish } = validatedInput;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          include: {
            video: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const hasChapterWithVideo = course.chapters.some(
      (chapter) =>
        chapter.video && chapter.video.status === "ready" && chapter.visible
    );

    if (!hasChapterWithVideo) {
      return {
        success: false,
        notPublishable: true,
        error: "Course must have at least one chapter with a processed video",
      };
    }

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        published: publish,
      },
    });

    revalidatePath(`/creator/course/${courseId}`);
    revalidatePath("/browse");
    if (publish) return { success: true, message: "Course Published" };
    return { success: true, message: "Course Unpublished" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[PUBLISH_COURSE]", error);
    return { success: false, error: "Failed to Publish Course" };
  }
}
