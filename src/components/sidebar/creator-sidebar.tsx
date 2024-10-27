import { SidebarItem } from "@/components/sidebar/sidebar-item";
import { SidebarContainer } from "@/components/sidebar/sidebar-container";
import {
  ArrowBigLeft,
  ChartColumnIncreasing,
  Goal,
  UserRoundPen,
} from "lucide-react";

export async function CreatorSidebar() {
  const sidebarItemsList = [
    {
      title: "Profile",
      icon: <UserRoundPen />,
      href: "/creator/profile",
      key: "/creator/profile",
    },
    {
      title: "Courses",
      icon: <Goal />,
      href: "/creator/courses",
      key: "/creator/courses",
    },
    {
      title: "Analytics",
      icon: <ChartColumnIncreasing />,
      href: "/creator/analytics",
      key: "/creator/analytics",
    },
    {
      title: "Exit",
      icon: <ArrowBigLeft />,
      href: "/browse",
      key: "/browse",
    },
  ];
  return (
    <SidebarContainer>
      {sidebarItemsList.map((item) => (
        <SidebarItem
          title={item.title}
          href={item.href}
          icon={item.icon}
          key={item.key}
        />
      ))}
    </SidebarContainer>
  );
}
