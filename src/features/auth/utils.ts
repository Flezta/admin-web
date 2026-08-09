import type { User } from "../../types/user";

export function getHomeRoute(user: User | null): string {
  if (!user) return "/login";
  if (user.isSuperAdmin || user.isAdmin) return "/";
  if (user.isHubAdmin) return "/hub";
  return "/unauthorized";
}
