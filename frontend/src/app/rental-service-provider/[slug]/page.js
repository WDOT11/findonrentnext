import { notFound } from "next/navigation";
import VendorDetailsClient from "./components/vendorDetailsClient";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

/* ================= SEO METADATA ================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/vendor/${slug}`,
      { cache: "no-store" }
    );

    const result = await res.json();
    const vendor = result?.data || result;

    if (!vendor || vendor.success === false) {
      return {
        title: "Vendor not found | FindOnRent",
        robots: "noindex, nofollow",
      };
    }

    const businessName = vendor.business_name || "Rental Service Provider";
    const city = vendor.address?.city || "";
    const title = `${businessName}${city ? `, ${city}` : ""} | Rental Service Provider`;
    const description = `Explore rental vehicles, contact details and services offered by ${businessName}${city ? ` in ${city}` : ""}.`;

    return {
      title,
      description,
      alternates: {
        canonical: `${WEB_BASE_DOMAIN_URL}/rental-service-provider/${slug}`,
      },
      robots: "index, follow",
      openGraph: {
        title,
        description,
        url: `${WEB_BASE_DOMAIN_URL}/rental-service-provider/${slug}`,
      },
    };
  } catch {
    return {
      title: "Vendor | FindOnRent",
    };
  }
}

/* ================= PAGE ================= */
export default async function VendorDetailsPage({ params }) {
  const { slug } = await params;

  /* ---------- Fetch vendor ---------- */
  const res = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/vendor/${slug}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const vendorData = data?.data || data;

  if (!vendorData || vendorData.success === false) {
    return notFound();
  }

  /* ---------- Fetch vendor items ---------- */
  const itemRes = await fetch(
    `${ROH_PUBLIC_API_BASE_URL}/rental-service-provider/items/${slug}`,
    { cache: "no-store" }
  );

  let vendorItems = [];

  if (itemRes.ok) {
    const dataItem = await itemRes.json();
    const vendorItemData = dataItem?.dataItem ?? dataItem;

    if (vendorItemData?.success === true) {
      vendorItems =
        vendorItemData.categories ||
        vendorItemData.items ||
        [];
    }
  }

  /* ================= SCHEMA ================= */

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": vendorData.business_name,
    "url": `${WEB_BASE_DOMAIN_URL}/rental-service-provider/${slug}`,
    "description": `Rental service provider offering vehicles on rent in ${vendorData.address?.city}.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": vendorData.address?.city,
      "addressRegion": vendorData.address?.state,
      "addressCountry": "IN",
    },
    "areaServed": {
      "@type": "City",
      "name": vendorData.address?.city,
    }
  };

  return (
    <>
      {/* LocalBusiness Schema (SERVER ONLY) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <VendorDetailsClient
        vendorData={vendorData}
        vendorItems={vendorItems}
        slug={slug}
      />
    </>
  );
}
