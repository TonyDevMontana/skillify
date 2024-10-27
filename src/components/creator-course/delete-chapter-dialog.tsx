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
import { deleteChapter } from "@/server/actions/delete-chapter";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function DeleteChapterDialog({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-red-600 rounded-md p-1 py-1.5 w-full text-sm mb-4 uppercase font-semibold">
        Delete Chapter
      </DialogTrigger>
      <DialogContent className="z-50">
        <DialogHeader>
          <div className="text-center mb-4">
            <DialogTitle className="mb-2">
              You sure about deleting this Chapter?
            </DialogTitle>
            <DialogDescription>
              All the info will be removed including video
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
                toast({ title: "Deleting..." });
                const response = await deleteChapter({ chapterId });

                if (response.success) {
                  toast({
                    title: "Chapter successfully deleted",
                    variant: "message",
                  });
                  router.push(`/creator/course/${response.data?.courseId}`);
                } else {
                  if (response.cannotDelete) {
                    toast({
                      title: "Cannot delete Last Chapter",
                      description:
                        "Published course should maintain one valid chapter",
                      variant: "destructive",
                    });
                  } else
                    toast({
                      title: "Chapter Deletion failed",
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
