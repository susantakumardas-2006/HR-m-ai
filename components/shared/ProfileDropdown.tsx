import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employees, activityFeed } from "../../data/mockData";

interface ProfileDropdownProps {
  role: "employee" | "hr";
}

export default function ProfileDropdown({ role }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = role === "hr" ? employees.find((e) => e.role === "hr")! : employees[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    { icon: "👤", label: "Profile", onClick: () => {} },
    { icon: "📅", label: "Attendance", onClick: () => {} },
    { icon: "🏖️", label: "Leave Requests", onClick: () => {} },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:bg-white/[0.04] rounded-xl px-3 py-2 transition-all"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-primary/50"
          style={{ backgroundColor: user.color + "22", color: user.color }}
        >
          {user.initials}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-foreground leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{role === "hr" ? "HR Admin" : "Employee"}</p>
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 animate-slide-down rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
          {/* User info header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: user.color + "22", color: user.color }}
              >
                {user.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-md bg-primary/15 text-primary font-semibold uppercase tracking-wider">
              {role === "hr" ? "HR Admin" : "Employee"}
            </span>
          </div>

          {/* Quick access */}
          <div className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:bg-white/[0.06] hover:text-foreground transition-colors"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="border-t border-border px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Recent Activity
            </p>
            <div className="space-y-2">
              {activityFeed.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-foreground/70 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-border p-2">
            <button
              onClick={() => { navigate("/"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <span className="text-base">🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
