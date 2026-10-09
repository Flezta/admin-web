import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/use-auth";
import logo from "../../../assets/Logo2.png";
import GoogleMark from "../../../lib/icons/GoogleMark";

import { getHomeRoute } from "../utils";

const MIN_PASSWORD_LENGTH = 8;

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
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
      {crossed && <path d="m3 3 18 18" />}
    </svg>
  );
}

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-primary/75";
const inputClass =
  "w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";
const toggleClass =
  "absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-xl text-primary/60 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function SignUp() {
  const { signUpWithEmail, signUpWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last names.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await signUpWithEmail(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password,
      );
      navigate(getHomeRoute(newUser));
    } catch (signUpError) {
      if (!(signUpError instanceof FirebaseError)) {
        setError(
          (signUpError as { message?: string })?.message ||
            "Unable to create your account. Please try again.",
        );
      } else {
        switch (signUpError.code) {
          case "auth/invalid-email":
          case "auth/missing-email":
            setError("Please enter a valid email address.");
            break;
          case "auth/email-already-in-use":
            setError(
              "An account with this email already exists. Try signing in instead.",
            );
            break;
          case "auth/weak-password":
            setError("Password is too weak. Please choose a stronger one.");
            break;
          case "auth/missing-password":
            setError("Please enter a password.");
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Please try again later.");
            break;
          case "auth/network-request-failed":
            setError(
              "Unable to connect. Check your internet connection and try again.",
            );
            break;
          case "auth/operation-not-allowed":
            setError(
              "Email and password sign-up is unavailable. Please contact support.",
            );
            break;
          default:
            setError("Unable to create your account. Please try again.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const newUser = await signUpWithGoogle(firstName, lastName);
      navigate(getHomeRoute(newUser));
    } catch (googleError) {
      setError(
        (googleError as { message?: string })?.message ||
          "Google sign-up failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-primary/15 bg-white/85 p-6 shadow-[0_20px_55px_-30px_rgba(0,54,37,0.45)] backdrop-blur-xl sm:p-8">
      <div className="mb-7 text-center">
        <img src={logo} alt="Flezta" className="mx-auto h-16 w-auto" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-primary/70">
          Create your Flezta account.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setError(null);
            }}
            disabled={submitting}
            placeholder="Jane"
            className={inputClass}
            autoComplete="given-name"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
              setError(null);
            }}
            disabled={submitting}
            placeholder="Doe"
            className={inputClass}
            autoComplete="family-name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            disabled={submitting}
            placeholder="you@flezta.com"
            className={inputClass}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              disabled={submitting}
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              className={`${inputClass} pr-12`}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-controls="password"
              title={showPassword ? "Hide password" : "Show password"}
              className={toggleClass}
              disabled={submitting}
            >
              <EyeIcon crossed={showPassword} />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              disabled={submitting}
              placeholder="Re-enter your password"
              className={`${inputClass} pr-12`}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((visible) => !visible)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              aria-controls="confirmPassword"
              title={showConfirm ? "Hide password" : "Show password"}
              className={toggleClass}
              disabled={submitting}
            >
              <EyeIcon crossed={showConfirm} />
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <div className="relative py-1 text-center">
          <span className="relative z-10 bg-white px-3 text-xs uppercase tracking-[0.14em] text-primary/45">
            Or
          </span>
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-primary/15" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary/35 hover:bg-primary/5 disabled:opacity-60"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <p className="pt-1 text-center text-sm text-primary/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
