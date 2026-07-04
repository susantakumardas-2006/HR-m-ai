import { useState } from "react";
import MonthlyCalendarView from "../shared/MonthlyCalendarView";
import { attendanceByEmployee, employees } from "../../data/mockData";

export default function EmployeeAttendance() {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const employee = employees[0];
  const records = attendanceByEmployee[employee.id] ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Attendance</h3>
            <p className="text-sm text-muted-foreground">Track your check-ins, working hours, and leave days.</p>
          </div>
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as const).map((option) => (
              <button key={option} onClick={() => setView(option)} className={`rounded-full px-3 py-1.5 text-sm capitalize transition-all ${view === option ? "bg-primary text-primary-foreground" : "bg-white/[0.04] text-muted-foreground hover:text-foreground"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Today</div>
              <div className="text-sm text-muted-foreground">Status: Present</div>
            </div>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Check In</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Check-in</div>
              <div className="mt-1 text-lg font-semibold text-foreground">09:02 AM</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Hours</div>
              <div className="mt-1 text-lg font-semibold text-foreground">8.5h</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-semibold text-foreground">Weekly Summary</div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"><span>Present</span><span className="text-foreground">4</span></div>
            <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"><span>Half-days</span><span className="text-foreground">1</span></div>
            <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"><span>Leave</span><span className="text-foreground">1</span></div>
          </div>
        </div>
      </div>

      {view === "daily" ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="mb-4 text-lg font-semibold text-foreground">This Week</h3>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Day</th>
                  <th className="px-3 py-3">Check-in</th>
                  <th className="px-3 py-3">Check-out</th>
                  <th className="px-3 py-3">Hours</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 5).map((record) => (
                  <tr key={record.date} className="border-t border-white/10">
                    <td className="px-3 py-3 text-foreground">{record.date}</td>
                    <td className="px-3 py-3 text-muted-foreground">{record.checkIn ?? "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{record.checkOut ?? "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{record.hours ?? "—"}</td>
                    <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${record.status === "present" ? "bg-primary/15 text-primary" : record.status === "leave" ? "bg-blue-500/15 text-blue-400" : record.status === "half-day" ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.06] text-muted-foreground"}`}>{record.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : view === "weekly" ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Weekly Calendar</h3>
          <div className="grid gap-2 sm:grid-cols-7">
            {records.slice(0, 7).map((record) => (
              <div key={record.date} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
                <div className="text-muted-foreground">{record.date}</div>
                <div className="mt-2 text-foreground capitalize">{record.status}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MonthlyCalendarView records={records} initialDate={new Date(2026, 6, 1)} />
      )}
    </div>
  );
}
