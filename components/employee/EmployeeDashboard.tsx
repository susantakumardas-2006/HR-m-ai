import { useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import EmployeeSidebar from "./EmployeeSidebar";
import TaskSection from "./TaskSection";
import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeLeave from "./EmployeeLeave";
import EmployeePayroll from "./EmployeePayroll";
import ProgressReport from "./ProgressReport";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState<"tasks" | "attendance" | "leave" | "payroll">("tasks");

  const content = useMemo(() => {
    switch (activeTab) {
      case "attendance":
        return <EmployeeAttendance />;
      case "leave":
        return <EmployeeLeave />;
      case "payroll":
        return <EmployeePayroll />;
      default:
        return <TaskSection />;
    }
  }, [activeTab]);

  return (
    <DashboardLayout
      role="employee"
      leftSidebar={<EmployeeSidebar />}
      mainContent={
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
              <h2 className="text-2xl font-semibold text-foreground">Your workspace</h2>
            </div>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              {[
                { key: "tasks", label: "Tasks" },
                { key: "attendance", label: "Attendance" },
                { key: "leave", label: "Leave" },
                { key: "payroll", label: "Payroll" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`rounded-xl px-4 py-2 text-sm transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {content}
        </div>
      }
      rightSidebar={<ProgressReport />}
    />
  );
}
