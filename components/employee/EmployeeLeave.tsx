import { useMemo, useState } from "react";
import CalendarPicker from "../shared/CalendarPicker";
import MonthlyCalendarView from "../shared/MonthlyCalendarView";
import { attendanceByEmployee, employees, leaveBalances, leaveRequests } from "../../data/mockData";

export default function EmployeeLeave() {
  const [selectedRange, setSelectedRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const employee = employees[0];
  const balances = leaveBalances[employee.id];
  const records = attendanceByEmployee[employee.id] ?? [];

  const days = useMemo(() => {
    if (!selectedRange) return 0;
    const start = new Date(selectedRange.startDate);
    const end = new Date(selectedRange.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  }, [selectedRange]);

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
            <select className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground">
              <option>Paid</option>
              <option>Sick</option>
              <option>Unpaid</option>
            </select>
            <CalendarPicker onRangeSelect={setSelectedRange} selectedRange={selectedRange} />
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted-foreground">
              Selected range: {selectedRange ? `${selectedRange.startDate} → ${selectedRange.endDate}` : "Choose dates"} • {days} day(s)
            </div>
            <textarea className="min-h-24 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground" placeholder="Add your remarks" />
            <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Submit Request</button>
          </div>
        </div>
      </div>

      <MonthlyCalendarView records={records} initialDate={new Date(2026, 6, 1)} />

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-lg font-semibold text-foreground">My Leave Requests</h3>
        <div className="mt-4 space-y-3">
          {leaveRequests.filter((item) => item.employeeId === employee.id).map((request) => (
            <div key={request.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-foreground">{request.type} leave</div>
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
