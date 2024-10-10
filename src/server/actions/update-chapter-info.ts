"use server";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "@/server/auth";

const UpdateChapterInfoSchema = z.object({
  chapterId: z.string().min(1, "Chapter Id required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name cannot exceed 255 characters"),
  description: z.string().optional(),
  freePreview: z.boolean(),
});

type UpdateChapterInfoType = z.infer<typeof UpdateChapterInfoSchema>;

type UpdateChapterInfoReturn = {
  success: boolean;
  error?: string;
  message?: string;
};

export const updateChapterInfo = async (
  input: UpdateChapterInfoType
): Promise<UpdateChapterInfoReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateChapterInfoSchema.parse(input);
    const { chapterId, name, description, freePreview } = validatedInput;

    await db.chapter.update({
      where: { id: chapterId },
      data: { name, description, freePreview },
    });

    revalidatePath(`/creator/course/chapter/${chapterId}`);
    return { success: true, message: "Chapter Info Updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[UPDATE_CHAPTER_INFO_ERROR]", error);
    return { success: false, error: "Failed to update chapter info" };
  }
};
