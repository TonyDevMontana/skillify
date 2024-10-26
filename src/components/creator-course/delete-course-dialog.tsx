"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/server/actions/delete-course";

export function DeleteCourseDialog({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-red-600 rounded-md p-1 py-1.5 w-full text-sm mb-4 uppercase font-semibold">
        Delete Course
      </DialogTrigger>
      <DialogContent className="z-50">
        <DialogHeader>
          <div className="text-center mb-4">
            <DialogTitle className="mb-2">
              You sure about deleting this Course?
            </DialogTitle>
            <DialogDescription>
              All info cannot be retrieved after deletion
            </DialogDescription>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <Button
              className="px-7"
              onClick={() => {
                setOpen(false);
              }}
            >
              No
            </Button>
            <Button
              className=""
              variant="destructive"
              onClick={async () => {
                setOpen(false);
                toast({ title: "Deleting Course...." });
                const response = await deleteCourse({ courseId });

                if (response.success) {
                  toast({
                    title: "Course successfully deleted",
                    variant: "message",
                  });
                  router.push(`/creator/courses`);
                } else {
                  toast({
                    title: "Course Deletion failed",
                    variant: "destructive",
                  });
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
