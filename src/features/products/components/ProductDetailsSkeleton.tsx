import SkeletonSectionCard from "../../../lib/components/SkeletonSectionCard";
import Shimmer from "../../users/components/Shimmer";

function ProductDetailsSkeleton() {
  return (
    <section className="space-y-5">
      <Shimmer className="h-9 w-36" />

      <div className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(0,54,37,0.45)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Shimmer className="aspect-4/3 w-full" />
          <div className="space-y-3">
            <div className="flex gap-2">
              <Shimmer className="h-5 w-20 rounded-full" />
              <Shimmer className="h-5 w-16 rounded-full" />
            </div>
            <Shimmer className="h-7 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-5/6" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Shimmer className="h-20 w-full rounded-2xl" />
              <Shimmer className="h-20 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      <Shimmer className="h-40 w-full rounded-3xl" />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SkeletonSectionCard rows={6} columns="sm:grid-cols-2 xl:grid-cols-3" />
        <SkeletonSectionCard rows={4} columns="grid-cols-1" />
      </div>
    </section>
  );
}

export default ProductDetailsSkeleton;
