import React, { Suspense, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import EmployeeSidebar from "./EmployeeSidebar";
import TaskSection from "./TaskSection";
import ProgressReport from "./ProgressReport";
import { activityFeed } from "../../data/mockData";
import { User, CalendarDays, Palmtree, LogOut } from "lucide-react";

const EmployeeAttendance = React.lazy(() => import("./EmployeeAttendance"));
const EmployeeLeave = React.lazy(() => import("./EmployeeLeave"));
const EmployeePayroll = React.lazy(() => import("./EmployeePayroll"));
const EmployeeProfile = React.lazy(() => import("./EmployeeProfile"));

type TabKey = "dashboard" | "tasks" | "attendance" | "leave" | "payroll" | "profile";

const quickAccessCards = [
  {
    key: "profile" as TabKey,
    label: "Profile",
    description: "View & edit your details",
    icon: User,
    gradient: "from-violet-500/20 to-indigo-500/10",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
  {
    key: "attendance" as TabKey,
    label: "Attendance",
    description: "Check in & track hours",
    icon: CalendarDays,
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    key: "leave" as TabKey,
    label: "Leave Requests",
    description: "Apply for time off",
    icon: Palmtree,
    gradient: "from-sky-500/20 to-blue-500/10",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
  },
];

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isTestUser = ["emp-1", "emp-2", "emp-5", "emp-6", "emp-7", "emp-8", "emp-9", "emp-10"].includes(user?.id || "");
  const userActivityFeed = isTestUser ? activityFeed : [];

  const content = useMemo(() => {
    switch (activeTab) {
      case "attendance":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><EmployeeAttendance /></Suspense>;
      case "leave":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><EmployeeLeave /></Suspense>;
      case "payroll":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><EmployeePayroll /></Suspense>;
      case "profile":
        return <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}><EmployeeProfile /></Suspense>;
      case "tasks":
        return <TaskSection />;
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            {/* Quick Access Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickAccessCards.map((card) => (
                <button
                  key={card.key}
                  onClick={() => setActiveTab(card.key)}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.gradient} p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:border-white/20 hover:shadow-lg hover:shadow-black/20 active:scale-[0.98]`}
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <div className="text-sm font-semibold text-foreground">{card.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{card.description}</div>
                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              ))}
              {/* Logout card */}
              <button
                onClick={() => navigate("/")}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/15 to-rose-500/5 p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:border-red-500/30 hover:shadow-lg hover:shadow-black/20 active:scale-[0.98]"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15">
                  <LogOut className="h-5 w-5 text-red-400" />
                </div>
                <div className="text-sm font-semibold text-foreground">Logout</div>
                <div className="mt-1 text-xs text-muted-foreground">Sign out safely</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>

            {/* Recent Activity / Alerts */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Recent Activity & Alerts
              </h3>
              <div className="space-y-3">
                {userActivityFeed.length > 0 ? (
                  userActivityFeed.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                        item.type === "task"
                          ? "bg-primary"
                          : item.type === "credit"
                          ? "bg-amber-400"
                          : item.type === "leave"
                          ? "bg-sky-400"
                          : item.type === "attendance"
                          ? "bg-emerald-400"
                          : "bg-muted-foreground"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        item.type === "task"
                          ? "bg-primary/15 text-primary"
                          : item.type === "credit"
                          ? "bg-amber-500/15 text-amber-400"
                          : item.type === "leave"
                          ? "bg-sky-500/15 text-sky-400"
                          : item.type === "attendance"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/[0.06] text-muted-foreground"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-1">No recent activity</p>
                    <p className="text-xs text-muted-foreground/60">Your timeline is empty.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  }, [activeTab, navigate]);

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
                { key: "dashboard", label: "Home" },
                { key: "tasks", label: "Tasks" },
                { key: "attendance", label: "Attendance" },
                { key: "leave", label: "Leave" },
                { key: "payroll", label: "Payroll" },
                { key: "profile", label: "Profile" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
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
