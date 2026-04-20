import { cookies } from "next/headers";
import HeaderClient from "./HeaderClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default async function Header({ isMounted, isLoggedIn }) {
  /* ===========================
    Read city from cookie
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
    Fetch categories (Cached)
  =========================== */
  let categories = [];
  let loading = true;

  try {
    const resp = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent_category_id: 1 }),
      next: { revalidate: 3600, tags: ['header-categories'] },
    });

    const data = await resp.json();
    categories = Array.isArray(data) ? data : data?.data || [];
    loading = false;
  } catch (err) {
    console.error("Header category error", err);
    loading = false;
  }

  return (
    <HeaderClient
      isMounted={isMounted}
      isLoggedIn={isLoggedIn}
      city={city}
      categories={categories}
      loading={loading}
    />
  );
}
