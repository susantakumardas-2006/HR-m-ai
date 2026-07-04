import { useMemo, useState } from "react";
import { generateContributionData } from "../../data/mockData";

export default function ContributionTree() {
  const data = useMemo(() => generateContributionData(), []);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const maxVal = Math.max(...data, 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["", "Mon", "", "Wed", "", "Fri", ""];

  // Calculate starting date (364 days ago from today)
  const today = new Date(2026, 6, 4);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 363);

  function getColor(val: number): string {
    if (val === 0) return "hsl(119 99% 46% / 0.05)";
    const ratio = val / maxVal;
    if (ratio < 0.25) return "hsl(119 99% 46% / 0.2)";
    if (ratio < 0.5) return "hsl(119 99% 46% / 0.4)";
    if (ratio < 0.75) return "hsl(119 99% 46% / 0.7)";
    return "hsl(119 99% 46% / 1.0)";
  }

  function getDateForIndex(i: number): string {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Build grid: 52 columns x 7 rows
  const weeks: number[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      week.push(idx < data.length ? data[idx] : 0);
    }
    weeks.push(week);
  }

  // Calculate month labels positions
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < 52; w++) {
    const idx = w * 7;
    const d = new Date(startDate);
    d.setDate(d.getDate() + idx);
    const m = d.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: months[m], col: w });
      lastMonth = m;
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 relative">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Contribution Activity
      </h3>

      {/* Month labels */}
      <div className="flex ml-8 mb-1 gap-0" style={{ width: 52 * 15 }}>
        {monthLabels.map((m, i) => (
          <span
            key={i}
            className="text-[10px] text-muted-foreground absolute"
            style={{ left: 32 + m.col * 15 + 16 }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0 mt-5">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-2 mt-0">
          {days.map((d, i) => (
            <span key={i} className="text-[10px] text-muted-foreground h-[12px] leading-[12px]">
              {d}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((val, dIdx) => {
                const idx = wIdx * 7 + dIdx;
                return (
                  <div
                    key={dIdx}
                    className="contribution-cell cursor-pointer"
                    style={{ backgroundColor: getColor(val) }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        text: `${val} credits on ${getDateForIndex(idx)}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {[0.05, 0.2, 0.4, 0.7, 1.0].map((op) => (
          <div
            key={op}
            className="w-[10px] h-[10px] rounded-sm"
            style={{ backgroundColor: `hsl(119 99% 46% / ${op})` }}
          />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[100] px-2 py-1 bg-foreground text-background text-[11px] rounded-md pointer-events-none whitespace-nowrap shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
