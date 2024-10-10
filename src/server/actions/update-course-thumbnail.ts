"use server";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "@/server/auth";

const UpdateCourseThumbnailSchema = z.object({
  courseId: z.string().min(1, "CourseId is required"),
  pictureUrl: z.string().min(1, "PictureUrl is required"),
});

type UpdateCourseThumbnailType = z.infer<typeof UpdateCourseThumbnailSchema>;

type UpdateCourseThumbnailReturn = {
  success: boolean;
  error?: string;
  message?: string;
};

export const updateCourseThumbnail = async (
  input: UpdateCourseThumbnailType
): Promise<UpdateCourseThumbnailReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateCourseThumbnailSchema.parse(input);
    const { courseId, pictureUrl } = validatedInput;

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        thumbnailUrl: pictureUrl,
      },
    });
    revalidatePath(`/creator/course/${courseId}`);

    return { success: true, message: "Course Thumbnail Updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }
    console.log("[UPDATE_COURSE_THUMBNAIL_ERROR]", error);
    return { success: true, error: "Failed to update Course Thumbnail" };
  }
};
