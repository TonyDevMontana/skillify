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

    const chapter = await db.video.findUnique({
      where: {
        chapterId,
      },
    });
    await mux.video.assets.delete(chapter?.assetId || "");

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
