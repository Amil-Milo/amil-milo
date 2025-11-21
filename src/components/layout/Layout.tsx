import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SidebarMobile } from "@/components/SidebarMobile";

interface LayoutProps {
  children: ReactNode;
  backgroundClass?: string;
}

export function Layout({ children, backgroundClass = "bg-background" }: LayoutProps) {
  return (
    <div className={`flex h-screen w-full ${backgroundClass} overflow-hidden`}>
      <Sidebar />
      <SidebarMobile />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

