import { Suspense } from "react";
import HowitworksClient from "./HowitworksClient";
import { getSeoMeta } from "../../lib/getSeoMeta";

export async function generateMetadata() {
  const meta = await getSeoMeta("/how-it-works/");
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

export default async function HowItWorksPage() {
  const metaSchema = await getSeoMeta("/how-it-works/");
  return (
    <>
      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading how it works...</div>}>
        <HowitworksClient />
      </Suspense>
    </>
  );
}