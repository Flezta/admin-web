import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/use-auth";
import logo from "../../../assets/Logo2.png";
import GoogleMark from "../../../lib/icons/GoogleMark";

import { getHomeRoute } from "../utils";

export default function Login() {
  const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const changeResetMode = (enabled: boolean) => {
    setResetMode(enabled);
    setError(null);
    setResetSent(false);
    setPassword("");
    setShowPassword(false);
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResetSent(false);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (resetError) {
      if (
        resetError instanceof FirebaseError &&
        resetError.code === "auth/user-not-found"
      ) {
        setResetSent(true);
      } else {
        setError(
          resetError instanceof FirebaseError &&
            resetError.code === "auth/too-many-requests"
            ? "Too many requests. Please try again later."
            : "Unable to send a reset email. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedInUser = await loginWithEmail(email, password);
      navigate(getHomeRoute(loggedInUser));
    } catch (loginError) {
      if (!(loginError instanceof FirebaseError)) {
        setError("Unable to sign in. Please try again.");
      } else {
        switch (loginError.code) {
          case "auth/invalid-email":
          case "auth/missing-email":
            setError("Please enter a valid email address.");
            break;
          case "auth/missing-password":
            setError("Please enter your password.");
            break;
          case "auth/user-disabled":
            setError("Your account has been disabled. Please contact support.");
            break;
          case "auth/too-many-requests":
            setError(
              "Too many sign-in attempts. Please try again later or reset your password.",
            );
            break;
          case "auth/network-request-failed":
            setError(
              "Unable to connect. Check your internet connection and try again.",
            );
            break;
          case "auth/operation-not-allowed":
            setError(
              "Email and password sign-in is unavailable. Please contact support.",
            );
            break;
          case "auth/invalid-credential":
          case "auth/invalid-login-credentials":
          case "auth/wrong-password":
          case "auth/user-not-found":
            setError("Invalid email or password.");
            break;
          default:
            setError("Unable to sign in. Please try again.");
        }
      }
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
          {resetMode ? "Reset password" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-primary/70">
          {resetMode
            ? "Enter your account email to receive a password reset link."
            : "Sign in to manage the Flezta admin workspace."}
        </p>
      </div>

      <form
        onSubmit={resetMode ? handlePasswordReset : handleEmailLogin}
        className="space-y-4"
        noValidate={!resetMode}
      >
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
            onChange={(e) => {
              setEmail(e.target.value);
              setResetSent(false);
              setError(null);
            }}
            disabled={submitting}
            placeholder="you@flezta.com"
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            autoComplete="email"
            required
          />
        </div>

        {!resetMode && (
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/75"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-primary/20 bg-white py-3 pl-4 pr-12 text-sm text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="password"
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-xl text-primary/60 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && <path d="m3 3 18 18" />}
                </svg>
              </button>
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                disabled={submitting}
                onClick={() => changeResetMode(true)}
                className="text-sm font-semibold text-primary hover:underline disabled:opacity-60"
              >
                Forgot password?
              </button>
            </div>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {resetMode && resetSent && (
          <p
            role="status"
            className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary"
          >
            If an account exists for this email, you will receive a password
            reset link. Check your inbox and spam folder.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || (resetMode && resetSent)}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resetMode
            ? submitting
              ? "Sending..."
              : resetSent
                ? "Reset email requested"
                : "Send reset link"
            : submitting
              ? "Signing in..."
              : "Sign in"}
        </button>

        {resetMode ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => changeResetMode(false)}
            className="w-full py-2 text-sm font-semibold text-primary hover:underline disabled:opacity-60"
          >
            Back to sign in
          </button>
        ) : (
          <>
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
          </>
        )}
      </form>
      {!resetMode && (
        <p className="mt-4 text-center text-sm text-primary/70">
          Need an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      )}
    </div>
  );
}
