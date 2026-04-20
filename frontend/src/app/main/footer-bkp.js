import { cookies } from "next/headers";
import FooterClient from "./FooterClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const API_BASE_PUBLIC_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default async function Footer() {
  /* ===========================
      Read city from cookie (SERVER)
  =========================== */
  const cookieStore = await cookies();

  let city = null;
  const locationCookie = cookieStore.get("user_location");

  if (locationCookie?.value) {
    try {
      const parsed = JSON.parse(locationCookie.value);
      city = parsed?.city?.toLowerCase() || null;
    } catch {}
  }

  /* ===========================
      Fetch Categories (SERVER)
  =========================== */
  let categories = [];
  try {
    const resp = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent_category_id: 1 }),
      cache: "no-store",
    });

    const data = await resp.json();
    if (Array.isArray(data)) {
      categories = data;
    } else if (Array.isArray(data?.data)) {
      categories = data.data;
    }
  } catch (err) {
    console.error("Footer category error", err);
  }

  /* ===========================
      Fetch Trending Searches (SERVER)
  =========================== */
  let trending = [];
  try {
    const resp = await fetch(`${API_BASE_PUBLIC_URL}/trendingsearches`, {
      cache: "no-store",
    });

    const json = await resp.json();
    if (json?.success && Array.isArray(json.data)) {
      trending = json.data;
    }
  } catch (err) {
    console.error("Footer trending error", err);
  }

  /* ===========================
      Fetch Category + Models Footer API (SERVER)
  =========================== */
  let categoryModels = [];
  try {
    const resp = await fetch(
      `${API_BASE_PUBLIC_URL}/getCategoryModelsFooter`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const json = await resp.json();
    if (json?.success && Array.isArray(json.data)) {
      categoryModels = json.data;
    }
  } catch (err) {
    console.error("Footer category-model error", err);
  }

  /* ===========================
      Fetch Category + Models + Locations Footer API (SERVER)
  =========================== */
  let categoryModelsLocations = [];
  try {
    const resp = await fetch(
      `${API_BASE_PUBLIC_URL}/getAllCategoryModelsLocationFooter`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const json = await resp.json();
    if (json?.success && Array.isArray(json.data)) {
      categoryModelsLocations = json.data;
    }
  } catch (err) {
    console.error("Footer category-model error", err);
  }

  return (
    <FooterClient
      city={city}
      categories={categories}
      trending={trending}
      categoryModels={categoryModels}
      categoryModelsLocations={categoryModelsLocations}
    />
  );
}
