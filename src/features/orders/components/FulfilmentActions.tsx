import { useState } from "react";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import {
  useGetLogisticsHubsQuery,
  useGetHandoverTimeSlotsQuery,
  useUpdateFulfilmentMutation,
} from "../../../store/api/ordersApi";
import type {
  FulfilmentStatus,
  OperationalSubOrder,
} from "../../../types/order";
import { getErrorMessage } from "../../../lib/utils/helpers";
import { actionLabels, fieldClass } from "../utils";
import { useAuth } from "../../auth/context/use-auth";

export default function FulfilmentActions({
  subOrder,
}: {
  subOrder: OperationalSubOrder;
}) {
  const { user } = useAuth();
  const fullAdmin = Boolean(user?.isAdmin || user?.isSuperAdmin);
  const allowedActions = subOrder.allowedActions.filter(
    (option) => option.value !== "CANCELLED" || fullAdmin,
  );
  const [status, setStatus] = useState<FulfilmentStatus | "">("");
  const [reason, setReason] = useState("");
  const [hubId, setHubId] = useState(subOrder.adminHandover?.hubId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmedStatus, setConfirmedStatus] = useState(subOrder.status);
  const [update, { isLoading }] = useUpdateFulfilmentMutation();
  const { data: hubs, error: hubsError } = useGetLogisticsHubsQuery(undefined, {
    skip: status !== "READY_FOR_QA",
  });
  const {
    currentData: slotOptions,
    isFetching: slotsLoading,
    error: slotsError,
    refetch: refetchSlots,
  } = useGetHandoverTimeSlotsQuery(
    { hubId: hubId || undefined, date: date || undefined },
    {
      skip: status !== "READY_FOR_QA",
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const selectedSlot =
    slotOptions?.date === date
      ? slotOptions.slots.find((slot) => slot.value === time)
      : undefined;
  const selectedTime = selectedSlot?.value || "";
  const action = allowedActions.find((option) => option.value === status);
  const requiresReason = [
    "CANCELLED",
    "RETURNED",
    "FULFILLMENT_REJECTION",
  ].includes(status);
  const requiresAcknowledgement =
    status === "CANCELLED" || status === "RETURNED";
  const warning =
    status === "CANCELLED"
      ? "Cancellation stops fulfilment and releases reserved stock immediately. Notify the seller and hub before proceeding. Reopening is a separate action and may fail if stock has sold. No refund is issued automatically."
      : status === "RETURNED"
        ? "Confirm the item has physically been returned before recording this action. Stock becomes available for sale immediately. This does not recall a courier, reverse payment, or issue a refund. Arrange any refund separately."
        : status === "OUT_FOR_DELIVERY"
          ? "Confirm QA has passed and the item is physically being dispatched. Cancellation will no longer be available. This action does not book a courier."
          : "This changes fulfilment immediately and adds a permanent activity entry. Confirm the item and selected action before proceeding.";

  const submit = async () => {
    if (!action || isLoading) return;
    if (requiresAcknowledgement && !acknowledged) return;
    if (status === "READY_FOR_QA" && !selectedSlot?.startsAt) {
      setConfirming(false);
      setError("Select an available handover slot.");
      return;
    }
    setError(null);
    try {
      await update({
        orderId: subOrder.orderId,
        subOrderId: subOrder.subOrderId,
        status: action.value,
        expectedStatus: confirmedStatus,
        acknowledgeEffects: acknowledged,
        ...(status === "READY_FOR_QA"
          ? {
              hubId,
              handoverDate: date,
              handoverTime: selectedTime,
            }
          : {}),
        ...(status === "CANCELLED"
          ? { cancellationReason: reason.trim() }
          : {}),
        ...(status === "RETURNED" ? { returnReason: reason.trim() } : {}),
        ...(status === "FULFILLMENT_REJECTION"
          ? { fulfillmentRejectionReason: reason.trim() }
          : {}),
      }).unwrap();
      setConfirming(false);
      setStatus("");
      setAcknowledged(false);
      setSuccess("Fulfilment updated successfully.");
    } catch (requestError) {
      setConfirming(false);
      setError(getErrorMessage(requestError) || "Unable to update fulfilment.");
    }
  };

  return (
    <div className="mt-5 border-t border-primary/15 pt-4">
      {success && (
        <p role="status" className="mb-3 text-sm text-green-700">
          {success}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {!allowedActions.length ? (
        <p className="text-sm text-primary/55">No available actions.</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (action && (!requiresAcknowledgement || acknowledged)) {
              setConfirmedStatus(subOrder.status);
              setConfirming(true);
            }
          }}
          className="space-y-3"
        >
          <label className="block text-xs font-semibold text-primary/70">
            Fulfilment action
            <select
              required
              value={status}
              disabled={isLoading}
              onChange={(event) => {
                setStatus(event.target.value as FulfilmentStatus);
                setReason("");
                setError(null);
                setSuccess(null);
                setAcknowledged(false);
              }}
              className={`mt-1 ${fieldClass}`}
            >
              <option value="">Select an action</option>
              {allowedActions.map((option) => (
                <option key={option.value} value={option.value}>
                  {actionLabels[option.value] || option.callToAction}
                </option>
              ))}
            </select>
          </label>
          {requiresReason && (
            <label className="block text-xs font-semibold text-primary/70">
              {status === "FULFILLMENT_REJECTION"
                ? "QA rejection reason"
                : status === "RETURNED"
                  ? "Return reason"
                  : "Cancellation reason"}
              <textarea
                required
                maxLength={2000}
                value={reason}
                disabled={isLoading}
                onChange={(event) => setReason(event.target.value)}
                className={`mt-1 ${fieldClass}`}
                rows={3}
              />
            </label>
          )}
          {status === "READY_FOR_QA" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-xs font-semibold text-primary/70">
                Handover hub
                <select
                  required
                  value={hubId}
                  disabled={isLoading}
                  onChange={(event) => {
                    setHubId(event.target.value);
                    setTime("");
                  }}
                  className={`mt-1 ${fieldClass}`}
                >
                  <option value="">Select hub</option>
                  {hubs?.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold text-primary/70">
                Handover date
                <input
                  required
                  type="date"
                  value={date}
                  min={slotOptions?.today}
                  disabled={isLoading}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setTime("");
                  }}
                  className={`mt-1 ${fieldClass}`}
                />
              </label>
              <label className="text-xs font-semibold text-primary/70">
                Time slot
                <select
                  required
                  value={selectedTime}
                  disabled={
                    isLoading || slotsLoading || !date || Boolean(slotsError)
                  }
                  onChange={(event) => setTime(event.target.value)}
                  className={`mt-1 ${fieldClass}`}
                >
                  <option value="">
                    {slotsLoading
                      ? "Loading slots..."
                      : !date
                        ? "Select a date first"
                        : "Select a time slot"}
                  </option>
                  {slotOptions?.slots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {status === "READY_FOR_QA" && Boolean(hubsError) && (
            <p role="alert" className="text-sm text-red-700">
              Unable to load hubs.
            </p>
          )}
          {status === "READY_FOR_QA" && Boolean(slotsError) && (
            <p role="alert" className="text-sm text-red-700">
              Unable to load handover slots.{" "}
              <button
                type="button"
                onClick={() => refetchSlots()}
                className="font-semibold underline"
              >
                Retry
              </button>
            </p>
          )}
          {status === "READY_FOR_QA" &&
            date &&
            slotOptions?.slots.length === 0 && (
              <p role="status" className="text-sm text-amber-800">
                No available handover slots for this date. Select a later date.
              </p>
            )}
          {action && (
            <>
              {requiresAcknowledgement && (
                <div className="space-y-3 border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
                  <p>{warning}</p>
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      required
                      checked={acknowledged}
                      disabled={isLoading}
                      onChange={(event) =>
                        setAcknowledged(event.target.checked)
                      }
                      className="mt-1 shrink-0"
                    />
                    <span>
                      I have verified the physical item state and understand the
                      stock and refund effects.
                    </span>
                  </label>
                </div>
              )}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (requiresReason && !reason.trim()) ||
                  (requiresAcknowledgement && !acknowledged) ||
                  (status === "READY_FOR_QA" &&
                    (!hubs?.length ||
                      !hubId ||
                      !selectedTime ||
                      Boolean(slotsError)))
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {actionLabels[action.value] || action.callToAction}
              </button>
            </>
          )}
        </form>
      )}
      <ConfirmActionModal
        isOpen={confirming}
        title="Confirm fulfilment action"
        message={`${action?.callToAction || "Update fulfilment"} for ${subOrder.subOrderId}?${requiresReason ? ` Reason: ${reason.trim()}` : ""}`}
        hint="This updates the order immediately."
        warning={warning}
        confirmButtonClassName={
          requiresAcknowledgement
            ? "rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            : undefined
        }
        confirmLabel={action ? actionLabels[action.value] : "Confirm"}
        busy={isLoading}
        onCancel={() => setConfirming(false)}
        onConfirm={submit}
      />
    </div>
  );
}
