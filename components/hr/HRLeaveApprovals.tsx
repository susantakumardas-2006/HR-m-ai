import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";

export default function HRLeaveApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [comments, setComments] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await apiFetch("/api/leave");
        setRequests(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadRequests();
  }, []);

  const approve = async (id: string) => {
    const comment = comments[id]?.trim() || "Approved.";
    try {
      await apiFetch(`/api/leave/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved", hrComment: comment }),
      });
      setRequests((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: "approved" as const, hrComment: comment } : item
        )
      );
      setComments((c) => { const next = { ...c }; delete next[id]; return next; });
    } catch (e) {
      console.error(e);
    }
  };

  const reject = async (id: string) => {
    const comment = comments[id]?.trim() || "Request denied.";
    try {
      await apiFetch(`/api/leave/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "rejected", hrComment: comment }),
      });
      setRequests((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: "rejected" as const, hrComment: comment } : item
        )
      );
      setComments((c) => { const next = { ...c }; delete next[id]; return next; });
    } catch (e) {
      console.error(e);
    }
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

            {/* Date range */}
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground">{request.startDate}</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-foreground">{request.endDate}</span>
            </div>

            <div className="mt-3 text-sm text-muted-foreground">{request.reason}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              {request.status === "pending" ? (
                <>
                  {/* Comment input */}
                  <div className="w-full mb-2">
                    <textarea
                      value={comments[request.id] ?? ""}
                      onChange={(e) => setComments((c) => ({ ...c, [request.id]: e.target.value }))}
                      placeholder="Add a comment before approving/rejecting…"
                      rows={2}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                    />
                  </div>
                  <button onClick={() => approve(request.id)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all">Approve</button>
                  <button onClick={() => reject(request.id)} className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-foreground hover:bg-destructive/90 active:scale-[0.97] transition-all">Reject</button>
                </>
              ) : (
                <div className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-muted-foreground w-full">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/70 mr-2">HR Comment:</span>
                  {request.hrComment ?? "No comment"}
                </div>
              )}
            </div>
          </div>
        ))}

        {requests.filter((item) => activeTab === "pending" ? item.status === "pending" : item.status !== "pending").length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-muted-foreground text-sm">
              {activeTab === "pending" ? "No pending leave requests 🎉" : "No history yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
