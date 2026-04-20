// "use client";
import Testimonials from '../globalComponents/testimonials';
import NeedHelp from '../globalComponents/needHelp';
import styles from '../services/servicesPage.module.css';
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";

export default async function ServicesPage() {
  const metaSchema = await getSeoMeta("/services/");
    return (
        <>
            {/* Works in App Router, truly inside <head> */}
            <Seo slug="/services/" />
          
            {/*Schema Injection */}
            {metaSchema.meta_schema && (
                <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: metaSchema.meta_schema,
                }}
                />
            )}
            
            {/* Hero section  */}
            <div className={styles.prouct_hero_wrap}>
                <div className={styles.prouct_hero_inner}>
                    <div className={styles.prouct_hero}>
                        <div className={`container`}>
                            <div className={styles.Zindex}>
                                <div className={styles.hero_heading}>
                                    <h1 data-wow-duration="2s">Services</h1>
                                </div>
                                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                                    <ol className={styles.breadcrumbList}>
                                    <li>
                                        <a href="/">Home</a>
                                    </li>
                                    <li className={styles.separator}>›</li>
                                    <li aria-current="page">Service</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service products */}
            <section className="services_wrap d-none">
                <div className="explore_wrap_inner">
                    <div className="explore_wrap_main">

                        <div className="container">
                            <div className="main_data_wrap">

                                <div className="card_box">
                                    <div className="card_box_inner">
                                        <ul className="explore_media_list">
                                            <li>
                                                <div className="media">
                                                    <div className="media_imgbox">
                                                        <div className="back_circle">
                                                            <img src="assets/images/vehicles-icon.svg"/>
                                                        </div>
                                                    </div>
                                                    <div className="media-body">
                                                        <h5 className="media_title">Vehicles</h5>
                                                        <p className="global_heading media_desc gray_global_heading">Find a ride that fits your need—from city scooters to family SUVs and delivery vans.</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="category-tags">
                                            <a href="#" className="tag">Cars</a>
                                            <a href="#" className="tag">Electric Car</a>
                                            <a href="#" className="tag">Two-Wheelers</a>
                                            <a href="#" className="tag">Commercial Vehicles</a>
                                            <a href="#" className="tag">Vintage Car</a>
                                            <a href="#" className="tag">Off-road Jeep</a>
                                        </div>
                                        <div className="circl_btn top_seprator">
                                            <strong>Starting at ₹299/day</strong>
                                            <a href="#">
                                                <button><img src="/arrow.svg"/></button>
                                            </a>
                                        </div>
                                    </div>

                                </div>

                                <div className="card_box">
                                    <div className="card_box_inner">
                                        <ul className="explore_media_list">
                                            <li>
                                                <div className="media">
                                                    <div className="media_imgbox">
                                                        <div className="back_circle">
                                                            <img src="assets/images/electronic/electronic-devices.svg"/>
                                                        </div>
                                                    </div>
                                                    <div className="media-body">
                                                        <h5 className="media_title">Electronics</h5>
                                                        <p className="global_heading media_desc gray_global_heading"> Rent the latest tech for work, study, or play—premium gadgets for any need.</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="category-tags">
                                            <a href="#" className="tag">Laptop</a>
                                            <a href="#" className="tag">Monitor</a>
                                            <a href="#" className="tag">Camera</a>
                                            <a href="#" className="tag">Phone</a>
                                            <a href="#" className="tag">Projector</a>
                                            <a href="#" className="tag">Gaming Console</a>
                                            <a href="#" className="tag">Drone</a>
                                            <a href="#" className="tag">Printer</a>
                                        </div>
                                        <div className="circl_btn top_seprator">
                                            <strong>Starting at ₹350/day</strong>
                                            <a href="#">
                                                <button><img src="/arrow.svg"/></button>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="card_box">
                                    <div className="card_box_inner">
                                        <ul className="explore_media_list">
                                            <li>
                                                <div className="media">
                                                    <div className="media_imgbox">
                                                        <div className="back_circle">
                                                            <img src="assets/images/electric-appliance.svg"/>
                                                        </div>
                                                    </div>
                                                    <div className="media-body">
                                                        <h5 className="media_title">Home Appliances</h5>
                                                        <p className="global_heading media_desc gray_global_heading">Essential appliances for temporary homes, offices, or seasonal needs—hassle-free rentals.</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="category-tags">
                                            <a href="#" className="tag">Refrigerator</a>
                                            <a href="#" className="tag">Washing Machine</a>
                                            <a href="#" className="tag">Microwave</a>
                                            <a href="#" className="tag">Air Conditioner</a>
                                            <a href="#" className="tag">TV</a>
                                            <a href="#" className="tag">Water Purifier</a>
                                        </div>
                                        <div className="circl_btn top_seprator">
                                            <strong>Starting at ₹199/day</strong>
                                            <button><svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" id="fi_9210374"><g clip-rule="evenodd" fill="rgb(0,0,0)" fill-rule="evenodd"><path d="m4 16c0-.5523.44772-1 1-1h22c.5523 0 1 .4477 1 1s-.4477 1-1 1h-22c-.55228 0-1-.4477-1-1z"></path><path d="m17.2929 6.29289c.3905-.39052 1.0237-.39052 1.4142 0l9 9.00001c.3905.3905.3905 1.0237 0 1.4142l-9 9c-.3905.3905-1.0237.3905-1.4142 0s-.3905-1.0237 0-1.4142l8.2929-8.2929-8.2929-8.29289c-.3905-.39053-.3905-1.02369 0-1.41422z"></path></g></svg></button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>


            {/* Testimonial component */}
            <Testimonials />

            {/* need help component */}
            <NeedHelp />

        </>
    );

}