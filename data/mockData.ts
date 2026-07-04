// ============================================================
// MOCK DATA — Centralized data for Employee & HR dashboards
// ============================================================

// --- Types ---
export type EmployeeRole = "employee" | "hr" | "manager";
export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";
export type AttendanceStatus = "present" | "absent" | "half-day" | "leave" | "weekend" | "holiday";
export type LeaveType = "paid" | "sick" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type PayrollStatus = "paid" | "processing" | "pending";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: EmployeeRole;
  initials: string;
  color: string;
  status: "online" | "away" | "offline";
  joinDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  project: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  credits: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  project: string;
  members: number;
  unread: number;
  messages: ChatMessage[];
}

export interface HRDepartment {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  status: "online" | "away" | "offline";
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  hrComment?: string;
  submittedAt: string;
}

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  hours?: number;
}

export interface PayrollRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  medical: number;
  taxPercent: number;
  pfPercent: number;
  grossSalary: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
}

export interface LeaveBalance {
  paid: { used: number; total: number };
  sick: { used: number; total: number };
  unpaid: { used: number; total: number };
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: "task" | "credit" | "leave" | "attendance" | "system";
}

// --- Employees ---
export const employees: Employee[] = [
  { id: "emp-1", name: "Arjun Mehta", email: "arjun@sentinel.ai", department: "Engineering", role: "employee", initials: "AM", color: "#4ade80", status: "online", joinDate: "2024-03-15" },
  { id: "emp-2", name: "Priya Sharma", email: "priya@sentinel.ai", department: "Design", role: "employee", initials: "PS", color: "#60a5fa", status: "online", joinDate: "2024-01-10" },
  { id: "emp-3", name: "Rahul Gupta", email: "rahul@sentinel.ai", department: "Engineering", role: "employee", initials: "RG", color: "#f472b6", status: "away", joinDate: "2023-11-20" },
  { id: "emp-4", name: "Sneha Reddy", email: "sneha@sentinel.ai", department: "Marketing", role: "employee", initials: "SR", color: "#facc15", status: "online", joinDate: "2024-06-01" },
  { id: "emp-5", name: "Vikram Singh", email: "vikram@sentinel.ai", department: "Engineering", role: "manager", initials: "VS", color: "#a78bfa", status: "online", joinDate: "2023-05-12" },
  { id: "emp-6", name: "Ananya Iyer", email: "ananya@sentinel.ai", department: "HR", role: "hr", initials: "AI", color: "#fb923c", status: "online", joinDate: "2023-08-25" },
  { id: "emp-7", name: "Karan Patel", email: "karan@sentinel.ai", department: "Finance", role: "employee", initials: "KP", color: "#2dd4bf", status: "offline", joinDate: "2024-02-14" },
  { id: "emp-8", name: "Meera Nair", email: "meera@sentinel.ai", department: "Design", role: "employee", initials: "MN", color: "#e879f9", status: "away", joinDate: "2024-04-08" },
  { id: "emp-9", name: "Deepak Kumar", email: "deepak@sentinel.ai", department: "Engineering", role: "employee", initials: "DK", color: "#34d399", status: "online", joinDate: "2023-09-30" },
  { id: "emp-10", name: "Ritu Verma", email: "ritu@sentinel.ai", department: "HR", role: "hr", initials: "RV", color: "#f87171", status: "online", joinDate: "2023-07-15" },
];

