import { create } from "zustand";

type PictureType = {
  selectedImage: string;
  croppedImageBase64: string;
  isPictureLoading: boolean;
  isDialogOpen: boolean;
  isInputDisabled: boolean;
  setSelectedImage: (image: string) => void;
  setCroppedImageBase64: (image: string) => void;
  setIsPictureLoading: (loading: boolean) => void;
  setIsDialogOpen: (open: boolean) => void;
  setIsInputDisabled: (isDisable: boolean) => void;
  reset: () => void;
};

const usePictureUploadStore = create<PictureType>()((set) => ({
  selectedImage: "",
  croppedImageBase64: "",
  isPictureLoading: false,
  isDialogOpen: false,
  isInputDisabled: false,
  setSelectedImage: (image: string) => set({ selectedImage: image }),
  setCroppedImageBase64: (image: string) => set({ croppedImageBase64: image }),
  setIsPictureLoading: (loading: boolean) => set({ isPictureLoading: loading }),
  setIsDialogOpen(open) {
    set({ isDialogOpen: open });
  },
  setIsInputDisabled(isDisable) {
    set({ isInputDisabled: isDisable });
  },
  reset() {
    set({
      selectedImage: "",
      croppedImageBase64: "",
      isPictureLoading: false,
      isDialogOpen: false,
    });
  },
}));

export default usePictureUploadStore;
