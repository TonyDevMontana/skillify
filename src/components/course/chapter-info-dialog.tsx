"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Chapter } from "@prisma/client";
import Tiptap from "@/components/tiptap";
import { updateChapterInfo } from "@/server/actions/update-chapter-info";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Course name must be at least 2 characters.",
  }),
  description: z.string().min(1),
  freePreview: z.boolean(),
});

export function ChapterInfoDialog({
  children,
  chapter,
}: {
  children: React.ReactNode;
  chapter: Chapter | null | undefined;
}) {
  const [isOpen, setIsOpen] = useState<boolean>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: chapter?.name || "",
      description: chapter?.description || "",
      freePreview: chapter?.freePreview,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateChapterInfo({
      chapterId: chapter?.id ?? "",
      name: values.name,
      description: values.description,
      freePreview: values.freePreview,
    });
    setIsOpen(false);

    if (!result.success) {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your chapter Info</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chapter Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Course Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freePreview"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel className="pt-2">Free Preview:</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Tiptap
                            value={field.value}
                            setValue={field.onChange}
                            className="h-64 overflow-y-auto"
                            placeholder="Chapter Description"
                            editable={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
