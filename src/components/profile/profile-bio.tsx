import { MoveUpRight } from "lucide-react";
import { ProfileBioDialog } from "@/components/profile/profile-bio-dialog";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Creator } from "@prisma/client";

export async function ProfileBio({ creator }: { creator: Creator | null }) {
  return (
    <div>
      <div className="mb-4 w-full">
        <div>Name:</div>

        <div className="text-3xl lg:text-4xl">{creator?.name}</div>
      </div>
      <div className="mb-4">
        <div>Profession:</div>
        <div className="text-2xl">{creator?.profession}</div>
      </div>
      <div className="mb-4">
        <div>LinkedIn:</div>
        <div className="text-xl text-orange-600 hover:text-orange-200">
          <Link target="_blank" href={creator?.linkedInUrl || "#"}>
            <div className="flex items-center hover:underline">
              <div>Visit</div>
              <MoveUpRight height={15} width={15} />
            </div>
          </Link>
        </div>
      </div>
      <div>
        <ProfileBioDialog creator={creator}>
          <Pencil className="hover:text-orange-600 outline-none" />
        </ProfileBioDialog>
      </div>
    </div>
  );
}
