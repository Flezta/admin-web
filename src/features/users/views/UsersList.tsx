import { useMemo, useState } from "react";
import { useGetUsersQuery } from "../../../store/api/usersApi";
import UsersListControls from "../components/UsersListControls";
import UsersTableView from "../components/UsersTableView";
import UsersTilesView from "../components/UsersTilesView";
import type { UserListFilter, UsersViewMode } from "../types";
import { matchesUserListFilter, matchesUserSearch } from "../utils/userFormat";

export default function UsersList() {
  const { data: users = [], isLoading, isFetching, error } = useGetUsersQuery();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<UsersViewMode>("tiles");
  const [status, setStatus] = useState<UserListFilter>("all");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        matchesUserListFilter(user, status) && matchesUserSearch(user, search),
    );
  }, [users, search, status]);

  const requestError = (error as { message?: string } | undefined)?.message;

  return (
    <section className="space-y-5">
      <UsersListControls
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        shownCount={filteredUsers.length}
        totalCount={users.length}
        isFetching={isFetching}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-primary/70">
          Loading users...
        </div>
      ) : requestError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {requestError}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-primary/70">
          No users match your current search/filter.
        </div>
      ) : viewMode === "tiles" ? (
        <UsersTilesView users={filteredUsers} />
      ) : (
        <UsersTableView users={filteredUsers} />
      )}
    </section>
  );
}
