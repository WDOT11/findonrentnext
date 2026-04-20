const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export async function getCategoryListingCount(categoryId) {
  try {
    if (!categoryId) return 0;

    const url = `${ROH_PUBLIC_API_BASE_URL}/category-listing-count/${categoryId}`;
    const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    });

    if (!res.ok) {
      return 0;
    }

    const response = await res.json();
    if (!response.success || typeof response.count !== "number") {
      return 0;
    }

    return response.count;

  } catch (error) {
    console.error("getCategoryListingCount error:", error);
    return 0;
  }
}

export async function getLocationListingCount(locationSlug) {
  try {
    if (!locationSlug) return 0;

    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/location-listing-count/${locationSlug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) return 0;

    const response = await res.json();

    if (!response.success || typeof response.count !== "number") {
      return 0;
    }

    return response.count;

  } catch (error) {
    console.error("getLocationListingCount error:", error);
    return 0;
  }
}

export async function getCategoryLocationListingCount(categoryId, locationSlug) {
  try {
    if (!categoryId || !locationSlug) return 0;

    const url = `${ROH_PUBLIC_API_BASE_URL}/category-location-listing-count/${categoryId}/${locationSlug}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("API request failed:", res.status);
      return 0;
    }

    const response = await res.json();

    if (!response.success || typeof response.count !== "number") {
      return 0;
    }

    return response.count;

  } catch (error) {
    console.error("getCategoryLocationListingCount error:", error);
    return 0;
  }
}

export async function getCategoryModelListingCount(categoryId, modelSlug) {
  try {
    if (!categoryId || !modelSlug) return 0;

    const url = `${ROH_PUBLIC_API_BASE_URL}/category-model-listing-count/${categoryId}/${modelSlug}`;
    const res = await fetch(url, { method: "GET", cache: "no-store" });

    if (!res.ok) return 0;

    const response = await res.json();

    if (!response.success || typeof response.count !== "number") return 0;

    return response.count;

  } catch (error) {
    console.error("getCategoryModelListingCount error:", error);
    return 0;
  }
}

export async function getCategoryModelLocationListingCount(categoryId, modelSlug, locationSlug) {
  try {
    if (!categoryId || !modelSlug || !locationSlug) return 0;

    const url = `${ROH_PUBLIC_API_BASE_URL}/category-model-location-listing-count/${categoryId}/${modelSlug}/${locationSlug}`;
    const res = await fetch(url, { method: "GET", cache: "no-store" });

    if (!res.ok) return 0;

    const response = await res.json();

    if (!response.success || typeof response.count !== "number") return 0;

    return response.count;

  } catch (error) {
    console.error("getCategoryModelLocationListingCount error:", error);
    return 0;
  }
}