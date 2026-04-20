import { Suspense } from "react";
import ProductsPageClient from "./ProductsPageClient";

export const metadata = { title: "ROH Products" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading Products...</div>}>
      <ProductsPageClient />
    </Suspense>
  );
}
