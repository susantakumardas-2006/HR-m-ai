import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { apiFetch } from "./api/client";

type LoginMode = "employee" | "hr";

interface LoginBoxProps {
  onSwitch?: () => void;
}

export default function LoginBox({ onSwitch }: LoginBoxProps) {
  const [mode, setMode] = useState<LoginMode>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const navigate = useNavigate();

  // Auto-dismiss error
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      triggerError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      triggerError("Please enter your password.");
      return;
    }

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role: mode }),
      });

      // Save token and user details
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(mode === "employee" ? "/employee" : "/hr");
    } catch (err: any) {
      triggerError(err.message || "Invalid email or password. Please try again.");
    }
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  };

  return (
    <div className="pointer-events-auto w-full max-w-sm">
      <div
        className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40 transition-transform ${
          shaking ? "animate-[shake_0.35s_ease-in-out]" : ""
        }`}
      >
        {/* Heading */}
        <h2 className="text-foreground text-lg font-semibold mb-1 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to your {mode === "employee" ? "Employee" : "HR"} dashboard
        </p>
        {/* Toggle */}
        <div className="flex rounded-lg bg-white/[0.06] p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("employee")}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all duration-200 ${
              mode === "employee"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setMode("hr")}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all duration-200 ${
              mode === "hr"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            HR
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 mb-4 animate-fade-up flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full rounded-lg uppercase text-xs tracking-widest mt-2"
          >
            {mode === "employee" ? "Employee Login" : "HR Login"}
          </Button>
        </form>
        <div className="flex items-center justify-between mt-5">
          <a
            href="#"
            className="text-muted-foreground text-xs hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </a>
          <button
            type="button"
            onClick={onSwitch}
            className="text-primary text-xs hover:text-primary/80 transition-colors"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
