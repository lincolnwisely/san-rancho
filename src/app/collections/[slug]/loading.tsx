import { ProductGridSkeleton, SkeletonBar } from "@/components/Skeletons";
import { BackLink } from "@/components/BackLink";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-8 pb-16">
      <BackLink />
      <SkeletonBar className="mt-8 mb-12 h-4 w-32" />
      <ProductGridSkeleton count={6} className="lg:grid-cols-3" />
    </main>
  );
}
