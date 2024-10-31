"use client";
import { cn } from "@/lib/utils";
import usePictureStore from "@/store/picture-store";
import { Upload } from "lucide-react";
import { ChangeEvent } from "react";
import { UploadedThumbnailPicture } from "./uploaded-thumbnail-picture";
import { Spinner } from "../spinner";
import { ThumbnailDialog } from "./thumbnail-dialog";

export function ThumbnailPhoto({
  imageUrl,
  courseId,
}: {
  imageUrl: string | null | undefined;
  courseId: string | null | undefined;
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
      <div className="h-60 sm:h-40 w-60 sm:w-96 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="relative h-40 w-60 sm:h-60 sm:w-96">
        {imageUrl ? (
          <UploadedThumbnailPicture
            imageUrl={imageUrl}
            courseId={courseId || ""}
          />
        ) : (
          <div className="h-full w-full bg-orange-100 rounded-lg flex justify-center items-center cursor-pointer">
            <div>
              <div className="flex justify-center">
                <Upload className="text-black text-center text-xs w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-black text-xs sm:text-sm">
                Click to upload Thumbnail (upto 8MB)
              </div>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className={cn(
                "opacity-0 absolute inset-0 cursor-pointer",
                isInputDisabled ? "cursor-not-allowed" : ""
              )}
              onChange={setSelectedFile}
              disabled={isInputDisabled === true}
            />
          </div>
        )}
      </div>
      <ThumbnailDialog courseId={courseId || ""} />
    </>
  );
}
