    
import SkeletonSectionCard from "../../../lib/components/SkeletonSectionCard";
import SkeletonTableCard from "../../../lib/components/SkeletonTableCard";
import Shimmer from "../../users/components/Shimmer";

 function ShopDetailsSkeleton() {
  return (
    <section className="space-y-5">
      {/* Back link */}
      <Shimmer className="h-4 w-32" />

      {/* Header */}
      <div className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.45)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Shimmer className="h-7 w-48" />
              <Shimmer className="h-5 w-16 rounded-full" />
              <Shimmer className="h-5 w-20 rounded-full" />
            </div>
            <Shimmer className="mt-3 h-3 w-40" />
            <Shimmer className="mt-2 h-3 w-full max-w-lg" />
            <Shimmer className="mt-1 h-3 w-2/3 max-w-md" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-primary/10 bg-primary/5 p-4"
              >
                <Shimmer className="h-2.5 w-16" />
                <Shimmer className="mt-3 h-6 w-24" />
                <Shimmer className="mt-2 h-2.5 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Control Panel skeleton — dark, matches real panel's chrome */}
      <section className="overflow-hidden rounded-3xl border border-primary-dark/40 bg-[linear-gradient(150deg,#003625_0%,#0a4e39_60%,#0b3f2f_100%)] shadow-[0_20px_50px_-24px_rgba(0,54,37,0.55)]">
        <div className="flex items-center gap-2.5 border-b border-white/10 bg-black/10 px-4 py-3 sm:px-5">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/15" />
          <div>
            <div className="h-3.5 w-28 animate-pulse rounded bg-white/25" />
            <div className="mt-2 h-2.5 w-56 animate-pulse rounded bg-white/15" />
          </div>
        </div>
        <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, g) => (
            <div key={g}>
              <div className="h-2.5 w-24 animate-pulse rounded bg-white/25" />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-20 animate-pulse rounded-xl bg-white/10"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payout stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-primary/10 bg-primary/5 p-4"
          >
            <Shimmer className="h-2.5 w-20" />
            <Shimmer className="mt-3 h-6 w-24" />
            <Shimmer className="mt-2 h-2.5 w-28" />
          </div>
        ))}
      </div>

      {/* Overview + Owner */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SkeletonSectionCard rows={6} columns="sm:grid-cols-2 xl:grid-cols-3" />
        <section className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.28)]">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="mt-2 h-3 w-52" />
          <div className="mt-4 flex items-center gap-3">
            <Shimmer className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3.5 w-32" />
              <Shimmer className="h-3 w-40" />
            </div>
          </div>
        </section>
      </div>

      {/* Revenue history */}
      <SkeletonTableCard rowCount={5} />

      {/* Compliance + Bank details */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SkeletonSectionCard rows={4} columns="sm:grid-cols-2" />
        <SkeletonSectionCard rows={4} columns="grid-cols-1" />
      </div>

      {/* Orders + Top products */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SkeletonSectionCard rows={3} columns="sm:grid-cols-2 xl:grid-cols-3" />
        <SkeletonTableCard rowCount={3} />
      </div>
    </section>
  );
}

export default ShopDetailsSkeleton;