// --- Tasks ---
export const tasks: Task[] = [
  { id: "t-1", title: "Build Dashboard UI", description: "Create the main employee dashboard layout with 3-column grid", assignee: "emp-1", project: "Project Alpha", dueDate: "2026-07-10", priority: "high", status: "in-progress", credits: 15 },
  { id: "t-2", title: "API Integration for Auth", description: "Connect login flow with backend authentication service", assignee: "emp-1", project: "Project Alpha", dueDate: "2026-07-08", priority: "high", status: "pending", credits: 20 },
  { id: "t-3", title: "Design System Documentation", description: "Document all design tokens, color palette, and component specs", assignee: "emp-2", project: "Project Beta", dueDate: "2026-07-12", priority: "medium", status: "in-progress", credits: 10 },
  { id: "t-4", title: "Unit Tests for UserService", description: "Write comprehensive unit tests for user management service", assignee: "emp-3", project: "Project Alpha", dueDate: "2026-07-15", priority: "medium", status: "pending", credits: 12 },
  { id: "t-5", title: "Landing Page SEO Audit", description: "Audit and optimize meta tags, headings, and content structure", assignee: "emp-4", project: "Project Gamma", dueDate: "2026-07-06", priority: "low", status: "completed", credits: 8 },
  { id: "t-6", title: "Database Schema Migration", description: "Migrate user tables to new schema with attendance tracking", assignee: "emp-9", project: "Project Alpha", dueDate: "2026-07-09", priority: "high", status: "in-progress", credits: 25 },
  { id: "t-7", title: "Mobile Responsive Fixes", description: "Fix layout issues on mobile devices for all dashboard views", assignee: "emp-2", project: "Project Beta", dueDate: "2026-07-11", priority: "medium", status: "pending", credits: 10 },
  { id: "t-8", title: "Payroll Report Generator", description: "Build automated monthly payroll report export feature", assignee: "emp-7", project: "Project Delta", dueDate: "2026-07-14", priority: "high", status: "pending", credits: 18 },
  { id: "t-9", title: "Chat Feature Prototype", description: "Create Discord-style chat prototype with channel support", assignee: "emp-1", project: "Project Alpha", dueDate: "2026-07-18", priority: "medium", status: "pending", credits: 15 },
  { id: "t-10", title: "Onboarding Flow UX", description: "Design and implement new employee onboarding wizard", assignee: "emp-8", project: "Project Beta", dueDate: "2026-07-20", priority: "low", status: "pending", credits: 12 },
  { id: "t-11", title: "Performance Metrics API", description: "Build REST endpoints for employee performance data", assignee: "emp-3", project: "Project Alpha", dueDate: "2026-07-07", priority: "high", status: "completed", credits: 20 },
  { id: "t-12", title: "Email Notification System", description: "Implement email notifications for leave approvals and task assignments", assignee: "emp-9", project: "Project Gamma", dueDate: "2026-07-13", priority: "medium", status: "in-progress", credits: 14 },
];

