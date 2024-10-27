import React, { ReactNode } from "react";

export function SidebarContainer({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block border-r pt-28 min-h-screen w-52 fixed top-0 left-0 bg-background z-40">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-40">
        <div className="flex justify-around items-center h-16 px-4">
          {children}
        </div>
      </div>
    </>
  );
}
