import RentHomePage from "./page.client";
import { getSeoMeta } from "../lib/getSeoMeta";
import { cookies, headers } from "next/headers";

export const revalidate = 3600;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const API_BASE_PUBLIC_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export async function generateMetadata() {
  const meta = await getSeoMeta("/home/");
  return {
    title: meta.page_title,
    description: meta.meta_description,
    keywords: meta.meta_keywords,
    alternates: {
      canonical: meta.canonical_url,
    },
    openGraph: {
      title: meta.og_title,
      description: meta.meta_description,
      images: [{ url: meta.og_image }],
      url: meta.canonical_url,
    },
    robots: {
      index: !meta.noindex,
      follow: !meta.noindex,
    }
  };
}

export default async function PageWrapper() {
  /** 
   * FETCH ALL DATA IN PARALLEL WITH REVALIDATION
   * Using 1-hour cache (3600s) to avoid hitting DB on every request.
   */
  /** 
   * DATA FETCHING STRATEGY:
   * 1. Await critical data (Meta & Categories) to show Hero & Search immediately.
   * 2. Start non-critical fetching (Cities & FAQs) but don't block initial shell.
   */
  const metaSchemaPromise = getSeoMeta("/home/");
  const allCategoriesPromise = fetch(`${API_BASE_URL}/getallcategorieswithchildren`, { 
    next: { revalidate: 3600 } 
  }).then(res => res.json());

  // Wait for critical data only
  const [metaSchema, categoriesData] = await Promise.all([
    metaSchemaPromise,
    allCategoriesPromise
  ]);

  // Non-critical data (fired but handled after initial render if possible, or just fetched later)
  const citiesResult = await fetch(`${API_BASE_PUBLIC_URL}/getallactivecity`, { 
    next: { revalidate: 3600 } 
  }).then(res => res.json()).catch(() => ({ success: false }));

  const faqsResult = await fetch(`${API_BASE_PUBLIC_URL}/getHomeFaqMaster`, { 
    next: { revalidate: 3600 } 
  }).then(res => res.json()).catch(() => ({ success: false }));

  const cities = citiesResult?.success ? citiesResult.data || [] : [];
  const homeFaqs = faqsResult?.success ? faqsResult.data || [] : [];

  /** Proper IP extraction */
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "UNKNOWN";

  /** Cookies */
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("authUser");

  const categories = Array.isArray(categoriesData) ? categoriesData : [];



  const dynamicSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Find On Rent",
    "alternateName": "FindOnRent",
    "url": "https://findonrent.com",
    "logo": "https://findonrent.com/images/global-imgs/roh_logo.svg",
    "image": "https://findonrent.com/images/homepg/bg-img-3.svg",
    "description": "India's direct rental marketplace...",
    "priceRange": "₹199.00-₹250000.00",
    "email": "contact@findonrent.com",
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59",
    }],
    "areaServed": [{ "@type": "Country", "name": "India" }],
    "sameAs": ["https://www.facebook.com/findonrent", "https://www.instagram.com/findonrent"]
  };

  const buildHomeFaqSchema = (faqs) => {
    if (!faqs || !faqs.length) return null;
    const categoryNames = faqs.map((c) => c.category_name).join(", ");
    const priceText = faqs.map((c) => `${c.category_name} (₹${Math.round(Number(c.min_price))} - ₹${Math.round(Number(c.max_price))})`).join(", ");

    const masterFaqs = [
      { q: "What types of vehicles are available for rent on FindOnRent?", a: `FindOnRent is a rental marketplace where you can book vehicles across categories such as ${categoryNames}...` },
      { q: "What is the rental price range for different categories?", a: `Estimated starting price ranges include: ${priceText}...` },
      { q: "Does FindOnRent charge any booking fees or commissions?", a: "FindOnRent is a zero-commission platform..." },
      { q: "What documents are required to rent a vehicle?", a: "Most rental providers require a valid driving license..." },
      { q: "How can I book a vehicle through FindOnRent?", a: "Browse vehicle categories, select a verified vendor, contact them via call or WhatsApp..." }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "publisher": {"@id": "https://findonrent.com"},
      "description": "Find answers to frequently asked questions about vehicle rentals on FindOnRent, including pricing, required documents, and booking fees.",
      "mainEntity": masterFaqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      })),
    };
  };

  const faqSchema = buildHomeFaqSchema(homeFaqs);

  return (
    <>
      {/* Preconnect to backend */}
      {/* <link rel="preconnect" href="https://backend.findonrent.com" crossOrigin="anonymous" /> */}

      {metaSchema?.meta_schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaSchema.meta_schema }} />
      )}

      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicSchema) }} /> */}

      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <RentHomePage
        categories={categories}
        homeFaqs={homeFaqs}
      />
    </>
  );
}