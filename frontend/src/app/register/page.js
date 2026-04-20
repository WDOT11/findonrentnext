import { Suspense } from "react";
import RegisterClient from "./RegisterClient";
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";
import { cookies } from "next/headers";

export default async function RegisterPage() {
    const metaSchema = await getSeoMeta("/register/");
    const cookieStore = await cookies();

    let region = null;
    const locationCookie = cookieStore.get("user_location");

    if (locationCookie?.value) {
      try {
        const parsed = JSON.parse(locationCookie.value);
        region = parsed?.region?.toLowerCase() || null;
      } catch {}
    }
  return (
    <>
        {/* Works in App Router, truly inside <head> */}
      <Seo slug="/register/" />

      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}
    
      <Suspense fallback={<div>Loading register...</div>}>
        <RegisterClient region={region} />
      </Suspense>
    </>
  );
}
