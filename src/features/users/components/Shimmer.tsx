function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-primary/10 ${className}`}
    />
  );
}

export default Shimmer;