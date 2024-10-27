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
      <div className="mt-28 mb-16 md:ml-52 md:mb-0 w-full">{children}</div>
    </div>
  );
}
