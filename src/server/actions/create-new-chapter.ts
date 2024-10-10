"use server";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "@/server/auth";

const CreateChapterSchema = z.object({
  courseId: z.string().min(1, "CourseId is required"),
  name: z
    .string()
    .min(1, "Chapter name is required")
    .max(255, "Chapter name cannot exceed 255 characters"),
});

type CreateChapterInput = z.infer<typeof CreateChapterSchema>;

type CreateChapterReturn = {
  success: boolean;
  message?: string;
  error?: string;
};

export const createNewChapter = async (
  input: CreateChapterInput
): Promise<CreateChapterReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = CreateChapterSchema.parse(input);
    const { courseId, name } = validatedInput;

    await db.$transaction(async (tx) => {
      const highestOrderChapter = await tx.chapter.findFirst({
        where: { courseId: courseId },
        orderBy: { order: "desc" },
      });

      const newOrder = highestOrderChapter ? highestOrderChapter.order + 1 : 1;

      const chapter = await tx.chapter.create({
        data: {
          courseId: courseId,
          name: name,
          order: newOrder,
          published: false,
          freePreview: false,
          description: "",
        },
        select: {
          id: true,
          name: true,
        },
      });
      return chapter;
    });

    revalidatePath(`/creator/course/${courseId}`);
    return { success: true, message: "New Chapter created" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[CREATE_CHAPTER_ERROR]", error);
    return { success: false, error: "Failed to create New Chapter" };
  }
};
