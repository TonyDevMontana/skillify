"use server";
import { revalidatePath } from "next/cache";
import db from "@/server/db";
import { mux } from "@/server/mux";
import { auth } from "@/server/auth";
import * as z from "zod";
import { utapi } from "@/server/uploadthing";

const DeleteCourseSchema = z.object({
  courseId: z.string().min(1, "CourseId is needed"),
});

type DeleteCourseType = z.infer<typeof DeleteCourseSchema>;

type DeleteCourseReturn = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function deleteCourse(
  input: DeleteCourseType
): Promise<DeleteCourseReturn> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = DeleteCourseSchema.parse(input);
    const { courseId } = validatedInput;

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

    for (const chapter of course.chapters) {
      if (chapter.video?.assetId) {
        try {
          await mux.video.assets.delete(chapter.video.assetId);
        } catch (error) {
          console.error(
            `Failed to delete video asset: ${chapter.video.assetId}`,
            error
          );
        }
      }
    }

    const imageUrl = course.thumbnailUrl;
    if (imageUrl) {
      const fileKey = imageUrl.split("/")[4];
      utapi.deleteFiles(fileKey);
    }

    await db.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/creator/courses");
    return { success: true, message: "Course deleted successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[DELETE_COURSE_ERROR]", error);
    return { success: false, error: "Failed to delete course" };
  }
}
