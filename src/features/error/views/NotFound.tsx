import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/use-auth";
import { getHomeRoute } from "../../auth/utils";
import logo from "../../../assets/Logo1.png";

function CompassIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path
        d="M14.5 9.5 13 13l-3.5 1.5L11 11l3.5-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="rounded-3xl border border-primary/15 bg-white/85 p-8 text-center shadow-[0_24px_80px_-20px_rgba(0,54,37,0.35)] backdrop-blur-xl sm:p-10">
      <img
        src={logo}
        alt="Flezta"
        className="mx-auto h-12 w-auto rounded-full border border-primary/10 bg-white"
      />

      <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light/40 text-primary ring-1 ring-primary/15">
        <CompassIcon />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary/60">
        404 error
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        This page went off the map
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-primary/70">
        The page you're looking for doesn't exist, may have been moved, or
        the link might be outdated.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => navigate(getHomeRoute(user), { replace: true })}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Back to dashboard
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-primary/20 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary/35 hover:bg-primary/5"
        >
          Go back
        </button>
      </div>

      <p className="mt-7 text-xs leading-5 text-primary/45">
        Double-check the URL, or reach out if you think this is a bug.
      </p>
    </div>
  );
}