import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { apiFetch } from "./api/client";

type SignUpRole = "employee" | "hr";

interface PasswordCheck {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordCheck[] = [
  { label: "Min 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Number", test: (pw) => /\d/.test(pw) },
  { label: "Special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

interface SignUpBoxProps {
  onSwitch?: () => void;
}

export default function SignUpBox({ onSwitch }: SignUpBoxProps) {
  const [role, setRole] = useState<SignUpRole>("employee");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const passedCount = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const strengthPercent = (passedCount / PASSWORD_RULES.length) * 100;
  const strengthColor =
    strengthPercent <= 25
      ? "bg-red-500"
      : strengthPercent <= 50
      ? "bg-amber-500"
      : strengthPercent <= 75
      ? "bg-yellow-400"
      : "bg-emerald-500";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!employeeId.trim()) {
      setError("Employee ID is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("A valid email is required.");
      return;
    }
    if (passedCount < PASSWORD_RULES.length) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ employeeId, email, password, role }),
      });

      // Auto login using the token returned from the registration endpoint
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Simulate success and email verification message
      setSuccess(true);
      setTimeout(() => {
        navigate(role === "employee" ? "/employee" : "/hr");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    }
  };

  return (
    <div className="pointer-events-auto w-full max-w-sm">
      <div
        className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40 transition-all duration-300 ${
          error ? "animate-[shake_0.35s_ease-in-out]" : ""
        }`}
      >
        <h2 className="text-foreground text-lg font-semibold mb-1 tracking-tight">
          Create Account
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Register as {role === "employee" ? "an Employee" : "HR Admin"}
        </p>

        {/* Role Toggle */}
        <div className="flex rounded-lg bg-white/[0.06] p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("employee")}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all duration-200 ${
              role === "employee"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setRole("hr")}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all duration-200 ${
              role === "hr"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            HR
          </button>
        </div>

        {/* Success animation */}
        {success ? (
          <div className="flex flex-col items-center py-8 animate-fade-up text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground font-semibold">Account Created!</p>
            <p className="text-muted-foreground text-sm mt-2">A verification email has been sent.</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Please verify your email before logging in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error banner */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 animate-fade-up">
                {error}
              </div>
            )}

            {/* Employee ID */}
            <div>
              <label htmlFor="signup-empid" className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                Employee ID
              </label>
              <input
                id="signup-empid"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="EMP-001"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {PASSWORD_RULES.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-1.5 text-[11px]">
                        <span className={rule.test(password) ? "text-emerald-400" : "text-muted-foreground/50"}>
                          {rule.test(password) ? "✓" : "○"}
                        </span>
                        <span className={rule.test(password) ? "text-emerald-400" : "text-muted-foreground/50"}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirm" className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-500/50 bg-red-500/[0.04]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-[11px] mt-1">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full rounded-lg uppercase text-xs tracking-widest mt-2"
            >
              Create Account
            </Button>
          </form>
        )}

        {!success && (
          <p className="text-center text-muted-foreground text-xs mt-5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
