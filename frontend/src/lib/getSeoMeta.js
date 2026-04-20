import { cookies } from "next/headers";
import { cache } from "react";

/** lib/getSeoMeta.js */
export const getSeoMeta = cache(async (slug) => {

  const cookieStore = await cookies();
  let ip = null;
  const locationCookie = cookieStore.get("user_location");


  if (locationCookie?.value) {
    try {
      const parsed = JSON.parse(locationCookie.value);
      ip = parsed?.ip?.toLowerCase() || null;
    } catch {}
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL}/getseometa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "x-forwarded-for": ip,
      },
      body: JSON.stringify({ slug }),
      /** 
       * Enable revalidation (1 hour) instead of no-store.
       * This speeds up page generation as the server doesn't wait for a fresh DB hit.
       */
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Failed to fetch SEO meta for ${slug}`);
    const result = await res.json();

    if (!result.status || !result.data) {
      throw new Error(result.message || "No SEO meta found");
    }

    return result.data;
  } catch (err) {
    // console.error("SEO Meta Error:", err);
    return {
      page_title: "FindOnRent | Reliable Rentals",
      meta_description: "Find and book vehicles, bikes, and tools on rent.",
      meta_keywords: "FindOnRent, rental, cars, bikes, rent near me",
      og_title: "FindOnRent",
      og_image: "/default-og.jpg",
      canonical_url: "https://findonrent.com/",
      meta_schema: "{...json...}",
      noindex: 0,
    };
  }
});
