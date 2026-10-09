import { useState } from "react";
import type { User } from "../../../types/user";
import { useGetLogisticsHubsQuery } from "../../../store/api/ordersApi";
import { useSetHubAccessMutation } from "../../../store/api/hubsApi";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import { getErrorMessage } from "../../../lib/utils/helpers";
import { fieldClass } from "../../orders/utils";

export default function HubAccessPanel({ user }: { user: User }) {
  const {
    data: hubs,
    error: hubsError,
    isLoading: hubsLoading,
  } = useGetLogisticsHubsQuery();
  const [hubId, setHubId] = useState(user.hubId || "");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState<{
    hubId: string | null;
    expectedHubId: string | null;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setAccess, { isLoading }] = useSetHubAccessMutation();
  const conflict = user.isAdmin || user.isSuperAdmin;
  const selectedHub = hubs?.find((hub) => hub.id === hubId);
  const confirm = async () => {
    if (!pending || isLoading) return;
    setError(null);
    try {
      await setAccess({
        uid: user.uid,
        ...pending,
        reason: reason.trim(),
      }).unwrap();
      setMessage(pending.hubId ? "Hub access updated." : "Hub access revoked.");
      setPending(null);
      setReason("");
    } catch (requestError) {
      setPending(null);
      setError(getErrorMessage(requestError) || "Unable to update hub access.");
    }
  };
  return (
    <section className="min-w-0 border-t border-primary/15 pt-4">
      <h2 className="text-base font-semibold">Hub access</h2>
      <p className="mt-2 break-all text-sm text-primary/65">
        Current hub:{" "}
        {hubs?.find((hub) => hub.id === user.hubId)?.name ||
          user.hubId ||
          "None"}
      </p>
      {conflict ? (
        <p className="mt-3 text-sm text-amber-800">
          Remove the marketplace admin role separately before granting partner
          hub access.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          <label className="block text-xs font-semibold text-primary/70">
            Partner hub
            <select
              value={hubId}
              disabled={isLoading || hubsLoading || user.disabled}
              onChange={(event) => {
                setHubId(event.target.value);
                setMessage(null);
              }}
              className={`mt-1 ${fieldClass}`}
            >
              <option value="">Select an enabled hub</option>
              {hubs?.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name}
                </option>
              ))}
              {user.hubId && !hubs?.some((hub) => hub.id === user.hubId) && (
                <option value={user.hubId} disabled>
                  Current hub unavailable for new access
                </option>
              )}
            </select>
          </label>
          <label className="block text-xs font-semibold text-primary/70">
            Access-change reason
            <textarea
              maxLength={2000}
              rows={2}
              value={reason}
              disabled={isLoading}
              onChange={(event) => setReason(event.target.value)}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={
                isLoading ||
                user.disabled ||
                !selectedHub ||
                !reason.trim() ||
                hubId === user.hubId
              }
              onClick={() =>
                setPending({ hubId, expectedHubId: user.hubId || null })
              }
              className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {user.hubId ? "Change hub access" : "Grant hub access"}
            </button>
            {user.hubId && (
              <button
                type="button"
                disabled={isLoading || !reason.trim()}
                onClick={() =>
                  setPending({ hubId: null, expectedHubId: user.hubId || null })
                }
                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
              >
                Revoke hub access
              </button>
            )}
          </div>
          {user.disabled && (
            <p className="text-sm text-amber-800">
              Account disabled. New access is blocked; existing access can still
              be revoked.
            </p>
          )}
        </div>
      )}
      {Boolean(hubsError) && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          Unable to load enabled hubs.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-2 text-sm text-green-700">
          {message}
        </p>
      )}
      <ConfirmActionModal
        isOpen={Boolean(pending)}
        title={pending?.hubId ? "Confirm hub access" : "Revoke hub access"}
        message={`${user.email}: ${pending?.hubId ? selectedHub?.name || pending.hubId : "remove partner hub access"}. Reason: ${reason.trim()}`}
        warning={
          pending?.hubId
            ? "This account will see and act on sub-orders assigned to this partner hub. Verify the account belongs to the intended partner. Changing hubs removes access to the previous hub."
            : "This immediately removes this account's hub permissions. Other partner accounts are not affected."
        }
        busy={isLoading}
        onCancel={() => setPending(null)}
        onConfirm={confirm}
      />
    </section>
  );
}
