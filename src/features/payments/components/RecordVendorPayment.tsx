import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { EligibleVendorPayout } from "../../../types/payment";
import { useRecordManualVendorPaymentMutation } from "../../../store/api/paymentsApi";
import { useGetShopBankDetailsQuery } from "../../../store/api/shopsApi";
import { formatMoney, getErrorMessage } from "../../../lib/utils/helpers";
import { fieldClass } from "../../orders/utils";
import ConfirmActionModal from "../../../components/ConfirmActionModal";

export default function RecordVendorPayment({
  selected,
  onCancel,
}: {
  selected: EligibleVendorPayout[];
  onCancel: () => void;
}) {
  const [paidAt, setPaidAt] = useState("");
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [notes, setNotes] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestKey = useRef<string | null>(null);
  const [record, { isLoading }] = useRecordManualVendorPaymentMutation();
  const navigate = useNavigate();
  const shopId = selected[0].shopId;
  const total = selected.reduce((amount, row) => amount + row.netInKobo, 0);
  const { data: bank, error: bankError } = useGetShopBankDetailsQuery(shopId);
  const submit = async () => {
    if (!acknowledged || isLoading) return;
    setError(null);
    requestKey.current ||= crypto.randomUUID();
    try {
      const payment = await record({
        shopId,
        subOrderIds: selected.map((row) => row.subOrderId),
        amountInKobo: total,
        paidAt: new Date(paidAt).toISOString(),
        reference: reference.trim(),
        method,
        notes: notes.trim(),
        requestKey: requestKey.current,
        acknowledged: true,
      }).unwrap();
      navigate(`/payments/vendors/${encodeURIComponent(payment.recordId)}`);
    } catch (requestError) {
      setConfirming(false);
      setError(
        getErrorMessage(requestError) ||
          "Unable to record payment. Check completed payments before retrying.",
      );
    }
  };
  const warning =
    "Record this only after the vendor has actually received the exact reviewed amount. The app does not transfer money. This permanently marks every selected sub-order PAID and prevents another payment record. Verify the vendor, reference, bank destination and payment time; no refund or bank transfer can be reversed here.";
  return (
    <section className="space-y-4 border-y border-primary/20 py-5">
      <h2 className="text-lg font-semibold">
        Record completed payment: {selected[0].shopName}
      </h2>
      <p className="text-sm font-semibold">
        {selected.length} sub-orders · {formatMoney(total / 100, "NGN")} vendor
        net
      </p>
      <ul className="divide-y divide-primary/10 text-sm">
        {selected.map((row) => (
          <li
            key={row.subOrderId}
            className="flex flex-wrap items-center justify-between gap-2 py-2"
          >
            <Link
              to={`/orders/${encodeURIComponent(row.orderId)}`}
              target="_blank"
              rel="noreferrer"
              className="break-all underline"
            >
              {row.subOrderId}
            </Link>
            <span>{formatMoney(row.netInKobo / 100, "NGN")}</span>
          </li>
        ))}
      </ul>
      {bank ? (
        <p className="break-words text-sm text-primary/65">
          Current bank details: {bank.accountName} · {bank.accountNumber} · bank
          code {bank.bankCode}
        </p>
      ) : (
        <p className="text-sm text-amber-800">
          {bankError
            ? "Bank details unavailable. Verify the actual destination separately before recording."
            : "Loading bank details..."}
        </p>
      )}
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (acknowledged && reference.trim()) setConfirming(true);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-primary/70">
            Paid at (your local time)
            <input
              required
              type="datetime-local"
              value={paidAt}
              disabled={isLoading}
              onChange={(event) => setPaidAt(event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <label className="text-xs font-semibold text-primary/70">
            Method
            <select
              value={method}
              disabled={isLoading}
              onChange={(event) => setMethod(event.target.value)}
              className={`mt-1 ${fieldClass}`}
            >
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option value="CASH">Cash</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
        </div>
        <label className="block text-xs font-semibold text-primary/70">
          Unique transaction / receipt reference
          <input
            required
            maxLength={200}
            value={reference}
            disabled={isLoading}
            onChange={(event) => setReference(event.target.value)}
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <label className="block text-xs font-semibold text-primary/70">
          Notes (optional)
          <textarea
            maxLength={2000}
            rows={2}
            value={notes}
            disabled={isLoading}
            onChange={(event) => setNotes(event.target.value)}
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <div className="space-y-3 border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
          <p>{warning}</p>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              checked={acknowledged}
              disabled={isLoading}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-1 shrink-0"
            />
            <span>
              I confirm this vendor has been paid{" "}
              {formatMoney(total / 100, "NGN")} outside the app.
            </span>
          </label>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={
              isLoading || !acknowledged || !reference.trim() || !paidAt
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Review payment record
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-lg border border-primary/20 px-4 py-2 text-sm"
          >
            Cancel recording
          </button>
        </div>
      </form>
      <ConfirmActionModal
        isOpen={confirming}
        title="Confirm completed vendor payment"
        message={`${selected[0].shopName}: ${formatMoney(total / 100, "NGN")}. Reference: ${reference.trim()}. Paid at: ${paidAt ? new Date(paidAt).toLocaleString() : ""}.`}
        warning={warning}
        confirmLabel="Record as paid"
        busy={isLoading}
        onCancel={() => setConfirming(false)}
        onConfirm={submit}
      />
    </section>
  );
}
