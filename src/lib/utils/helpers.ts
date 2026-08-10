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

export { formatDate, formatMoney, getErrorMessage ,statusLabel };