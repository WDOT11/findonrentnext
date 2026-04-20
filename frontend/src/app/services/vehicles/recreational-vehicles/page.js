// "use client";

import { Suspense } from "react";
import Vehiclesrecreational from "./Vehiclesrecreational";
import FAQSection from "../../../services/vehicles/recreational-vehicles/components/faqSection";
import Testimonials from "../../../globalComponents/testimonials";
import AboutUs from "./components/aboutUs";
import LatestArtical from "../../../globalComponents/latestArticle";
import ReadyToRide from "../../../services/vehicles/recreational-vehicles/components/readyToRide";
import WhyChooseUs from "./components/whyChooseUs";
import NeedHelp from "../../../globalComponents/needHelp";
import Seo from "../../../../components/seo/Seo";

export default function RecreationalPage() {
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/services/vehicles/recreational-vehicles/" />

      {/* Hero Section and Product Listing */}
      <Suspense>
        <Vehiclesrecreational />
      </Suspense>

      {/* FAQ section component */}
      <FAQSection cate_id={6} />

      {/* about us component */}
      <AboutUs />

      {/* Testimonial component */}
      <Testimonials />

      {/* latest artical component */}
      <LatestArtical cate_id={2} />

      {/* why choose us component */}
      <WhyChooseUs />

      {/* ready to ride component */}
      <ReadyToRide />

      {/* need help component */}
      <NeedHelp />
    </>
  );
}
