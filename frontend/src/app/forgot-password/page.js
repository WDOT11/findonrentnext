import ForgotPasswordClient from "./ForgotPasswordClient";
import { getSeoMeta } from "../../lib/getSeoMeta";
import Seo from "../../components/seo/Seo";

export default async function ForgotPasswordPage() {
  const seo = await getSeoMeta("/forgot-password/");

  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/forgot-password/" />

      {/* Schema injection – SERVER ONLY */}
      {seo?.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: seo.meta_schema,
          }}
        />
      )}

      <ForgotPasswordClient />
    </>
  );
}
