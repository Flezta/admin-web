import type { User } from "../../../types/user";
import type { UserListFilter, UserStatusFilter } from "../types";

export function getUserDisplayName(user: User): string {
  return (
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName
  );
}

export function getUserRoles(user: User): string[] {
  const roles: string[] = [];
  if (user.isSuperAdmin) roles.push("Super Admin");
  if (user.isAdmin) roles.push("Admin");
  if (user.isHubAdmin) roles.push("Hub Admin");
  if (user.isVendor) roles.push("Vendor");
  if (roles.length === 0) roles.push("Customer");
  return roles;
}

export function matchesUserStatus(
  user: User,
  status: UserStatusFilter,
): boolean {
  return (
    status === "all" ||
    (status === "active" && !user.disabled) ||
    (status === "disabled" && !!user.disabled)
  );
}

export function matchesUserListFilter(
  user: User,
  filter: UserListFilter,
): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "active" || filter === "disabled") {
    return matchesUserStatus(user, filter);
  }

  if (filter === "admin") {
    return !!user.isAdmin;
  }

  if (filter === "hub_admin") {
    return !!user.isHubAdmin;
  }

  if (filter === "super_admin") {
    return !!user.isSuperAdmin;
  }

  return true;
}

export function matchesUserSearch(user: User, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    user.uid,
    user.userName,
    user.email,
    user.firstName,
    user.lastName,
    user.phoneNumber,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}
