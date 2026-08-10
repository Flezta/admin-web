interface UserInfoRowProps {
  label: string;
  value: string;
}

export default function UserInfoRow({ label, value }: UserInfoRowProps) {
  return (
    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
      <p className="text-xs uppercase tracking-[0.13em] text-primary/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-primary">{value || "-"}</p>
    </div>
  );
}
