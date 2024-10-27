"use client";

import { z } from "zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfileBio } from "@/server/actions/update-profile-bio";
import type { Creator } from "@prisma/client";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Must contain atleast 4 characters" })
    .max(30, { message: "Only 30 characters allowed" }),
  profession: z
    .string()
    .min(4, { message: "Must contain atleast 4 characters" })
    .max(30, { message: "Only 30 characters allowed" }),
  linkedInUrl: z.string().min(8, { message: "Must be a valid URL" }),
});

export function ProfileBioDialog({
  children,
  creator,
}: {
  children: ReactNode;
  creator: Creator | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: creator?.name || "",
      profession: creator?.profession || "",
      linkedInUrl: creator?.linkedInUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpen(false);
    toast({ title: "Saving..." });
    const result = await updateProfileBio(values);
    if (!result.success) {
      toast({ title: "Something went wrong", variant: "destructive" });
    } else {
      toast({ title: "Profile Bio Updated!", variant: "message" });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="outline-none">{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-6">Edit your Bio</DialogTitle>
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
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Your profession" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedInUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LinkedIn Profile URL"
                            {...field}
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
