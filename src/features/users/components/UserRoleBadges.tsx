interface UserRoleBadgesProps {
  roles: string[];
}

export default function UserRoleBadges({ roles }: UserRoleBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <span
          key={role}
          className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary"
        >
          {role}
        </span>
      ))}
    </div>
  );
}
