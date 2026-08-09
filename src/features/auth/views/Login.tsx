import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/use-auth";
import logo from "../../../assets/Logo2.png";

import { getHomeRoute } from "../utils";

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.46-.8 5.94-2.18l-2.9-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.31-1.58-5.02-3.7H.98v2.34A8.99 8.99 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.98 10.72A5.42 5.42 0 0 1 3.7 9c0-.6.1-1.18.28-1.72V4.94H.98A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.98 4.06l3-2.34Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.52.45 3.46 1.34l2.6-2.6C13.46.85 11.43 0 9 0 .48 0 0 9 0 9s.35-2.83.98-4.06l3 2.34c.71-2.12 2.68-3.7 5.02-3.7Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Login() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedInUser = await loginWithEmail(email, password);
      navigate(getHomeRoute(loggedInUser));
    } catch {
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const loggedInUser = await loginWithGoogle();
      navigate(getHomeRoute(loggedInUser));
    } catch {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="rounded-3xl border border-primary/15 bg-white/85 p-6 shadow-[0_20px_55px_-30px_rgba(0,54,37,0.45)] backdrop-blur-xl sm:p-8">
      <div className="mb-7 text-center">
        <img src={logo} alt="Flezta" className="mx-auto h-16 w-auto" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-primary/70">
          Sign in to manage the Flezta admin workspace.
        </p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/75"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@flezta.com"
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/75"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <div className="relative py-1 text-center">
          <span className="relative z-10 bg-white px-3 text-xs uppercase tracking-[0.14em] text-primary/45">
            Or
          </span>
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-primary/15" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary/35 hover:bg-primary/5"
        >
          <GoogleMark />
          Continue with Google
        </button>
      </form>
    </div>
  );
}
