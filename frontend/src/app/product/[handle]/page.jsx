import { medusa } from "@/lib/medusa";
import ProductView from "./ProductView";

export async function generateMetadata({ params }) {
  const { handle } = await params;

  try {
    const { products } = await medusa.store.product.list({
      handle: handle,
      limit: 1,
    });

    if (!products || products.length === 0) {
      return { title: "Товар не найден" };
    }

    const product = products[0];

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch (error) {
    return { title: "Loom Store" };
  }
}

export default async function ProductPage({ params }) {
  const { handle } = await params;

  return <ProductView handle={handle} />;
}