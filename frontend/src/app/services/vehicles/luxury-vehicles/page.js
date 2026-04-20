// "use client";

import { Suspense } from "react";
import Vehiclesluxury from "./Vehiclesluxury";
import FAQSection from '../../../services/vehicles/luxury-vehicles/components/faqSection';
import Testimonials from '../../../globalComponents/testimonials';
import AboutUs from "../../../globalComponents/aboutUs";
import LatestArtical from '../../../globalComponents/latestArticle';
import ReadyToRide from '../../../services/vehicles/luxury-vehicles/components/readyToRide';
import WhyChooseUs from '../../../globalComponents/whyChooseUs';
import NeedHelp from '../../../globalComponents/needHelp';
import Seo from "../../../../components/seo/Seo";


export default function LuxuryPage() {
  return (
    <>

      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/services/vehicles/luxury-vehicles/" />

      {/* Hero Section and Product Listing */}
      <Suspense>
        <Vehiclesluxury />
      </Suspense>

      {/* FAQ section component */}
      <FAQSection cate_id={5} />

      {/* Testimonial component */}
      <Testimonials />

      {/* about us component */}
      <AboutUs />

      {/* why choose us component */}
      <WhyChooseUs />

      {/* ready to ride component */}
      <ReadyToRide />

      {/* latest artical component */}
      <LatestArtical cate_id={5} />


      {/* need help component */}
      <NeedHelp />

    </>
  );
}