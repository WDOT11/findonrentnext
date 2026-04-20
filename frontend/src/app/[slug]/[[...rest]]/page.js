import { notFound, permanentRedirect } from "next/navigation";
import { resolveSlug, resolveCategoryLocation, resolveCategoryModelLocation, resolveCategoryModel } from "../../../lib/slugService";
import { getCategoryListingCount, getLocationListingCount, getCategoryLocationListingCount, getCategoryModelListingCount, getCategoryModelLocationListingCount } from "../../../lib/listingService";
import CategoryPage from "./components/CategoryPage";
import LocationPage from "./components/LocationPage";
import CategoryLocationPage from "./components/CategoryLocationPage";
import CategoryModelPage from "./components/CategoryModelPage";
import CategoryModelLocationPage from "./components/CategoryModelLocationPage";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

/* ---------- Helper: Smart Truncate ---------- */
const truncateTitle = (title, maxLength = 62) => {
  if (!title || title.length <= maxLength) return title;
  let truncated = title.slice(0, maxLength);
  truncated = truncated.slice(
    0,
    Math.min(truncated.length, truncated.lastIndexOf(" "))
  );
  return truncated + "...";
};

/* ---------- Helper: Slug to Readable ---------- */
const toReadable = (val) => val.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------- Breadcrumb Schema Builder ---------- */
const buildItem = (url) => ({
  "@type": "WebPage",
  "@id": url,
});

