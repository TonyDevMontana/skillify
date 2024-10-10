"use client";
import { cn } from "@/lib/utils";
import usePictureStore from "@/store/picture-store";
import { UserRound } from "lucide-react";
import { ChangeEvent } from "react";
import { UploadedProfilePicture } from "@/components/profile/uploaded-profile-picture";
import { ProfilePictureDialog } from "@/components/profile/profile-picture-dialog";
import { Spinner } from "@/components/spinner";

export function ProfilePhoto({
  imageUrl,
}: {
  imageUrl: string | null | undefined;
}) {
  const setSelectedImage = usePictureStore((state) => state.setSelectedImage);
  const setIsDialogOpen = usePictureStore((state) => state.setIsDialogOpen);
  const isInputDisabled = usePictureStore((state) => state.isInputDisabled);
  const isPictureLoading = usePictureStore((state) => state.isPictureLoading);

  const setSelectedFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        setSelectedImage(URL.createObjectURL(file));
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Error creating object URL:", error);
        setSelectedImage("");
      }
    }
  };

  if (isPictureLoading) {
    return (
      <div className="h-60 w-60 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="relative h-60 w-60">
        {imageUrl ? (
          <UploadedProfilePicture imageUrl={imageUrl} />
        ) : (
          <div className="h-full w-full bg-orange-100 rounded-lg flex justify-center items-center cursor-pointer">
            <UserRound width={400} height={400} color="black" />
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className={cn(
                "opacity-0 absolute inset-0 cursor-pointer",
                isInputDisabled === true ? "cursor-not-allowed" : ""
              )}
              onChange={setSelectedFile}
              disabled={isInputDisabled === true}
              // ref={localFileInputRef}
            />
          </div>
        )}
      </div>
      <ProfilePictureDialog />
    </>
  );
}
