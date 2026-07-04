import { payrollData, payHistory } from "../../data/mockData";

export default function EmployeePayroll() {
  const payroll = payrollData[0];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Current Month Salary</h3>
            <p className="text-sm text-muted-foreground">Your latest payslip summary.</p>
          </div>
          <button className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground">Download Payslip</button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <div className="text-sm text-primary">Net Salary</div>
            <div className="mt-2 text-4xl font-semibold text-foreground">₹{payroll.netPay.toLocaleString()}</div>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Gross</span><span className="text-foreground">₹{payroll.grossSalary.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">₹{payroll.deductions.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">PF</span><span className="text-foreground">₹{Math.floor(payroll.baseSalary * 0.12).toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-lg font-semibold text-foreground">Salary Structure</h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr><th className="px-3 py-3">Component</th><th className="px-3 py-3">Amount</th></tr>
            </thead>
            <tbody>
              {[
                ["Base Salary", payroll.baseSalary],
                ["HRA", payroll.hra],
                ["Special Allowance", payroll.specialAllowance],
                ["Conveyance", payroll.conveyance],
                ["Medical", payroll.medical],
              ].map(([label, amount]) => (
                <tr key={label} className="border-t border-white/10">
                  <td className="px-3 py-3 text-foreground">{label}</td>
                  <td className="px-3 py-3 text-muted-foreground">₹{Number(amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-lg font-semibold text-foreground">Pay History</h3>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr><th className="px-3 py-3">Month</th><th className="px-3 py-3">Gross</th><th className="px-3 py-3">Deductions</th><th className="px-3 py-3">Net</th><th className="px-3 py-3">Status</th></tr>
            </thead>
            <tbody>
              {payHistory.map((row) => (
                <tr key={row.month} className="border-t border-white/10">
                  <td className="px-3 py-3 text-foreground">{row.month}</td>
                  <td className="px-3 py-3 text-muted-foreground">₹{row.gross.toLocaleString()}</td>
                  <td className="px-3 py-3 text-muted-foreground">₹{row.deductions.toLocaleString()}</td>
                  <td className="px-3 py-3 text-foreground">₹{row.net.toLocaleString()}</td>
                  <td className="px-3 py-3"><span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
