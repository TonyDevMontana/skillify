"use client";
import { cn } from "@/lib/utils";
import { handleMuxVideoProcessing } from "@/server/actions/handle-mux-video-processing";
import { createMuxUpload } from "@/server/actions/create-mux-upload";
import MuxPlayer from "@mux/mux-player-react";
import MuxUploader from "@mux/mux-uploader-react";
import { Chapter, Video } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteMuxVideo } from "@/server/actions/delete-mux-video";
import { toast } from "@/hooks/use-toast";

type UploadType = {
  uploadUrl: string;
  uploadId: string;
};

export function VideoHandler({
  chapter,
}: {
  chapter: Chapter & { video: Video | null };
}) {
  const [playbackId, setPlaybackId] = useState<string | undefined | null>(
    chapter.video?.playbackId
  );
  const [upload, setUpload] = useState<UploadType | undefined>({
    uploadUrl: "",
    uploadId: "",
  });
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [open, setOpen] = useState(false);

  const initializeUpload = useCallback(async () => {
    const video = await createMuxUpload({ chapterId: chapter.id });
    if (video.success) setUpload(video.data);
  }, [chapter.id]);

  useEffect(() => {
    if (!playbackId) {
      initializeUpload();
    }
  }, [initializeUpload, chapter.id, playbackId]);

  const SkeletonLoader = () => (
    <div
      className={cn(
        "relative w-full aspect-[16/9] overflow-hidden rounded-lg",
        "bg-[hsl(var(--card))]"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 animate-pulse",
          "bg-[hsl(var(--muted))]"
        )}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    </div>
  );

  if (playbackId) {
    return (
      <>
        {!isPlayerReady && <SkeletonLoader />}

        <MuxPlayer
          playbackId={playbackId}
          accentColor="#D97706"
          title={chapter.name}
          className={cn(
            "overflow-hidden outline-none aspect-[16/9] rounded-md",
            !isPlayerReady ? "hidden" : "visible"
          )}
          onCanPlay={() => setIsPlayerReady(true)}
          onError={() => setIsPlayerReady(true)}
        />
        <div className="mt-4 flex items-center gap-x-2">
          <div className="text-2xl">{chapter.name}</div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="">
              <Trash2 className="text-red-600" />
            </DialogTrigger>
            <DialogContent className="z-50">
              <DialogHeader>
                <div className="text-center mb-4">
                  <DialogTitle className="mb-2">
                    You sure about deleting this video?
                  </DialogTitle>
                  <DialogDescription>
                    Deleted videoes cannot be retrieved back
                  </DialogDescription>
                </div>
                <div className="flex justify-center gap-6">
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
                      const response = await deleteMuxVideo({
                        chapterId: chapter.id,
                      });

                      if (response.success) {
                        toast({
                          title: "Video successfully deleted",
                          variant: "message",
                        });
                        setPlaybackId(null);
                        setIsPlayerReady(false);
                        await initializeUpload();
                      } else {
                        toast({
                          title: "Video Deletion failed",
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
        </div>
      </>
    );
  } else {
    return upload?.uploadUrl ? (
      <>
        <MuxUploader
          endpoint={upload.uploadUrl}
          className="w-full aspect-[16/9]"
          onUploadStart={() => {}}
          onSuccess={async () => {
            const response = await handleMuxVideoProcessing({
              chapterId: chapter.id,
              uploadId: upload.uploadId,
            });

            if (response.success) {
              setPlaybackId(response.data?.playbackId);
              toast({
                title: "Video uploaded Successfully!",
                variant: "message",
              });
            }

            if (response.error) {
              console.error(response.error);
              toast({
                title: "Error while uploading Video",
                variant: "destructive",
              });
            }
          }}
        ></MuxUploader>
        <div className="mt-4">
          <div className="text-3xl">{chapter.name}</div>
        </div>
      </>
    ) : (
      <SkeletonLoader />
    );
  }
}
