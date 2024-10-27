"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { publishCourse } from "@/server/actions/publish-course";
import { toast } from "@/hooks/use-toast";

export default function PublishCourse({
  courseId,
  published,
}: {
  published: boolean;
  courseId: string;
}) {
  const [checked, setChecked] = useState<boolean>(published);

  const onCheckedChange = async (checked: boolean) => {
    setChecked(checked);
    const response = await publishCourse({ courseId, publish: checked });
    if (response.success) {
      if (published) {
        toast({ title: "Course Unpublished", variant: "message" });
      } else toast({ title: "Course Published", variant: "message" });
    } else {
      if (response.notPublishable) {
        setChecked(published);
        toast({
          title: "Course not Publishable!",
          description: "Should have a visible chapter with video",
          variant: "destructive",
        });
      } else {
        if (response.error) {
          toast({ title: "Something went wrong", variant: "destructive" });
        }
      }
    }
  };
  return (
    <div className="w-full mb-4">
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <div className="font-bold">Publish</div>
          <div className="text-[0.8rem] text-muted-foreground"></div>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}
