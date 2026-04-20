import { Suspense } from "react";
import SitemapCategoryClient from "./CategorySitemapClient";
export const dynamic = 'force-dynamic'


const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_USER_URL;

/* ===========================
   SERVER FETCH FUNCTION
=========================== */
async function getCategories() {
  let categories = [];

  /* ===========================
     FETCH CATEGORIES
  =========================== */
  try {
    const resp = await fetch(
      `${API_BASE_URL}/getallactivechildcategory`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
     FETCH ALL MODELS IN A SINGLE BATCHED API CALL
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
    console.error("Failed to fetch batched models for sitemap", err);
  }

  /* ===========================
     GROUP MODELS BY CATEGORY IN-MEMORY
  =========================== */
  const categoriesWithModels = categories.map((category) => {
    const categoryModels = allModelsData.filter(m => m.sub_cat_id === category.id);
    
    // De-duplicate models that might be listed under multiple locations for the same category
    const uniqueModelsMap = {};
    categoryModels.forEach(m => {
        if (!uniqueModelsMap[m.model_slug]) {
            uniqueModelsMap[m.model_slug] = m;
        }
    });

    return {
      ...category,
      models: Object.values(uniqueModelsMap),
    };
  });

  return categoriesWithModels;
}

/* ===========================
   PAGE COMPONENT (SERVER)
=========================== */
export default async function SitemapCategoryPage() {
  const categories = await getCategories();

  return (
    <>
      <title>All Categories | Find on Rent</title>
      <meta
        name="description"
        content="Browse all rental categories available on Find on Rent."
      />
      <meta name="robots" content="index, follow" />
      <link
        rel="canonical"
        href="https://findonrent.com/sitemap-category"
      />

      <Suspense fallback={<div>Loading categories...</div>}>
        <SitemapCategoryClient categories={categories} />
      </Suspense>
    </>
  );
}