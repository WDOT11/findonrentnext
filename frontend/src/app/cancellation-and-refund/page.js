import { Suspense } from "react";
import  CancellationAndRefundClient from "./CancellationAndRefundClient";
import { getSeoMeta } from "../../lib/getSeoMeta";

export async function generateMetadata() {
  const meta = await getSeoMeta("/cancellation-and-refund/");
  return {
    title: meta.page_title,
    description: meta.meta_description,
    keywords: meta.meta_keywords,
    alternates: {
      canonical: meta.canonical_url,
    },
    openGraph: {
      title: meta.og_title,
      description: meta.meta_description,
      images: [{ url: meta.og_image }],
      url: meta.canonical_url,
    },
    robots: {
      index: !meta.noindex,
      follow: !meta.noindex,
    }
  };
}

export default async function CancellationAndRefundPage() {
  const metaSchema = await getSeoMeta("/cancellation-and-refund/");
  return (
    <>
      {/*Schema Injection */}
      {metaSchema?.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading Cancellation and Refund ...</div>}>
        <CancellationAndRefundClient />
      </Suspense>
    </>
  );
}