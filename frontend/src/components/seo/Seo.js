import { getSeoMeta } from "../../lib/getSeoMeta";

export default async function Seo({ slug }) {
  const meta = await getSeoMeta(slug);

  return (
    <>
      {/* This works because App Router supports this JSX head injection */}
      <meta name="robots" content={meta.noindex ? "noindex, nofollow" : "index, follow"} />
      <title>{meta.page_title}</title>
      <meta name="description" content={meta.meta_description} />
      <meta name="keywords" content={meta.meta_keywords} />
      <link rel="canonical" href={meta.canonical_url} />
      <meta property="og:title" content={meta.og_title} />
      <meta property="og:description" content={meta.meta_description} />
      <meta property="og:image" content={meta.og_image} />
      <meta property="og:url" content={meta.canonical_url} />
    </>
  );
}