const getBreadcrumbSchema = ({ type, slug, rest = [], slugData }) => {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: buildItem(`${WEB_BASE_DOMAIN_URL}/`),
    },
  ];

  if (type === "category") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: toReadable(slugData.categorySinName),
      item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}`),
    });
  }

  if (type === "location") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: toReadable(slug),
      item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}`),
    });
  }

  if (type === "category-location") {
    items.push(
      {
        "@type": "ListItem",
        position: 2,
        name: toReadable(slugData.categorySinName),
        item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: toReadable(rest[0]),
        item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}/${rest[0]}`),
      }
    );
  }

  if (type === "category-model-location") {
    items.push(
      {
        "@type": "ListItem",
        position: 2,
        name: toReadable(slugData.categorySinName),
        item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: toReadable(rest[0]),
        item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}/${rest[0]}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: toReadable(rest[1]),
        item: buildItem(
          `${WEB_BASE_DOMAIN_URL}/${slug}/${rest[0]}/${rest[1]}`
        ),
      }
    );
  }

  if (type === "category-model") {
    items.push(
      {
        "@type": "ListItem",
        position: 2,
        name: toReadable(slugData.categorySinName),
        item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: toReadable(rest[0]),
        item: buildItem(`${WEB_BASE_DOMAIN_URL}/${slug}/${rest[0]}`),
      }
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
};

/* =========================================================
  METADATA (SEO)
  ========================================================= */
const getCategoryLocationTitle = (categoryId, locationName) => {
  switch (Number(categoryId)) {
    case 2: /** Car */
      return `Cars Rental in ${locationName}, find a car on rent | Find On Rent`;

    case 3: /** Bike */
      return `Bikes Rental in ${locationName}, find a bike on rent | Find On Rent`;

    case 8: /** Scooters */
      return `Scooters Rental in ${locationName}, find a scooty on rent | Find On Rent`;

    case 10: /** Car With Driver */
      return `Cars with Driver on rent in ${locationName} | Find On Rent`;

    default:
      /** Future-safe fallback */
      return `${locationName} Rentals | Find On Rent`;
  }
};

const getRoundedCount = (count) => {
  if (!count) return 10;

  const rounded = Math.floor(count / 10) * 10;

  return rounded < 10 ? 10 : rounded;
};

const getCountPrefix = (count) => {
  if (!count || count < 10) return null;

  const rounded = Math.floor(count / 10) * 10;

  return `${rounded}+`;
};

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page || 1);

  const { slug, rest = [] } = resolvedParams;

  if (!slug || slug === "_next" || slug.startsWith("_") || slug.includes("."))
  {
    return {};
  }

  const slugData = await resolveSlug(slug);
  if (!slugData) return {};

  /* ---------- CASE 0: /category/model/location ---------- */
  if (rest.length === 2) {
    const modelSlug = rest[0];
    const locationSlug = rest[1];

    const readableModel = toReadable(modelSlug);
    const readableLocation = toReadable(locationSlug);
    const categoryName = toReadable(slugData.categoryName);

    const readableCategorySinName = toReadable(slugData.categorySinName);

    // Get total count from API
    const totalCount = await getCategoryModelLocationListingCount(slugData.entityId, modelSlug, locationSlug);

    // Determine prefix
    const countPrefix = totalCount >= 10 ? `${Math.floor(totalCount / 10) * 10}+ ` : "";

    // Construct title
    // const rawTitle = `${countPrefix}${readableModel} ${readableCategorySinName} For Rent in ${readableLocation} | Find On Rent`;

    /*
    const rawTitle =
      countPrefix
        ? `${countPrefix}${readableModel} ${categoryName} For Rent in ${readableLocation} | Find On Rent`
        : `${readableCategorySinName} For Rent in ${readableLocation} | Find On Rent`;
    */
    const rawTitle = `${readableModel} ${readableCategorySinName} For Rent in ${readableLocation} | Find On Rent | FindOnRent`;


    const title = truncateTitle(rawTitle, 62);

    // const title = truncateTitle(`${readableModel} ${toReadable(slug)} on Rent in ${readableLocation} | Find On Rent`, 62);

    return {
      title,
      description: `Rent a ${readableModel} ${slug} in ${readableLocation}. Best daily and weekly rates for ${readableModel} rentals on Find On Rent.`,
      alternates: {
        canonical: `${WEB_BASE_DOMAIN_URL}/${slug}/${modelSlug}/${locationSlug}`,
      },
    };
  }

  /* CASE 1: /category/location OR /category/model */
  if (rest.length === 1) {
    const subSlug = rest[0];
    const page = Number(resolvedSearchParams?.page || 1);

    const readableSinCategory = toReadable(slugData.categorySinName);
    const categoryName = toReadable(slugData.categoryName);
    const readableLocation = toReadable(subSlug);

    const canonicalUrl =
      page > 1
        ? `${WEB_BASE_DOMAIN_URL}/${slug}/${subSlug}?page=${page}`
        : `${WEB_BASE_DOMAIN_URL}/${slug}/${subSlug}`;

    // CATEGORY + LOCATION
    const combo = await resolveCategoryLocation(slug, subSlug);

    if (combo) {

    const totalCount = await getCategoryLocationListingCount(
      slugData.entityId,
      subSlug
    );

    const countPrefix = getCountPrefix(totalCount);

    /*
      const rawTitle = countPrefix ? `${countPrefix} ${categoryName} For Rent in ${readableLocation} | Find On Rent` : `${readableSinCategory} For Rent in ${readableLocation} | Find On Rent`;
    */
    const rawTitle = `${readableSinCategory} For Rent in ${readableLocation} | Find On Rent | FindOnRent`;

      // const rawTitle =
      //   page > 1
      //     ? `${readableSinCategory} Rentals in ${readableLocation} – Page ${page} | Find On Rent`
      //     : `${readableSinCategory} Rentals in ${readableLocation} | Find On Rent`;

      const title = truncateTitle(rawTitle, 62);

      const description = `Find ${readableSinCategory.toLowerCase()} available for rent in ${readableLocation}. Compare prices, verified owners, and easy booking on Find On Rent.`;

      return {
        title,
        description,
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }

    // CATEGORY + MODEL
    const readableModel = toReadable(subSlug);

    // fetch total count
    const totalCount = await getCategoryModelListingCount(slugData.entityId, subSlug);

    // determine count prefix
    const countPrefix = getCountPrefix(totalCount);

    /*
      const rawTitle = countPrefix ? `${countPrefix} ${readableModel} ${categoryName} For Rent Near You | Find On Rent` : `Find a ${readableModel} ${readableSinCategory} For Rent Near You | Find On Rent`;
    */
    const rawTitle = `Find a ${readableModel} ${readableSinCategory} For Rent Near You | Find On Rent`;

    /*
    const rawTitle =
      page > 1
        ? `Find a ${readableModel} ${readableSinCategory} Near You – Page ${page} | Find On Rent`
        : `Find a ${readableModel} ${readableSinCategory} Near You | Find On Rent`;
    */

    const title = truncateTitle(rawTitle, 62);

    return {
      title,
      description: `Rent a ${readableModel} ${readableSinCategory.toLowerCase()}. Best rates and trusted listings on Find On Rent.`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  /* ---------- CASE 2: /location ---------- */
  if (slugData.type === "location") {
    const readableLocation = toReadable(slug);


    // get total vehicles in this location
    const totalCount = await getLocationListingCount(slug);
    const roundedCount = getRoundedCount(totalCount);

    // const rawTitle = `${roundedCount}+ Cars, Bikes & Scooters For Rent in ${readableLocation} | Find On Rent`;
    const rawTitle = `Cars, Bikes & Scooters For Rent in ${readableLocation} | Find On Rent | FindOnRent`;

    // const rawTitle = `Car, Bike & Scooter Rentals in ${readableLocation} | Find On Rent`;
    const title = truncateTitle(rawTitle, 62);

    return {
      title,
      description: `Find cars, bikes, scooters, self drive cars, and other vehicles available for rent in ${readableLocation}. Trusted owners and easy booking on Find On Rent. It's free, No Commission.`,
      alternates: {
        canonical: `${WEB_BASE_DOMAIN_URL}/${slug}`,
      },
      openGraph: {
        title,
        description: `Vehicle rentals in ${readableLocation}`,
        url: `${WEB_BASE_DOMAIN_URL}/${slug}`,
        siteName: "FindOnRent",
        type: "website",
      },
    };
  }

  /* ---------- CASE 3: /category ---------- */
  if (slugData.type === "category") {
    const categoryName = toReadable(slugData.categoryName);
    const categorySinName = toReadable(slugData.categorySinName);

    const page = Number(resolvedSearchParams?.page || 1);

    // get total listings count
    const totalCount = await getCategoryListingCount(slugData.entityId);

    const roundedCount = getRoundedCount(totalCount);

    /*
      const rawTitle = page > 1 ? `${roundedCount}+ ${categoryName} for Rent Near You – Page ${page} | Find On Rent` : `${roundedCount}+ ${categoryName} for Rent Near You | Find On Rent`;
    */
    const rawTitle = page > 1 ? `${categoryName} for Rent Near You – Page ${page} | Find On Rent | FindOnRent` : `${categoryName} for Rent Near You | Find On Rent | FindOnRent`;

    // const rawTitle =
    //   page > 1
    //     ? `Find a ${categorySinName} on Rent Near You – Page ${page} | Find On Rent`
    //     : `Find a ${categorySinName} on Rent Near You | Find On Rent`;

    const title = truncateTitle(rawTitle, 62);

    const canonicalUrl =
      page > 1
        ? `${WEB_BASE_DOMAIN_URL}/${slug}?page=${page}`
        : `${WEB_BASE_DOMAIN_URL}/${slug}`;

    return {
      title,
      description: `Find the best ${categorySinName} rentals near you. Easy booking and affordable prices on Find On Rent. It's free, No Commission.`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description: `Rent a ${categorySinName} on Find On Rent`,
        url: canonicalUrl,
        siteName: "FindOnRent",
        type: "website",
      },
    };
  }


  return {};
}

