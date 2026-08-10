import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  type AdminRole,
  useAssignUserAdminRoleMutation,
  useGetUserByUidQuery,
} from "../../../store/api/usersApi";
import BackLinkButton from "../components/BackLinkButton";
import UserInfoRow from "../components/UserInfoRow";
import UserAvatar from "../components/UserAvatar";
import UserCommercePreviewCard from "../components/UserCommercePreviewCard";
import UserQuickActions from "../components/UserQuickActions";
import UserRoleActionsCard from "../components/UserRoleActionsCard";
import UserShopLinkCard from "../components/UserShopLinkCard";
import { getUserDisplayName } from "../utils/userFormat";

export default function UserDetails() {
  const { uid } = useParams<{ uid: string }>();
  const {
    data: user,
    isLoading,
    isFetching,
    error,
  } = useGetUserByUidQuery(uid || "", {
    skip: !uid,
  });

  const [assignUserAdminRole, { isLoading: assigningRole }] =
    useAssignUserAdminRoleMutation();
  const [roleActionError, setRoleActionError] = useState<string | null>(null);
  const [roleActionSuccess, setRoleActionSuccess] = useState<string | null>(
    null,
  );
  const [pendingRole, setPendingRole] = useState<AdminRole | null>(null);

  const requestError = (error as { message?: string } | undefined)?.message;
  const busy = assigningRole;

  const runRoleUpdate = async (role: AdminRole) => {
    if (!user || !uid) return;

    const roleLabelMap: Record<AdminRole, string> = {
      ADMIN: "Admin",
      HUB_ADMIN: "Hub Admin",
      SUPER_ADMIN: "Super Admin",
      NONE: "No elevated role",
    };

    try {
      setRoleActionError(null);
      setRoleActionSuccess(null);
      setPendingRole(role);
      await assignUserAdminRole({ uid, role }).unwrap();
      setRoleActionSuccess(`${roleLabelMap[role]} set successfully.`);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ||
        "Failed to assign role. Please try again.";
      setRoleActionError(message);
    } finally {
      setPendingRole(null);
    }
  };

  const activeRole: AdminRole | null = user?.isSuperAdmin
    ? "SUPER_ADMIN"
    : user?.isHubAdmin
      ? "HUB_ADMIN"
      : user?.isAdmin
        ? "ADMIN"
        : null;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-primary/70">
        Loading user details...
      </div>
    );
  }

  if (requestError || !user) {
    return (
      <div className="space-y-4">
        <BackLinkButton to="/users" label="Back to users" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {requestError || "User not found"}
        </div>
      </div>
    );
  }

  const fullName = getUserDisplayName(user);
  const authActivity = user.authActivity;
  const hasAuthActivity = Boolean(
    authActivity?.lastSignInTime ||
    authActivity?.creationTime ||
    authActivity?.providerData ||
    authActivity?.lastRefreshTime,
  );

  const formatAuthDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  return (
    <section className="space-y-5">
      <BackLinkButton to="/users" label="Back to users" />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.45)]">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div>
            <h1 className="mt-1 text-xl md:text-2xl font-bold tracking-tight text-primary">
              {fullName}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <UserQuickActions user={user} showDetailsLink={false} />
        </div>
      </div>

      {isFetching && (
        <p className="text-sm text-primary/65">Refreshing user...</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <UserInfoRow label="Email" value={user.email || "-"} />
        <UserInfoRow label="Username" value={user.userName || "-"} />
        <UserInfoRow label="Phone" value={user.phoneNumber || "-"} />
        <UserInfoRow
          label="Account Status"
          value={user.disabled ? "Disabled" : "Active"}
        />
        <UserInfoRow label="Created" value={user.creationTime || "-"} />
        <UserInfoRow
          label="Sign In Count"
          value={String(user.signInCount || 0)}
        />
      </div>

      {hasAuthActivity && (
        <section className="rounded-2xl border border-primary/10 bg-white p-4">
          <h2 className="text-base font-semibold text-primary">
            Auth Activity
          </h2>
          <p className="mt-1 text-sm text-primary/65">
            Authentication timeline and provider metadata from the user profile.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <UserInfoRow
              label="Auth Created"
              value={formatAuthDate(authActivity?.creationTime)}
            />
            <UserInfoRow
              label="Last Sign In"
              value={formatAuthDate(authActivity?.lastSignInTime)}
            />
            <UserInfoRow
              label="Last Refresh"
              value={formatAuthDate(authActivity?.lastRefreshTime)}
            />
            <UserInfoRow
              label="Provider"
              value={authActivity?.providerData || "-"}
            />
          </div>
        </section>
      )}

      <UserCommercePreviewCard uid={user.uid} />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <UserRoleActionsCard
          activeRole={activeRole}
          busy={busy}
          pendingRole={pendingRole}
          errorMessage={roleActionError}
          successMessage={roleActionSuccess}
          onSetAdmin={() => runRoleUpdate("ADMIN")}
          onSetHubAdmin={() => runRoleUpdate("HUB_ADMIN")}
          onSetSuperAdmin={() => runRoleUpdate("SUPER_ADMIN")}
          onSetNone={() => runRoleUpdate("NONE")}
        />

        <UserShopLinkCard shopId={user.shopId} />
      </div>
    </section>
  );
}
