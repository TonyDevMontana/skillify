"use server";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "@/server/auth";

const CreateCourseSchema = z.object({
  creatorId: z.string().min(1, "CreatorId is required"),
  name: z
    .string()
    .min(1, "Course name is required")
    .max(255, "Course name cannot exceed 255 characters"),
});

type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

type CreateCourseReturn = {
  success: boolean;
  data?: {
    id: string;
    name: string;
  };
  error?: string;
};

export const createCourse = async (
  input: CreateCourseInput
): Promise<CreateCourseReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = CreateCourseSchema.parse(input);
    const { creatorId, name } = validatedInput;

    const course = await db.course.create({
      data: {
        creatorId,
        name,
        price: 0,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath("/creator/courses");
    return { success: true, data: course };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[CREATE_COURSE_ERROR]", error);
    return { success: false, error: "Failed to create Course" };
  }
};
