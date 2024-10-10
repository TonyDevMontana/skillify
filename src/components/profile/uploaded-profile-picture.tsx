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
import { useSession } from "next-auth/react";
import { deleteProfileImage } from "@/server/actions/delete-profile-image";
import { useState } from "react";
import usePictureUploadStore from "@/store/picture-store";
import { toast } from "@/hooks/use-toast";

export function UploadedProfilePicture({ imageUrl }: { imageUrl: string }) {
  const session = useSession();
  const creatorId = session.data?.user.creatorId;
  const [isLoading, setIsLoading] = useState(true);
  const setIsInputDisabled = usePictureUploadStore(
    (state) => state.setIsInputDisabled
  );

  return (
    <div className="relative h-60 w-60">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-md" />
      )}
      <Image
        className="rounded-md"
        src={imageUrl}
        alt="profile picture"
        height={240}
        width={240}
        priority={true}
        onLoadingComplete={() => {
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
              You want to remove your profile picture?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-8">
            <DialogClose asChild>
              <Button
                onClick={async () => {
                  const result = await deleteProfileImage({
                    creatorId: creatorId ?? "",
                    imageUrl,
                  });

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
