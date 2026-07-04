import { useState } from "react";
import type { AttendanceRecord } from "../../data/mockData";

interface MonthlyCalendarViewProps {
  records: AttendanceRecord[];
  initialDate?: Date;
}

const statusConfig: Record<string, { class: string; label: string; emoji: string }> = {
  present: { class: "cal-day-present", label: "Present", emoji: "✅" },
  absent: { class: "cal-day-absent", label: "Absent", emoji: "❌" },
  "half-day": { class: "cal-day-halfday", label: "Half-day", emoji: "🌗" },
  leave: { class: "cal-day-leave", label: "Leave", emoji: "🏖️" },
  weekend: { class: "cal-day-weekend", label: "Weekend", emoji: "⬜" },
  holiday: { class: "cal-day-weekend", label: "Holiday", emoji: "🎉" },
};

export default function MonthlyCalendarView({ records, initialDate }: MonthlyCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate ?? new Date(2026, 6, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const today = "2026-07-04";
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const recordMap: Record<string, AttendanceRecord> = {};
  records.forEach((r) => { recordMap[r.date] = r; });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Summary stats
  const stats = { present: 0, absent: 0, "half-day": 0, leave: 0 };
  records.forEach((r) => {
    if (r.status in stats) stats[r.status as keyof typeof stats]++;
  });

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {(Object.entries(stats) as [string, number][]).map(([key, val]) => (
          <div key={key} className="text-center p-2 rounded-lg bg-white/[0.03]">
            <p className="text-lg font-bold text-foreground">{val}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground capitalize">
              {key.replace("-", " ")}
            </p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-foreground">{monthName}</span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="w-9 h-9" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const record = recordMap[dateStr];
          const isToday = dateStr === today;

          let cellClass = "cal-day";
          if (record) {
            cellClass += ` ${statusConfig[record.status]?.class ?? ""}`;
          } else {
            cellClass += " text-muted-foreground/30";
          }
          if (isToday) cellClass += " cal-day-today";

          return (
            <div key={day} className={cellClass} title={record ? statusConfig[record.status]?.label : ""}>
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        {Object.entries(statusConfig)
          .filter(([k]) => k !== "holiday")
          .map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="text-xs">{cfg.emoji}</span>
              <span className="text-[10px] text-muted-foreground capitalize">{cfg.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
