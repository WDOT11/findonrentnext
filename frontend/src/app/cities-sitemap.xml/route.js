import { NextResponse } from "next/server";

const ROH_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const BASE_URL = "https://findonrent.com";

/* ============================
   LOCATION ONLY SITEMAP
============================ */
async function getLocationUrls() {
  const urlSet = new Set();

  const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/get-all-slugs`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) return [];

  const slugs = json.data || [];

  // ONLY location type
  slugs
    .filter((s) => s.type === "location" && s.slug)
    .forEach((loc) => {
      urlSet.add(`${BASE_URL}/${loc.slug}`);
    });

  return [...urlSet];
}

/* ============================
   SITEMAP RESPONSE
============================ */
export async function GET() {
  const locationPages = await getLocationUrls();

  const locationXml = locationPages.map(
    (u) => `
    <url>
      <loc>${u}</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locationXml.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
