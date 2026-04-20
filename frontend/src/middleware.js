import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  const authUserCookie = request.cookies.get('authUser')?.value;
  let authUser = authUserCookie ? JSON.parse(authUserCookie) : null;

  /** BASE RESPONSE (IMPORTANT) */
  let response = NextResponse.next();

  /** AppShell pathname */
  response.headers.set("x-pathname", pathname);

  /* Skip internal/static files */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/.well-known") ||
    request.method === "HEAD"
  ) {
    return NextResponse.next();
  }
  
  /* Skip Next.js prefetch */
  if (request.headers.get("purpose") === "prefetch") {
    return NextResponse.next();
  }
  
  const acceptHeader = request.headers.get("accept") || "";
  if (!acceptHeader.includes("text/html")) {
    return NextResponse.next();
  }
  
  const isAdminRoute = pathname.startsWith("/adminrohpnl");
  const referer = request.headers.get("referer") || "";
  
  // added console to check
  console.log("next server is running.....");

  // Run GEO only if NOT admin route
  if (isAdminRoute) {

    let ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.ip || "UNKNOWN";

    const forwarded = request.headers.get("x-forwarded-for");
    const userAgent = request.headers.get("user-agent");

    if (forwarded) {
      ip = forwarded.split(",")[0].trim();
    } else if (request.headers.get("x-real-ip")) {
      ip = request.headers.get("x-real-ip");
    }

    // ip = "183.83.54.200";

    /* Bypass geo check for localhost */
    if (ip == "127.0.0.1" || ip == "::1" || ip == "::ffff:127.0.0.1") {
      return NextResponse.next();
    }

    const geoCookie = request.cookies.get("geo_data");

    let geoData = null;

    if (geoCookie) {
      try {
        geoData = JSON.parse(geoCookie.value);
      } catch (err) {
        geoData = null;
      }
    }

    try {
      const res = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/detect-country`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": ip,
            "user-agent": userAgent || "",
            "referer": referer,
          },
          body: JSON.stringify({
            path: pathname,
            geoData: geoData
          }),
        }
      );

      // console.log("Geo API response:", res);

      /* Rate limit hit */
      // if (res.status === 429) {
      //   return new NextResponse(
      //     "Too many requests. Please try again later.",
      //     { status: 429 }
      //   );
      // }

      /* If backend says forbidden */
      // if (res.status === 403) {
      //   return new NextResponse(
      //     "Sorry, the website is not available in this region.",
      //     { status: 403 }
      //   );
      // }

      /* If backend failed unexpectedly */
      if (!res.ok) {
        console.error("Geo API unexpected error:", res.status);
        return new NextResponse(
          "Service temporarily unavailable.",
          { status: 503 }
        );
      }

      const data = await res.json();

      if (data?.isBanned) {
        return new NextResponse(
          "Sorry, the website is not available in this region.",
          { status: 403 }
        );
      }

      response.cookies.set(
        "geo_data",
        JSON.stringify({
          country: data?.country,
          region: data?.region,
          isBanned: data?.isBanned
        }),
        {
          path: "/",
        }
      );

    } catch (err) {
      console.error("Geo detection failed:", err);
    }
  }

  // ================= 301 DYNAMIC REDIRECTS (NEW) =================
  const segments = pathname.split('/').filter(Boolean);

  // Case: /category/model/location (3 segments)
  if (segments.length === 3) {
    const [category, model, location] = segments;

    try {
      const apiRes = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/resolve-category-model-location?category=${category}&model=${model}&location=${location}`,
        { next: { revalidate: 3600 } }
      );
      const result = await apiRes.json();

      if (result.success && result.data.isOldSlug) {
        const newUrl = new URL(`/${category}/${result.data.modelSlug}/${location}`, request.url);
        // Force 301 Permanent Redirect
        return NextResponse.redirect(newUrl, 301);
      }
    } catch (err) {
      console.error("Redirect Middleware Error:", err);
    }
  }

  // Case: /category/model (2 segments)
  if (segments.length === 2) {
    const [category, model] = segments;
    try {
      const apiRes = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/resolve-category-model?category=${category}&model=${model}`,
        { next: { revalidate: 3600 } }
      );
      const result = await apiRes.json();

      if (result.success && result.data.isOldSlug) {
        const newUrl = new URL(`/${category}/${result.data.modelSlug}`, request.url);
        return NextResponse.redirect(newUrl, 301);
      }
    } catch (err) {
      console.error("Redirect Middleware Error (2-seg):", err);
    }
  }

  // ================= LEGACY DB BASED REDIRECTS =================
  try {
    // Skip API & auth related paths to avoid loops
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/adminrohpnl')
    ) {
      // do nothing
    } else {
      const redirectRes = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/pageredirect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "x-forwarded-for": ip,
          },
          body: JSON.stringify({
            page: pathname,
          }),
        }
      );

      if (redirectRes.ok) {
        const redirectData = await redirectRes.json();

        if (
          redirectData.success &&
          redirectData.found &&
          redirectData.target &&
          redirectData.target !== pathname
        ) {
          return NextResponse.redirect(
            new URL(redirectData.target, request.url),
            {
              status: Number(redirectData.type) || 301
            }
          );
        }
      }
    }
  } catch (err) {
    console.error("Legacy DB Redirect Middleware Error:", err);
  }

  // ================= TOKEN EXPIRATION =================
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        response.cookies.delete('authToken');
        response.cookies.delete('authUser');

        const protectedPaths = [
          '/dashboard',
          '/adminrohpnl',
          '/become-a-host',
          '/add-item',
          '/hosting',
        ];

        if (protectedPaths.some(path => pathname.startsWith(path))) {
          const loginUrl = pathname.startsWith('/adminrohpnl')
            ? '/auth/admin'
            : '/login';
          return NextResponse.redirect(new URL(loginUrl, request.url));
        }

        return response;
      }
    } catch (err) {
      response.cookies.delete('authToken');
      response.cookies.delete('authUser');
      return response;
    }
  }

  // ================= REDIRECT HELPERS =================
  const redirectToUserLogin = () => NextResponse.redirect(new URL('/login', request.url));
  const redirectToAdminLogin = () => NextResponse.redirect(new URL('/auth/admin', request.url));
  const redirectToAdminDashboard = () => NextResponse.redirect(new URL('/adminrohpnl', request.url));
  const redirectToUserDashboard = () => NextResponse.redirect(new URL('/dashboard', request.url));
  const redirectToBecomeAHost = () => NextResponse.redirect(new URL('/become-a-host', request.url));

 

  // ================= AUTH PAGES =================
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token && authUser) {
      if (authUser.role_id == 1) return redirectToAdminDashboard();
      return redirectToUserDashboard();
    }
    return response;
  }

  // ================= ADMIN AUTH =================
  /*
  if (pathname.startsWith('/auth/admin')) {
    if (token && authUser && authUser.role_id == 1) {
      return redirectToAdminDashboard();
    }
    return response;
  }
  */
 
  if (pathname.startsWith('/auth/admin')) {
        
    if (token && authUser) {
      if (authUser.role_id == 1) {
        return redirectToAdminDashboard();
      }
      return redirectToUserDashboard();
    }
    return response;
  }

  // ================= ADMIN PANEL =================
  if (pathname.startsWith('/adminrohpnl')) {

    // Not logged in
    if (!token || !authUser) {
      return redirectToAdminLogin();
    }

    // Logged in but NOT admin
    if (authUser.role_id !== 1) {
      return redirectToUserDashboard();
    }

    return response;
  }

  // ================= USER DASHBOARD =================
  if (pathname.startsWith('/dashboard')) {
    if (!token || !authUser) return redirectToUserLogin();

    // Only redirect admin IF not already on admin panel
    if (authUser.role_id === 1 && !pathname.startsWith('/adminrohpnl')) {
      return redirectToAdminDashboard();
    }

    return response;
  }

  // ================= HOSTING LOGIC =================
  if (pathname.startsWith('/become-a-host') || pathname.startsWith('/add-item') || pathname.startsWith('/hosting')) {
    if (!token || !authUser) return redirectToUserLogin();
    if (authUser.role_id === 1) return redirectToAdminDashboard();

    if (pathname.startsWith('/become-a-host') && authUser.is_service_provider === 1) {
      return NextResponse.redirect(new URL('/add-item', request.url));
    }

    if ((pathname.startsWith('/add-item') || pathname.startsWith('/hosting')) && authUser.is_service_provider !== 1) {
      return redirectToBecomeAHost();
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [ '/((?!api|_next|favicon.ico|fonts|images|icon|.well-known).*)']
};