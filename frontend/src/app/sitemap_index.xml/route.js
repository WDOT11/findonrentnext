import { NextResponse } from "next/server";

const BASE_URL = "https://findonrent.com";
const CHUNK_SIZE = 1000;

export async function GET() {
  /* -------- category + model + location (existing) -------- */
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL}/get-all-category-model-location-slugs`,
    { cache: "no-store" }
  );

  const json = await res.json();
  const total = (json.data || []).length;
  const totalPages = Math.ceil(total / CHUNK_SIZE);

  /* -------- category + model (NEW – without location) -------- */
  const modelRes = await fetch(
    `${process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL}/getcatmodel-slug`,
    { cache: "no-store" }
  );

  const modelJson = await modelRes.json();
  const modelTotal = (modelJson.models || []).length;
  const modelTotalPages = Math.ceil(modelTotal / CHUNK_SIZE);

  /* -------- common lastmod -------- */
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const lastmod = now.toISOString();

  /* -------- existing category-model-location sitemaps -------- */
  const categoryModelLocationSitemaps = Array.from(
    { length: totalPages },
    (_, i) => `
      <sitemap>
        <loc>${BASE_URL}/category-model-location-${i + 1}.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
    `
  ).join("");

  /* -------- NEW category-model sitemaps -------- */
  const categoryModelSitemaps = Array.from(
    { length: modelTotalPages },
    (_, i) => `
      <sitemap>
        <loc>${BASE_URL}/category-model-${i + 1}.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
    `
  ).join("");

  /* -------- final XML -------- */
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${BASE_URL}/pages-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/blog-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/cities-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/categories-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/category-city-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/service-providers-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  ${categoryModelSitemaps}

  ${categoryModelLocationSitemaps}

</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
