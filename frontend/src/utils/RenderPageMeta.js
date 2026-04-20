"use client";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

/**
 * RenderPageMeta(slug)
 * Fetches SEO meta for given slug and renders <head> tags automatically.
 * @param {string} slug - Page slug (e.g. "/services")
 */
export default function RenderPageMeta(slug = "/") {
  const [meta, setMeta] = useState({
    page_title: "FindOnRent",
    meta_description: "Book Reliable Rentals From Locals - Fast, Easy Services",
    meta_keywords: "",
    canonical_url: "",
    og_title: "",
    og_image: "",
    noindex: 0,
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getseometa`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });
        const data = await res.json();
        if (data.status && data.data) {
          setMeta({
            page_title: data.data.page_title || "FindOnRent",
            meta_description:
              data.data.meta_description ||
              "Book Reliable Rentals From Locals - Fast, Easy Services",
            meta_keywords: data.data.meta_keywords || "",
            canonical_url: data.data.canonical_url || "",
            og_title: data.data.og_title || "",
            og_image: data.data.og_image || "",
            noindex: Number(data.data.noindex) || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching meta:", err);
      }
    };
    fetchMeta();
  }, [slug]);

  return (
    <head>
      <title>{meta.page_title}</title>
      <meta name="description" content={meta.meta_description} />
      {meta.meta_keywords && (
        <meta name="keywords" content={meta.meta_keywords} />
      )}
      {meta.canonical_url && (
        <link rel="canonical" href={meta.canonical_url} />
      )}
      {meta.og_title && <meta property="og:title" content={meta.og_title} />}
      {meta.og_image && <meta property="og:image" content={meta.og_image} />}
      {meta.noindex === 1 && <meta name="robots" content="noindex, nofollow" />}
    </head>
  );
}
