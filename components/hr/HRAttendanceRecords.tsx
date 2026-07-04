import { useState } from "react";
import MonthlyCalendarView from "../shared/MonthlyCalendarView";
import { attendanceByEmployee, employees } from "../../data/mockData";

export default function HRAttendanceRecords() {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const selectedRecords = selectedEmployee === "all" ? Object.values(attendanceByEmployee).flat() : attendanceByEmployee[selectedEmployee] ?? [];
  const selectedName = selectedEmployee === "all" ? "All employees" : employees.find((employee) => employee.id === selectedEmployee)?.name ?? "Employee";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Attendance Overview</h3>
            <p className="text-sm text-muted-foreground">Monitor team attendance across daily and monthly views.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground">
              <option value="all">All Employees</option>
              {employees.filter((employee) => employee.role !== "hr").map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
            {(["daily", "weekly", "monthly"] as const).map((option) => (
              <button key={option} onClick={() => setView(option)} className={`rounded-full px-3 py-1.5 text-sm capitalize transition-all ${view === option ? "bg-primary text-primary-foreground" : "bg-white/[0.04] text-muted-foreground hover:text-foreground"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="mb-3 text-lg font-semibold text-foreground">{selectedName}</h3>
        {view === "daily" ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr><th className="px-3 py-3">Employee</th><th className="px-3 py-3">Check-in</th><th className="px-3 py-3">Check-out</th><th className="px-3 py-3">Hours</th><th className="px-3 py-3">Status</th></tr>
              </thead>
              <tbody>
                {selectedEmployee === "all" ? employees.filter((employee) => employee.role !== "hr").map((employee) => {
                  const record = attendanceByEmployee[employee.id]?.[0];
                  return (
                    <tr key={employee.id} className="border-t border-white/10">
                      <td className="px-3 py-3 text-foreground">{employee.name}</td>
                      <td className="px-3 py-3 text-muted-foreground">{record?.checkIn ?? "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{record?.checkOut ?? "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{record?.hours ?? "—"}</td>
                      <td className="px-3 py-3"><span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">Present</span></td>
                    </tr>
                  );
                }) : (
                  <tr className="border-t border-white/10">
                    <td className="px-3 py-3 text-foreground">{selectedName}</td>
                    <td className="px-3 py-3 text-muted-foreground">{selectedRecords[0]?.checkIn ?? "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{selectedRecords[0]?.checkOut ?? "—"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{selectedRecords[0]?.hours ?? "—"}</td>
                    <td className="px-3 py-3"><span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">Present</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : view === "weekly" ? (
          <div className="grid gap-2 sm:grid-cols-7">
            {selectedRecords.slice(0, 7).map((record) => (
              <div key={record.date} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
                <div className="text-muted-foreground">{record.date}</div>
                <div className="mt-2 text-foreground capitalize">{record.status}</div>
              </div>
            ))}
          </div>
        ) : (
          <MonthlyCalendarView records={selectedRecords} initialDate={new Date(2026, 6, 1)} />
        )}
      </div>
    </div>
  );
}
