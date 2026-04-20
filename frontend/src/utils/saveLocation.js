// utils/saveUserLocation.js
export default async function saveUserLocation() {
  try {
    /* ==============================
       Cookie helpers
    ============================== */
    function setCookie(name, value, days = 1) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie =
        name +
        "=" +
        encodeURIComponent(JSON.stringify(value)) +
        "; expires=" +
        expires +
        "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? JSON.parse(decodeURIComponent(match[2])) : null;
    }

    /* ==============================
       1. Ensure Session Exists
    ============================== */
    const sessionRaw = localStorage.getItem("roh_session");
    let sessionObj;

    if (!sessionRaw) {
      sessionObj = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2),
        createdAt: Date.now(),
      };

      localStorage.setItem("roh_session", JSON.stringify(sessionObj));
      setCookie("roh_session", sessionObj, 1);
    } else {
      sessionObj = JSON.parse(sessionRaw);
      const age = Date.now() - sessionObj.createdAt;
      const ttl = 24 * 60 * 60 * 1000;

      if (age > ttl) {
        sessionObj = {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2),
          createdAt: Date.now(),
        };

        localStorage.setItem("roh_session", JSON.stringify(sessionObj));
        setCookie("roh_session", sessionObj, 1);
      }
    }

    /* ==============================
       2. Location Sync Logic
    ============================== */
    const lsLocation = localStorage.getItem("user_location");
    const cookieLocation = getCookie("user_location");

    /** Case: localStorage exists but cookie missing */
    if (lsLocation && !cookieLocation) {
      setCookie("user_location", JSON.parse(lsLocation), 1);
      return;
    }

    /** Case: cookie exists but localStorage missing */
    if (!lsLocation && cookieLocation) {
      localStorage.setItem("user_location", JSON.stringify(cookieLocation));
      return;
    }

    /** Case: both exist → nothing to do */
    if (lsLocation && cookieLocation) return;

    /* ==============================
       3. Fetch & Save Fresh Location
    ============================== */
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return;

    const ipRes = await fetch("https://api.ipify.org?format=json");

    const data = await res.json();
    const ipData = await ipRes.json();

    const loc = {
      ip: ipData.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: Date.now(),
    };

    localStorage.setItem("user_location", JSON.stringify(loc));
    setCookie("user_location", loc, 1);

  } catch (err) {
    /** silent fail */
  }
}
