import styles from './vehicles.module.css';
import HeroSection from '../../globalComponents/heroSection';
import AboutUs from '../../globalComponents/aboutUs';
import FAQSection from './faqSection';
import InnerServicesnew from '../../globalComponents/innerServicesnew';
import LatestArtical from '../../globalComponents/latestArticle';
import WhyChooseUs from '../../globalComponents/whyChooseUs';
import NeedHelp from '../../globalComponents/needHelp';
import ReadyToRide from '../../globalComponents/readyToRide';
import Testimonials from '../../globalComponents/testimonials';
import TestimonialsNew from '../../globalComponents/testimonialsNew';
import InnerServices from '../../globalComponents/innerServices';
import Seo from "../../../components/seo/Seo";
import { getSeoMeta } from "../../../lib/getSeoMeta";
export const dynamic = "force-dynamic";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

async function getVehicleCategories() {
    try {
        const resp = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent_category_id: 1 }),
            cache: "no-store", /** SSR fresh data */
        });

        return await resp.json();
    } catch (error) {
        console.error("Server fetch error:", error);
        return [];
    }
}

export default async function Vechicles() {
    const metaSchema = await getSeoMeta("/services/vehicles/");
    const categories = await getVehicleCategories(); /** SERVER SIDE  */

    return (
        <>
            <Seo slug="/services/vehicles/" />

            {metaSchema.meta_schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: metaSchema.meta_schema,
                    }}
                />
            )}

            {/* Hero section */}
            <HeroSection />

            {/* Innser services section */}
            {/* <InnerServices /> */}
            
            {/* Innser services New section */}
            <InnerServicesnew categories={categories} />

            {/* FAQ section component */}
            <FAQSection cate_id={1} />
            
            {/* about us component */}
            <AboutUs />


            {/* Testimonial component */}
            {/* <Testimonials/> */}

            {/* TestimonialNew component */}
            {/* <TestimonialsNew/> */}

            {/* latest artical component */}
            <LatestArtical cate_id={1} />

            {/* why choose us component */}
            <WhyChooseUs/>

            {/* ready to ride component */}
            <ReadyToRide/>

            {/* need help component */}
            <NeedHelp/>
        </>
    );
}
