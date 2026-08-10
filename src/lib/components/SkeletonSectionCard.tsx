import Shimmer from "../../features/users/components/Shimmer";

function SkeletonSectionCard({
  rows = 3,
  columns = "sm:grid-cols-2 xl:grid-cols-3",
}: {
  rows?: number;
  columns?: string;
}) {
  return (
    <section className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.28)]">
      <Shimmer className="h-4 w-40" />
      <Shimmer className="mt-2 h-3 w-64" />
      <div className={`mt-4 grid gap-3 ${columns}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-primary/10 bg-white px-3 py-2"
          >
            <Shimmer className="h-2.5 w-20" />
            <Shimmer className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkeletonSectionCard;