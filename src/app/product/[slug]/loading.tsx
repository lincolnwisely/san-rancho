import { ProductDetailSkeleton } from "@/components/Skeletons";
import { BackLink } from "@/components/BackLink";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-8 pb-16">
      <BackLink />
      <ProductDetailSkeleton />
    </main>
  );
}
