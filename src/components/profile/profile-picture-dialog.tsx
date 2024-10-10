"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ImageCropper from "@/components/image-cropper";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import usePictureUploadStore from "@/store/picture-store";
import { useSession } from "next-auth/react";
import { updateProfilePicture } from "@/server/actions/update-profile-picture";

export function ProfilePictureDialog() {
  const session = useSession();
  const creatorId = session.data?.user.creatorId ?? "";
  const isUploadDialogOpen = usePictureUploadStore(
    (state) => state.isDialogOpen
  );
  const setIsUploadDialogOpen = usePictureUploadStore(
    (state) => state.setIsDialogOpen
  );
  const croppedImageBase64 = usePictureUploadStore(
    (state) => state.croppedImageBase64
  );
  const reset = usePictureUploadStore((state) => state.reset);
  const setIsPictureLoading = usePictureUploadStore(
    (state) => state.setIsPictureLoading
  );
  const setIsInputDisabled = usePictureUploadStore(
    (state) => state.setIsInputDisabled
  );

  const { toast } = useToast();

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (response) => {
      toast({ title: "Uploaded successfully!", variant: "message" });
      const pictureUrl = response?.[0]?.url;
      const result = await updateProfilePicture({ creatorId, pictureUrl });
      reset();

      if (!result.success)
        toast({ title: "Something went wrong", variant: "destructive" });
    },
    onUploadError: () => {
      toast({
        title: "Error occurred while uploading",
        variant: "destructive",
      });
      reset();
    },
    onUploadBegin: () => {
      toast({ title: "Picture Uploading...", variant: "message" });
      setIsPictureLoading(true);
    },
  });

  const uploadCropped = () => {
    setIsInputDisabled(true);
    const blobData = dataURLtoBlob(croppedImageBase64);
    const file = new File([blobData], "cropped-image.png", {
      type: "image/png",
    });
    setIsPictureLoading(true);
    startUpload([file]);
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div>
      <AlertDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        defaultOpen={isUploadDialogOpen}
      >
        <AlertDialogContent
          className={cn(croppedImageBase64 ? "max-w-md" : "sm:max-w-2xl")}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className={cn(!croppedImageBase64 ? "visible" : "hidden")}
            >
              Crop your Picture
            </AlertDialogTitle>
            <AlertDialogDescription>
              <ImageCropper />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                reset();
              }}
              className="bg-red-600 px-7"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(croppedImageBase64 ? "visible" : "hidden")}
              onClick={uploadCropped}
            >
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
