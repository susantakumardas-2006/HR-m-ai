import { activityFeed, employees } from "../../data/mockData";
import ContributionTree from "../shared/ContributionTree";

export default function ProgressReport() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Weekly Summary</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[8px] border-primary/20 border-t-primary text-xl font-semibold text-foreground">82%</div>
          <div>
            <div className="text-sm text-foreground">Sprint progress</div>
            <div className="text-sm text-muted-foreground">4 tasks ahead of plan</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contribution Tree</h3>
        <ContributionTree />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Recent Activity</h3>
        <div className="space-y-2">
          {activityFeed.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
              <div className="font-medium text-foreground">{item.text}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Team Presence</h3>
        <div className="space-y-2">
          {employees.slice(0, 4).map((employee) => (
            <div key={employee.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{employee.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${employee.status === "online" ? "bg-primary/15 text-primary" : "bg-white/[0.06] text-muted-foreground"}`}>{employee.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
