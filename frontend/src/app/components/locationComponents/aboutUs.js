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


export default function AboutUs({ cate_id, city_data }) {

  const Icon0 = ICON_MAP[0];
  const Icon1 = ICON_MAP[1];
  const Icon2 = ICON_MAP[2];
  const images = categoryDoubleImages[cate_id] || categoryDoubleImages[3];

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
                      About us
                    </span>
                  </div>
                </div>

                <h3 className="roh_section_title_h3">
                  Your Go-To Platform for Rentals in {city_data?.city_name || "City"}
                </h3>

                <p className={`${styles.global_heading} ${styles.gray_global_heading}`}>
                  Looking for reliable rental services in {city_data?.city_name || "City"}? We connect you with trusted local rental providers offering cars, bikes, scooters, and chauffeur-driven options to suit different travel needs. Whether it’s daily commuting, business travel, or exploring the city, FindOnRent helps you find the right option in one place.
                </p>

                <ul className={styles.about_media_list} aria-label="Key features of Find On Rent">
                    <li>
                      <div className={styles.media}>
                        <div className={styles.media_imgbox}>
                          <div className={styles.back_circle}>
                            {Icon0 && <Icon0 className="feature-icon" width={30} height={30} aria-hidden="true"/>}
                          </div>
                        </div>

                        <div className="media-body">
                          <h4 className={styles.media_title}>
                            Verified providers you can trust
                          </h4>
                          <p
                            className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                          >
                            Browse multiple verified rental providers listed for {city_data?.city_name || "City"}. Compare options, check availability, and choose what fits your travel plan best.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className={styles.media}>
                        <div className={styles.media_imgbox}>
                          <div className={styles.back_circle}>
                            {Icon1 && <Icon1 className="feature-icon" width={30} height={30} />}
                          </div>
                        </div>

                        <div className="media-body">
                          <h4 className={styles.media_title}>
                            Transparent pricing, no hidden charges
                          </h4>
                          <p
                            className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                          >
                            Get clear rental pricing directly from providers. No platform fees, no hidden costs. Just straightforward pricing from local businesses.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className={styles.media}>
                        <div className={styles.media_imgbox}>
                          <div className={styles.back_circle}>
                            {Icon2 && <Icon2 className="feature-icon" width={30} height={30} />}
                          </div>
                        </div>

                        <div className="media-body">
                          <h4 className={styles.media_title}>
                            Flexible pickup and drop-off options
                          </h4>
                          <p
                            className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                          >
                            Many providers offer convenient pickup and drop-off locations across {city_data?.city_name || "City"}, including hotels, homes, and transport hubs.
                          </p>
                        </div>
                      </div>
                    </li>
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