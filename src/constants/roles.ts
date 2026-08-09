import type { User } from "../types/user";

export const ROLES = {
  SUPER_ADMIN: "isSuperAdmin",
  HUB_ADMIN: "isHubAdmin",
  ADMIN: "isAdmin",
  VENDOR: "isVendor",
} as const;

export type RoleKey = (typeof ROLES)[keyof typeof ROLES];

// checks if a user satisfies ANY of the given role flags
export function hasAnyRole(user: User | null, allowed: RoleKey[]): boolean {
  if (!user) return false;
  return allowed.some((key) => user[key] === true);
}
