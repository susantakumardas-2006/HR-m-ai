import { Search } from "lucide-react";
import { employees, hrDepartments } from "../../data/mockData";

export default function HRSidebar() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Employee Switcher</h3>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <input className="w-full bg-transparent outline-none" placeholder="Search" />
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">People</h3>
        <div className="space-y-2">
          {employees.slice(0, 6).map((employee) => (
            <div key={employee.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">{employee.initials}</div>
                <div>
                  <div className="text-sm text-foreground">{employee.name}</div>
                  <div className="text-[11px] text-muted-foreground">{employee.department}</div>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${employee.status === "online" ? "bg-primary/15 text-primary" : "bg-white/[0.06] text-muted-foreground"}`}>{employee.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">HR Contacts</h3>
        <div className="space-y-2">
          {hrDepartments.map((dept) => (
            <div key={dept.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-sm">
              <div className="font-medium text-foreground">{dept.name}</div>
              <div className="text-xs text-muted-foreground">{dept.contactPerson}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