// --- Chat Channels ---
export const chatChannels: ChatChannel[] = [
  {
    id: "ch-1", name: "project-alpha", project: "Project Alpha", members: 5, unread: 3,
    messages: [
      { id: "m-1", userId: "emp-5", userName: "Vikram Singh", userColor: "#a78bfa", content: "Hey team, the sprint review is scheduled for Friday. Please have your demos ready.", timestamp: "10:15 AM" },
      { id: "m-2", userId: "emp-1", userName: "Arjun Mehta", userColor: "#4ade80", content: "Dashboard UI is almost done. Just need to fix the sidebar scroll issue.", timestamp: "10:22 AM" },
      { id: "m-3", userId: "emp-1", userName: "Arjun Mehta", userColor: "#4ade80", content: "Also, should we use virtualized lists for the attendance table?", timestamp: "10:23 AM" },
      { id: "m-4", userId: "emp-9", userName: "Deepak Kumar", userColor: "#34d399", content: "Yes, definitely. The dataset could get large. I'll send you the wrapper component.", timestamp: "10:30 AM" },
      { id: "m-5", userId: "emp-3", userName: "Rahul Gupta", userColor: "#f472b6", content: "Unit tests are at 78% coverage. Pushing for 90% by EOD.", timestamp: "10:45 AM" },
      { id: "m-6", userId: "emp-5", userName: "Vikram Singh", userColor: "#a78bfa", content: "Great progress everyone! Keep it up 🚀", timestamp: "11:00 AM" },
    ],
  },
  {
    id: "ch-2", name: "project-beta", project: "Project Beta", members: 4, unread: 0,
    messages: [
      { id: "m-7", userId: "emp-2", userName: "Priya Sharma", userColor: "#60a5fa", content: "Updated the design system docs with the new color tokens.", timestamp: "9:30 AM" },
      { id: "m-8", userId: "emp-8", userName: "Meera Nair", userColor: "#e879f9", content: "Looks great! Can we add the animation specs too?", timestamp: "9:45 AM" },
      { id: "m-9", userId: "emp-2", userName: "Priya Sharma", userColor: "#60a5fa", content: "Sure, I'll add them in the next commit.", timestamp: "9:50 AM" },
      { id: "m-10", userId: "emp-5", userName: "Vikram Singh", userColor: "#a78bfa", content: "Mobile responsive tickets have been created. Priority is medium.", timestamp: "10:05 AM" },
    ],
  },
  {
    id: "ch-3", name: "project-gamma", project: "Project Gamma", members: 3, unread: 1,
    messages: [
      { id: "m-11", userId: "emp-4", userName: "Sneha Reddy", userColor: "#facc15", content: "SEO audit is complete. Found 12 issues, 8 already fixed.", timestamp: "11:30 AM" },
      { id: "m-12", userId: "emp-9", userName: "Deepak Kumar", userColor: "#34d399", content: "Nice work! What about the remaining 4?", timestamp: "11:40 AM" },
      { id: "m-13", userId: "emp-4", userName: "Sneha Reddy", userColor: "#facc15", content: "They need content team input. Created tickets for them.", timestamp: "11:45 AM" },
    ],
  },
  {
    id: "ch-4", name: "project-delta", project: "Project Delta", members: 3, unread: 5,
    messages: [
      { id: "m-14", userId: "emp-7", userName: "Karan Patel", userColor: "#2dd4bf", content: "Payroll calculation engine is ready for testing.", timestamp: "2:00 PM" },
      { id: "m-15", userId: "emp-6", userName: "Ananya Iyer", userColor: "#fb923c", content: "I'll verify the tax computations against the manual sheet.", timestamp: "2:15 PM" },
      { id: "m-16", userId: "emp-7", userName: "Karan Patel", userColor: "#2dd4bf", content: "Perfect. Also added PF auto-deduction logic.", timestamp: "2:20 PM" },
      { id: "m-17", userId: "emp-10", userName: "Ritu Verma", userColor: "#f87171", content: "Can we add a preview mode before final payroll generation?", timestamp: "2:30 PM" },
      { id: "m-18", userId: "emp-7", userName: "Karan Patel", userColor: "#2dd4bf", content: "Good idea. I'll add a dry-run feature.", timestamp: "2:35 PM" },
    ],
  },
  {
    id: "ch-5", name: "general", project: "General", members: 10, unread: 2,
    messages: [
      { id: "m-19", userId: "emp-6", userName: "Ananya Iyer", userColor: "#fb923c", content: "Reminder: Company townhall is next Tuesday at 3 PM.", timestamp: "9:00 AM" },
      { id: "m-20", userId: "emp-5", userName: "Vikram Singh", userColor: "#a78bfa", content: "Thanks for the reminder! Will there be snacks? 😄", timestamp: "9:05 AM" },
      { id: "m-21", userId: "emp-6", userName: "Ananya Iyer", userColor: "#fb923c", content: "Of course! Catering is already arranged.", timestamp: "9:10 AM" },
    ],
  },
];

// --- HR Departments ---
export const hrDepartments: HRDepartment[] = [
  { id: "hr-1", name: "Recruitment", contactPerson: "Ananya Iyer", email: "ananya@sentinel.ai", status: "online" },
  { id: "hr-2", name: "Compensation & Benefits", contactPerson: "Ritu Verma", email: "ritu@sentinel.ai", status: "online" },
  { id: "hr-3", name: "Employee Relations", contactPerson: "Ananya Iyer", email: "ananya@sentinel.ai", status: "online" },
  { id: "hr-4", name: "Learning & Development", contactPerson: "Ritu Verma", email: "ritu@sentinel.ai", status: "away" },
  { id: "hr-5", name: "Compliance", contactPerson: "Ananya Iyer", email: "ananya@sentinel.ai", status: "online" },
  { id: "hr-6", name: "HR Strategy", contactPerson: "Ritu Verma", email: "ritu@sentinel.ai", status: "offline" },
];

