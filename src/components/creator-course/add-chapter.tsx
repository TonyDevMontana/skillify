"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createNewChapter } from "@/server/actions/create-new-chapter";
import { toast } from "@/hooks/use-toast";

function AddVideo({ courseId }: { courseId: string }) {
  const formSchema = z.object({
    chaptername: z.string().min(1, { message: "Name your Chapter" }).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chaptername: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.reset();
    toast({ title: "Creating Chapter..." });
    const result = await createNewChapter({
      courseId: courseId,
      name: values.chaptername,
    });

    if (!result.success) {
      toast({ title: "Something went wrong", variant: "destructive" });
    } else {
      toast({ title: "Chapter Created!", variant: "message" });
    }
  }
  return (
    <div>
      <div className="flex gap-x-4 w-full mb-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <div className="flex gap-x-4 w-full">
              <FormField
                control={form.control}
                name="chaptername"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Chapter name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddVideo;
