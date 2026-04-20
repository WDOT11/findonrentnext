// utils/trackItemView.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default async function trackItemView(itemId) {
  try {
    if (!itemId) return;

    /** 1) Extract SESSION ID */
    let session_id = null;
    try {
      const s = JSON.parse(localStorage.getItem("roh_session") || "{}");
      session_id = s.id || null;
    } catch {}

    /** 2) Extract USER ID (from authUser cookie) */
    let user_id = null;
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authUser="));

      if (cookie) {
        const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        user_id = userData.id || null;
      }
    } catch (err) {
      console.warn("Failed to parse authUser cookie:", err);
    }

    /** 3) Extract IP from saved location */
    let ip_address = null;
    try {
      const loc = JSON.parse(localStorage.getItem("user_location") || "{}");
      ip_address = loc.ip || null;
    } catch {}

    /** 4) Send API request */
    await fetch(`${ROH_PUBLIC_API_BASE_URL}/trackitemviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: itemId,
        user_id,
        session_id,
        ip_address
      }),
    });

  } catch (err) {
    console.error("trackItemView failed:", err);
  }
}
