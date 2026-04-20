import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BASE_URL = "https://findonrent.com";

/* ============================
   STATIC PAGES SCAN ONLY
============================ */
function scanStaticRoutes(dir, basePath = "", urlSet = new Set()) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  const EXCLUDED_DIRS = [
    "api",
    "adminrohpnl",
    "dashboard",
    "forgot-password",
    "add-item-new",
    "auth",
    "testalert",
    "vendor-old",
    "login",
    "add-item",
    "become-a-host",
  ];

  const EXCLUDED_PATHS = [
    "/services/vehicles/bikes",
    "/services/vehicles/car-with-driver",
    "/services/vehicles/cars",
    "/services/vehicles/commercial-vehicles",
    "/services/vehicles/recreational-vehicles",
    "/services/vehicles/scooters",
    "/services/vehicles/luxury-vehicles",
    "/agents/register-vendors",
  ];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const routePath = path.join(basePath, item.name);
    const normalizedPath = ("/" + routePath).replace(/\\/g, "/");

    /** exclude by directory name */
    if (
      item.isDirectory() &&
      (item.name.startsWith("[") || EXCLUDED_DIRS.includes(item.name))
    ) {
      continue;
    }

    /** exclude by full path */
    if (
      item.isDirectory() &&
      EXCLUDED_PATHS.some((p) => normalizedPath.startsWith(p))
    ) {
      continue;
    }

    if (item.isDirectory()) {
      scanStaticRoutes(fullPath, routePath, urlSet);
    }

    if (item.isFile() && item.name.startsWith("page.")) {
      let url = "/" + basePath.replace(/\\/g, "/");
      url = url.replace(/\/page\..+$/, "");
      url = url.replace(/\/index$/, "");

      /** home page safety */
      if (url === "") url = "/";

      urlSet.add(url); /** dedupe automatically */
    }
  }

  return [...urlSet];
}

/* ============================
   SITEMAP RESPONSE (PAGES ONLY)
============================ */
export async function GET() {
  const appDir = path.join(process.cwd(), "src/app");

  const pages = scanStaticRoutes(appDir);

  const pagesXml = pages.map(
    (u) => `
    <url>
      <loc>${BASE_URL}${u}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesXml.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
