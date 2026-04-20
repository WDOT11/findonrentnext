// utils/fetchWrapper.js
export async function fetchWrapper(url, options) {
  const res = await fetch(url, { ...options, cache: "no-store" });

  if (!res.ok) {
    if (res.status === 429) {
      // Handle rate limit globally
      // console.log("Rate limit hit for URL:", url);
      throw new Error("RATE_LIMIT");
    }
    throw new Error(`HTTP_ERROR_${res.status}`);
  }

  return res.json();
}