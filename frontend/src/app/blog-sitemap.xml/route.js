import { NextResponse } from "next/server";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export async function GET() {
  const baseUrl = "https://findonrent.com";

  let slugs = [];

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/getallactiveblogslugs`,
      { cache: "no-store" }
    );
    const json = await res.json();
    slugs = json.slugs || [];
  } catch (e) {
    console.error(e);
  }

  const urls = slugs
    .map(
      (slug) => `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}
