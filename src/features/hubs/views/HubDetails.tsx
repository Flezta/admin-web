import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetHubQuery,
  useSetHubEnabledMutation,
  useUpdateHubMutation,
} from "../../../store/api/hubsApi";
import type { HubProfile } from "../../../types/hub";
import { getErrorMessage } from "../../../lib/utils/helpers";
import BackLinkButton from "../../users/components/BackLinkButton";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import Badge from "../../../lib/components/Badge";
import HubProfileForm from "../components/HubProfileForm";
import { fieldClass } from "../../orders/utils";

export default function HubDetails() {
  const { hubId = "" } = useParams();
  const {
    data: hub,
    isLoading,
    error,
    refetch,
  } = useGetHubQuery(hubId, { skip: !hubId });
  const [updateHub, { isLoading: saving }] = useUpdateHubMutation();
  const [setEnabled, { isLoading: updatingStatus }] =
    useSetHubEnabledMutation();
  const [editing, setEditing] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<{
    profile: HubProfile;
    expectedUpdatedAt: string;
  } | null>(null);
  const [reason, setReason] = useState("");
  const [pendingStatus, setPendingStatus] = useState<{
    enabled: boolean;
    expectedUpdatedAt: string;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const busy = saving || updatingStatus;
  const save = async () => {
    if (!hub || !pendingProfile || busy) return;
    setActionError(null);
    try {
      await updateHub({ hubId, ...pendingProfile }).unwrap();
      setEditing(false);
      setPendingProfile(null);
      setSuccess("Partner hub updated.");
    } catch (requestError) {
      setPendingProfile(null);
      setActionError(getErrorMessage(requestError) || "Unable to update hub.");
    }
  };
  const toggle = async () => {
    if (!pendingStatus || busy) return;
    setActionError(null);
    try {
      await setEnabled({
        hubId,
        ...pendingStatus,
        reason: reason.trim(),
      }).unwrap();
      setPendingStatus(null);
      setReason("");
      setSuccess("Partner hub status updated.");
    } catch (requestError) {
      setPendingStatus(null);
      setActionError(
        getErrorMessage(requestError) || "Unable to change hub status.",
      );
    }
  };
  return (
    <section className="min-w-0 space-y-5">
      <BackLinkButton to="/hubs" label="Back to partner hubs" />
      {isLoading ? (
        <p className="text-sm text-primary/65">Loading partner hub...</p>
      ) : Boolean(error) || !hub ? (
        <p role="alert" className="text-sm text-red-700">
          {getErrorMessage(error) || "Hub not found"}{" "}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </p>
      ) : (
        <>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-4">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold">{hub.name}</h1>
              <p className="mt-1 break-all text-xs text-primary/55">
                {hub.hubId}
              </p>
            </div>
            <Badge tone={hub.enabled ? "success" : "danger"}>
              {hub.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </header>
          {actionError && (
            <p role="alert" className="text-sm text-red-700">
              {actionError}
            </p>
          )}
          {success && (
            <p role="status" className="text-sm text-green-700">
              {success}
            </p>
          )}
          <section className="space-y-4 border-b border-primary/15 pb-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Partner profile</h2>
              <button
                type="button"
                disabled={busy}
                onClick={() => setEditing(!editing)}
                className="text-sm font-semibold underline"
              >
                {editing ? "Close editing" : "Edit profile"}
              </button>
            </div>
            {editing ? (
              <HubProfileForm
                key={hub.updatedAt}
                initial={hub}
                busy={busy}
                onSubmit={(profile) =>
                  setPendingProfile({
                    profile,
                    expectedUpdatedAt: hub.updatedAt,
                  })
                }
                onCancel={() => setEditing(false)}
              />
            ) : (
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-primary/55">Handover address</dt>
                  <dd className="mt-1 break-words">
                    {hub.address}, {hub.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-primary/55">
                    Coordinates / time zone
                  </dt>
                  <dd className="mt-1">
                    {hub.coordinate.lat}, {hub.coordinate.lng} · {hub.timeZone}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-primary/55">Partner contact</dt>
                  <dd className="mt-1 break-words">{hub.contactName || "-"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-primary/55">
                    Contact email / phone
                  </dt>
                  <dd className="mt-1 break-words">
                    {hub.contactEmail || "-"} · {hub.contactPhone || "-"}
                  </dd>
                </div>
              </dl>
            )}
          </section>
          <section className="space-y-3 border-b border-primary/15 pb-5">
            <h2 className="text-lg font-semibold">Hub availability</h2>
            <label className="block text-xs font-semibold text-primary/70">
              Availability-change reason
              <textarea
                maxLength={2000}
                rows={2}
                value={reason}
                disabled={busy}
                onChange={(event) => setReason(event.target.value)}
                className={`mt-1 ${fieldClass}`}
              />
            </label>
            <button
              type="button"
              disabled={busy || !reason.trim()}
              onClick={() =>
                setPendingStatus({
                  enabled: !hub.enabled,
                  expectedUpdatedAt: hub.updatedAt,
                })
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 ${hub.enabled ? "border border-red-300 text-red-700" : "bg-primary text-white"}`}
            >
              {hub.enabled ? "Disable hub" : "Enable hub"}
            </button>
          </section>
          <section className="space-y-3 border-b border-primary/15 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Hub access</h2>
              <Link to="/users" className="text-sm font-semibold underline">
                Manage access from a user profile
              </Link>
            </div>
            {hub.accessUsers?.length ? (
              <div className="divide-y divide-primary/10">
                {hub.accessUsers.map((account) => (
                  <div
                    key={account.uid}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        to={`/users/${encodeURIComponent(account.uid)}`}
                        className="break-words text-sm font-semibold underline"
                      >
                        {[account.firstName, account.lastName]
                          .filter(Boolean)
                          .join(" ") || account.userName}
                      </Link>
                      <p className="mt-1 break-words text-xs text-primary/55">
                        {account.email}
                      </p>
                    </div>
                    <Badge tone={account.disabled ? "danger" : "success"}>
                      {account.disabled ? "Account disabled" : "Access granted"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-primary/65">
                No accounts have access to this hub.
              </p>
            )}
          </section>
          <section className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-5">
            <h2 className="text-lg font-semibold">
              Linked sub-orders{" "}
              <span className="text-primary/55">
                ({hub.subOrderCount || 0})
              </span>
            </h2>
            <Link
              to={`/orders?hubId=${encodeURIComponent(hubId)}`}
              className="text-sm font-semibold underline"
            >
              View linked orders
            </Link>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Hub activity</h2>
            <ol className="mt-4 space-y-4 border-l border-primary/20 pl-4">
              {[...(hub.history || [])].reverse().map((event) => (
                <li key={event.eventId} className="min-w-0 text-sm">
                  <p className="font-semibold">
                    {event.action.toLowerCase().replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 break-words text-xs text-primary/65">
                    {event.actor.name} ·{" "}
                    {new Date(event.occurredAt).toLocaleString()}
                  </p>
                  {event.targetUid && (
                    <Link
                      to={`/users/${encodeURIComponent(event.targetUid)}`}
                      className="mt-1 inline-block break-all text-xs underline"
                    >
                      Account: {event.targetUid}
                    </Link>
                  )}
                  {event.reason && (
                    <p className="mt-1 break-words text-primary/70">
                      {event.reason}
                    </p>
                  )}
                  {(event.before || event.after) && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-primary/55">
                        Change details
                      </summary>
                      <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-all bg-primary/5 p-2 text-xs">
                        {JSON.stringify(
                          { before: event.before, after: event.after },
                          null,
                          2,
                        )}
                      </pre>
                    </details>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
      <ConfirmActionModal
        isOpen={Boolean(pendingProfile)}
        title="Update partner hub"
        message="Save the partner business and handover details?"
        warning="New handovers will use the updated profile. Existing order snapshots remain unchanged. Verify any address change with the partner before saving."
        busy={busy}
        onCancel={() => setPendingProfile(null)}
        onConfirm={save}
      />
      <ConfirmActionModal
        isOpen={Boolean(pendingStatus)}
        title={
          pendingStatus?.enabled ? "Enable partner hub" : "Disable partner hub"
        }
        message={`Reason: ${reason.trim()}`}
        warning={
          pendingStatus?.enabled
            ? "This hub will become available for new handovers and hub-access grants."
            : "New handovers and access grants will be blocked. Existing assigned sub-orders remain accessible and actionable to partner accounts; revoke access separately if required."
        }
        busy={busy}
        onCancel={() => setPendingStatus(null)}
        onConfirm={toggle}
      />
    </section>
  );
}
