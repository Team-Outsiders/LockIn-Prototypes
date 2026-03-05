import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-secondary/30">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden relative">
          {/* Subtle top gradient for clean depth */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent opacity-50 pointer-events-none z-0" />
          
          <header className="flex items-center h-16 px-4 shrink-0 z-10">
            <SidebarTrigger className="hover:bg-secondary transition-colors" />
          </header>
          
          <main className="flex-1 overflow-y-auto z-10 px-4 md:px-8 pb-12">
            <div className="max-w-6xl mx-auto w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
