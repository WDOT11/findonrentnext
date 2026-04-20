import ContactUsClient from "./ContactUsClient";
import { getSeoMeta } from "../../lib/getSeoMeta";

export async function generateMetadata() {
  const meta = await getSeoMeta("/contact-us/");
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

export default async function ContactUsPage() {
  const metaSchema = await getSeoMeta("/contact-us/");
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

      {/* Client form automatically runs in client boundary */}
      <ContactUsClient />
    </>
  );
}
