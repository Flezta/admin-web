import type { User } from "../../../types/user";
import { getUserDisplayName, getUserRoles } from "../utils/userFormat";
import UserQuickActions from "./UserQuickActions";
import UserRoleBadges from "./UserRoleBadges";
import UserStatusBadge from "./UserStatusBadge";

interface UsersTableViewProps {
  users: User[];
}

export default function UsersTableView({ users }: UsersTableViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-primary/5 text-left text-xs uppercase tracking-[0.14em] text-primary/65">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Roles</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="border-t border-primary/10 align-top">
              <td className="px-4 py-3">
                <p className="font-semibold text-primary">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-primary/70">{user.email}</p>
              </td>
              <td className="px-4 py-3">
                <UserRoleBadges roles={getUserRoles(user)} />
              </td>
              <td className="px-4 py-3">
                <UserStatusBadge disabled={user.disabled} />
              </td>
              <td className="px-4 py-3">
                <UserQuickActions user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
