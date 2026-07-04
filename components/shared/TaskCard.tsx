import type { Task } from "../../data/mockData";

const priorityStyles: Record<string, string> = {
  high: "bg-red-500/15 text-red-400 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low: "bg-green-500/15 text-green-400 border-green-500/30",
};

const statusStyles: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-500/15 text-blue-400",
  completed: "bg-primary/15 text-primary",
};

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export default function TaskCard({ task, compact }: TaskCardProps) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:border-primary/30 hover:scale-[1.01] transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
        {/* Credit badge */}
        <span className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary whitespace-nowrap">
          +{task.credits} cr
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Priority */}
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {/* Status */}
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${statusStyles[task.status]}`}>
          {task.status.replace("-", " ")}
        </span>
        {/* Project */}
        <span className="text-[10px] text-muted-foreground ml-auto">
          {task.project}
        </span>
      </div>

      {!compact && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-[11px] text-muted-foreground">
            Due: {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      )}
    </div>
  );
}
