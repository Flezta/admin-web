import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/use-auth";
import logo from "../../../assets/Logo1.png";
import { hasAnyRole, ROLES } from "../../../constants/roles";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };
  const userRole = hasAnyRole(user, [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.HUB_ADMIN,
  ]);


  return (
    <div className="w-full max-w-lg rounded-3xl border border-primary/15 bg-white/85 p-8 text-center shadow-[0_24px_80px_-20px_rgba(0,54,37,0.35)] backdrop-blur-xl sm:p-10">
      <img
        src={logo}
        alt="Flezta"
        className="mx-auto h-12 w-auto rounded-full border border-primary/10 bg-white"
      />

      <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-very-light text-secondary-dark ring-1 ring-secondary-light/40">
        <LockIcon />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-dark">
        Access restricted
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        You don't have permission
        <br /> to view this page
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-primary/70">
        {user?.email
          ? `Your account (${user.email}) isn't assigned the role required for this section of the workspace.`
          : "Your account isn't assigned the role required for this section of the workspace."}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {userRole && (
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark cursor-pointer"
          >
            Back to dashboard
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl cursor-pointer border border-primary/20 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:border-primary/35 hover:bg-primary/5"
        >
          Sign out
        </button>
      </div>

      <p className="mt-7 text-xs leading-5 text-primary/45">
        Think this is a mistake? Reach out to a super admin to have your access
        reviewed.
      </p>
    </div>
  );
}
