import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import VehicleList from "../../../components/categoryModelLocationComponents/VehiclesList";

// import VendorsList from "../../../components/categoryModelLocationComponents/VendorsList";
// import FAQSection from "../../../components/categoryModelLocationComponents/faqSection";
// import RentEarn from "../../../components/categoryModelLocationComponents/rentEarn";

const VendorsList = dynamic(() => import("../../../components/categoryModelLocationComponents/VendorsList"));
const FAQSection = dynamic(() => import("../../../components/categoryModelLocationComponents/faqSection"));
const RentEarn = dynamic(() => import("../../../components/categoryModelLocationComponents/rentEarn"));

// import ReadyToRide from "../../../components/categoryModelLocationComponents/readyToRide";
// import AboutUs from "../../../components/categoryModelLocationComponents/aboutUs";
// import WhyChooseUs from "../../../components/categoryModelLocationComponents/whyChooseUs";
// import LatestArtical from "../../../components/categoryModelLocationComponents/latestArticle";
// import NeedHelp from "../../../components/categoryModelLocationComponents/needHelp";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default async function CategoryModelLocationPage({ categoryId, modelId, locationId, categoryName, modelName, cityName, categorySlug, modelImageUrl, modelSlug, modelLabel, locSlug, searchParams }) {

  const params = await Promise.resolve(searchParams);

  const page = Number(params.page) || 1;
  const search_by = params.search_by || "";
  const brand = params.brand || "";
  const tag = params.tag_slug || "";

  /* IMPORTANT: USE FULL SLUG */
  const location_slug = locSlug; // udaipur-rajasthan

  /* FETCH ALL CATEGORIES */
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

  const res = await fetch(
    `${process.env.BACKEND_JSON_DIR_PATH}faq/catmodloc-data.json`
  );

  const faqJson = await res.json();

  const faqData =
  Array.isArray(faqJson)
    ? faqJson.find(
        item =>
          Number(item.cat_id) === Number(categoryId) &&
          Number(item.model_id) === Number(modelId) &&
          Number(item.loc_id) === Number(locationId)
      )
    : null;

  const vendors = faqData?.vendors || [];
  const model = faqData?.model || "";
  const city = faqData?.city || "";
  const category = faqData?.category || "";
  const price_range = faqData?.price_range || "";

  /* FAQ SCHEMA */
  /* ===== CLEAN HTML → TEXT (SCHEMA PURPOSE) ===== */
  function stripHtml(html) {
    return html
      .replace(/<[^>]*>?/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* ===== VIEW ALL BUTTON ===== */
  const viewAllBtn =
    vendors.length >= 5
      ? `<br/><br/>
        <a href="/rental-service-providers?city=${faqData.city_slug}"
            class="button theme-btn-new"
            target="_blank">
            View all rental service providers
        </a>`
      : "";

  /* ===== PRICE HTML ===== */
  const priceHtml =
    price_range && price_range !== "0"
      ? `<br/><br/>
          Typical price ranges offered by providers are:
          <ul>
            <li>${price_range}</li>
          </ul>`
      : ` Please contact the rental providers directly for pricing details.`;

  function formatVendorNames(vendors = []) {
    if (!vendors.length) return "";

    const names = vendors.map(v => v.name);

    if (names.length === 1) return names[0];

    if (names.length === 2) {
      return `${names[0]} and ${names[1]}`;
    }

    return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
  }

  const vendorText = formatVendorNames(vendors);

  /* ===== UI FAQ ARRAY ===== */
  const faqs = [
    {
      id: 1,
      title: `What is the rental price range for ${model} in ${city}?`,
      description: `
        The rental price range for ${model} in ${city} may vary depending on rental duration, vehicle condition, demand, and rental service provider policies.
        ${priceHtml}
        For exact pricing and availability, please contact the rental providers directly.
      `
    },
    {
      id: 2,
      title: `Which rental service providers offer ${model} on rent in ${city}?`,
      description: `
        Some of the popular rental service providers who offer ${model} on rent in ${city} include:
        ${vendorText}
        ${viewAllBtn}
        Users can explore provider profiles, compare rental options, and choose the most suitable provider.
      `
    },
    {
      id: 3,
      title: `How popular is ${model} among ${category} rentals in ${city}?`,
      description: `
        The popularity of ${model} in the ${category} rental segment in ${city} depends on travel demand, pricing trends, and rental provider availability.
        Demand may increase during tourist seasons or weekends.
      `
    },
    {
      id: 4,
      title: `Is security deposit required for ${model} ${category} rental in ${city}?`,
      description: `
        Security deposit requirements for renting ${model} ${category} in ${city} depend on rental duration, vehicle condition, and provider policies.
        Users should confirm deposit terms before booking.
      `
    },
    {
      id: 5,
      title: `What documents should I check before renting ${model} ${category} in ${city}?`,
      description: `
        Before renting ${model} ${category} in ${city}, users should ensure they meet eligibility criteria such as valid ID proof and required driving credentials.
        Requirements may vary depending on rental provider policies.
      `
    }
  ];

  /* ===== FAQ SCHEMA (PLAIN TEXT VERSION) ===== */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: stripHtml(f.title),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(f.description)
      }
    }))
  };

  /* LOCAL / AUTORENTAL SCHEMA */
  const rentalSchema = faqData
    ? {
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: `${faqData.model} ${faqData.category} Rental in ${faqData.city}`,
        url: `https://www.findonrent.com/${categorySlug}/${modelSlug}/${locSlug}`,
        description: `Find ${faqData.model} ${faqData.category} rental options in ${faqData.city}. Compare pricing, availability and verified rental providers.`,
        areaServed: {
          "@type": "City",
          name: faqData.city
        },
        brand: {
          "@type": "Brand",
          name: "FindOnRent"
        }
      }
    : null;

  /* FETCH PRODUCTS (MAIN FIX) */
  const productsRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/getallvehiclesByCategoryModelLocation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        cat_id: categoryId,
        location_slug, // FULL SLUG
        model_id: modelId,
        page,
        limit: 28,
        search_by,
        brand,
        tag_slug: tag,
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
    `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: categoryId }),
      cache: "no-store",
    }
  );

  const brandsData = await brandsRes.json();

  /* RENDER */
  return (
    <>
      <meta name="robots" content="index, follow" />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {rentalSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rentalSchema) }}
        />
      )}

      <VehicleList
        initialProducts={productsData.products || []}
        total={productsData.total || 0}
        categories={categoriesWithChildren}
        categorySlug={categorySlug}
        categorySinName={categoryName}
        categoryName={categoryName}
        locSlug={locSlug}
        brands={brandsData}
        cate_id={categoryId}
        modelName={modelName}
        modelSlug={modelSlug}
        modelLabel={modelLabel}
      />

      <VendorsList businessIds={businessIds} categorySinName={categoryName} />

      {/* <WhyChooseUs cate_id={categoryId} /> */}
      <FAQSection faqData={faqData} cate_id={categoryId} loc_id={locationId} />
      {/* <AboutUs cate_id={categoryId} cat_nm={categoryName} loc_nm={cityName} /> */}
      {/* <ReadyToRide cate_id={categoryId} /> */}
      {/* <LatestArtical cate_id={categoryId} loc_id={locationId} /> */}
      {/* <NeedHelp /> */}
      <RentEarn cate_id={categoryId} cat_nm={categoryName} loc_nm={cityName} modelLabel={modelLabel} modelImageUrl={modelImageUrl}/>
    </>
  );
}
