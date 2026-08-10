import Shimmer from "../../features/users/components/Shimmer";

function SkeletonTableCard({ rowCount = 4 }: { rowCount?: number }) {
  return (
    <section className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.28)]">
      <Shimmer className="h-4 w-40" />
      <Shimmer className="mt-2 h-3 w-64" />
      <div className="mt-4 overflow-hidden rounded-2xl border border-primary/10">
        <div className="grid grid-cols-4 gap-4 bg-primary/5 px-4 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-2.5 w-16" />
          ))}
        </div>
        {Array.from({ length: rowCount }).map((_, r) => (
          <div
            key={r}
            className="grid grid-cols-4 gap-4 border-t border-primary/10 px-4 py-3"
          >
            {Array.from({ length: 4 }).map((_, c) => (
              <Shimmer key={c} className="h-3 w-full max-w-24" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkeletonTableCard;