import { useState, useEffect, useCallback } from "react";
import MonthlyCalendarView from "../shared/MonthlyCalendarView";
import { apiFetch } from "../../api/client";

export default function EmployeeAttendance() {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [records, setRecords] = useState<any[]>([]);

  // Check-in / Check-out state
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data = await apiFetch("/api/attendance");
        setRecords(data);

        // Find today's record to set initial state
        const todayStr = new Date().toISOString().split("T")[0];
        const todayRecord = data.find((r: any) => r.date === todayStr);

        if (todayRecord) {
          if (todayRecord.checkIn) {
            const [hours, minutes, seconds] = todayRecord.checkIn.split(":");
            const date = new Date();
            date.setHours(Number(hours), Number(minutes), Number(seconds) || 0);
            setCheckInTime(date);
            setActiveRecordId(todayRecord.id);

            if (todayRecord.checkOut) {
              const [h, m, s] = todayRecord.checkOut.split(":");
              const outDate = new Date();
              outDate.setHours(Number(h), Number(m), Number(s) || 0);
              setCheckOutTime(outDate);
            } else {
              setCheckedIn(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAttendance();
  }, []);

  // Timer that ticks every second when checked in
  useEffect(() => {
    if (!checkedIn || !checkInTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - checkInTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [checkedIn, checkInTime]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }, []);

  const formatElapsed = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await apiFetch("/api/attendance/checkin", { method: "POST" });
      const now = new Date();
      setCheckInTime(now);
      setCheckedIn(true);
      setCheckOutTime(null);
      setElapsed(0);
      setActiveRecordId(res.id);
      
      // Refresh records
      const data = await apiFetch("/api/attendance");
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      if (!activeRecordId) return;
      await apiFetch("/api/attendance/checkout", { 
        method: "POST",
        body: JSON.stringify({ id: activeRecordId })
      });
      const now = new Date();
      setCheckOutTime(now);
      setCheckedIn(false);

      // Refresh records
      const data = await apiFetch("/api/attendance");
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

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
        {/* Check-in / Check-out Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Today</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${checkedIn ? "bg-emerald-400 animate-pulse" : checkOutTime ? "bg-amber-400" : "bg-muted-foreground"}`} />
                <span className="text-sm text-muted-foreground">
                  {checkedIn ? "Checked In — Working" : checkOutTime ? "Checked Out" : "Not checked in yet"}
                </span>
              </div>
            </div>
            {!checkedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={!!checkOutTime}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  checkOutTime
                    ? "bg-white/[0.04] text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]"
                }`}
              >
                Check In
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="rounded-lg bg-red-500/80 hover:bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.97]"
              >
                Check Out
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Check-in</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {checkInTime ? formatTime(checkInTime) : "—"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Check-out</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {checkOutTime ? formatTime(checkOutTime) : "—"}
              </div>
            </div>
            <div className={`rounded-xl border p-3 ${checkedIn ? "border-primary/30 bg-primary/10" : "border-white/10 bg-white/[0.03]"}`}>
              <div className={`text-xs uppercase tracking-[0.3em] ${checkedIn ? "text-primary" : "text-muted-foreground"}`}>
                {checkedIn ? "Elapsed" : "Hours"}
              </div>
              <div className={`mt-1 text-lg font-semibold font-mono ${checkedIn ? "text-primary" : "text-foreground"}`}>
                {checkInTime ? formatElapsed(elapsed) : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
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
