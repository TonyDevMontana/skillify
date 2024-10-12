"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { updateProfileAbout } from "@/server/actions/update-profile-about";
import Tiptap from "@/components/tiptap";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export function About({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
  const creatorId = session.data?.user.creatorId;

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="relative w-full md:min-h-96 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isEditable ? (
        <Button
          className="md:absolute md:right-0 mb-4"
          onClick={async () => {
            const result = await updateProfileAbout({
              creatorId: creatorId ?? "",
              about: value,
            });
            if (!(value === "<p></p>") && !(value === "<h2></h2>")) {
              setIsEditable(false);
            }

            if (!result.success) {
              toast({
                title: "Something went wrong",
                variant: "destructive",
              });
            }
          }}
        >
          Save
        </Button>
      ) : (
        <Button
          className="mb-4"
          onClick={() => {
            setIsEditable(true);
          }}
        >
          Edit
        </Button>
      )}
      <Tiptap
        value={initialValue}
        className={"min-h-96 max-w-[350px]"}
        setValue={setValue}
        editable={isEditable}
        placeholder="Write about yourself in youn public creator's profile"
      />
    </div>
  );
}
