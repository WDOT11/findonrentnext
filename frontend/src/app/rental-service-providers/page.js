import { Suspense } from "react";
import RentalProvidersClient from "./RentalProvidersClient";
import Seo from "../../components/seo/Seo";
import { cookies } from "next/headers";
import { getSeoMeta } from "../../lib/getSeoMeta";


const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

async function getVendors(page = 1, query = "", city = "") {
  const cookieStore = await cookies(); // await added
  const userLocation = cookieStore.get("user_location");
  let userCity = "";

  if (userLocation) {
    try {
      userCity = JSON.parse(userLocation.value)?.city || "";
    } catch (e) {}
  }

  const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getallactivevendors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vendors: true,
      page,
      limit: 15,
      query,
      city,
      user_city: userCity
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return { vendors: [], pagination: {} };
  }

  return await res.json();
}

export default async function RentalProvidersPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const query = params?.search_by || "";
  const city = params?.city || "";
  const metaSchema = await getSeoMeta("/rental-providers/");

  const isOnlyCitySearch = city && !query;
  const cityNameForSeo = city
    ? city.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    : "";

  const { vendors, pagination } = await getVendors(page, query, city);

  return (
    <>
      {/* SEO */}
      {!isOnlyCitySearch && <Seo slug="/rental-providers/" />}

      {isOnlyCitySearch && (
        <>
          <meta name="robots" content={`index, follow`} />
          <title>
            {`Find the best rental service provider in ${cityNameForSeo} | Find on Rent`}
          </title>
          <meta
            name="description"
            content={`Rental Service Providers near you | Compare local renal providers | Get good price | No middleman | No commission.`}
          />
          <link
            rel="canonical"
            href={`https://findonrent.com/rental-service-providers`}
          />
          <meta name="keywords" content={`Renal Service Providers, Find affordable rental service, Best service provider`} />

          <meta property="og:title" content={`Renal Service Providers, Find affordable rental service, Best service provider`} />
          
          <meta property="og:description" content={`Discover verified rental service providers in ${cityNameForSeo}. Compare prices, services, and connect directly with trusted vendors on Find on Rent.`} />
        </>
      )}

      {/* Schema (same as before) */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading providers...</div>}>
        <RentalProvidersClient
          vendors={vendors}
          pagination={pagination}
          query={query}
          citySearchTerm={city}
        />
      </Suspense>
    </>
  );
}

