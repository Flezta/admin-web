import { useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "../../../types/user";
import {
  useDisableUserMutation,
  useRestoreUserMutation,
} from "../../../store/api/usersApi";
import ConfirmActionModal from "../../../components/ConfirmActionModal";

interface UserQuickActionsProps {
  user: User;
  showDetailsLink?: boolean;
  showDisableRestoreButtons?: boolean;
}

export default function UserQuickActions({
  user,
  showDetailsLink = true,
  showDisableRestoreButtons = true,
}: UserQuickActionsProps) {
  const [disableUser, { isLoading: disabling }] = useDisableUserMutation();
  const [restoreUser, { isLoading: restoring }] = useRestoreUserMutation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "disable" | "restore" | null
  >(null);

  const busy = disabling || restoring;

  const performDisable = async () => {
    setActionError(null);
    try {
      await disableUser(user.uid).unwrap();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Failed to disable user. Please try again.";
      setActionError(message);
    }
  };

  const performRestore = async () => {
    setActionError(null);
    try {
      await restoreUser(user.uid).unwrap();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Failed to restore user. Please try again.";
      setActionError(message);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction === "disable") {
      await performDisable();
    }

    if (confirmAction === "restore") {
      await performRestore();
    }

    setConfirmAction(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        {showDetailsLink && (
          <Link
            to={`/users/${user.uid}`}
            className="rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
          >
            View details
          </Link>
        )}

        {user.disabled ? (
          <button
            type="button"
            onClick={() => setConfirmAction("restore")}
            disabled={busy}
            className="rounded-lg border border-secondary/35 bg-secondary-very-light px-3 py-1.5 text-xs font-semibold text-secondary-dark transition hover:bg-secondary-very-light/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Please wait..." : "Restore"}
          </button>
        ) : (
          showDisableRestoreButtons && (
            <button
              type="button"
              onClick={() => setConfirmAction("disable")}
              disabled={busy}
              className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {busy ? "Please wait..." : "Disable"}
            </button>
          )
        )}
      </div>

      {actionError && <p className="text-xs text-red-700">{actionError}</p>}

      <ConfirmActionModal
        isOpen={Boolean(confirmAction)}
        title="Confirm User Action"
        message={
          confirmAction === "disable"
            ? `Disable ${user.email || user.userName}?`
            : `Restore ${user.email || user.userName}?`
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
