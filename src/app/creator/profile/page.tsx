import { CreatorProfile } from "@/components/profile/creator-profile";
import { Spinner } from "@/components/spinner";
import { Suspense } from "react";

export const revalidate = 3600;

export default function Profile() {
  return (
    <div className="px-4 sm:px-8 md:px-14  md:mx-0 w-full mb-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[calc(100vh-128px)]">
            <Spinner />
          </div>
        }
      >
        <CreatorProfile />
      </Suspense>
    </div>
  );
}
