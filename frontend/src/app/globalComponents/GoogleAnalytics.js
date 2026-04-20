"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [load, setLoad] = useState(false);
  const isEnabled = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED === "true";

  // Disable for specific routes
  const isExcluded = pathname?.startsWith("/adminrohpnl") || pathname === "/agents/register-vendors" || pathname === "/auth/admin";

  useEffect(() => {
    if (!isEnabled || isExcluded) return;

    const handleInteraction = () => {
      setLoad(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
    };

    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("mousemove", handleInteraction, { passive: true });

    // Fallback: load after 8 seconds if no interaction
    const timer = setTimeout(() => {
      setLoad(true);
    }, 8000);

    return () => {
      cleanup();
      clearTimeout(timer);
    };
  }, [isEnabled]);

  if (!isEnabled || !load || isExcluded) {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-L4NBJ6Y5VQ"
        strategy="afterInteractive"
      />

      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('js', new Date());
          gtag('config', 'G-L4NBJ6Y5VQ', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}