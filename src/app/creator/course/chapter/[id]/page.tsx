import ChapterContent from "@/components/creator-course/chapter-content";
import { Spinner } from "@/components/spinner";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="px-14 md:mx-0 w-full">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-128px)]">
            <Spinner />
          </div>
        }
      >
        <ChapterContent chapterId={params.id} />
      </Suspense>
    </div>
  );
}
