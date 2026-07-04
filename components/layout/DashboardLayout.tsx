import { type ReactNode } from "react";
import DashboardTopBar from "./DashboardTopBar";

interface DashboardLayoutProps {
  role: "employee" | "hr";
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
}

/**
 * Master layout: GitHub-like 3-column dashboard shell.
 * Common to both Employee and HR dashboards.
 * - Fixed top bar
 * - Left sidebar (w-72)
 * - Main scrollable content (flex-1)
 * - Right sidebar (w-80)
 */
export default function DashboardLayout({
  role,
  leftSidebar,
  mainContent,
  rightSidebar,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-hero-bg text-foreground">
      <DashboardTopBar role={role} />

      {/* 3-column body below top bar */}
      <div className="flex pt-16 h-screen">
        {/* Left Sidebar */}
        <div className="w-72 flex-shrink-0 bg-sidebar border-r border-border overflow-y-auto">
          {leftSidebar}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-5xl mx-auto">{mainContent}</div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0 bg-sidebar border-l border-border overflow-y-auto">
          {rightSidebar}
        </div>
      </div>
    </div>
  );
}
