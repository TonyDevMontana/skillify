"use client";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserButton() {
  const session = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return session.status === "loading" ? null : (
    <div>
      {session.status === "authenticated" ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session.data?.user.image ?? ""} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuItem>My Courses</DropdownMenuItem>
            <DropdownMenuItem>Wishlist</DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                router.push(`/creator/courses`);
              }}
            >
              Create Course
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut({ callbackUrl: "/", redirect: true });
              }}
            >
              <div className="flex items-center gap-x-1">
                <LogOut width={15} height={15} />
                Sign out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link href={"/api/auth/signin"}>Signin</Link>
        </Button>
      )}
    </div>
  );
}
