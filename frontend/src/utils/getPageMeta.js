// import { cookies } from "next/headers";


//  No "use client" here (server utility)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

/**
 * 🔹 getPageMeta(slug)
 * Server-side function for SSR SEO metadata.
 */
export async function getPageMeta(slug = "/") {

  // const cookieStore = await cookies();
  // let city = null;
  // const locationCookie = cookieStore.get("user_location");

  // if (locationCookie?.value) {
  //   try {
  //     const parsed = JSON.parse(locationCookie.value);
  //     city = parsed?.city?.toLowerCase() || null;
  //   } catch {}
  // }

  try {
    // Absolute URL fetch (server-to-server)
    const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getseometa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      cache: "no-store", // fresh data every render
      //  Important: Force server-side mode
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("getPageMeta() → bad response:", res.status);
      throw new Error("Meta fetch failed");
    }

    const data = await res.json();
    const meta = data?.data || {};

    return {
      title: meta.page_title || "FindOnRent | Rent Anything",
      description:
        meta.meta_description ||
        "Book Reliable Rentals From Locals - Fast, Easy Services.",
      keywords: meta.meta_keywords || "rent, hire, services",
      alternates: { canonical: meta.canonical_url || "" },
      openGraph: {
        title: meta.og_title || meta.page_title || "FindOnRent",
        description:
          meta.meta_description ||
          "Book Reliable Rentals From Locals - Fast, Easy Services.",
        images: meta.og_image
          ? [meta.og_image]
          : ["https://findonrent.com/default-og.jpg"],
      },
      robots: meta.noindex === 1 ? "noindex, nofollow" : "index, follow",
    };
  } catch (err) {
    console.error("getPageMeta() error:", err);
    //  fallback safe defaults
    return {
      title: "FindOnRent",
      description:
        "Book Reliable Rentals From Locals - Fast, Easy Services.",
      robots: "index, follow",
    };
  }
}
