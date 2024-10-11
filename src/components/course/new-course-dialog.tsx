"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCourse } from "@/server/actions/create-course";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Atleast write a name" }).max(50),
});

export function NewCourse({ children }: { children: React.ReactNode }) {
  const creatorId = useSession().data?.user.creatorId ?? "";
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    const result = await createCourse({
      creatorId,
      name: values.name,
    });

    if (!result.success) {
      toast({ title: "Something went wrong", variant: "destructive" });
    } else {
      router.push(`/creator/course/${result.data?.id}`);
      toast({ title: "Course Created Successfully!", variant: "message" });
    }
  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          {isPending ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-4">
                  Name your course
                </AlertDialogTitle>
                <AlertDialogDescription>
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
                            <FormControl>
                              <Input
                                autoFocus
                                placeholder="Course Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-x-4">
                        <Button type="submit">Create</Button>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          variant={"outline"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
