"use server";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "@/server/auth";

const UpdateProfilePictureSchema = z.object({
  creatorId: z.string(),
  pictureUrl: z.string(),
});

type UpdateProfilePictureType = z.infer<typeof UpdateProfilePictureSchema>;

type UpdateProfilePictureReturn = {
  success: boolean;
  message?: string;
  error?: string;
};

export const updateProfilePicture = async (
  input: UpdateProfilePictureType
): Promise<UpdateProfilePictureReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateProfilePictureSchema.parse(input);
    const { creatorId, pictureUrl } = validatedInput;

    await db.creator.update({
      where: {
        id: creatorId,
      },
      data: {
        pictureUrl,
      },
    });
    revalidatePath("/creator/profile");

    return { success: true, message: "Profile Picture Updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[UPDATE_PROFILE_PICTURE_ERROR]", error);
    return { success: false, error: "Failed to update Profile Picture" };
  }
};
