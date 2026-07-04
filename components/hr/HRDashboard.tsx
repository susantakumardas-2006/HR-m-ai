import React, { Suspense, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import HRSidebar from "./HRSidebar";

const EmployeeList = React.lazy(() => import("./EmployeeList"));
const HRAttendanceRecords = React.lazy(() => import("./HRAttendanceRecords"));
const HRLeaveApprovals = React.lazy(() => import("./HRLeaveApprovals"));
const HRPayrollControl = React.lazy(() => import("./HRPayrollControl"));

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState<"employees" | "attendance" | "leave" | "payroll">("employees");

  const content = useMemo(() => {
    switch (activeTab) {
      case "attendance":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><HRAttendanceRecords /></Suspense>;
      case "leave":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><HRLeaveApprovals /></Suspense>;
      case "payroll":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><HRPayrollControl /></Suspense>;
      default:
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><EmployeeList /></Suspense>;
    }
  }, [activeTab]);

  return (
    <DashboardLayout
      role="hr"
      leftSidebar={<HRSidebar />}
      mainContent={
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">HR Ops</p>
              <h2 className="text-2xl font-semibold text-foreground">People operations overview</h2>
            </div>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              {[
                { key: "employees", label: "Employees" },
                { key: "attendance", label: "Attendance" },
                { key: "leave", label: "Leave" },
                { key: "payroll", label: "Payroll" },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`rounded-xl px-4 py-2 text-sm transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {content}
        </div>
      }
      rightSidebar={
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Today</h3>
            <div className="mt-3 text-2xl font-semibold text-foreground">94% attendance</div>
            <div className="mt-1 text-sm text-muted-foreground">3 pending approvals</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Quick Notes</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Payroll batch ready for review.</div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Design sprint review starts at 4 PM.</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
