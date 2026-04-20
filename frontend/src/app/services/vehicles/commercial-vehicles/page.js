// "use client";

import { Suspense } from "react";
import Vehiclescommercial from "./Vehiclescommercial";
import FAQSection from '../../../services/vehicles/commercial-vehicles/components/faqSection';
import Testimonials from '../../../globalComponents/testimonials';
import AboutUs from "./components/aboutUs";
import LatestArtical from '../../../globalComponents/latestArticle';
import ReadyToRide from '../../../services/vehicles/commercial-vehicles/components/readyToRide';
import WhyChooseUs from '../../../globalComponents/whyChooseUs';
import NeedHelp from '../../../globalComponents/needHelp';
import Seo from "../../../../components/seo/Seo";

export default function CommercialPage() {
  return (

    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/services/vehicles/commercial-vehicles/" />

      {/* Hero Section and Product Listing */}
      <Suspense>
        <Vehiclescommercial />
      </Suspense>

      {/* FAQ section component */}
      <FAQSection cate_id={4} />

      {/* Testimonial component */}
      <Testimonials />

      {/* about us component */}
      <AboutUs />

      {/* why choose us component */}
      <WhyChooseUs />

      {/* ready to ride component */}
      <ReadyToRide />

      {/* latest artical component */}
      <LatestArtical cate_id={4} />


      {/* need help component */}
      <NeedHelp />

    </>
  );
}