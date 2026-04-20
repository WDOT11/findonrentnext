import { Suspense } from "react";
import RentalProvidersClient from "./RentalProvidersClient";
export const dynamic = 'force-dynamic'

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

/* ===========================
   SERVER FETCH FUNCTION
=========================== */
async function getProvidersByLocation() {

  /* ===========================
     FETCH ALL LOCATIONS
  =========================== */
  let locations = [];

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/get-all-slugs`,
      { cache: "no-store" }
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
     FETCH ALL VENDORS (NO PAGINATION)
  =========================== */
  let vendors = [];

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/getallactivevendors`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendors: true,
          page: 1,
          limit: 10000, 
          sort_by: "alphabetical"
        }),
        cache: "no-store",
      }
    );

    const data = await res.json();
    vendors = data?.vendors || [];

  } catch (err) {
    console.error("Vendor fetch error:", err);
    return [];
  }

  /* ===========================
    GROUP VENDORS BY LOCATION SLUG
  =========================== */

  const vendorsByLocation = {};

  vendors.forEach((vendor) => {

    const slug = vendor.city || vendor.locationName;

    if (!slug) return;

    if (!vendorsByLocation[slug]) {
      vendorsByLocation[slug] = [];
    }

    vendorsByLocation[slug].push(vendor);
  });

  /* ===========================
     ATTACH VENDORS TO LOCATIONS
  =========================== */
  const locationsWithVendors = locations.map((loc) => ({
    ...loc,
    vendors: vendorsByLocation[loc.slug] || [],
  }));

  return locationsWithVendors;
}

/* ===========================
   PAGE COMPONENT
=========================== */
export default async function RentalProvidersPage() {

  const locations = await getProvidersByLocation();

  return (
    <>
      <title>Rental Service Providers by Location | Find on Rent</title>
      <meta name="description" content="Explore rental service providers across different cities on Find on Rent."/>
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${WEB_BASE_DOMAIN_URL}/rental-providers-by-location`}/>

      <Suspense fallback={<div>Loading providers...</div>}>
        <RentalProvidersClient locations={locations} />
      </Suspense>
    </>
  );
}