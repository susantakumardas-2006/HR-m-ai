import { useState } from "react";
import { leaveRequests } from "../../data/mockData";

export default function HRLeaveApprovals() {
  const [requests, setRequests] = useState(leaveRequests);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const approve = (id: string) => {
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status: "approved" } : item));
  };

  const reject = (id: string) => {
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status: "rejected" } : item));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Leave Approvals</h3>
            <p className="text-sm text-muted-foreground">Review and respond to pending leave requests.</p>
          </div>
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            {(["pending", "history"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm capitalize transition-all ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {requests.filter((item) => activeTab === "pending" ? item.status === "pending" : item.status !== "pending").map((request) => (
          <div key={request.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-foreground">{request.employeeName}</div>
                <div className="text-sm text-muted-foreground">{request.type} leave • {request.days} day(s)</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${request.status === "approved" ? "bg-primary/15 text-primary" : request.status === "rejected" ? "bg-destructive/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>{request.status}</span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{request.reason}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {request.status === "pending" ? (
                <>
                  <button onClick={() => approve(request.id)} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Approve</button>
                  <button onClick={() => reject(request.id)} className="rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-foreground">Reject</button>
                </>
              ) : (
                <div className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground">{request.hrComment ?? "No comment"}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
