import { useMemo, useState } from "react";
import { payrollData } from "../../data/mockData";

export default function HRPayrollControl() {
  const [rows, setRows] = useState(payrollData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ baseSalary: 0, hra: 0, specialAllowance: 0, conveyance: 0, medical: 0, taxPercent: 0, pfPercent: 0 });

  const totals = useMemo(() => {
    const totalNet = rows.reduce((sum, row) => sum + row.netPay, 0);
    const pending = rows.filter((row) => row.status === "pending").length;
    return { totalNet, pending };
  }, [rows]);

  const startEdit = (row: typeof rows[number]) => {
    setEditingId(row.employeeId);
    setForm({ baseSalary: row.baseSalary, hra: row.hra, specialAllowance: row.specialAllowance, conveyance: row.conveyance, medical: row.medical, taxPercent: row.taxPercent, pfPercent: row.pfPercent });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setRows((current) => current.map((row) => row.employeeId === editingId ? { ...row, baseSalary: form.baseSalary, hra: form.hra, specialAllowance: form.specialAllowance, conveyance: form.conveyance, medical: form.medical, taxPercent: form.taxPercent, pfPercent: form.pfPercent, grossSalary: form.baseSalary + form.hra + form.specialAllowance + form.conveyance + form.medical, deductions: Math.round((form.baseSalary + form.hra + form.specialAllowance + form.conveyance + form.medical) * (form.taxPercent / 100 + form.pfPercent / 100)), netPay: form.baseSalary + form.hra + form.specialAllowance + form.conveyance + form.medical - Math.round((form.baseSalary + form.hra + form.specialAllowance + form.conveyance + form.medical) * (form.taxPercent / 100 + form.pfPercent / 100)) } : row));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "Total Payroll", value: `₹${totals.totalNet.toLocaleString()}` },
          { label: "Employees Processed", value: `${rows.length}` },
          { label: "Pending", value: `${totals.pending}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-2xl font-semibold text-foreground">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-lg font-semibold text-foreground">Payroll Table</h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr><th className="px-3 py-3">Employee</th><th className="px-3 py-3">Department</th><th className="px-3 py-3">Net Pay</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.employeeId} className="border-t border-white/10">
                  <td className="px-3 py-3 text-foreground">{row.employeeName}</td>
                  <td className="px-3 py-3 text-muted-foreground">{row.department}</td>
                  <td className="px-3 py-3 text-foreground">₹{row.netPay.toLocaleString()}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${row.status === "paid" ? "bg-primary/15 text-primary" : row.status === "processing" ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.06] text-muted-foreground"}`}>{row.status}</span></td>
                  <td className="px-3 py-3">
                    <button onClick={() => startEdit(row)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-foreground">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h3 className="text-lg font-semibold text-foreground">Edit Salary Structure</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {([
              ["baseSalary", "Base Salary"],
              ["hra", "HRA"],
              ["specialAllowance", "Special Allowance"],
              ["conveyance", "Conveyance"],
              ["medical", "Medical"],
              ["taxPercent", "Tax %"],
              ["pfPercent", "PF %"],
            ] as const).map(([key, label]) => (
              <label key={key} className="text-sm text-muted-foreground">
                <span className="mb-1 block">{label}</span>
                <input type="number" value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: Number(event.target.value) }))} className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-foreground" />
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={saveEdit} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
            <button onClick={() => setEditingId(null)} className="rounded-lg bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground">Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
