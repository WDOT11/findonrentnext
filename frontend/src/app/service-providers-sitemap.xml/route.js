import { NextResponse } from "next/server";

const ROH_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const BASE_URL = "https://findonrent.com";

/* ============================
   VENDOR ROUTES ONLY
============================ */
async function getVendorUrls() {
  const urlSet = new Set();

  const res = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/get-all-vendor-slugs`,
    { cache: "no-store" }
  );

  const json = await res.json();
  if (!json.success) return [];

  const vendors = json.data || [];

  vendors.forEach((v) => {
    if (v.business_slug) {
      urlSet.add(
        `${BASE_URL}/rental-service-provider/${v.business_slug}`
      );
    }
  });

  return [...urlSet];
}

/* ============================
   SITEMAP RESPONSE (VENDORS ONLY)
============================ */
export async function GET() {
  const vendorPages = await getVendorUrls();

  const vendorXml = vendorPages.map(
    (u) => `
    <url>
      <loc>${u}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${vendorXml.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
