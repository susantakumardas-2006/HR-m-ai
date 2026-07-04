import { useNavigate } from "react-router-dom";
import ProfileDropdown from "../shared/ProfileDropdown";

interface DashboardTopBarProps {
  role: "employee" | "hr";
}

export default function DashboardTopBar({ role }: DashboardTopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-hero-bg/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
      {/* Left: Logo + Dashboard label */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <span className="text-foreground text-lg font-bold tracking-tight uppercase">
            Sentinel
          </span>
          <span className="text-primary text-lg font-bold tracking-tight uppercase">
            AI
          </span>
        </button>
        <div className="h-5 w-px bg-border" />
        <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
          Dashboard
        </span>
        <span className="text-xs px-2 py-0.5 rounded-md bg-primary/15 text-primary font-semibold uppercase tracking-wider">
          {role === "hr" ? "HR" : "Employee"}
        </span>
      </div>

      {/* Right: Profile */}
      <ProfileDropdown role={role} />
    </header>
  );
}
