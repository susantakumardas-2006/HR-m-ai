import { useMemo, useState } from "react";
import { tasks } from "../../data/mockData";
import TaskCard from "../shared/TaskCard";

export default function TaskSection() {
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");

  const visibleTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {[{ label: "Tasks Completed", value: "24" }, { label: "Credits Earned", value: "182" }, { label: "Streak Days", value: "9" }].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-2xl font-semibold text-foreground">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">My Tasks</h3>
            <p className="text-sm text-muted-foreground">Keep your current priorities moving.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "in-progress", "completed"] as const).map((option) => (
              <button key={option} onClick={() => setFilter(option)} className={`rounded-full px-3 py-1.5 text-sm capitalize transition-all ${filter === option ? "bg-primary text-primary-foreground" : "bg-white/[0.04] text-muted-foreground hover:text-foreground"}`}>
                {option.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-lg font-semibold text-foreground">Submit Task</h3>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center text-sm text-muted-foreground">
            Drop files here or click to upload
          </div>
          <div className="space-y-3">
            <input className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground" placeholder="Task name" />
            <textarea className="min-h-24 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground" placeholder="Short summary" />
            <select className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground">
              <option>Project Alpha</option>
              <option>Project Beta</option>
              <option>Project Gamma</option>
            </select>
            <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
