import type { User } from "../../../types/user";
import { getUserDisplayName } from "../utils/userFormat";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-24 w-24 text-xl",
} as const;

function getAvatarText(user: User): string {
  const name = getUserDisplayName(user).trim();
  if (!name) return "A";

  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export default function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const imageSrc = user.imageUrl?.link;
  const avatarText = user.avatar?.text || getAvatarText(user);
  const bgColor = user.avatar?.bgColor || "#003625";
  const textColor = user.avatar?.textColor || "#ffffff";

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-primary/10 ${sizeClasses[size]}`}
      style={{ backgroundColor: bgColor, color: textColor }}
      aria-label={getUserDisplayName(user)}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={getUserDisplayName(user)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-bold uppercase tracking-[0.08em]">
          {avatarText}
        </span>
      )}
    </div>
  );
}
