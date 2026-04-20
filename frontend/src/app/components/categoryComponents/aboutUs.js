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
import { LuCircleCheckBig, LuPiggyBank, LuTruck  } from "react-icons/lu";
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

const ICON_MAP = {
  0: VerifiedRedIcon,
  1: TransparentRricingRedIcon,
  2: PickupDropIcon,
};



/* Category-wise image mapping */
const categoryDoubleImages = {
  2: [
    "/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-car2.webp",
    "/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-car.webp",
  ],
  10: [
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
};

/* Category-wise About Us content mapping (TEXT ONLY) */
const categoryAboutUsContent = {
  3: {
    badge: "About us",
    heading: "Discover Bike Rental Services Near You",
    description:
      "Need a flexible and affordable way to travel? FindOnRent helps you find trusted bike rental providers offering commuter and premium motorcycles for daily use, short trips, and leisure rides.",
    features: [
      {
        title: "Verified bike rental providers",
        description:
          "Explore multiple verified bike rental listings in one place. Compare bike models and rental terms before making a choice.",
      },
      {
        title: "Clear pricing, no hidden costs",
        description:
          "Rental pricing is shared directly by providers. No booking fees or surprise charges.",
      },
      {
        title: "Pickup and delivery based on location",
        description:
          "Pickup and delivery options depend on the provider and city availability.",
      },
    ],
  },

  2: {
    badge: "About us",
    heading: "Find Reliable Car Rental Services Across India",
    description:
      "Looking for a convenient way to rent a car? FindOnRent connects you with verified car rental providers offering hatchbacks, sedans, and SUVs for city travel, business use, and outstation trips across multiple locations.",
    features: [
      {
        title: "Verified providers and quality vehicles",
        description:
          "Browse trusted car rental providers listed on our platform. Compare vehicle options, availability, and rental terms before contacting the provider directly.",
      },
      {
        title: "Transparent pricing, no platform fees",
        description:
          "View clear rental pricing shared by providers. No hidden charges, no commissions. You connect directly with the rental business.",
      },
      {
        title: "Flexible pickup options",
        description:
          "Many providers offer flexible pickup and drop-off options depending on location and availability.",
      },
    ],
  },

  8: {
    badge: "About us",
    heading: "Find Scooter Rentals for Easy City Travel",
    description:
      "Scooters are a simple and efficient way to manage daily travel. FindOnRent connects you with local scooter rental providers offering ready-to-ride scooters at transparent prices.",
    features: [
      {
        title: "Trusted scooter rental providers",
        description:
          "Compare verified providers and available scooter options before contacting the rental business directly.",
      },
      {
        title: "Upfront pricing from providers",
        description:
          "See actual rental rates without inflated prices or platform fees.",
      },
      {
        title: "Convenient delivery options",
        description:
          "Many providers offer doorstep delivery depending on location and availability.",
      },
    ],
  },

  10: {
    badge: "About us",
    heading: "Find Trusted Car with Driver Services",
    description:
      "Prefer a comfortable and stress-free travel experience? FindOnRent helps you connect with verified car with driver providers offering services for business travel, airport transfers, and full-day usage.",
    features: [
      {
        title: "Verified providers and experienced drivers",
        description:
          "Compare car with driver services offered by trusted providers. Choose based on vehicle type and travel needs.",
      },
      {
        title: "Transparent pricing shared by providers",
        description:
          "No platform commissions or hidden charges. Pricing and terms are discussed directly with the provider.",
      },
      {
        title: "Flexible usage options",
        description:
          "Services may be available for hourly, full-day, or outstation travel depending on provider policies.",
      },
    ],
  },
};

export default function AboutUs({ cate_id }) {
  const aboutData =
    categoryAboutUsContent[cate_id] || categoryAboutUsContent[3];

  const images =
    categoryDoubleImages[cate_id] || categoryDoubleImages[3];

  return (
    <>
      <section className={styles.roh_aboutUs_wrapper} aria-label="About Find On Rent">
        <div className="container p-0">
          <div className="row">
            {/* Left Content */}
            <div className="col-12 col-md-12 col-lg-6 order-2 order-md-2 order-lg-1 mt-3 mt-md-4 mt-lg-0">
              <div className={styles.banner_bottom}>
                <div className={styles.star_box}>
                  <div className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                    <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>

                    <span className="roh_star_title">
                      {aboutData.badge}
                    </span>
                  </div>
                </div>

                <h3 className="roh_section_title_h3">
                  {aboutData.heading}
                </h3>

                <p>
                  {aboutData.description}
                </p>

                <ul className={styles.about_media_list} aria-label="Key features of Find On Rent">
                {aboutData.features.map((item, index) => {
                  const Icon = ICON_MAP[index];

                  return (
                    <li key={index}>
                      <div className={styles.media}>
                        <div className={styles.media_imgbox}>
                          <div className={styles.back_circle}>
                            {Icon && <Icon className="feature-icon" width={30} height={30} aria-hidden="true"/>}
                          </div>
                        </div>

                        <div className="media-body">
                          <h4 className={styles.media_title}>
                            {item.title}
                          </h4>
                          <p
                            className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                          >
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
                        alt={`Category ${cate_id} image ${index + 1}`}
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