const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) => {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-primary/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
        {value}
      </p>
      <p className="mt-1 text-xs text-primary/60">{hint}</p>
    </div>
  );
};

export default StatCard;
