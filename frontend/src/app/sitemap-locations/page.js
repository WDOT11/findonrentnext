import { Suspense } from "react";
import SitemapLocationsClient from "./LocationSitemapClient";
import { headers } from "next/headers";
export const dynamic = 'force-dynamic'

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

/* ===========================
   SERVER FETCH FUNCTION
=========================== */
async function getLocations() {

  const headerList = headers();

  let ip = null;

  const forwarded = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");

  if (forwarded) {
    ip = forwarded.split(",")[0].trim();
  } else if (realIp) {
    ip = realIp;
  }

  let locations = [];
  let categories = [];

  /* ===========================
     FETCH CATEGORIES FIRST
  =========================== */
  try {
    const resp = await fetch(
      `${API_BASE_URL}/getallactivechildcategory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "x-forwarded-for": ip
        },
        body: JSON.stringify({ parent_category_id: 1 }),
        cache: "no-store",
      }
    );

    const data = await resp.json();
    categories = Array.isArray(data) ? data : data?.data || [];
  } catch (err) {
    console.error("Category fetch error:", err);
    return [];
  }

  /* ===========================
     CREATE CATEGORY MAP
  =========================== */
  const categoryMap = {};
  categories.forEach((cat) => {
    categoryMap[cat.id] = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    };
  });

  /* ===========================
     FETCH ALL LOCATION SLUGS
  =========================== */
  try {
    // const res = await fetch(
    //   `${ROH_PUBLIC_API_BASE_URL}/get-all-slugs`,
    //   { cache: "no-store" }
    // );
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/get-all-slugs`,
      {
        // headers: {
        //   "x-forwarded-for": ip
        // },
        cache: "no-store"
      }
    );

    const json = await res.json();

    if (!json.success) return [];

    locations = (json.data || []).filter(
      (item) => item.type === "location" && item.slug
    );
  } catch (err) {
    console.error("Location fetch error:", err);
    return [];
  }

  /* ===========================
     FETCH MODELS + GROUP BY CATEGORY
  =========================== */
  let allModelsData = [];
  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/getAllModelsForSitemap`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (res.ok) {
      const json = await res.json();
      allModelsData = json.models || [];
    }
  } catch (err) {
    console.error("Failed to fetch batched models for locations sitemap", err);
  }

  const locationsWithGroupedModels = locations.map((loc) => {
    // Filter models belonging to this specific location
    const modelsForLoc = allModelsData.filter(m => m.location_slug === loc.slug);

    /* GROUP MODELS BY CATEGORY */
    const grouped = {};
    modelsForLoc.forEach((model) => {
      const catId = model.sub_cat_id;
      if (!categoryMap[catId]) return;

      if (!grouped[catId]) {
        grouped[catId] = {
          category_id: catId,
          category_name: categoryMap[catId].name,
          category_slug: categoryMap[catId].slug,
          models: [],
        };
      }
      // Group them 
      grouped[catId].models.push(model);
    });

    return {
      ...loc,
      categories: Object.values(grouped),
    };
  });

  return locationsWithGroupedModels;
}

/* ===========================
   PAGE COMPONENT
=========================== */
export default async function SitemapLocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <title>All Locations | Find on Rent</title>
      <meta
        name="description"
        content="Explore rental services available across cities on Find on Rent."
      />
      <meta name="robots" content="index, follow" />
      <link
        rel="canonical"
        href={`${WEB_BASE_DOMAIN_URL}/sitemap-locations`}
      />

      <Suspense fallback={<div>Loading locations...</div>}>
        <SitemapLocationsClient locations={locations} />
      </Suspense>
    </>
  );
}