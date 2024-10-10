import { CreatorSidebar } from "@/components/sidebar/creator-sidebar";
import { ReactNode } from "react";

export default async function CreatorsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex">
      <CreatorSidebar />
      <div className="mt-32 ml-20 md:ml-52 w-full">{children}</div>
    </div>
  );
}
