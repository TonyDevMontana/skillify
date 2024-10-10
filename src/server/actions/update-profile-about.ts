"use server";
import { auth } from "@/server/auth";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const UpdateProfileAboutSchema = z.object({
  creatorId: z.string().min(1, "CreatorId is Required"),
  about: z.string().min(1, "Profile About is required"),
});

type UpdateProfileAboutType = z.infer<typeof UpdateProfileAboutSchema>;

type UpdateProfileAboutReturn = {
  success: boolean;
  error?: string;
  message?: string;
};

export const updateProfileAbout = async (
  input: UpdateProfileAboutType
): Promise<UpdateProfileAboutReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateProfileAboutSchema.parse(input);
    const { creatorId, about } = validatedInput;

    await db.creator.update({
      where: {
        id: creatorId,
      },
      data: {
        about: about,
      },
    });
    revalidatePath("/creator/profile");

    return { success: true, message: "Profile About updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[UPDATE_PROFILE_ABOUT_ERROR]", error);
    return { success: false, error: "Failed to update Profile About" };
  }
};
