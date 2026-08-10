import type { User } from "../../../types/user";
import { getUserDisplayName, getUserRoles } from "../utils/userFormat";
import UserAvatar from "./UserAvatar";
import UserQuickActions from "./UserQuickActions";
import UserRoleBadges from "./UserRoleBadges";
import UserStatusBadge from "./UserStatusBadge";

interface UserTileProps {
  user: User;
  showDisableRestoreButtons?: boolean;
}

export default function UserTile({ user, showDisableRestoreButtons = true }: UserTileProps) {
  return (
    <article
      key={user.uid}
      className="rounded-2xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.45)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <UserAvatar user={user} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary">
              {getUserDisplayName(user)}
            </p>
            <p className="break-words text-[10px] text-primary/70">{user.email}</p>
            <p className="mt-1 break-words text-[10px] text-primary/60">
              Phone: {user.phoneNumber || "-"}
            </p>
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          <UserStatusBadge disabled={user.disabled} />
        </div>
      </div>

      <div className="mt-3">
        <UserRoleBadges roles={getUserRoles(user)} />
      </div>

      <div className="mt-4 border-t border-primary/10 pt-3">
        <UserQuickActions user={user} showDisableRestoreButtons={showDisableRestoreButtons} />
      </div>
    </article>
  );
}
