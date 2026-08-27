function formatDate(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function formatMoney(value: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getErrorMessage(error: unknown) {
  return (error as { message?: string } | undefined)?.message;
}
function statusLabel(status?: string) {
  if (!status) return "Unknown";
  return status.replaceAll("_", " ").toLowerCase();
}

function formatElapsed(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - parsed.getTime()) / 60000),
  );

  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}

function elapsedHours(value?: string) {
  if (!value) return 0;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 0;
  return Math.max(0, (Date.now() - parsed.getTime()) / 3600000);
}

export {
  formatDate,
  formatMoney,
  getErrorMessage,
  statusLabel,
  formatElapsed,
  elapsedHours,
};
