"use server";
import { auth } from "../auth";
import db from "../db";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const ReorderChapterSchema = z.object({
  updatedChapters: z
    .object({
      id: z.string(),
      order: z.number().nonnegative(),
    })
    .array(),
  courseId: z.string(),
});

type ReorderChapterType = z.infer<typeof ReorderChapterSchema>;

type ReorderChapterReturn = {
  success: boolean;
  message?: string;
  error?: string;
};

export const reorderChapters = async (
  input: ReorderChapterType
): Promise<ReorderChapterReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = ReorderChapterSchema.parse(input);
    const { courseId, updatedChapters } = validatedInput;

    await db.$transaction(async (tx) => {
      // First, get all chapters for the course
      const existingChapters = await tx.chapter.findMany({
        where: { courseId: courseId },
        orderBy: { order: "asc" },
      });

      // Create a map of id to chapter for quick lookup
      const chapterMap = new Map(existingChapters.map((c) => [c.id, c]));

      // Update the order of each chapter
      for (let i = 0; i < updatedChapters.length; i++) {
        const { id } = updatedChapters[i];
        const chapter = chapterMap.get(id);

        if (chapter) {
          await tx.chapter.update({
            where: { id: id },
            data: { order: i + 1 }, // Use the index + 1 as the new order
          });
        }
      }
    });

    revalidatePath(`/creator/course/${courseId}`);
    return { success: true, message: "Chapters orders updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[CHAPTER_REORDER_ERROR]", error);
    return { success: false, error: "Failed to Reorder Chapters" };
  }
};
