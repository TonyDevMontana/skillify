import ChapterContent from "@/components/creator-course/chapter-content";
import { Spinner } from "@/components/spinner";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

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
