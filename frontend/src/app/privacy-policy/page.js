import { Suspense } from "react";
import  PrivacyPolicyClient from "./PrivacyPolicyClient";
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";

export default async function PrivacyPolicyPage() {
    const metaSchema = await getSeoMeta("/privacy-policy/");
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/privacy-policy/" />

      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading Privacy Policy ...</div>}>
        <PrivacyPolicyClient />
      </Suspense>
    </>
  );
}