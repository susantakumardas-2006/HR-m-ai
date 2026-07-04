import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import { FileText, Phone, MapPin, Briefcase, Calendar, Shield, Pencil, X, Check } from "lucide-react";

export default function EmployeeProfile() {
  const [employee, setEmployee] = useState<any>(null);
  const [payroll, setPayroll] = useState<any>(null);
  const [manager, setManager] = useState<any>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: "", address: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const empData = await apiFetch(`/api/employees/${user.id}`);
        setEmployee(empData);
        setEditForm({ phone: empData.phone || "", address: empData.address || "" });
        
        // Fetch payroll
        const pyData = await apiFetch("/api/payroll");
        // payroll endpoint returns array of payroll records for the user
        if (pyData && pyData.length > 0) setPayroll(pyData[0]);

        if (empData.managerId) {
           const mgrData = await apiFetch(`/api/employees/${empData.managerId}`);
           setManager(mgrData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await apiFetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEmployee((prev: any) => ({ ...prev, phone: editForm.phone, address: editForm.address }));
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setEditForm({ phone: employee.phone || "", address: employee.address || "" });
    setIsEditing(false);
  };

  if (loading || !employee) return <div className="text-muted-foreground p-6">Loading profile...</div>;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold ring-4 ring-primary/30 shadow-lg shadow-primary/10"
              style={{ backgroundColor: employee.color + "22", color: employee.color }}
            >
              {employee.initials}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.designation}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {employee.department}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                  employee.status === "online"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : employee.status === "away"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-white/[0.06] text-muted-foreground"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    employee.status === "online"
                      ? "bg-emerald-400"
                      : employee.status === "away"
                      ? "bg-amber-400"
                      : "bg-muted-foreground"
                  }`} />
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              isEditing
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Personal Details
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                {isEditing ? (
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg border border-primary/30 bg-white/[0.04] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                ) : (
                  <p className="text-sm text-foreground">{employee.phone}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Address</p>
                {isEditing ? (
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg border border-primary/30 bg-white/[0.04] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                ) : (
                  <p className="text-sm text-foreground">{employee.address}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-foreground">{employee.email}</p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Job Details
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Employee ID", value: employee.id.toUpperCase() },
              { label: "Department", value: employee.department },
              { label: "Designation", value: employee.designation },
              { label: "Reporting Manager", value: manager?.name ?? "—" },
              { label: "Join Date", value: new Date(employee.joinDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) },
              { label: "Role", value: employee.role.charAt(0).toUpperCase() + employee.role.slice(1) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Structure */}
      {payroll && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Salary Structure
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Base Salary", value: payroll.baseSalary },
              { label: "HRA", value: payroll.hra },
              { label: "Special Allowance", value: payroll.specialAllowance },
              { label: "Conveyance", value: payroll.conveyance },
              { label: "Medical", value: payroll.medical },
              { label: "Gross Salary", value: payroll.grossSalary, highlight: true },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-3 ${
                  item.highlight
                    ? "border border-primary/20 bg-primary/10"
                    : "border border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className={`text-xs mb-1 ${item.highlight ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </div>
                <div className="text-lg font-semibold text-foreground">
                  ₹{item.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Documents
          </h3>
        </div>
        <div className="space-y-2">
          {employee.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Uploaded {new Date(doc.uploadedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
