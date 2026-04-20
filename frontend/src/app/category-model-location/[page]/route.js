import { NextResponse } from "next/server";

const BASE_URL = "https://findonrent.com";
const CHUNK_SIZE = 1000;

export async function GET(req, { params }) {
  const resolvedParams = await params;
  const page = Number(resolvedParams.page || 1);

  const offset = (page - 1) * CHUNK_SIZE;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL}/get-all-category-model-location-slugs`,
    { cache: "no-store" }
  );

  const json = await res.json();
  const data = json.data || [];

  const chunk = data.slice(offset, offset + CHUNK_SIZE);

  if (!chunk.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const urls = chunk
    .map(
      (item) => `
    <url>
      <loc>${BASE_URL}/${item.category_slug}/${item.model_slug}/${item.city_slug}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
