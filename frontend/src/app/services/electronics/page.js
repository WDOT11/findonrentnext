"use client";

import React from "react";
import HeroSection from "./components/heroSection";
import InnerServices from "./components/innerServices";
import FreshInventory from "./components/freshInventory";
import AboutUs from "./components/aboutUs";
import FAQSection from "./components/faqSection";
import DarkCta from "./components/darkCta";
import NeeddHelp from "./components/needHelp";

// export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Inner Services */}
      <InnerServices />

      {/* Fresh Inventory */}
      <FreshInventory />

      {/* About Us */}
      <AboutUs />

      {/* FAQ Section */}
      <FAQSection />

      {/* Dark CTA */}
      <DarkCta />

      {/* Need Help */}
      <NeeddHelp />
      
    </>
  );
}