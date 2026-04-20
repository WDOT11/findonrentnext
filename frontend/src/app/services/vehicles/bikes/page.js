// "use client";

import { Suspense } from "react";
import Vehiclesbikes from "./Vehiclesbikes";
import FAQSection from "../../../services/vehicles/bikes/components/faqSection";
import Testimonials from "../../../globalComponents/testimonials";
import AboutUs from "./components/aboutUs";
import LatestArtical from "../../../globalComponents/latestArticle";
import ReadyToRide from "../../../services/vehicles/bikes/components/readyToRide";
import WhyChooseUs from "./components/whyChooseUs";
import NeedHelp from "../../../globalComponents/needHelp";
import Seo from "../../../../components/seo/Seo";

export default function BikesPage() {
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/services/vehicles/bikes/" />

      {/* Hero Section and Product Listing */}
      <Suspense>
        <Vehiclesbikes />
      </Suspense>

      {/* FAQ section component */}
      <FAQSection cate_id={3} />

      {/* about us component */}
      <AboutUs />

      {/* Testimonial component */}
      <Testimonials />

      {/* latest artical component */}
      <LatestArtical cate_id={3} />

      {/* why choose us component */}
      <WhyChooseUs />

      {/* FAQ section component */}
      <FAQSection cate_id={3} />

      {/* Testimonial component */}
      <Testimonials />

      {/* about us component */}
      <AboutUs />

      {/* ready to ride component */}
      <ReadyToRide />

      {/* latest artical component */}
      <LatestArtical cate_id={3} />

      {/* need help component */}
      <NeedHelp />
    </>
  );
}
