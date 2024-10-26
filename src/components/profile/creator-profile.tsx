import { About } from "@/components/profile/about";
import { ProfileBio } from "@/components/profile/profile-bio";
import { ProfilePhoto } from "@/components/profile/profile-photo";
import { auth } from "@/server/auth";
import db from "@/server/db";
import { redirect } from "next/navigation";
import { cache } from "react";

const getCreatorProfile = cache(async (id: string) => {
  return await db.creator.findUnique({
    where: {
      id,
    },
  });
});

export async function CreatorProfile() {
  const session = await auth();
  const creatorId = session?.user.creatorId ?? "";
  if (!creatorId) {
    redirect("/browse");
  }
  const creator = await getCreatorProfile(creatorId);
  return (
    <div className="flex flex-col lg:flex-row w-full gap-10">
      <div className="flex flex-col lg:flex-col md:flex-row gap-6 mx-auto">
        <div className="mb-6 h-60 w-60">
          <ProfilePhoto imageUrl={creator?.pictureUrl} />
        </div>
        <div className="w-full">
          <ProfileBio creator={creator} />
        </div>
      </div>
      <div className="w-full flex justify-center sm:justify-start">
        <About initialValue={creator?.about ?? ""} />
      </div>
    </div>
  );
}
