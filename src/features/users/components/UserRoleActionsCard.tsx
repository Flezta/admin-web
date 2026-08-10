import { useState } from "react";
import ConfirmActionModal from "../../../components/ConfirmActionModal";

interface UserRoleActionsCardProps {
  activeRole: "ADMIN" | "SUPER_ADMIN" | "HUB_ADMIN" | null;
  busy: boolean;
  pendingRole?: "ADMIN" | "SUPER_ADMIN" | "HUB_ADMIN" | "NONE" | null;
  errorMessage?: string | null;
  successMessage?: string | null;
  onSetAdmin: () => void;
  onSetHubAdmin: () => void;
  onSetSuperAdmin: () => void;
  onSetNone: () => void;
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function UserRoleActionsCard({
  activeRole,
  busy,
  pendingRole,
  errorMessage,
  successMessage,
  onSetAdmin,
  onSetHubAdmin,
  onSetSuperAdmin,
  onSetNone,
}: UserRoleActionsCardProps) {
  const [confirmRole, setConfirmRole] = useState<
    "ADMIN" | "SUPER_ADMIN" | "HUB_ADMIN" | "NONE" | null
  >(null);

  const roleLabelMap = {
    ADMIN: "Admin",
    HUB_ADMIN: "Hub Admin",
    SUPER_ADMIN: "Super Admin",
    NONE: "No elevated role",
  } as const;

  const handleConfirm = () => {
    if (!confirmRole) return;

    if (confirmRole === "ADMIN") onSetAdmin();
    if (confirmRole === "HUB_ADMIN") onSetHubAdmin();
    if (confirmRole === "SUPER_ADMIN") onSetSuperAdmin();
    if (confirmRole === "NONE") onSetNone();

    setConfirmRole(null);
  };

  return (
    <section className="rounded-2xl border border-primary/10 bg-white p-4">
      <h2 className="text-base font-semibold text-primary">Admin Actions</h2>
      <p className="mt-1 text-sm text-primary/65">
        Assign exactly one elevated role for this user at a time.
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary/55">
        Current role: {activeRole ? activeRole.replace("_", " ") : "NONE"}
      </p>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:flex-wrap">
        <button
          type="button"
          disabled={busy || activeRole === "ADMIN"}
          onClick={() => setConfirmRole("ADMIN")}
          className={`rounded-lg border cursor-pointer px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            activeRole === "ADMIN"
              ? "border-primary bg-primary text-white"
              : "border-primary/20 bg-white text-primary hover:bg-primary/5"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {pendingRole === "ADMIN" && busy ? <Spinner /> : null}
            {pendingRole === "ADMIN" && busy ? "Setting..." : "Set as Admin"}
          </span>
        </button>

        <button
          type="button"
          disabled={busy || activeRole === "HUB_ADMIN"}
          onClick={() => setConfirmRole("HUB_ADMIN")}
          className={`rounded-lg border cursor-pointer px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            activeRole === "HUB_ADMIN"
              ? "border-primary bg-primary text-white"
              : "border-primary/20 bg-white text-primary hover:bg-primary/5"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {pendingRole === "HUB_ADMIN" && busy ? <Spinner /> : null}
            {pendingRole === "HUB_ADMIN" && busy
              ? "Setting..."
              : "Set as Hub Admin"}
          </span>
        </button>

        <button
          type="button"
          disabled={busy || activeRole === "SUPER_ADMIN"}
          onClick={() => setConfirmRole("SUPER_ADMIN")}
          className={`rounded-lg border cursor-pointer px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            activeRole === "SUPER_ADMIN"
              ? "border-primary bg-primary text-white"
              : "border-primary/20 bg-white text-primary hover:bg-primary/5"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {pendingRole === "SUPER_ADMIN" && busy ? <Spinner /> : null}
            {pendingRole === "SUPER_ADMIN" && busy
              ? "Setting..."
              : "Set as Super Admin"}
          </span>
        </button>

        <button
          type="button"
          disabled={busy || activeRole === null}
          onClick={() => setConfirmRole("NONE")}
          className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            {pendingRole === "NONE" && busy ? <Spinner /> : null}
            {pendingRole === "NONE" && busy
              ? "Setting..."
              : "Remove elevated role"}
          </span>
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {successMessage && !errorMessage && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <ConfirmActionModal
        isOpen={Boolean(confirmRole)}
        title="Confirm Role Action"
        message={
          confirmRole
            ? `You are about to set this user to ${roleLabelMap[confirmRole]}.`
            : ""
        }
        onCancel={() => setConfirmRole(null)}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
