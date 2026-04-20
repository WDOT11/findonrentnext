// "use client";

import { Suspense } from "react";
import Vehiclesscooters from "./Vehiclesscooters";
import FAQSection from '../../../services/vehicles/scooters/components/faqSection';
import Testimonials from '../../../globalComponents/testimonials';
import AboutUs from "./components/aboutUs";
import LatestArtical from '../../../globalComponents/latestArticle';
import ReadyToRide from '../../../services/vehicles/scooters/components/readyToRide';
import WhyChooseUs from './components/whyChooseUs';
import NeedHelp from '../../../globalComponents/needHelp';
import Seo from "../../../../components/seo/Seo";

export default function BikesPage() {
  return (
    <>

      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/services/vehicles/scooters/" />

      {/* Hero Section and Product Listing */}
      <Suspense >
        <Vehiclesscooters />
      </Suspense>

      {/* why choose us component */}
      <WhyChooseUs />

     {/* FAQ section component */}
      <FAQSection cate_id={8} />

      {/* Testimonial component */}
      <Testimonials />

      {/* about us component */}
      <AboutUs />

      {/* ready to ride component */}
      <ReadyToRide />

      {/* latest artical component */}
      <LatestArtical cate_id={8} />

      {/* need help component */}
      <NeedHelp />

    </>
  );
}