// --- Leave Requests ---
export const leaveRequests: LeaveRequest[] = [
  { id: "lr-1", employeeId: "emp-1", employeeName: "Arjun Mehta", type: "paid", startDate: "2026-07-14", endDate: "2026-07-16", days: 3, reason: "Family vacation to Goa", status: "pending", submittedAt: "2026-07-02" },
  { id: "lr-2", employeeId: "emp-3", employeeName: "Rahul Gupta", type: "sick", startDate: "2026-07-07", endDate: "2026-07-08", days: 2, reason: "Fever and cold, doctor advised rest", status: "approved", hrComment: "Get well soon! Approved.", submittedAt: "2026-07-06" },
  { id: "lr-3", employeeId: "emp-4", employeeName: "Sneha Reddy", type: "paid", startDate: "2026-07-21", endDate: "2026-07-25", days: 5, reason: "Sister's wedding in Chennai", status: "pending", submittedAt: "2026-07-03" },
  { id: "lr-4", employeeId: "emp-7", employeeName: "Karan Patel", type: "unpaid", startDate: "2026-07-10", endDate: "2026-07-10", days: 1, reason: "Personal work", status: "rejected", hrComment: "Critical payroll deadline. Please reschedule.", submittedAt: "2026-07-05" },
  { id: "lr-5", employeeId: "emp-2", employeeName: "Priya Sharma", type: "sick", startDate: "2026-07-03", endDate: "2026-07-04", days: 2, reason: "Migraine, unable to work on screens", status: "approved", hrComment: "Approved. Take care.", submittedAt: "2026-07-03" },
  { id: "lr-6", employeeId: "emp-9", employeeName: "Deepak Kumar", type: "paid", startDate: "2026-07-28", endDate: "2026-07-30", days: 3, reason: "Moving to new apartment", status: "pending", submittedAt: "2026-07-04" },
  { id: "lr-7", employeeId: "emp-8", employeeName: "Meera Nair", type: "paid", startDate: "2026-07-17", endDate: "2026-07-18", days: 2, reason: "Friend's destination wedding", status: "pending", submittedAt: "2026-07-04" },
  { id: "lr-8", employeeId: "emp-1", employeeName: "Arjun Mehta", type: "sick", startDate: "2026-06-20", endDate: "2026-06-20", days: 1, reason: "Food poisoning", status: "approved", hrComment: "Approved.", submittedAt: "2026-06-20" },
];

// --- Attendance Records (for current month, per employee) ---
function generateAttendance(employeeId: string): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const now = new Date(2026, 6, 4); // July 4, 2026
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Use employeeId hash for deterministic variation
  const hash = employeeId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    const dow = date.getDay();

    if (dow === 0 || dow === 6) {
      records.push({ date: dateStr, status: "weekend" });
      continue;
    }

    if (day > now.getDate()) {
      // Future days — no record
      continue;
    }

    // Deterministic pattern based on employee hash + day
    const seed = (hash + day * 7) % 20;
    let status: AttendanceStatus;
    let checkIn = "09:0" + (seed % 5) + " AM";
    let checkOut = "06:" + (10 + (seed % 50)) + " PM";
    let hours = 8 + (seed % 2);

    if (seed < 13) {
      status = "present";
    } else if (seed < 15) {
      status = "half-day";
      checkOut = "01:" + (seed * 3) + " PM";
      hours = 4;
    } else if (seed < 17) {
      status = "leave";
      checkIn = undefined as any;
      checkOut = undefined as any;
      hours = undefined as any;
    } else {
      status = "absent";
      checkIn = undefined as any;
      checkOut = undefined as any;
      hours = undefined as any;
    }

    records.push({ date: dateStr, status, checkIn, checkOut, hours });
  }
  return records;
}

export const attendanceByEmployee: Record<string, AttendanceRecord[]> = {};
employees.forEach((emp) => {
  attendanceByEmployee[emp.id] = generateAttendance(emp.id);
});

