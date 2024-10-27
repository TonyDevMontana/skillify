"use client";

import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { updateChapterVisibility } from "@/server/actions/update-chapter-visibility";
import { useState } from "react";

export function ChapterVisible({
  chapterId,
  isVisible,
}: {
  chapterId: string;
  isVisible: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(isVisible);
  async function onCheckedChange(checked: boolean) {
    setChecked(checked);
    const response = await updateChapterVisibility({
      chapterId,
      visible: checked,
    });

    if (response.success) {
      toast({
        title: "Chapter Visibility Changed",
        variant: "message",
      });
    } else {
      setChecked(isVisible);
      if (response.cannotDelete) {
        toast({
          title: "Cannot disable visibility",
          description:
            "Published Course must maintain one valid chapter with video",
          variant: "destructive",
        });
      } else
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
    }
  }

  return (
    <div className="w-full mb-4">
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <div className="font-bold">Change Visiblity</div>
          <div className="text-[0.8rem] text-muted-foreground">
            Hidden Chapter is not shown to the viewer
          </div>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}
