"use server";

import { mux } from "@/server/mux";
import db from "@/server/db";
import * as z from "zod";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

const DeleteMuxSchema = z.object({
  chapterId: z.string().min(1, "ChapterId is required"),
});

type DeleteMuxInput = z.infer<typeof DeleteMuxSchema>;

type DeleteMuxReturn = {
  success: boolean;
  message?: string;
  cannotDelete?: boolean;
  error?: string;
};

export const deleteMuxVideo = async (
  input: DeleteMuxInput
): Promise<DeleteMuxReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = DeleteMuxSchema.parse(input);
    const { chapterId } = validatedInput;

    const video = await db.video.findUnique({
      where: {
        chapterId,
      },
      include: {
        chapter: {
          include: {
            course: {
              include: {
                chapters: {
                  include: {
                    video: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!video) {
      return { success: false, error: "Video not found" };
    }

    // Count visible chapters with ready videos, excluding the current chapter
    const otherVisibleChaptersWithVideo = video.chapter.course.chapters.filter(
      (chapter) =>
        chapter.id !== chapterId && // Exclude current chapter
        chapter.visible &&
        chapter.video &&
        chapter.video.status === "ready"
    ).length;

    // If this is the last valid video and the course is published, prevent deletion
    if (otherVisibleChaptersWithVideo === 0 && video.chapter.course.published) {
      return {
        success: false,
        cannotDelete: true,
        error:
          "Cannot delete the last video. Course must maintain at least one visible chapter with a processed video",
      };
    }

    if (video.assetId) {
      try {
        await mux.video.assets.delete(video.assetId);
      } catch (muxError) {
        console.error("[MUX_DELETE_ERROR]", muxError);
        // Continue with database cleanup even if Mux deletion fails
      }
    }

    await db.video.update({
      where: { chapterId },
      data: {
        assetId: null,
        playbackId: null,
        duration: null,
        status: "waiting",
      },
    });

    revalidatePath(`/creator/course/chapter/${chapterId}`);

    return { success: true, message: "Video deleted successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[DELETE_VIDEO_MUX_ERROR]", error);
    return { success: false, error: "Failed to Delete Video" };
  }
};
