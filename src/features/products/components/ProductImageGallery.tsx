import { useMemo, useState } from "react";
import type { ProductImage } from "../../../types/product";
import {
  groupImagesByAxis,
  resolveImageAxisKey,
} from "../utils/product.helpers";

function attributeSummary(attributes?: Record<string, string>) {
  const entries = Object.entries(attributes ?? {});
  if (entries.length === 0) return null;
  return entries.map(([key, value]) => `${key}: ${value}`).join(" · ");
}

export default function ProductImageGallery({
  images,
}: {
  images: ProductImage[];
}) {
  const axisKey = useMemo(() => resolveImageAxisKey(images), [images]);
  const groups = useMemo(
    () => groupImagesByAxis(images, axisKey),
    [images, axisKey],
  );

  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [activeName, setActiveName] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="grid aspect-4/3 w-full place-items-center rounded-2xl border border-dashed border-primary/20 bg-primary/5 text-sm text-primary/50">
        No images uploaded yet
      </div>
    );
  }

  const visibleImages =
    activeGroup === "all"
      ? images
      : (groups.find((group) => group.value === activeGroup)?.images ?? images);

  const active =
    visibleImages.find((image) => image.name === activeName) ||
    visibleImages.find((image) => image.isDefault) ||
    visibleImages[0];

  const summary = attributeSummary(active.attributes);
  const untaggedCount = axisKey
    ? images.filter((image) => !image.attributes?.[axisKey]).length
    : 0;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5">
        <img
          src={active.sizes?.large || active.sizes?.medium}
          alt={active.name}
          className="aspect-4/3 w-full object-contain"
        />
        {active.isDefault ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            default
          </span>
        ) : null}
      </div>

      {groups.length > 1 ? (
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/55">
            {axisKey}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveGroup("all");
                setActiveName(null);
              }}
              className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                activeGroup === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-primary/15 bg-primary/5 text-primary/70 hover:border-primary/30"
              }`}
            >
              All ({images.length})
            </button>
            {groups.map((group) => (
              <button
                key={group.value}
                type="button"
                onClick={() => {
                  setActiveGroup(group.value);
                  setActiveName(null);
                }}
                className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  activeGroup === group.value
                    ? "border-primary bg-primary text-white"
                    : "border-primary/15 bg-primary/5 text-primary/70 hover:border-primary/30"
                }`}
              >
                {group.value} ({group.images.length})
              </button>
            ))}
          </div>
          {untaggedCount > 0 ? (
            <p className="text-[11px] text-amber-700">
              {untaggedCount} image(s) are not tagged with a {axisKey}.
            </p>
          ) : null}
        </div>
      ) : null}

      {summary ? (
        <p className="text-xs capitalize text-primary/60">{summary}</p>
      ) : null}

      {visibleImages.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {visibleImages.map((image) => (
            <button
              key={image.name}
              type="button"
              onClick={() => setActiveName(image.name)}
              aria-label={`View ${image.name}`}
              className={`cursor-pointer overflow-hidden rounded-xl border transition ${
                image.name === active.name
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-primary/10 hover:border-primary/30"
              }`}
            >
              <img
                src={image.sizes?.thumbnail}
                alt={image.name}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <a
        href={active.sizes?.large || active.sizes?.medium}
        target="_blank"
        rel="noreferrer"
        className="inline-flex text-xs font-semibold text-primary underline decoration-primary/35 underline-offset-4"
      >
        Open full-size image
      </a>
    </div>
  );
}
