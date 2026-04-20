import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import VehicleList from "../../../components/categoryLocationComponents/VehiclesList";
// import VendorsList from "../../../components/categoryLocationComponents/VendorsList";
// import FAQSection from "../../../components/categoryLocationComponents/faqSection";
// import LatestArtical from "../../../components/categoryLocationComponents/latestArticle";
// import RentEarn from "../../../components/categoryLocationComponents/rentEarn";

const VendorsList = dynamic(() => import("../../../components/categoryLocationComponents/VendorsList"));
const FAQSection = dynamic(() => import("../../../components/categoryLocationComponents/faqSection"));
const LatestArtical = dynamic(() => import("../../../components/categoryLocationComponents/latestArticle"));
const RentEarn = dynamic(() => import("../../../components/categoryLocationComponents/rentEarn"));


// import fs from "fs/promises";
// import path from "path";

// import AboutUs from "../../../components/categoryLocationComponents/aboutUs";
// import ReadyToRide from "../../../components/categoryLocationComponents/readyToRide";
// import WhyChooseUs from "../../../components/categoryLocationComponents/whyChooseUs";
// import NeedHelp from "../../../components/categoryLocationComponents/needHelp";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default async function CategoryLocationPage({categorySlug, categorySinName, categoryId, locationId, categoryName, cityName, locSlug, searchParams}) {

  const params = await Promise.resolve(searchParams);

  const page = Number(params.page) || 1;
  const search_by = params.search_by || "";
  const brand = params.brand || "";
  const tag = params.tag_slug || "";

  /* IMPORTANT: USE FULL SLUG */
  const location_slug = locSlug; // udaipur-rajasthan

  /* ===============================
    FETCH ALL CATEGORIES
  =============================== */
  const categoryRes = await fetch(`${API_BASE_URL}/getallactivecategory`, {
    cache: "no-store",
  });

  if (!categoryRes.ok) {
    notFound();
  }

  const categories = await categoryRes.json();

  const categoriesWithChildren = await Promise.all(
    (Array.isArray(categories) ? categories : []).map(async (parent) => {
      try {
        const resp = await fetch(
          `${API_BASE_URL}/getallactivechildcategory`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parent_category_id: parent.id,
            }),
            cache: "no-store",
          }
        );

        const children = resp.ok ? await resp.json() : [];

        return {
          ...parent,
          children: Array.isArray(children) ? children : [],
        };
      } catch {
        return { ...parent, children: [] };
      }
    })
  );

  /* ===============================
     FETCH PRODUCTS (MAIN FIX)
  =============================== */
  const productsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getallvehiclesByCategoryLocation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        cat_id: categoryId,
        location_slug,
        page,
        limit: 28,
        search_by,
        brand,
        tag_slug: tag,
      }),
    }
  );

  const productsData = await productsRes.json();

  /* ===============================
     FETCH BRANDS
  =============================== */
  const brandsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: categoryId }),
      cache: "no-store",
    }
  );

  const brandsData = await brandsRes.json();

  /* -------- Fetch popular models -------- */
  // const popularModelsRes = await fetch(
  //   `${ROH_PUBLIC_API_BASE_URL}/getModelsByCategoryAndLocation`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       cat_id: categoryId,
  //       location_slug: location_slug
  //     }),
  //     next: { revalidate: 3600 },
  //   }
  // );

  // // 1. Check if the request was successful
  // if (!popularModelsRes.ok) {
  //    console.error("Failed to fetch models");
  //    // handle error state here
  // }

  // // 2. Parse the JSON
  // const popularModelsData = await popularModelsRes.json();
  // const popularModels = popularModelsData.models || [];

  /* ===========================
  Read JSON from Backend
  =========================== */
  let popularModels = [];

  try {
    const res = await fetch(
      `${process.env.BACKEND_JSON_DIR_PATH}location/data-roh-${locSlug}.json`
    );

    if (!res.ok) throw new Error("Failed to fetch JSON");

    const jsonData = await res.json();

    const categoryLocations = jsonData?.data || [];

    // Find the matching category
    const categoryData = categoryLocations.find(
      (cat) => cat.category_slug === categorySlug
    );

    // Extract models (adjust key based on your JSON structure)
    popularModels = categoryData?.models || [];

  } catch (err) {
    console.error("Popular models not found:", err.message);
  }

  /* ===============================
    FETCH FAQ JSON
  =============================== */

  const res = await fetch(
    `${process.env.BACKEND_JSON_DIR_PATH}faq/catloc-data.json`
  );

  const faqJson = await res.json();

  const faqRecord = faqJson.find(
    item => item.cat_id === categoryId && item.loc_id === locationId
  );

  /* ===============================
    BUILD FAQ SCHEMA
  =============================== */

  let faqSchema = null;

  if (faqRecord) {

    const category = faqRecord.category;
    const city = faqRecord.city;

    const vendors = faqRecord.vendors || [];

    /* MODEL PRICE LINES (same UI logic) */
    const priceLines = (faqRecord.model_price_ranges || [])
      .sort((a, b) => {
        const getMin = (str) => {
          const match = str.price_range.match(/\d+/);
          return match ? Number(match[0]) : 0;
        };
        return getMin(a) - getMin(b);
      })
      .map(p => `${p.model}: ${p.price_range}`)
      .join(" ");

    /* CATEGORY PRICE FALLBACK */
    let priceInfo = "";

    if (priceLines) {
      priceInfo = priceLines;
    } else if (faqRecord.price_range) {
      priceInfo = `${category}: ${faqRecord.price_range}`;
    } else {
      priceInfo = "Please contact the rental service provider for prices.";
    }

    /* VENDOR TEXT */
    const providerNames = vendors.map(v => v.name).join(", ");

    const faqs = [

      {
        q: `What is the average ${category} rental price in ${city}?`,
        a: `The average ${category} rental price in ${city} depends on factors such as vehicle type, rental duration and rental providers policies. ${priceInfo}`
      },

      {
        q: `What are the popular ${category} available for rent in ${city}?`,
        a: `Some popular ${category} available for rent in ${city} include ${ (faqRecord.popular_models || []).map(m => m.name).join(", ") }.`
      },

      {
        q: `What documents are required for ${category} rental in ${city}?`,
        a: `In most cases, renting ${category} requires a valid ID proof and a driving licence. However, exact document requirements may vary depending on the rental service provider and vehicle type.`
      },

      {
        q: `Who are the popular ${category} rental providers in ${city}?`,
        a: providerNames
          ? `Some popular rental service providers offering ${category} in ${city} include ${providerNames}.`
          : `There are multiple rental service providers offering ${category} rentals in ${city}.`
      },

      {
        q: `Is advance booking available for ${category} rental in ${city}?`,
        a: `Yes, many rental service providers allow advance booking for ${category} rentals in ${city}. Availability and booking policies may vary depending on provider and vehicle type.`
      }

    ];

    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };

  }

  /* ===============================
    BUILD LOCAL BUSINESS SCHEMA
  =============================== */

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": `${categoryName} Rental in ${cityName}`,
    "url": `https://www.findonrent.com/${categorySlug}/${locSlug}`,
    "description": `Find and compare ${categoryName} rental options in ${cityName}. Browse available vehicle models, daily rental prices and verified rental service providers. Book the best ${categoryName} on rent in ${cityName} easily with FindOnRent.`,
    "areaServed": {
      "@type": "City",
      "name": cityName
    },

    "brand": {
      "@type": "Brand",
      "name": "FindOnRent"
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <>
      <meta name="robots" content="index, follow" />

      {/* FAQ SCHEMA */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}

      {/* LOCAL SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localSchema)
        }}
      />

      <VehicleList
        initialProducts={productsData.products || []}
        total={productsData.total || 0}
        categories={categoriesWithChildren}
        categorySlug={categorySlug}
        categorySinName={categorySinName}
        categoryName={categoryName}
        locSlug={locSlug}
        brands={brandsData}
        cate_id={categoryId}
        loc_nm={cityName}
        popularModels={popularModels}
      />

      <VendorsList loc_slug={locSlug} cate_id={categoryId} categorySinName={categorySinName}/>

      {/* <WhyChooseUs cate_id={categoryId} /> */}
      <FAQSection faqData={faqRecord} cate_id={categoryId} loc_id={locationId} />
      {/* <AboutUs cate_id={categoryId} cat_nm={categoryName} loc_nm={cityName} /> */}
      {/* <ReadyToRide cate_id={categoryId} /> */}
      <LatestArtical cate_id={categoryId} loc_id={locationId} />
      {/* <NeedHelp /> */}
      {/* Rent and Earn */}
      <RentEarn cate_id={categoryId} cat_nm={categoryName} loc_nm={cityName} />
    </>
  );
}
