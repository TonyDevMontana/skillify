import { CreatorProfile } from "@/components/profile/creator-profile";
import { Spinner } from "@/components/spinner";
import { Suspense } from "react";

export default function Profile() {
  return (
    <div className="px-8 lg:px-14 md:mx-0 w-full mb-8">
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
