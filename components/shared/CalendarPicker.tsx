import { useState, useCallback } from "react";

interface CalendarPickerProps {
  onRangeSelect?: (range: { startDate: string; endDate: string }) => void;
  selectedRange?: { startDate: string; endDate: string } | null;
}

export default function CalendarPicker({ onRangeSelect, selectedRange }: CalendarPickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // July 2026
  const [selecting, setSelecting] = useState<string | null>(null); // first date clicked

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const today = "2026-07-04";
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = useCallback(
    (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    [year, month]
  );

  const handleClick = (day: number) => {
    const dateStr = formatDate(day);
    if (!selecting) {
      setSelecting(dateStr);
    } else {
      const start = selecting < dateStr ? selecting : dateStr;
      const end = selecting < dateStr ? dateStr : selecting;
      onRangeSelect?.({ startDate: start, endDate: end });
      setSelecting(null);
    }
  };

  const isInRange = (day: number) => {
    const dateStr = formatDate(day);
    if (selectedRange) {
      return dateStr >= selectedRange.startDate && dateStr <= selectedRange.endDate;
    }
    return false;
  };

  const isRangeEnd = (day: number) => {
    const dateStr = formatDate(day);
    if (selectedRange) {
      return dateStr === selectedRange.startDate || dateStr === selectedRange.endDate;
    }
    return false;
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
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
        {/* Empty cells for days before month start */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="w-9 h-9" />
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const isToday = dateStr === today;
          const inRange = isInRange(day);
          const isEnd = isRangeEnd(day);
          const isStart = selecting === dateStr;

          let cellClass = "cal-day cursor-pointer hover:bg-white/[0.08] hover:text-foreground";
          if (isEnd) cellClass = "cal-day cal-day-selected cursor-pointer";
          else if (inRange) cellClass = "cal-day cal-day-range cursor-pointer";
          else if (isStart) cellClass = "cal-day cal-day-selected cursor-pointer";
          if (isToday) cellClass += " cal-day-today";

          return (
            <button key={day} onClick={() => handleClick(day)} className={cellClass}>
              {day}
            </button>
          );
        })}
      </div>

      {selecting && (
        <p className="text-xs text-primary mt-3 text-center animate-pulse">
          Click another date to complete the range
        </p>
      )}
    </div>
  );
}
