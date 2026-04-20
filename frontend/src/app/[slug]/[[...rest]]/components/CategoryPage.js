import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";
import VehicleList from "../../../components/categoryComponents/VehiclesList";
// import VendorsList from "../../../components/categoryComponents/VendorsList";
// import FAQSection from "../../../components/categoryComponents/faqSection";
// import AboutUs from "../../../components/categoryComponents/aboutUs";
// import LatestArtical from "../../../components/categoryComponents/latestArticle";
// import WhyChooseUs from "../../../components/categoryComponents/whyChooseUs";
// import RentEarn from "../../../components/categoryComponents/rentEarn";

const FAQSection = dynamic(() => import("../../../components/categoryComponents/faqSection"));
const VendorsList = dynamic(() => import("../../../components/categoryComponents/VendorsList"));
const AboutUs = dynamic(() => import("../../../components/categoryComponents/aboutUs"));
const LatestArtical = dynamic(() => import("../../../components/categoryComponents/latestArticle"));
const WhyChooseUs = dynamic(() => import("../../../components/categoryComponents/whyChooseUs"));
const RentEarn = dynamic(() => import("../../../components/categoryComponents/rentEarn"));

// import NeedHelp from "../../../components/categoryComponents/needHelp";
// import ReadyToRide from "../../../components/categoryComponents/readyToRide";
// import Testimonials from "../../../globalComponents/testimonials";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default async function CategoryPage({categoryId, categorySlug, searchParams, categorySinName, categoryName}) {

  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();

  const page = Number(resolvedSearchParams?.page || 1);
  const search_by = resolvedSearchParams?.search_by || "";
  const brand = resolvedSearchParams?.brand || "";

  let userCity = "";
  try {
    const raw = cookieStore.get("user_location")?.value;
    if (raw) {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (parsed?.city) userCity = parsed.city;
    }
  } catch {}

  /* -------- Parallel Fetching Optimization -------- */
  const productsPromise = fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getallvehiclesbyCatId`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cat_id: categoryId,
        page,
        limit: 20,
        search_by,
        brand: brand,
        user_city: userCity,
      }),
      cache: "no-store",
    }
  );

  const brandsPromise = fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrandscatpg`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: categoryId }),
      cache: "no-store",
    }
  );

  const popularModelsPromise = fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getModelsByCategoryAndLocation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: categoryId }),
      next: { revalidate: 3600 },
    }
  );

  const locationsJSONPromise = fetch(`${process.env.BACKEND_JSON_DIR_PATH}category-location.json`);

  // AWAIT ALL 4 HTTP REQUESTS SIMULTANEOUSLY
  const [productsRes, brandsRes, popularModelsRes, locationsRes] = await Promise.all([
    productsPromise, 
    brandsPromise, 
    popularModelsPromise, 
    locationsJSONPromise
  ]);

  const productsData = productsRes.ok ? await productsRes.json() : {};
  const brandsData = brandsRes.ok ? await brandsRes.json() : {};

  if (!popularModelsRes.ok) console.error("Failed to fetch models");
  const popularModelsData = popularModelsRes.ok ? await popularModelsRes.json() : {};
  const popularModels = popularModelsData.models || [];

  let categoryLocations = [];
  try {
    if (locationsRes.ok) {
      categoryLocations = (await locationsRes.json()) || [];
    }
  } catch (err) {
    console.error("Footer JSON read error:", err.message);
  }

  const popularCities = categoryLocations.find(
    (cat) => cat.category_slug == categorySlug
  );


  /* =====================================================
   * GENERATE DYNAMIC FAQs FOR CATEGORY PAGE
   * ===================================================== */
  
  // 1. Generate Cities List
  const cityList = (popularCities?.locations || [])
    .slice(0, 10) // Show top 10 cities
    .map(loc => `<li><a href="/${categorySlug}/${loc.location_slug}" class="text-primary fw-bold">${loc.location_name}</a></li>`)
    .join("");

  const citiesHtml = cityList ? `<ul>${cityList}</ul>` : "";

  // 2. Generate Models List
  const modelList = popularModels
    .slice(0, 10) // Show top 10 models
    .map(m => `<li><a href="/${categorySlug}/${m.model_slug}" class="text-primary fw-bold">${m.display_name || m.model_name}</a></li>`)
    .join("");

  const modelsHtml = modelList ? `<ul>${modelList}</ul>` : "";

  const categoryFaqs = [
    {
      id: "cat-faq-1",
      title: `In which cities can I rent ${categoryName} through FindOnRent?`,
      description: citiesHtml 
        ? `${categoryName} are available in several major cities across India, including: ${citiesHtml} You can browse specific listings in each city to find the best deals.`
        : `We offer ${categoryName} rentals in multiple cities. Please use our search bar to find available options in your specific location.`
    },
    {
      id: "cat-faq-2",
      title: `What are the most popular ${categorySinName} models available for rent?`,
      description: modelsHtml 
        ? `Our platform features a wide range of popular models for ${categorySinName} rentals, such as: ${modelsHtml} Availability may vary by city and vendor.`
        : `We provide a diverse selection of high-quality ${categorySinName} models to suit all your rental needs. Browse our current listings to see what's available.`
    },
    {
      id: "cat-faq-3",
      title: `Does FindOnRent charge any commission for ${categoryName} bookings?`,
      description: `No, FindOnRent is a 100% zero-commission marketplace. You connect directly with the vehicle owners and pay them without any platform fees or extra convenience charges.`
    },
    {
      id: "cat-faq-4",
      title: `How do I book a ${categorySinName} on FindOnRent?`,
      description: `Simply select your preferred category and city, browse the verified listings, and contact the vendor directly via phone or WhatsApp to confirm pricing and availability.`
    },
    {
      id: "cat-faq-5",
      title: `What are the security deposit and documents required for renting ${categoryName}?`,
      description: `Requirement for security deposits and specific documents (like Aadhar or DL) can vary between different rental vendors. We recommend discussing these details directly with the verified service provider in your selected city before finalizing the booking.`
    }
  ];

  return (
    <>
      {/* SEO robots meta tags – index, follow by default */}
      <meta name="robots" content="index, follow" />

      <VehicleList
        initialProducts={productsData.products || []}
        total={productsData.total || 0}
        brands={brandsData.brands || []}
        categorySlug={categorySlug}
        categorySinName={categorySinName}
        categoryName={categoryName}
        cate_id={categoryId}
        popularModels={popularModels}
        userCity={userCity}
        popularCities={popularCities}
      />

      {/* Vendors list */}
      <VendorsList cat_id={categoryId} user_city={userCity} categorySinName={categorySinName}/>

      <WhyChooseUs cate_id={categoryId} />
      <FAQSection cate_id={categoryId} faqData={categoryFaqs} />
          {/* <Testimonials /> */}
      <AboutUs cate_id={categoryId} />
          {/* <ReadyToRide cate_id={categoryId} /> */}
      <LatestArtical cate_id={categoryId} />
          {/* <NeedHelp /> */}
      {/* Rent and Earn */}
      <RentEarn cate_id={categoryId}  />
    </>
  );
}
