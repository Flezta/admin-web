function AlertMessage({
  tone,
  message,
  onDismiss,
}: {
  tone: "error" | "success" | "info";
  message: string;
  onDismiss?: () => void;
}) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "success"
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-primary/15 bg-primary/5 text-primary/75";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2 text-sm ${toneClass}`}
    >
      <p>{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="cursor-pointer text-base leading-none opacity-60 transition hover:opacity-100"
        >
          &times;
        </button>
      ) : null}
    </div>
  );
}

export default AlertMessage;
