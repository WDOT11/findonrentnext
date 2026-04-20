import dynamic from "next/dynamic";
// app/services/vehicles/cars/page.js

import AboutUs from "../../../components/locationComponents/aboutUs";
import VehicleList from "../../../components/locationComponents/VehiclesList";

// import VendorsList from "../../../components/locationComponents/VendorsList";
// import FAQSection from "../../../components/locationComponents/faqSection";
// import LatestArtical from "../../../components/locationComponents/latestArticle";
// import NeedHelp from "../../../components/locationComponents/needHelp";

const VendorsList = dynamic(() => import("../../../components/locationComponents/VendorsList"));
const FAQSection = dynamic(() => import("../../../components/locationComponents/faqSection"));
const LatestArtical = dynamic(() => import("../../../components/locationComponents/latestArticle"));
const NeedHelp = dynamic(() => import("../../../components/locationComponents/needHelp"));

// import ReadyToRide from "../../../components/locationComponents/readyToRide";
// import WhyChooseUs from "../../../components/locationComponents/whyChooseUs";
// import Testimonials from "../../../globalComponents/testimonials";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default async function CarsPage({ locationId, searchParams, locSlug, categorySinName }) {
    /* ---------------- Await search params ---------------- */
  const params = await searchParams;

  const page = params?.page || 1;
  const q = params?.q || "";
  const brand = params?.brand_slug || "";

    /* =====================================================
   * CITY DETAILS (getcity by locationId)
   * ===================================================== */
  let cityData = null;

  if (locationId) {
    try {
      const cityRes = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/getcity`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            city_id: locationId,
          }),
        }
      );

      const cityJson = await cityRes.json();

      if (cityJson.status) {
        // Agar API single object bhej rahi ho to direct use hoga
        cityData = Array.isArray(cityJson.data)
          ? cityJson.data[0]
          : cityJson.data;
      }
    } catch (err) {
      console.error("City fetch error:", err);
    }
  }

  /* =====================================================
   * VEHICLES BY LOCATION
   * ===================================================== */
  const productsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getallvehiclesByLocation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        loc_slug: locSlug,
        page: 1,
        limit: 8,
        q,
        brand_slug: brand,
      }),
    }
  );

  const productsData = await productsRes.json();

  /* =====================================================
   * ALL ACTIVE PARENT CATEGORIES
   * ===================================================== */
  const categoryRes = await fetch(
    `${API_BASE_URL}/getallactivecategory`,
    { cache: "no-store" }
  );

  if (!categoryRes.ok) {
    throw new Error(`Category API failed: ${categoryRes.status}`);
  }

  const categories = await categoryRes.json();

  /* =====================================================
   * CHILD CATEGORIES (NO FILTER, NO CHECK)
   * ===================================================== */
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

  /* =====================================================
   * Getting models by location slug
   * ===================================================== */
  /*
    const popularModelsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getModelsByCategoryAndLocation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location_slug: locSlug,
      }),
      next: { revalidate: 3600 },
    }
  );

  // 1. Check if the request was successful
  if (!popularModelsRes.ok) {
     console.error("Failed to fetch models");
     // handle error state here
  }

  // 2. Parse the JSON
  const popularModelsData = await popularModelsRes.json();
  const popularModels = popularModelsData.models || [];
  */

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

    // Get all category data for the location
    popularModels = jsonData?.data || [];

  } catch (err) {
    console.error("Popular models not found:", err.message);
  }

  /* =====================================================
   * GENERATE DYNAMIC FAQs FROM JSON DATA
   * ===================================================== */
  const propertyName = cityData?.cat_singular_name || categorySinName || "this location";
  
  // Extract all category names with links in a UL/LI list
  const availableCategories = `<ul>${popularModels
    .map(cat => `<li><a href="/${cat.category_slug}/${locSlug}" class="text-primary fw-bold">${cat.category_name}</a></li>`)
    .join("")}</ul>`;
  
  // Extract some top models (max 8) with links in a UL/LI list
  const allModelsWithLinks = popularModels.flatMap(cat => 
    (cat.models || []).map(m => ({
      name: m.display_name || m.model_name,
      slug: m.model_slug,
      catSlug: cat.category_slug
    }))
  );
  
  const topModels = allModelsWithLinks.length > 0 
    ? `<ul>${allModelsWithLinks
        .slice(0, 8)
        .map(m => `<li><a href="/${m.catSlug}/${m.slug}/${locSlug}" class="text-primary fw-bold">${m.name}</a></li>`)
        .join("")}</ul>`
    : "";

  const locationFaqs = [
    {
      id: "faq-1",
      title: `What types of vehicles are available for rent in ${propertyName}?`,
      description: `You can rent a wide variety of vehicles in ${propertyName} through our platform. Current available categories include: ${availableCategories} We connect you directly with verified local vendors for the best experience in the city.`
    },
    {
      id: "faq-2",
      title: `Which are the most popular vehicle models available in ${propertyName}?`,
      description: topModels 
        ? `Some of the most popular vehicle models currently available for rent in ${propertyName} include: ${topModels} ...and many others across different categories.`
        : `We have a wide range of popular vehicle models available from top brands. Browse our categories to find the perfect match for your needs in ${propertyName}.`
    },
    {
      id: "faq-3",
      title: `Are the rental vehicles in ${propertyName} verified?`,
      description: `Yes, all rental service providers and their vehicle listings in ${propertyName} undergo a verification process on FindOnRent to ensure transparency and trust for our users. We highly recommend checking vendor reviews and ratings before booking.`
    },
    {
      id: "faq-4",
      title: `Is there any commission fee for booking vehicles in ${propertyName}?`,
      description: `No, FindOnRent is a 100% zero-commission platform. You connect directly with the vehicle owners in ${propertyName} and pay them without any extra platform fees, service charges, or hidden booking costs.`
    },
    {
      id: "faq-5",
      title: `What documents do I need to rent a vehicle in ${propertyName}?`,
      description: `Generally, you will need a valid ID proof (like Aadhar Card or Passport) and a valid Driving License to rent a vehicle in ${propertyName}. Specific document requirements may vary slightly depending on the individual vendor's policies and the vehicle type.`
    }
  ];

  /* =====================================================
   * RENDER
   * ===================================================== */
  return (
    <>
      {/* SEO robots meta tags – index, follow by default */}
      <meta name="robots" content="index, follow" />

      {/* Vehicles */}
      <VehicleList
        initialProducts={productsData || []}
        categories={categoriesWithChildren}
        city_data={cityData}
        loc_slug={locSlug}
        popularModels={popularModels}
        city_name={categorySinName}
      />

      {/* Vendors list */}
      <VendorsList loc_slug={locSlug}/>

      {/* <WhyChooseUs /> */}
      {/* <FAQSection cate_id={2} /> */}
      <FAQSection loc_id={locationId} faqData={locationFaqs} />

      <AboutUs city_data={cityData} />
      {/* <ReadyToRide /> */}
      {/* <Testimonials /> */}
      <LatestArtical loc_id={locationId} />
      <NeedHelp />
    </>
  );
}
