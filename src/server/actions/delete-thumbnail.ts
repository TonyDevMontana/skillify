"use server";
import db from "@/server/db";
import { utapi } from "@/server/uploadthing";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "../auth";

const DeleteThumbnailSchema = z.object({
  courseId: z.string().min(1, "CreatorId is Required"),
  imageUrl: z.string().min(1, "ImageUrl is required"),
});

type DeleteThumbnailType = z.infer<typeof DeleteThumbnailSchema>;

type DeleteThumbnailReturn = {
  success: boolean;
  error?: string;
};

export const deleteThumbnail = async (
  input: DeleteThumbnailType
): Promise<DeleteThumbnailReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = DeleteThumbnailSchema.parse(input);
    const { courseId, imageUrl } = validatedInput;

    const fileKey = imageUrl.split("/")[4];
    utapi.deleteFiles(fileKey);
    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        thumbnailUrl: "",
      },
    });

    revalidatePath(`/creator/course/${courseId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[DELETE_THUMBNAIL_ERROR]", error);
    return { success: false, error: "Failed to delete thumbnail" };
  }
};
