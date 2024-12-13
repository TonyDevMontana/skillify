"use server";

import * as z from "zod";
import { auth } from "@/server/auth";
import { deleteMuxVideo } from "./delete-mux-video";
import db from "@/server/db";
import { revalidatePath } from "next/cache";

const DeleteChapterSchema = z.object({
  chapterId: z.string().min(1, "ChapterId is required"),
});

type DeleteChapterType = z.infer<typeof DeleteChapterSchema>;

type DeleteChapterReturn = {
  success: boolean;
  cannotDelete?: boolean;
  data?: { message: string; courseId: string };
  error?: string;
};

export const deleteChapter = async (
  input: DeleteChapterType
): Promise<DeleteChapterReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = DeleteChapterSchema.parse(input);
    const { chapterId } = validatedInput;

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
          "Cannot delete the last chapter. Course must maintain at least one visible chapter with a processed video",
      };
    }

    if (videoData?.playbackId) {
      const deleteVideo = await deleteMuxVideo({ chapterId });
      if (!deleteVideo.success) {
        return { success: false, error: "Failed in video deletion" };
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const courseId = deletedChapter.courseId;

    await db.$transaction(async (tx) => {
      const chapters = await tx.chapter.findMany({
        where: {
          courseId,
        },
        orderBy: { order: "asc" },
      });

      for (const chapter of chapters) {
        if (chapter.order > deletedChapter.order) {
          await tx.chapter.update({
            where: {
              id: chapter.id,
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          });
        }
      }
    });

    revalidatePath(`/creator/course/${courseId}`);
    return {
      success: true,
      data: { message: "Chapter deleted successfully", courseId },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[DELETE_CHAPTER_ERROR]", error);
    return { success: false, error: "Failed to Delete Chapter" };
  }
};
