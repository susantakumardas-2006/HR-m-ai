import { useMemo, useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import HREmployeeEditor from "./HREmployeeEditor";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingEmp, setEditingEmp] = useState<any | null>(null);

  const fetchEmployees = async () => {
    try {
      const data = await apiFetch("/api/employees");
      setEmployees(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const visibleEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = `${employee.name} ${employee.department}`.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || employee.department.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, employees]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Employee Directory</h3>
            <p className="text-sm text-muted-foreground">Find team members and manage their status.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground" placeholder="Search" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground">
              <option value="all">All</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="hr">HR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Department</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Attendance</th><th className="px-3 py-3">Action</th></tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-white/10">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary" style={{ backgroundColor: employee.color + "22", color: employee.color }}>{employee.initials}</div>
                    <div>
                      <div className="font-medium text-foreground">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{employee.department}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${employee.status === "online" ? "bg-emerald-500/15 text-emerald-400" : employee.status === "away" ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.06] text-muted-foreground"}`}>{employee.status}</span></td>
                <td className="px-3 py-3 text-foreground">{Math.round(90 + Math.random() * 10)}%</td>
                <td className="px-3 py-3">
                  <button onClick={() => setEditingEmp(employee)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-foreground hover:bg-white/[0.06] transition-colors">
                    Edit Profile
                  </button>
                </td>
              </tr>
            ))}
            {visibleEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground text-sm">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingEmp && (
        <HREmployeeEditor 
          employee={editingEmp} 
          onClose={() => setEditingEmp(null)} 
          onSave={() => {
            setEditingEmp(null);
            fetchEmployees();
          }} 
        />
      )}
    </div>
  );
}
