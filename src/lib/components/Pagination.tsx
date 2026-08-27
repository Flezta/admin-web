function Pagination({
  page,
  totalPages,
  total,
  showing,
  onPageChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  total: number;
  showing: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  const canGoBack = page > 1 && !disabled;
  const canGoForward = page < totalPages && !disabled;

  const buttonClass =
    "cursor-pointer rounded-xl border border-primary/20 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-primary/60">
        Showing <span className="font-semibold text-primary">{showing}</span> of{" "}
        <span className="font-semibold text-primary">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={!canGoBack}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <p className="px-1 text-xs font-semibold text-primary/70">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          className={buttonClass}
          disabled={!canGoForward}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
