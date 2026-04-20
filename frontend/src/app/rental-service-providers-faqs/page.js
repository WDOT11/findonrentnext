import { Suspense } from "react";
import  ProviderFaqsClientClient from "./ProviderFaqsClient";
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";

export default async function ProviderFaqsPage() {
  const metaSchema = await getSeoMeta("/rental-service-providers-faqs/");
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/rental-service-providers-faqs/" />
      
      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading provider faqs...</div>}>
        <ProviderFaqsClientClient />
      </Suspense>
    </>
  );
}