import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { ChapterInfoDialog } from "@/components/creator-course/chapter-info-dialog";
import { Switch } from "@/components/ui/switch";
import { HtmlContent } from "@/components/html-content";
import { DeleteChapterDialog } from "@/components/creator-course/delete-chapter-dialog";
import { ChapterVisible } from "./chapter-visible";

export function ChapterInfo({
  chapter,
}: {
  chapter: Chapter | null | undefined;
}) {
  return (
    <div>
      <DeleteChapterDialog chapterId={chapter?.id ?? ""} />
      <ChapterVisible
        chapterId={chapter?.id ?? ""}
        isVisible={chapter?.visible ?? false}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-x-2">
            <span className="mb-1">Chapter Info</span>
            <ChapterInfoDialog chapter={chapter}>
              <Pencil
                height={20}
                width={20}
                className="hover:text-orange-600"
              />
            </ChapterInfoDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span>Name:</span>
          <CardDescription>{chapter?.name}</CardDescription>
        </CardContent>
        <CardContent>
          <div className="flex gap-x-2 items-center">
            <span className="mb-1">Free Preview:</span>
            <Switch
              id="is free for preview"
              disabled
              checked={chapter?.freePreview}
            />
          </div>
        </CardContent>
        <CardContent>
          <span>Description:</span>
          <CardDescription>
            <HtmlContent html={chapter?.description || ""} />
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
