"use server";
import db from "@/server/db";
import { mux } from "@/server/mux";
import * as z from "zod";
import { auth } from "@/server/auth";

const MuxVideoProcessingSchema = z.object({
  chapterId: z.string().min(1, "ChapterId is required"),
  uploadId: z.string().min(1, "UploadId is required"),
});

type MuxVideoProcessingInput = z.infer<typeof MuxVideoProcessingSchema>;

type MuxVideoProcessingReturn = {
  success: boolean;
  data?: {
    playbackId: string;
    message: string;
  };
  error?: string;
};

export const handleMuxVideoProcessing = async (
  input: MuxVideoProcessingInput
): Promise<MuxVideoProcessingReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = MuxVideoProcessingSchema.parse(input);
    const { chapterId, uploadId } = validatedInput;

    let attempts = 0;
    while (attempts <= 10) {
      const assetId = (await mux.video.uploads.retrieve(uploadId)).asset_id;
      if (assetId) {
        const asset = await mux.video.assets.retrieve(assetId);

        const playbackId = asset.playback_ids?.[0].id;
        if (asset && asset.status === "ready" && playbackId) {
          await db.video.update({
            where: {
              chapterId,
            },
            data: {
              assetId,
              playbackId,
              status: "ready",
              duration: asset.duration,
            },
          });

          return {
            success: true,
            data: { playbackId, message: "Video processed successfully" },
          };
        }
      } else {
        await waitForThreeSeconds();
        attempts++;
      }
    }
    return { success: false, error: "No asset_id found for upload" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[HANDLE_MUX_VIDEO_ACTION_ERROR]", error);
    return { success: false, error: "Mux Video Handle Error" };
  }
};

const waitForThreeSeconds = () =>
  new Promise((resolve) => setTimeout(resolve, 3000));
