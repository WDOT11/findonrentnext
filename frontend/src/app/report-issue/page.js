import { Suspense } from "react";
import ReportIssueClient from "./ReportIssueClient";
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";

export default async function ReportIssuePage() {
  const metaSchema = await getSeoMeta("/report-issue/");
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/report-issue/" />

      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading Report Issue ...</div>}>
        <ReportIssueClient />
      </Suspense>
    </>
  );
}