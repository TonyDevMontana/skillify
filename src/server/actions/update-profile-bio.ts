"use server";
import { auth } from "@/server/auth";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const UpdateProfileBioSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  profession: z.string().min(1, "Profession is Required"),
  linkedInUrl: z.string().min(1, "LinkedInUrl is required"),
});

type UpdateProfileBioType = z.infer<typeof UpdateProfileBioSchema>;

type UpdateProfileBioReturn = {
  success: boolean;
  message?: string;
  error?: string;
};

export const updateProfileBio = async (
  input: UpdateProfileBioType
): Promise<UpdateProfileBioReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateProfileBioSchema.parse(input);
    const { name, profession, linkedInUrl } = validatedInput;

    await db.creator.update({
      where: {
        id: session?.user.creatorId,
      },
      data: {
        name,
        profession,
        linkedInUrl,
      },
    });
    revalidatePath("/creator/profile");

    return { success: true, message: "Update Profile Bio" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[UPDATE_PROFILE_BIO_ERROR]", error);
    return { success: false, error: "Failed to update Profile Bio" };
  }
};