// --- Contribution Tree Data (365 days) ---
export function generateContributionData(): number[] {
  const data: number[] = [];
  for (let i = 0; i < 364; i++) {
    // Create a realistic-looking pattern
    const dayOfWeek = i % 7;
    const weekNum = Math.floor(i / 7);
    const isWeekend = dayOfWeek >= 5;

    if (isWeekend) {
      data.push(Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0);
    } else {
      // Workdays have more activity, with periodic bursts
      const burstWeek = weekNum % 4 === 0;
      const base = burstWeek ? 3 : 1;
      const val = Math.random() < 0.15 ? 0 : base + Math.floor(Math.random() * (burstWeek ? 8 : 5));
      data.push(val);
    }
  }
  return data;
}

// --- Payroll Data ---
export const payrollData: PayrollRecord[] = employees
  .filter((e) => e.role !== "hr")
  .map((emp) => {
    const base = 50000 + Math.floor(Math.random() * 50000);
    const hra = Math.floor(base * 0.4);
    const special = Math.floor(base * 0.2);
    const conv = 3000;
    const med = 2500;
    const gross = base + hra + special + conv + med;
    const tax = Math.floor(gross * 0.1);
    const pf = Math.floor(base * 0.12);
    const deductions = tax + pf;
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      baseSalary: base,
      hra,
      specialAllowance: special,
      conveyance: conv,
      medical: med,
      taxPercent: 10,
      pfPercent: 12,
      grossSalary: gross,
      deductions,
      netPay: gross - deductions,
      status: (["paid", "paid", "paid", "processing", "pending"] as PayrollStatus[])[Math.floor(Math.random() * 5)],
    };
  });

// --- Leave Balances ---
export const leaveBalances: Record<string, LeaveBalance> = {};
employees.forEach((emp) => {
  leaveBalances[emp.id] = {
    paid: { used: Math.floor(Math.random() * 8), total: 18 },
    sick: { used: Math.floor(Math.random() * 4), total: 12 },
    unpaid: { used: Math.floor(Math.random() * 2), total: 10 },
  };
});

// --- Activity Feed ---
export const activityFeed: ActivityItem[] = [
  { id: "a-1", text: "Completed 'Build Dashboard UI' task", time: "2 hours ago", type: "task" },
  { id: "a-2", text: "Earned 15 credits for sprint delivery", time: "3 hours ago", type: "credit" },
  { id: "a-3", text: "Leave request approved by Ananya", time: "Yesterday", type: "leave" },
  { id: "a-4", text: "Checked in at 9:02 AM", time: "Today", type: "attendance" },
  { id: "a-5", text: "New task assigned: API Integration", time: "Yesterday", type: "task" },
  { id: "a-6", text: "Earned 20 credits for Performance API", time: "2 days ago", type: "credit" },
  { id: "a-7", text: "Monthly payroll processed", time: "3 days ago", type: "system" },
  { id: "a-8", text: "Completed code review for PR #142", time: "3 days ago", type: "task" },
];

// --- Projects (for sidebar) ---
export const projects = [
  { id: "p-1", name: "Project Alpha", progress: 68, pendingTasks: 4, totalTasks: 12 },
  { id: "p-2", name: "Project Beta", progress: 45, pendingTasks: 6, totalTasks: 10 },
  { id: "p-3", name: "Project Gamma", progress: 85, pendingTasks: 2, totalTasks: 8 },
  { id: "p-4", name: "Project Delta", progress: 30, pendingTasks: 5, totalTasks: 7 },
];

// --- Pay History (last 6 months) ---
export const payHistory = [
  { month: "June 2026", gross: 92500, deductions: 17800, net: 74700, status: "paid" as const },
  { month: "May 2026", gross: 92500, deductions: 17800, net: 74700, status: "paid" as const },
  { month: "April 2026", gross: 90000, deductions: 17300, net: 72700, status: "paid" as const },
  { month: "March 2026", gross: 90000, deductions: 17300, net: 72700, status: "paid" as const },
  { month: "February 2026", gross: 88000, deductions: 16900, net: 71100, status: "paid" as const },
  { month: "January 2026", gross: 88000, deductions: 16900, net: 71100, status: "paid" as const },
];
