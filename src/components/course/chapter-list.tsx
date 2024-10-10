"use client";
import { reorderChapters } from "@/server/actions/reorder-chapters";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Menu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Chapter } from "@prisma/client";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function VideoChapterList({
  chapters,
  courseId,
}: {
  courseId: string;
  chapters: Chapter[] | undefined;
}) {
  const [localChapters, setLocalChapters] = useState<Chapter[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (chapters) {
      setLocalChapters(chapters.sort((a, b) => a.order - b.order));
    }
  }, [chapters]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !localChapters) return;

    const items = Array.from(localChapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedChapters = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setLocalChapters(updatedChapters);
    setIsSaving(true);

    try {
      const reorderResult = await reorderChapters({
        updatedChapters: updatedChapters.map(({ id, order }) => ({
          id,
          order,
        })),
        courseId,
      });

      if (!reorderResult.success) {
        throw new Error(reorderResult.error);
      }

      toast({ title: "Chapter order changed", variant: "message" });
    } catch (error) {
      console.error("Failed to update chapter order:", error);
      setLocalChapters(chapters?.sort((a, b) => a.order - b.order) || []);
    } finally {
      setIsSaving(false);
    }
  };

  if (!localChapters.length)
    return <div>No chapters created yet. Create a chapter first.</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="relative"
          >
            {isSaving && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center space-x-2">
                  <Loader2 className="animate-spin" />
                  <span>Saving...</span>
                </div>
              </div>
            )}
            {localChapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
                isDragDisabled={isSaving}
              >
                {(provided) => (
                  <Link
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "flex mb-4 backdrop-blur-md bg-white/10 p-2 border border-white/30 rounded-lg shadow-lg hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-700/20 dark:border-gray-600/30 dark:shadow-gray-800/30",
                      isSaving &&
                        "pointer-events-none opacity-65 dark:opacity-50"
                    )}
                    href={`/creator/course/chapter/${chapter.id}`}
                    onClick={(e) => isSaving && e.preventDefault()}
                  >
                    <div className="flex items-center">
                      <Menu className="mr-2" width={20} height={20} />
                      <div>{chapter.name}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <Badge
                        className={cn(
                          chapter.freePreview ? "visible" : "hidden"
                        )}
                      >
                        Free
                      </Badge>
                      <Badge
                        className={cn(
                          !chapter.published
                            ? ""
                            : "bg-green-500 px-5 hover:bg-green-600"
                        )}
                        variant={"destructive"}
                      >
                        {!chapter.published ? "Unpublished" : "Published"}
                      </Badge>
                    </div>
                  </Link>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
