import type { ReactNode } from "react";

function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-primary/20 bg-white px-6 py-14 text-center">
      {icon ? (
        <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/5 text-primary/60">
          {icon}
        </span>
      ) : null}
      <p className="text-base font-semibold text-primary">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-primary/60">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
