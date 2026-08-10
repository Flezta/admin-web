import type { User } from "../../../types/user";

import UserTile from "./UserTile";

interface UsersTilesViewProps {
  users: User[];
}

export default function UsersTilesView({ users }: UsersTilesViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserTile key={user.uid} user={user} />
      ))}
    </div>
  );
}
