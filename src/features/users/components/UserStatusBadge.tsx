interface UserStatusBadgeProps {
  disabled?: boolean;
}

export default function UserStatusBadge({ disabled }: UserStatusBadgeProps) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        disabled ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {disabled ? "Disabled" : "Active"}
    </span>
  );
}
