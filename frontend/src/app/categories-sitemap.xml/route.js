import { NextResponse } from "next/server";

const ROH_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const BASE_URL = "https://findonrent.com";

/* ============================
   CATEGORY ONLY ROUTES
============================ */
async function getCategoryUrls() {
  const urlSet = new Set();

  const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/get-all-slugs`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) return [];

  const slugs = json.data || [];

  /** ONLY categories */
  slugs
    .filter((s) => s.type === "category" && s.slug)
    .forEach((cat) => {
      urlSet.add(`${BASE_URL}/${cat.slug}`);
    });

  return [...urlSet];
}

/* ============================
   SITEMAP RESPONSE
============================ */
export async function GET() {
  const categoryPages = await getCategoryUrls();

  const categoryXml = categoryPages.map(
    (u) => `
    <url>
      <loc>${u}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryXml.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
