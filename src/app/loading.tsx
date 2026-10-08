import { ProductGridSkeleton, SkeletonBar } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <div className="flex flex-col gap-16">
        {Array.from({ length: 3 }, (_, i) => (
          <section key={i}>
            <div className="mb-6 flex items-baseline justify-between">
              <SkeletonBar className="h-4 w-24" />
              <SkeletonBar className="h-3 w-16" />
            </div>
            <ProductGridSkeleton count={4} className="lg:grid-cols-4" />
          </section>
        ))}
      </div>
    </main>
  );
}
