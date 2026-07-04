import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

type LoginMode = "employee" | "hr";

export default function LoginBox() {
  const [mode, setMode] = useState<LoginMode>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    navigate(mode === "employee" ? "/employee" : "/hr");
  };
  return (
    <div className="pointer-events-auto w-full max-w-sm">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
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
        <p className="text-center text-muted-foreground text-xs mt-5">
          Forgot password?{" "}
          <a
            href="#"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