/* =========================================================
  PAGE RENDERING
  ========================================================= */
export default async function SlugPage({ params, searchParams }) {
  const resolvedParams = await params;
  const { slug, rest = [] } = resolvedParams;

  if (!slug || slug === "_next" || slug.startsWith("_") || slug.includes(".")) {
    notFound();
  }

  const slugData = await resolveSlug(slug);
  if (!slugData) notFound();

  /* ---------- CASE 0: /category/model/location (NEW) ---------- */
  if (rest.length === 2) {
    const modelSlug = rest[0];
    const locationSlug = rest[1];

    // You will need to create this helper in your slugService
    const combo = await resolveCategoryModelLocation(slug, modelSlug, locationSlug);
    if (!combo) notFound();

    // TRIGGER 301 REDIRECT IF OLD SLUG DETECTED
    // if (combo.isOldSlug) {
    //     return {
    //         redirect: {
    //             // Redirect to the CURRENT modelSlug found in the database
    //             destination: `/${slug}/${combo.modelSlug}/${locationSlug}`,
    //             permanent: true, // This triggers the 301 status code
    //         },
    //     };
    // }
    if (combo.isOldSlug) {
      permanentRedirect(`/${slug}/${combo.modelSlug}/${locationSlug}`);
    }

    const breadcrumbSchema = getBreadcrumbSchema({
      type: "category-model-location",
      slug,
      rest, // [modelSlug, locationSlug]
      slugData,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <CategoryModelLocationPage
          categoryId={combo.categoryId}
          modelId={combo.modelId}
          locationId={combo.locationId}
          categoryName={combo.categoryName}
          modelName={combo.modelName}
          modelImageUrl={combo.modelImageUrl}
          cityName={combo.cityName}
          categorySlug={slug}
          modelSlug={modelSlug}
          modelLabel={combo.modelLabel}
          locSlug={locationSlug}
          searchParams={searchParams}
        />
      </>
    );
  }

  /* ---------- CASE 1: /category/location OR /category/model ---------- */
  if (rest.length === 1) {
    const subSlug = rest[0];

    // 1. Try to resolve as Category-Location
    const locationCombo = await resolveCategoryLocation(slug, subSlug);

    if (locationCombo) {
      const breadcrumbSchema = getBreadcrumbSchema({ type: "category-location", slug, rest, slugData });
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}/>
          <CategoryLocationPage
            categorySlug={slug}
            categorySinName={slugData.categorySinName}
            categoryId={locationCombo.categoryId}
            locationId={locationCombo.locationId}
            categoryName={locationCombo.categoryName}
            cityName={locationCombo.cityName}
            locSlug={subSlug}
            searchParams={searchParams}
          />
        </>
      );
    }

    // 2. Try to resolve as Category-Model (New Page Type)
    const modelCombo = await resolveCategoryModel(slug, subSlug);
    if (modelCombo) {
      const breadcrumbSchema = getBreadcrumbSchema({ type: "category-model", slug, rest, slugData });
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
          <CategoryModelPage
            categoryId={modelCombo.categoryId}
            modelId={modelCombo.modelId}
            categorySinName={modelCombo.categorySinName}
            categoryName={modelCombo.categoryName}
            modelName={modelCombo.modelName}
            modelLabel={modelCombo.modelLabel}
            modelImageURL={modelCombo.modelImageURL}
            categorySlug={slug}
            modelSlug={subSlug}
            searchParams={searchParams}
          />
        </>
      );
    }

    notFound();
  }

  /* ---------- CASE 2: /location ---------- */
  if (slugData.type === "location") {
    const breadcrumbSchema = getBreadcrumbSchema({
      type: "location",
      slug,
      slugData,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <LocationPage
          locationId={slugData.entityId}
          locSlug={slugData.slug}
          categorySinName={slugData.categorySinName}
        />
      </>
    );
  }

  /* ---------- CASE 3: /category ---------- */
  if (slugData.type === "category") {
    const breadcrumbSchema = getBreadcrumbSchema({
      type: "category", slug, slugData,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <CategoryPage
          categoryId={slugData.entityId}
          categorySlug={slug}
          searchParams={searchParams}
          categorySinName={slugData.categorySinName}
          categoryName={slugData.categoryName}
        />
      </>
    );
  }

  notFound();
}
