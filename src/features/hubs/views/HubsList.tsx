import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateHubMutation,
  useGetHubsQuery,
} from "../../../store/api/hubsApi";
import { formatDate, getErrorMessage } from "../../../lib/utils/helpers";
import type { HubProfile } from "../../../types/hub";
import HubProfileForm from "../components/HubProfileForm";
import Badge from "../../../lib/components/Badge";
import { fieldClass } from "../../orders/utils";

export default function HubsList() {
  const { data: hubs, isLoading, error, refetch } = useGetHubsQuery();
  const [createHub, { isLoading: creating }] = useCreateHubMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actionError, setActionError] = useState<string | null>(null);
  const navigate = useNavigate();
  const filtered = hubs?.filter(
    (hub) =>
      `${hub.name} ${hub.city} ${hub.address}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "all" || hub.enabled === (status === "enabled")),
  );
  const create = async (profile: HubProfile) => {
    setActionError(null);
    try {
      const hub = await createHub(profile).unwrap();
      navigate(`/hubs/${encodeURIComponent(hub.hubId)}`);
    } catch (requestError) {
      setActionError(
        getErrorMessage(requestError) || "Unable to create partner hub.",
      );
    }
  };
  return (
    <section className="min-w-0 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Partner hubs</h1>
        <button
          type="button"
          onClick={() => {
            setShowCreate(!showCreate);
            setActionError(null);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {showCreate ? "Close" : "New partner hub"}
        </button>
      </header>
      {showCreate && (
        <section className="space-y-4 border-y border-primary/15 py-5">
          <h2 className="text-base font-semibold">New partner hub</h2>
          <HubProfileForm
            busy={creating}
            onSubmit={create}
            onCancel={() => setShowCreate(false)}
          />
          {actionError && (
            <p role="alert" className="text-sm text-red-700">
              {actionError}
            </p>
          )}
        </section>
      )}
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <label className="text-xs font-semibold text-primary/70">
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Business, city or address"
            className={`mt-1 ${fieldClass}`}
          />
        </label>
        <label className="text-xs font-semibold text-primary/70">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={`mt-1 ${fieldClass}`}
          >
            <option value="all">All hubs</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
      </div>
      {isLoading && (
        <p className="text-sm text-primary/65">Loading partner hubs...</p>
      )}
      {Boolean(error) && (
        <p role="alert" className="text-sm text-red-700">
          {getErrorMessage(error)}{" "}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </p>
      )}
      {hubs && (
        <div className="overflow-x-auto border-y border-primary/15 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-primary/5 text-xs uppercase text-primary/65">
              <tr>
                <th className="p-3">Partner business</th>
                <th className="p-3">City</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((hub) => (
                <tr key={hub.hubId} className="border-t border-primary/10">
                  <td className="max-w-80 p-3">
                    <Link
                      to={`/hubs/${encodeURIComponent(hub.hubId)}`}
                      className="break-words font-semibold underline"
                    >
                      {hub.name}
                    </Link>
                    <p className="mt-1 break-words text-xs text-primary/55">
                      {hub.address}
                    </p>
                  </td>
                  <td className="p-3">{hub.city}</td>
                  <td className="p-3">
                    <Badge tone={hub.enabled ? "success" : "danger"}>
                      {hub.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="p-3">{formatDate(hub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered?.length && (
            <p className="p-8 text-center text-sm text-primary/65">
              {hubs.length
                ? "No hubs match these filters."
                : "No partner hubs have been created."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
