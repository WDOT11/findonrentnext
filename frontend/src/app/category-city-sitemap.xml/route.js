import { NextResponse } from "next/server";

const ROH_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const BASE_URL = "https://findonrent.com";

/* ============================
   CATEGORY + CITY ROUTES ONLY
============================ */
async function getCategoryCityUrls() {
  const urlSet = new Set();

  const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/get-all-slugs`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) return [];

  const slugs = json.data || [];

  const categories = slugs.filter(
    (s) => s.type === "category" && s.slug
  );
  const locations = slugs.filter(
    (s) => s.type === "location" && s.slug
  );

  /** ONLY /category/location */
  categories.forEach((cat) => {
    locations.forEach((loc) => {
      urlSet.add(`${BASE_URL}/${cat.slug}/${loc.slug}`);
    });
  });

  return [...urlSet];
}

/* ============================
   SITEMAP RESPONSE
============================ */
export async function GET() {
  const categoryCityPages = await getCategoryCityUrls();

  const categoryCityXml = categoryCityPages.map(
    (u) => `
    <url>
      <loc>${u}</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryCityXml.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
