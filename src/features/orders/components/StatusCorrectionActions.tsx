import { useState } from "react";
import { useAuth } from "../../auth/context/use-auth";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import { useCorrectOrderStatusMutation } from "../../../store/api/ordersApi";
import { getErrorMessage } from "../../../lib/utils/helpers";
import type {
  FulfilmentStatus,
  OperationalSubOrder,
} from "../../../types/order";
import { fieldClass, statusLabel } from "../utils";

export default function StatusCorrectionActions({
  subOrder,
}: {
  subOrder: OperationalSubOrder;
}) {
  const { user } = useAuth();
  const [status, setStatus] = useState<FulfilmentStatus | "">("");
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmedStatus, setConfirmedStatus] = useState(subOrder.status);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [correctStatus, { isLoading }] = useCorrectOrderStatusMutation();
  if (!user?.isAdmin && !user?.isSuperAdmin) return null;
  const reopen =
    subOrder.status === "CANCELLED" || subOrder.status === "RETURNED";
  const options = reopen
    ? subOrder.reopenStatuses || []
    : subOrder.correctionStatuses || [];
  const selectedStatus = options.includes(status as FulfilmentStatus)
    ? status
    : "";
  const warning = reopen
    ? "Reopening resumes this order and reserves its items again. Every product and bundle component must have sufficient stock; otherwise nothing changes. Check the physical item, seller agreement, and any previous refund first. Payments and payouts are not reversed automatically. Historical handover details may need rescheduling."
    : "This corrects the recorded status only. It does not reverse a physical delivery, recall a courier, or reverse payments or payouts. Verify the item location and inform the seller and hub first. The original history stays visible, QA/dispatch cancellation cutoffs remain in force, and this correction is permanently attributed to you.";

  const submit = async () => {
    if (!selectedStatus || !acknowledged || !reason.trim() || isLoading) return;
    setError(null);
    try {
      await correctStatus({
        orderId: subOrder.orderId,
        subOrderId: subOrder.subOrderId,
        status: selectedStatus,
        expectedStatus: confirmedStatus,
        reason: reason.trim(),
        acknowledgeEffects: true,
        reopen,
      }).unwrap();
      setConfirming(false);
      setStatus("");
      setReason("");
      setAcknowledged(false);
      setSuccess(
        reopen
          ? "Order reopened and stock reserved."
          : "Status corrected. Previous history is preserved.",
      );
    } catch (requestError) {
      setConfirming(false);
      setError(
        getErrorMessage(requestError) ||
          "Unable to change the status. Refresh the order before retrying.",
      );
    }
  };

  return (
    <details className="mt-4 border-t border-primary/15 pt-4">
      <summary className="cursor-pointer text-sm font-semibold text-primary">
        {reopen ? "Reopen order" : "Correct status"}
      </summary>
      <div className="mt-3 space-y-3">
        {success && (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        {!options.length ? (
          <p className="text-sm text-primary/65">
            No previously reached active status is available.
          </p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (selectedStatus && acknowledged && reason.trim()) {
                setConfirmedStatus(subOrder.status);
                setConfirming(true);
              }
            }}
          >
            <label className="block text-xs font-semibold text-primary/70">
              Previously reached status
              <select
                required
                value={selectedStatus}
                disabled={isLoading}
                onChange={(event) => {
                  setStatus(event.target.value as FulfilmentStatus);
                  setAcknowledged(false);
                  setError(null);
                  setSuccess(null);
                }}
                className={`mt-1 ${fieldClass}`}
              >
                <option value="">Select a previously reached status</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {statusLabel(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-primary/70">
              {reopen ? "Reopening reason" : "Correction reason"}
              <textarea
                required
                maxLength={2000}
                rows={3}
                value={reason}
                disabled={isLoading}
                onChange={(event) => setReason(event.target.value)}
                className={`mt-1 ${fieldClass}`}
              />
            </label>
            <div className="space-y-3 border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
              <p>{warning}</p>
              <label className="flex items-start gap-2">
                <input
                  required
                  type="checkbox"
                  checked={acknowledged}
                  disabled={isLoading}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                  className="mt-1 shrink-0"
                />
                <span>
                  I have verified the physical item, stock, payment and payout
                  implications.
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={
                isLoading || !selectedStatus || !reason.trim() || !acknowledged
              }
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {reopen ? "Review reopening" : "Review correction"}
            </button>
          </form>
        )}
      </div>
      <ConfirmActionModal
        isOpen={confirming}
        title={reopen ? "Confirm order reopening" : "Confirm status correction"}
        message={`${subOrder.subOrderId}: ${statusLabel(confirmedStatus)} to ${selectedStatus ? statusLabel(selectedStatus) : ""}. Reason: ${reason.trim()}`}
        warning={warning}
        hint="This action is recorded permanently against your account."
        confirmLabel={reopen ? "Reopen and reserve stock" : "Apply correction"}
        busy={isLoading}
        onCancel={() => setConfirming(false)}
        onConfirm={submit}
        confirmButtonClassName="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
      />
    </details>
  );
}
