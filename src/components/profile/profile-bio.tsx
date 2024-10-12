import { MoveUpRight } from "lucide-react";
import { ProfileBioDialog } from "@/components/profile/profile-bio-dialog";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Creator } from "@prisma/client";
import { cn } from "@/lib/utils";

export async function ProfileBio({ creator }: { creator: Creator | null }) {
  const url = creator?.linkedInUrl;
  const isValidUrl = url && url.trim() !== "" && url !== "#";

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
        <div
          className={cn(
            "text-xl text-orange-600 hover:text-orange-200",
            isValidUrl ? "cursor-pointer" : "cursor-not-allowed"
          )}
        >
          {isValidUrl ? (
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center">
                <div>Visit</div>
                <MoveUpRight height={15} width={15} />
              </div>
            </Link>
          ) : (
            <div className="flex items-center">
              <div>Visit</div>
              <MoveUpRight height={15} width={15} />
            </div>
          )}
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
