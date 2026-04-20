"use client";
import "../../globals.css";
import styles from "./aboutUs.module.css";
import Image from "next/image";
import Link from "next/link";
import StarIcon from '../../../../public/star.svg';
import ArrowrightIcon from '../../../../public/arrow.svg';
import VerifiedRedIcon from '../../../../public/verified-red-icon.svg';
import TransparentRricingRedIcon from '../../../../public/transparent-pricing-red-icon.svg';
import PickupDropIcon from '../../../../public/pickup-and-drop-off-red-icon.svg';
import { usePathname } from "next/navigation";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

const ICON_MAP = {
  0: VerifiedRedIcon,
  1: TransparentRricingRedIcon,
  2: PickupDropIcon,
};

/* Category-wise image mapping (AS IT IS) */
const CATEGORY_IMAGE_BY_ID = {
  2: [
    "/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-car2.webp",
    "/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-car.webp",
  ],
  3: [
    "/images/vechiclespg/Your-Go-To-Platform-for-Bike-Rentals-in-Goa1.webp",
    "/images/vechiclespg/Your-Go-To-Platform-for-Bike-Rentals-in-Goa2.webp",
  ],
  8: [
    "/images/vechiclespg/Your-Go-To-Platform-for-Scooter-Rentals-in-Goa-Scooter2.webp",
    "/images/vechiclespg/Your-Go-To-Platform-for-Scooter-Rentals-in-Goa-Scooter.webp",
  ],
  10: [
    "/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-car2.webp",
    "/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-car.webp",
  ],
};


const categorySeoContent = {
    2: { // Cars
    heading: "Your Go-To Platform for Car Rentals in {city}",
    description:
      "Need a comfortable and flexible way to travel around {city}? We connect you with trusted car rental providers offering hatchbacks, sedans, and SUVs for city travel, business use, and outstation trips.",
    features: [
      {
        title: "Verified vendors and well-maintained cars",
        description:
          "Compare multiple verified car rental providers in {city}. Choose vehicles based on group size, comfort, and travel duration.",
      },
      {
        title: "Transparent pricing, no hidden charges",
        description:
          "See clear daily or hourly car rental rates directly from providers. No booking fees or surprise costs.",
      },
      {
        title: "Pickup and drop-off available locally",
        description:
          "Many vendors offer flexible pickup and drop-off across {city}, including airports, hotels, and residential areas.",
      },
    ],
  },
  3: { // Bikes
    heading: "Your Go-To Platform for Bike Rentals in {city}",
    description:
      "Want an easy and affordable way to get around {city}? We help you find trusted bike rental providers offering commuter and premium motorcycles for short trips, daily travel, or weekend rides.",
    features: [
      {
        title: "Verified vendors and quality bikes",
        description:
          "Find verified bike rental providers offering well-maintained motorcycles. Compare models, availability, and rental terms before you decide.",
      },
      {
        title: "Transparent pricing, no hidden charges",
        description:
          "Know the rental cost upfront. No surprises, no extra platform fees. Just clear pricing from local bike rental providers.",
      },
      {
        title: "Flexible pickup options across the city",
        description:
          "Pick up your bike from convenient locations across {city}. Many providers also offer doorstep delivery.",
      },
    ],
  },

  8: { // Scooters
    heading: "Your Go-To Platform for Scooter Rentals in {city}",
    description:
      "Looking for a simple way to explore {city} or manage daily travel? We connect you with trusted scooter rental providers offering ready-to-ride scooters at transparent prices.",
    features: [
      {
        title: "Verified vendors and reliable scooters",
        description:
          "Browse multiple verified scooter rental providers in one place. Compare options and choose what works best for your trip.",
      },
      {
        title: "Transparent pricing, no hidden charges",
        description:
          "See actual rental rates upfront. No inflated prices, no hidden fees. Pay directly to the provider.",
      },
      {
        title: "Delivery available across the city",
        description:
          "Many vendors offer doorstep delivery to your hotel, home, or preferred location within {city}.",
      },
    ],
  },
  10: { // car-with-driver
    heading: "Your Go-To Platform for Car with Driver Services in {city}",
    description:
      "Prefer stress-free travel in {city}? We connect you with trusted car with driver providers offering comfortable vehicles for business travel, airport transfers, sightseeing, and full-day use.",
    features: [
      {
        title: "Verified providers and experienced drivers",
        description:
          "Compare verified car with driver providers in {city}. Choose based on vehicle type, travel needs, and availability.",
      },
      {
        title: "Transparent pricing, no hidden charges",
        description:
          "Get clear pricing details directly from providers. No platform commissions or surprise costs.",
      },
      {
        title: "Flexible travel and pickup options",
        description:
          "Many providers offer flexible pickup locations across {city}, including airports, hotels, offices, and homes.",
      },
    ],
  },
};


export default function AboutUs({cate_id, cat_nm, loc_nm}) {
 const rawContent =
  categorySeoContent[cate_id] || categorySeoContent[3]; // fallback bikes

const replaceVars = (text) =>
  text
    .replaceAll("{category}", cat_nm)
    .replaceAll("{city}", loc_nm);

const heading = replaceVars(rawContent.heading);
const description = replaceVars(rawContent.description);

const features = rawContent.features.map((item) => ({
  title: replaceVars(item.title),
  description: replaceVars(item.description),
}));

const images = CATEGORY_IMAGE_BY_ID[cate_id] || CATEGORY_IMAGE_BY_ID[3];

  return (
    <>
      <section className={styles.roh_aboutUs_wrapper} aria-label="About Find On Rent rental services">
        <div className="container p-0">
          <div className="row">
            {/* Left Content */}
            <div className="col-12 col-md-12 col-lg-6 order-2 order-md-2 order-lg-1 mt-3 mt-md-4 mt-lg-0">
              <div className={styles.banner_bottom}>
                <div className={styles.star_box}>
                  <div className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                    <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                    <span className="roh_star_title">About us</span>
                  </div>
                </div>

                <h3 className={`roh_section_title_h3`}>{heading}</h3>

                <p className={`${styles.global_heading} ${styles.gray_global_heading}`}>
                  {description}
                </p>

                <ul className={styles.about_media_list} aria-label="Key features of Find On Rent">
                  {features.map((item, index) => {
                    const Icon = ICON_MAP[index];
                    return (
                      <li key={index}>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              {Icon && <Icon className="feature-icon" width={30} height={30} aria-hidden="true" />}
                            </div>
                          </div>

                          <div className="media-body">
                            <h4 className={styles.media_title}>{item.title}</h4>
                            <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="d-flex align-items-center justify-content-center justify-content-sm-start mt-3 mt-sm-4 roh_redBtns">
                  <div className="roh_button_custom">
                    <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact us</a>
                  </div>
                  <div className="roh_circl_btn">
                    <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">
                      <ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images */}
            <div className="col-12 col-md-12 col-lg-6 order-1 order-md-1 order-lg-2">
              <div className={styles.body_img_egg}>
                {images.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`${index === 0 ? styles.egg_img1_wrap : styles.egg_img2_wrap} ${
                      index === 0 ? styles.about_img_1 : styles.about_img_2
                    }`}
                  >
                    <div className={index === 0 ? styles.egg_img1 : styles.egg_img2}>
                      <Image
                        className={index === 0 ? styles.eggimg1 : styles.eggimg2}
                        src={imgSrc}
                        alt={`${cat_nm} rental in ${loc_nm}`}
                        width={600}
                        height={400}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* End Right */}
          </div>
        </div>
      </section>
    </>
  );
}
