"use server";
import db from "@/server/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { auth } from "@/server/auth";

const UpdateCourseDataSchema = z.object({
  courseId: z.string().min(1, "Course Id required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name cannot exceed 255 characters"),
  price: z.number().nonnegative(),
  about: z.string().optional(),
});

type UpdateCourseDataType = z.infer<typeof UpdateCourseDataSchema>;

type UpdateCourseDataReturn = {
  success: boolean;
  error?: string;
  message?: string;
};

export const updateCourseData = async (
  input: UpdateCourseDataType
): Promise<UpdateCourseDataReturn> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedInput = UpdateCourseDataSchema.parse(input);
    const { courseId, name, price, about } = validatedInput;

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        name,
        price,
        about,
      },
    });

    revalidatePath(`/creator/course/${courseId}`);
    return { success: true, message: "Course Data Updated" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(""),
      };
    }

    console.error("[UPDATE_COURSE_DATA_ERROR]", error);
    return { success: false, error: "Fail to update Course Data" };
  }
};
