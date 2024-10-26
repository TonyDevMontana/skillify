"use server";
import db from "@/server/db";
import { mux } from "@/server/mux";
import * as z from "zod";
import { auth } from "@/server/auth";

const MuxUploadSchema = z.object({
  chapterId: z.string().min(1, "ChapterId is required"),
});

type MuxUploadInput = z.infer<typeof MuxUploadSchema>;

type MuxUploadReturn = {
  success: boolean;
  data?: {
    uploadUrl: string;
    uploadId: string;
  };
  error?: string;
};

export const createMuxUpload = async (
  input: MuxUploadInput
): Promise<MuxUploadReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = MuxUploadSchema.parse(input);
    const { chapterId } = validatedInput;

    await db.video.deleteMany({
      where: {
        chapterId,
      },
    });

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
      },
      cors_origin: "*",
    });

    await db.video.create({
      data: {
        chapterId,
        uploadId: upload.id,
        status: "waiting",
      },
    });

    return {
      success: true,
      data: { uploadUrl: upload.url, uploadId: upload.id },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }
    console.error("[CREATE_MUX_UPLOAD_ERROR]", error);
    return { success: false, error: "Create Mux Upload error" };
  }
};
