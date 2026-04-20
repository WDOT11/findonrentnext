import { Suspense } from "react";
import  TermsAndConditionsClient from "./TermsAndConditionsClient";
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";

export default async function TermsAndConditionsPage() {
  const metaSchema = await getSeoMeta("/terms-and-conditions/");
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/terms-and-conditions/" />

      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading Terms and Conditions ...</div>}>
        <TermsAndConditionsClient />
      </Suspense>
    </>
  );
}