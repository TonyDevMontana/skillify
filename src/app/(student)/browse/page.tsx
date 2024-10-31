import BrowseCourses from "@/components/browse-courses";
import { Spinner } from "@/components/spinner";
import React, { Suspense } from "react";

export default async function Browse() {
  return (
    <div className="px-2 py-8">
      <div className="mb-12"></div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-128px)]">
            <Spinner />
          </div>
        }
      >
        <BrowseCourses />
      </Suspense>
    </div>
  );
}
