"use server";
import db from "@/server/db";
import { utapi } from "@/server/uploadthing";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import * as z from "zod";

const DeleteProfilePictureSchema = z.object({
  creatorId: z.string().min(1, "CreatorId is Required"),
  imageUrl: z.string().min(1, "ImageUrl is required"),
});

type DeleteProfilePictureType = z.infer<typeof DeleteProfilePictureSchema>;

type DeleteProfilePictureReturn = {
  success: boolean;
  error?: string;
  message?: string;
};

export const deleteProfileImage = async (
  input: DeleteProfilePictureType
): Promise<DeleteProfilePictureReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = DeleteProfilePictureSchema.parse(input);
    const { creatorId, imageUrl } = validatedInput;

    const fileKey = imageUrl.split("/")[4];
    utapi.deleteFiles(fileKey);
    await db.creator.update({
      where: {
        id: creatorId,
      },
      data: {
        pictureUrl: "",
      },
    });

    revalidatePath("/creator/profile");
    return { success: true, message: "Profile Picture Deleted" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[DELETE_PROFILE_IMAGE_ERROR]", error);
    return { success: false, error: "Failed to delete profile image" };
  }
};
