"use client";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteThumbnail } from "@/server/actions/delete-thumbnail";
import usePictureUploadStore from "@/store/picture-store";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function UploadedThumbnailPicture({
  imageUrl,
  courseId,
}: {
  imageUrl: string;
  courseId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const setIsInputDisabled = usePictureUploadStore(
    (state) => state.setIsInputDisabled
  );
  return (
    <div className="relative sm:h-60 sm:w-96 h-40 w-60">
      {isLoading && (
        <div className="sm:h-60 sm:w-96 h-40 w-60 bg-muted animate-pulse rounded-md" />
      )}
      <Image
        src={imageUrl}
        alt={"profile"}
        width={0}
        height={0}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        style={{ width: "100%", height: "auto" }}
        priority={true}
        onLoad={() => {
          setIsLoading(false);
          setIsInputDisabled(false);
        }}
      />
      <Dialog>
        <DialogTrigger>
          <X className="absolute -right-2 -top-2 bg-rose-500 text-white p-1 rounded-full shadow-sm hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              You want to remove your Thumbnail?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-8">
            <DialogClose asChild>
              <Button
                onClick={async () => {
                  const result = await deleteThumbnail({ courseId, imageUrl });

                  if (!result.success) {
                    toast({
                      title: "Something went wrong",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Yes
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="">No</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
