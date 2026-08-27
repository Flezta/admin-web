import Shimmer from "../../users/components/Shimmer";

function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-primary/10 bg-white"
        >
          <Shimmer className="aspect-4/3 w-full rounded-none" />
          <div className="space-y-2 p-3.5">
            <Shimmer className="h-3.5 w-4/5" />
            <Shimmer className="h-2.5 w-1/2" />
            <Shimmer className="h-2.5 w-2/3" />
            <div className="flex justify-between border-t border-primary/10 pt-3">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductsGridSkeleton;
