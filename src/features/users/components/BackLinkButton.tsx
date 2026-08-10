import { Link } from "react-router-dom";

interface BackLinkButtonProps {
  to: string;
  label: string;
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BackLinkButton({ to, label }: BackLinkButtonProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:shadow-md"
    >
      <ArrowLeftIcon />
      <span>{label}</span>
    </Link>
  );
}
