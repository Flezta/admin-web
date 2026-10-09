import { useState } from "react";
import type { HubProfile } from "../../../types/hub";
import { fieldClass } from "../../orders/utils";

export default function HubProfileForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: {
  initial?: HubProfile;
  busy: boolean;
  onSubmit: (profile: HubProfile) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState({
    name: initial?.name || "",
    city: initial?.city || "",
    address: initial?.address || "",
    lat: initial ? String(initial.coordinate.lat) : "",
    lng: initial ? String(initial.coordinate.lng) : "",
    contactName: initial?.contactName || "",
    contactEmail: initial?.contactEmail || "",
    contactPhone: initial?.contactPhone || "",
  });
  const fields = [
    {
      key: "name",
      label: "Partner business name",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      key: "city",
      label: "City",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      key: "address",
      label: "Handover address",
      type: "text",
      required: true,
      maxLength: 500,
    },
    {
      key: "lat",
      label: "Latitude",
      type: "number",
      required: true,
      min: -90,
      max: 90,
    },
    {
      key: "lng",
      label: "Longitude",
      type: "number",
      required: true,
      min: -180,
      max: 180,
    },
    {
      key: "contactName",
      label: "Partner contact name",
      type: "text",
      maxLength: 120,
    },
    {
      key: "contactEmail",
      label: "Partner contact email",
      type: "email",
      maxLength: 254,
    },
    {
      key: "contactPhone",
      label: "Partner contact phone",
      type: "tel",
      maxLength: 40,
    },
  ] as const;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name: values.name.trim(),
          city: values.city.trim(),
          address: values.address.trim(),
          coordinate: { lat: Number(values.lat), lng: Number(values.lng) },
          timeZone: "Africa/Lagos",
          contactName: values.contactName.trim(),
          contactEmail: values.contactEmail.trim(),
          contactPhone: values.contactPhone.trim(),
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.key}
            className={`min-w-0 text-xs font-semibold text-primary/70 ${field.key === "address" ? "sm:col-span-2" : ""}`}
          >
            {field.label}
            <input
              type={field.type}
              required={"required" in field && field.required}
              maxLength={"maxLength" in field ? field.maxLength : undefined}
              min={"min" in field ? field.min : undefined}
              max={"max" in field ? field.max : undefined}
              step={field.type === "number" ? "any" : undefined}
              value={values[field.key]}
              disabled={busy}
              onChange={(event) =>
                setValues({ ...values, [field.key]: event.target.value })
              }
              className={`mt-1 ${fieldClass}`}
            />
          </label>
        ))}
      </div>
      <p className="text-sm text-primary/60">Time zone: Africa/Lagos</p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={
            busy ||
            !values.name.trim() ||
            !values.city.trim() ||
            !values.address.trim()
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy
            ? "Saving..."
            : initial
              ? "Save partner hub"
              : "Create partner hub"}
        </button>
        {onCancel && (
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-lg border border-primary/20 px-4 py-2 text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
