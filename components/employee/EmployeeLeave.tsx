import { useMemo, useState, useEffect } from "react";
import CalendarPicker from "../shared/CalendarPicker";
import MonthlyCalendarView from "../shared/MonthlyCalendarView";
import { apiFetch } from "../../api/client";

export default function EmployeeLeave() {
  const [selectedRange, setSelectedRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [leaveType, setLeaveType] = useState("Paid");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Hardcoded for now until balances API is ready
  const balances = {
    paid: { total: 20, used: 5 },
    sick: { total: 10, used: 2 },
    unpaid: { total: 0, used: 1 },
  };

  useEffect(() => {
    async function loadData() {
      try {
        const attData = await apiFetch("/api/attendance");
        setRecords(attData);

        const leaveData = await apiFetch("/api/leave");
        setLeaveRequests(leaveData);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const days = useMemo(() => {
    if (!selectedRange) return 0;
    const start = new Date(selectedRange.startDate);
    const end = new Date(selectedRange.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  }, [selectedRange]);

  const handleSubmit = async () => {
    if (!selectedRange || days <= 0 || !reason.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch("/api/leave", {
        method: "POST",
        body: JSON.stringify({
          type: leaveType.toLowerCase(),
          startDate: selectedRange.startDate,
          endDate: selectedRange.endDate,
          reason,
        }),
      });
      // Refresh requests
      const data = await apiFetch("/api/leave");
      setLeaveRequests(data);
      setSelectedRange(null);
      setReason("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="text-lg font-semibold text-foreground">Leave Balance</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(balances).map(([type, value]) => (
              <div key={type}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="capitalize text-foreground">{type} Leave</span>
                  <span className="text-muted-foreground">{value.used}/{value.total}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06]">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(value.used / value.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="text-lg font-semibold text-foreground">Apply for Leave</h3>
          <div className="mt-4 grid gap-3">
            <select 
              value={leaveType} 
              onChange={(e) => setLeaveType(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground"
            >
              <option value="Paid">Paid</option>
              <option value="Sick">Sick</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <CalendarPicker onRangeSelect={setSelectedRange} selectedRange={selectedRange} />
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted-foreground">
              Selected range: {selectedRange ? `${selectedRange.startDate} → ${selectedRange.endDate}` : "Choose dates"} • {days} day(s)
            </div>
            <textarea 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground" 
              placeholder="Add your remarks" 
            />
            <button 
              onClick={handleSubmit} 
              disabled={submitting || !selectedRange || !reason.trim()}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>

      <MonthlyCalendarView records={records} initialDate={new Date()} />

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-lg font-semibold text-foreground">My Leave Requests</h3>
        <div className="mt-4 space-y-3">
          {leaveRequests.map((request) => (
            <div key={request.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-foreground capitalize">{request.type} leave</div>
                  <div className="text-sm text-muted-foreground">{request.startDate} → {request.endDate}</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${request.status === "approved" ? "bg-primary/15 text-primary" : request.status === "rejected" ? "bg-destructive/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>{request.status}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{request.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
