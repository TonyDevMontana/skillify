import { HtmlContent } from "@/components/html-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/server/db";
import MuxPlayer from "@mux/mux-player-react";
import { notFound } from "next/navigation";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const getChapter = async (id: string, courseId: string) => {
  return await db.chapter.findUnique({
    where: {
      id: id,
      courseId: courseId,
    },
    include: {
      video: true,
    },
  });
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const chapter = await getChapter(params.chapterId, params.courseId);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-full">
        <h1 className="mb-4 text-2xl font-bold">{chapter.name}</h1>
        {chapter.video && chapter.video.playbackId && (
          <div className="w-full bg-black mt-6">
            <div className="mx-auto max-w-[177.78vh]">
              <div className="aspect-video">
                <MuxPlayer
                  autoPlay
                  accentColor="#D97706"
                  playbackId={chapter.video.playbackId ?? ""}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <Tabs defaultValue="overview" className="w-[400px] visible md:hidden">
            <TabsList>
              {chapter.description && (
                <TabsTrigger value="overview">Overview</TabsTrigger>
              )}
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <HtmlContent html={chapter.description ?? ""} />
            </TabsContent>
            <TabsContent value="chapters">
              Change your password here.
            </TabsContent>
          </Tabs>

          <div className="hidden md:visible">
            {chapter.description && (
              <HtmlContent html={chapter.description ?? ""} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
