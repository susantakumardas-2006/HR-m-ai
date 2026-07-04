import { useState } from "react";
import { apiFetch } from "../../api/client";
import { X, Check } from "lucide-react";

interface HREmployeeEditorProps {
  employee: any;
  onClose: () => void;
  onSave: () => void;
}

export default function HREmployeeEditor({ employee, onClose, onSave }: HREmployeeEditorProps) {
  const [form, setForm] = useState({
    name: employee.name,
    department: employee.department,
    designation: employee.designation,
    phone: employee.phone || "",
    address: employee.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      onSave();
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full overflow-y-auto flex flex-col shadow-2xl animate-fade-left">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-10">
          <h2 className="text-lg font-semibold text-foreground">Edit Employee</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Job Details</h3>
            
            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Full Name</span>
              <input 
                type="text" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Department</span>
              <select 
                value={form.department} 
                onChange={e => setForm({...form, department: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Designation</span>
              <input 
                type="text" 
                value={form.designation} 
                onChange={e => setForm({...form, designation: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Contact Info</h3>
            
            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Phone Number</span>
              <input 
                type="text" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Address</span>
              <textarea 
                rows={3}
                value={form.address} 
                onChange={e => setForm({...form, address: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              />
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving..." : <><Check className="w-4 h-4"/> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
