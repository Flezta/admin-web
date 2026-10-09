import type { FulfilmentStatus } from "../../types/order";

export function statusLabel(status: string): string {
  if (status === "READY_FOR_QA") return "Ready for QA";
  if (status === "QA_IN_PROGRESS") return "QA in progress";
  if (status === "FULFILLMENT_REJECTION") return "QA rejected";
  if (status === "FULFILLMENT_EXCEPTION") return "Fulfilment issue";
  return status.toLowerCase().replaceAll("_", " ");
}

export function statusTone(status: string) {
  if (status === "DELIVERED") return "success";
  if (
    [
      "CANCELLED",
      "RETURNED",
      "FULFILLMENT_REJECTION",
      "FULFILLMENT_EXCEPTION",
    ].includes(status)
  )
    return "danger";
  if (["READY_FOR_QA", "QA_IN_PROGRESS"].includes(status)) return "warning";
  return "neutral";
}

export const actionLabels: Partial<Record<FulfilmentStatus, string>> = {
  CONFIRMED: "Accept order",
  CANCELLED: "Cancel order",
  READY_FOR_QA: "Mark ready for QA",
  QA_IN_PROGRESS: "Receive and start QA",
  OUT_FOR_DELIVERY: "Approve QA and dispatch",
  FULFILLMENT_REJECTION: "Reject QA",
  DELIVERED: "Confirm delivery",
  RETURNED: "Record return",
};

export const fieldClass =
  "w-full min-w-0 rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";
