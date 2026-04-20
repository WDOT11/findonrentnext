// app/services/vehicles/cars/page.js

import Vehiclescars from "./Vehiclescars";
import FAQSection from "../../../services/vehicles/cars/components/faqSection";
import Testimonials from "../../../globalComponents/testimonials";
import AboutUs from "./components/aboutUs";
import LatestArtical from "../../../globalComponents/latestArticle";
import ReadyToRide from "../../../services/vehicles/cars/components/readyToRide";
import WhyChooseUs from "./components/whyChooseUs";
import NeedHelp from "../../../globalComponents/needHelp";
import Seo from "../../../../components/seo/Seo";


const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default async function CarsPage({ searchParams }) {
   // MUST await
  const params = await searchParams;

  // USE params, NOT searchParams
  const page = params?.page || 1;
  const q = params?.q || "";
  const location = params?.location || "";
  const brand = params?.brand_slug || "";
  const tag = params?.tag_slug || "";


  /* ---------------- SERVER FETCH ---------------- */
  const [productsRes, brandsRes, tagsRes] = await Promise.all([
    fetch(
      `${ROH_PUBLIC_API_BASE_URL}/getallvehiclescars?cat_id=2&page=${page}&limit=28&q=${q}&location=${location}&brand_slug=${brand}&tag_slug=${tag}`,
      { cache: "no-store" }
    ),
    fetch(`${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: 2 }),
    }),
    fetch(`${ROH_PUBLIC_API_BASE_URL}/getvehiclestags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_id: 2 }),
    }),
  ]);

  const productsData = await productsRes.json();
  const brandsData = await brandsRes.json();
  const tagsData = await tagsRes.json();


  return (
    <>
      <Seo slug="/services/vehicles/cars/" />

      {/* Data already available here */}
      <Vehiclescars
        initialProducts={productsData.products || []}
        total={productsData.total || 0}
        brands={brandsData.brands || []}
        tags={tagsData.models || []}
      />

      <WhyChooseUs />
      <FAQSection cate_id={2} />
      <Testimonials />
      <AboutUs />
      <ReadyToRide />
      <LatestArtical cate_id={2} />
      <NeedHelp />
    </>
  );
}
