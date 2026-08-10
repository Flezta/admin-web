import type { UserListFilter, UsersViewMode } from "../types";

interface UsersListControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: UserListFilter;
  onStatusChange: (value: UserListFilter) => void;
  viewMode: UsersViewMode;
  onViewModeChange: (value: UsersViewMode) => void;
  shownCount: number;
  totalCount: number;
  isFetching: boolean;
}

export default function UsersListControls({
  search,
  onSearchChange,
  status,
  onStatusChange,
  viewMode,
  onViewModeChange,
  shownCount,
  totalCount,
  isFetching,
}: UsersListControlsProps) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Users
          </h1>
          <p className="mt-1 text-sm text-primary/70">
            Manage marketplace users, review accounts, and take admin actions.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-primary/15 bg-white p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("tiles")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              viewMode === "tiles"
                ? "bg-primary text-white"
                : "text-primary hover:bg-primary/5"
            }`}
          >
            Tiles
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              viewMode === "table"
                ? "bg-primary text-white"
                : "text-primary hover:bg-primary/5"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-primary/10 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center sm:p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Search users
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Name, email, uid, phone"
            className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60">
            Status
          </span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as UserListFilter)}
            className="w-full rounded-xl border border-primary/20 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="all">All users</option>
            <option value="active">Active only</option>
            <option value="disabled">Disabled only</option>
            <option value="admin">Admin only</option>
            <option value="hub_admin">Hub admin only</option>
            <option value="super_admin">Super admin only</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm text-primary/70">
        <p>
          Showing {shownCount} of {totalCount} users
        </p>
        {isFetching && <p>Refreshing...</p>}
      </div>
    </>
  );
}
