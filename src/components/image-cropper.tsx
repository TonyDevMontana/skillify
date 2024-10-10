"use client";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import usePictureUploadStore from "@/store/picture-store";

function ImageCropper({ aspectRatio = 1 }: { aspectRatio?: number }) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const selectedImage = usePictureUploadStore((state) => state.selectedImage);
  const croppedImageBase64 = usePictureUploadStore(
    (state) => state.croppedImageBase64
  );
  const setCroppedImageBase64 = usePictureUploadStore(
    (state) => state.setCroppedImageBase64
  );

  const getCropData = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
      if (croppedDataUrl) {
        setCroppedImageBase64(croppedDataUrl);
      } else {
        console.error("Could not get cropped data URL");
      }
    } else {
      console.error("Cropper instance is not available");
    }
  };

  if (croppedImageBase64) {
    return (
      <Image
        src={croppedImageBase64}
        alt="Cropped Preview"
        width={400}
        height={400}
        className="rounded-lg"
      />
    );
  }

  return (
    <div>
      <Cropper
        src={selectedImage}
        style={{ height: 400, width: "100%" }}
        ref={cropperRef}
        aspectRatio={aspectRatio}
        viewMode={1}
        guides={true}
        minCropBoxHeight={100}
        minCropBoxWidth={100}
        checkOrientation={false}
        background={false}
        responsive={true}
      />
      <div className="flex justify-end mt-2">
        <Button onClick={getCropData}>Crop Image</Button>
      </div>
    </div>
  );
}

export default ImageCropper;
