import { useState } from "react";
import type { HRDepartment } from "../../data/mockData";

interface HRContactDropdownProps {
  departments: HRDepartment[];
}

export default function HRContactDropdown({ departments }: HRContactDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground">
        <span>Department contacts</span>
        <span className="text-muted-foreground">▾</span>
      </button>
      {open ? (
        <div className="absolute left-0 right-0 z-10 mt-2 rounded-xl border border-white/10 bg-card p-2 shadow-xl shadow-black/40">
          {departments.map((dept) => (
            <div key={dept.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{dept.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${dept.status === "online" ? "bg-primary/15 text-primary" : "bg-white/[0.06] text-muted-foreground"}`}>{dept.status}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{dept.contactPerson}</div>
              <div className="mt-1 text-[11px] text-primary">{dept.email}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
