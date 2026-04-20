import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import path from "path";
import fs from "fs/promises";

import VehicleList from "../../../components/categoryModelComponents/VehiclesList";

// import VendorsList from "../../../components/categoryModelComponents/VendorsList";
// import RentEarn from "../../../components/categoryModelComponents/rentEarn";

const VendorsList = dynamic(() => import("../../../components/categoryModelComponents/VendorsList"));
const RentEarn = dynamic(() => import("../../../components/categoryModelComponents/rentEarn"));

// import AboutUs from "../../../components/categoryModelComponents/aboutUs";
// import FAQSection from "../../../components/categoryModelComponents/faqSection";
// import ReadyToRide from "../../../components/categoryModelComponents/readyToRide";
// import WhyChooseUs from "../../../components/categoryModelComponents/whyChooseUs";
// import LatestArtical from "../../../components/categoryModelComponents/latestArticle";
// import NeedHelp from "../../../components/categoryModelComponents/needHelp";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default async function CategoryModelPage({
  categorySlug,
  categorySinName,
  categoryId,
  modelId,
  modelName,
  modelSlug,
  modelLabel,
  modelImageURL,
  categoryName,
  searchParams
}) {

  const params = await Promise.resolve(searchParams);
  const cookieStore = await cookies();

  const page = Number(params.page) || 1;
  const search_by = params.search_by || "";
  const brand = params.brand || "";
  const tag = params.tag_slug || "";

  let userCity = "";
  try {
    const raw = cookieStore.get("user_location")?.value;
    if (raw) {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (parsed?.city) userCity = parsed.city;
    }
  } catch {}

  /* FETCH ALL CATEGORIES */
  const categoryRes = await fetch(`${API_BASE_URL}/getallactivecategory`, {
    cache: "no-store",
  });

  if (!categoryRes.ok) notFound();

  const categories = await categoryRes.json();

  const categoriesWithChildren = await Promise.all(
    (Array.isArray(categories) ? categories : []).map(async (parent) => {
      try {
        const resp = await fetch(
          `${API_BASE_URL}/getallactivechildcategory`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent_category_id: parent.id }),
            cache: "no-store",
          }
        );
        const children = resp.ok ? await resp.json() : [];
        return { ...parent, children: Array.isArray(children) ? children : [] };
      } catch {
        return { ...parent, children: [] };
      }
    })
  );

  /* FETCH PRODUCTS BY MODEL */
  const productsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getallvehiclesByCategoryModel`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        cat_id: categoryId,
        model_id: modelId,
        page,
        limit: 28,
        search_by,
        brand,
        tag_slug: tag,
        user_city: userCity,
      }),
    }
  );

  const productsData = await productsRes.json();

  /** To get the business ids from the products */
  const products = Array.isArray(productsData?.products) ? productsData.products : [];
  const businessIds = [
    ...new Set(
      products
        .map(item => item?.business_id)
        .filter(Boolean)
    )
  ];

  /* FETCH BRANDS */
  const brandsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrandscatpg`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: categoryId }),
      cache: "no-store",
    }
  );

  const brandsData = await brandsRes.json();

   /* ===========================
    Read JSON from Backend
    =========================== */
    let categoryLocations = [];

    try {
    const res = await fetch(
      `${process.env.BACKEND_JSON_DIR_PATH}category-model-location.json`
    );

    if (!res.ok) throw new Error("Failed to fetch JSON");

    const jsonData = await res.json();

      categoryLocations = jsonData || [];

    } catch (err) {
      console.error("Footer JSON read error:", err.message);
    }

    /* ===========================
    Find category
    =========================== */
    const categoryData = categoryLocations.find(
      (cat) => cat.category_slug === categorySlug
    );

    /* ===========================
    Find model inside category
    =========================== */
    const modelData = categoryData?.models?.find(
      (model) => model.model_slug === modelSlug
    );

    /* ===========================
    Get locations
    =========================== */
    const popularCities = modelData?.locations || [];

  /* RENDER */
  return (
    <>
      <meta name="robots" content="index, follow" />

      <VehicleList
        initialProducts={productsData.products || []}
        total={productsData.total || 0}
        categories={categoriesWithChildren}
        categorySlug={categorySlug}
        categorySinName={categorySinName}
        categoryName={categoryName}
        modelSlug={modelSlug}
        modelName={modelName}
        modelLabel={modelLabel}
        brands={brandsData}
        cate_id={categoryId}
        userCity={userCity}
        popularCities={popularCities}
      />

      <VendorsList businessIds={businessIds} cate_id={categoryId} categorySinName={categorySinName} model_id={modelId} />

      {/* <WhyChooseUs cate_id={categoryId} /> */}
      {/* <FAQSection cate_id={categoryId} model_id={modelId} /> */}

      {/* <AboutUs cate_id={categoryId} cat_nm={categoryName} model_nm={modelName} /> */}

      {/* <ReadyToRide cate_id={categoryId} /> */}
      {/* <LatestArtical cate_id={categoryId} model_id={modelId} /> */}
      {/* <NeedHelp /> */}
      <RentEarn cate_id={categoryId} modelName={modelName} modelLabel={modelLabel} modelImageURL={modelImageURL}/>

    </>
  );
}