"use server";
import { auth } from "@/server/auth";
import db from "@/server/db";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const UpdateChapterVisibilitySchema = z.object({
  chapterId: z.string().min(1, "Chapter Id required"),
  visible: z.boolean(),
});

type UpdateChapterVisibilityType = z.infer<
  typeof UpdateChapterVisibilitySchema
>;

type UpdateChapterVisibilityReturn = {
  success: boolean;
  error?: string;
  cannotDelete?: boolean;
  message?: string;
};

export const updateChapterVisibility = async (
  input: UpdateChapterVisibilityType
): Promise<UpdateChapterVisibilityReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateChapterVisibilitySchema.parse(input);
    const { chapterId, visible } = validatedInput;

    if (!visible) {
      const videoData = await db.video.findUnique({
        where: { chapterId },
        include: {
          chapter: {
            include: {
              course: { include: { chapters: { include: { video: true } } } },
            },
          },
        },
      });

      if (!videoData) {
        return { success: false, error: "Video not found" };
      }

      const otherVisibleChaptersWithVideo =
        videoData.chapter.course.chapters.filter(
          (chapter) =>
            chapter.id !== chapterId && // Exclude current chapter
            chapter.visible &&
            chapter.video &&
            chapter.video.status === "ready"
        ).length;

      if (
        otherVisibleChaptersWithVideo === 0 &&
        videoData.chapter.course.published
      ) {
        return {
          success: false,
          cannotDelete: true,
          error:
            "Course must maintain at least one visible chapter with a processed video",
        };
      }
    }

    await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        visible,
      },
    });

    revalidatePath(`/creator/course/chapter/${chapterId}`);
    return { success: true, message: "Chapter Visibility Updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[UPDATE_CHAPTER_VISIBLITY_ERROR]", error);
    return { success: false, error: "Failed to update chapter Visibility" };
  }
};
