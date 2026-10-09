// Placeholders shown by loading.tsx files while route data streams in.
// Shapes mirror ProductCard and ProductDetail so the layout doesn't jump.

export function SkeletonBar({ className }: { className: string }) {
  return <div className={`animate-pulse bg-foreground/10 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-square w-full animate-pulse bg-surface" />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <SkeletonBar className="h-4 w-2/3" />
        <SkeletonBar className="h-4 w-10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count,
  className,
}: {
  count: number;
  className: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-x-8 gap-y-12 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
      <div className="aspect-square w-full animate-pulse bg-surface" />
      <div className="flex flex-col gap-6">
        <div>
          <SkeletonBar className="h-6 w-3/4" />
          <SkeletonBar className="mt-3 h-4 w-16" />
        </div>
        <div className="flex flex-col gap-2">
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonBar key={i} className="h-9 w-14" />
          ))}
        </div>
        <SkeletonBar className="h-11 w-full" />
      </div>
    </div>
  );
}
