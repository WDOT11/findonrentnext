// "use client";

import { Suspense } from "react";
import VehiclescarWithDriver from "./VehiclescarWithDriver";
import FAQSection from '../../../services/vehicles/cars/components/faqSection';
import Testimonials from '../../../globalComponents/testimonials';
import AboutUs from "./components/aboutUs";
import LatestArtical from '../../../globalComponents/latestArticle';
import ReadyToRide from '../../../services/vehicles/cars/components/readyToRide';
import WhyChooseUs from './components/whyChooseUs';
import NeedHelp from '../../../globalComponents/needHelp';
import Seo from "../../../../components/seo/Seo";


export default function CarsPage() {
  return (
    <>
      {/* Works in App Router, truly inside <head> */}
      <Seo slug="/services/vehicles/car-with-driver/" />

      {/* Hero Section and Product Listing */}
      <Suspense >
        <VehiclescarWithDriver />
      </Suspense>

      {/* why choose us component */}
      <WhyChooseUs />

      {/* FAQ section component */}
      <FAQSection cate_id={2} />

      {/* Testimonial component */}
      <Testimonials />

      {/* about us component */}
      <AboutUs />

      {/* ready to ride component */}
      <ReadyToRide />

      {/* latest artical component */}
      <LatestArtical cate_id={2} />

      {/* need help component */}
      <NeedHelp />
    </>
  );
}