import ResetPasswordClient from "./ResetPasswordClient";
import { getSeoMeta } from "../../../lib/getSeoMeta";
import Seo from "../../../components/seo/Seo";

export default async function ResetPasswordPage() {
  const seo = await getSeoMeta("/reset-password/");

  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/reset-password/" />
      
      {/* Schema injection – SERVER ONLY */}
      {seo?.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: seo.meta_schema,
          }}
        />
      )}

      <ResetPasswordClient />
    </>
  );
}
