import { cache } from 'react';

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export const resolveSlug = cache(async (slug) => {
  try {
    if (!slug) return null;

    const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getslugs/${slug}`, {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const response = await res.json();

    if (!response.success || !response.data) {
      return null;
    }

    return {
      slug: response.data.slug,
      categorySinName: response.data.categorySinName,
      type: response.data.type,
      entityId: response.data.entityId,
      categoryName: response.data.categoryName,
    };

  } catch (error) {
    console.error("resolveSlug error:", error);
    return null;
  }
});

export const resolveCategoryLocation = cache(async (categorySlug, locationSlug) => {
  const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/resolve-category-location?category=${categorySlug}&location=${locationSlug}`,
    {
      method: "GET",
      cache: "no-store"
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  return data.success ? {categoryId: data.data.categoryId,locationId: data.data.locationId, categoryName: data.data.categoryName, cityName: data.data.cityName, categorySinName: data.data.categorySinName, locationSlug: data.data.locationSlug} : null;
});

export const resolveCategoryModelLocation = cache(async (categorySlug, modelSlug, locationSlug) => {
  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/resolve-category-model-location?category=${categorySlug}&model=${modelSlug}&location=${locationSlug}`,
      { method: "GET", cache: "no-store" }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return data.success ? data.data : null;
  } catch (error) {
    console.error("resolveCategoryModelLocation error:", error);
    return null;
  }
});

export const resolveCategoryModel = cache(async (categorySlug, modelSlug) => {
  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/resolve-category-model?category=${categorySlug}&model=${modelSlug}`,
      {
        method: "GET",
        cache: "no-store"
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    // Returning data similar to your other resolvers for consistency
    return data.success ? {
      categoryId: data.data.categoryId,
      modelId: data.data.modelId,
      categoryName: data.data.categoryName,
      modelName: data.data.modelName,
      modelLabel: data.data.modelLabel,
      categorySinName: data.data.categorySinName,
      modelImageURL: data.data.modelImageUrl,
      isOldSlug: data.data.isOldSlug
    } : null;

  } catch (error) {
    console.error("resolveCategoryModel error:", error);
    return null;
  }
});