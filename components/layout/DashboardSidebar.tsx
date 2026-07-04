import { type ReactNode } from "react";

interface DashboardSidebarProps {
  children: ReactNode;
}

/** Sidebar section header — reusable label for grouping sidebar items */
export function SidebarSection({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/** Generic scrollable sidebar container */
export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  return (
    <aside className="h-full overflow-y-auto p-4 space-y-2">{children}</aside>
  );
}
