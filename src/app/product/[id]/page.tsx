import { notFound } from "next/navigation";
import { getProduct, getEnabledVariants } from "@/lib/printify";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();

  const variants = getEnabledVariants(product);

  return <ProductDetail product={product} variants={variants} />;
}
