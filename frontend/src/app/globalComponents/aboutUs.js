"use client";
import "../globals.css"
import styles from './css/aboutUs.module.css';
import Image from "next/image";
import Link from "next/link";
import StarIcon from '../../../public/star.svg';
import ArrowrightIcon from '../../../public/arrow.svg';
import { LuCircleCheckBig, LuPiggyBank, LuTruck } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;


export default function AboutUs() {

  return (
    <>
      <section className={styles.roh_aboutUs_wrapper} aria-label="About FindOnRent vehicle rental platform">
        <div className={styles.roh_container}>
          <div className="row">
            {/* Left Images */}

            <div className="col-12 col-md-12 col-lg-6 order-2 order-md-2 order-lg-1 mt-3 mt-md-4 mt-lg-0 ">
              <div className={styles.banner_bottom}>
                <div className={styles.star_box}>
                  <div className={`d-flex align-items-center gap-1 ${styles.star_inner} ${styles.star_inner}`}>
                    <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                    <span className="roh_star_title">About us</span>
                  </div>
                </div>

                <h3 className="roh_section_title_h3">
                  Your Go-To Platform for Vehicle Rentals
                </h3>
                <p className={`${styles.global_heading} ${styles.gray_global_heading}`}>
                  <a href="https://findonrent.com/">FindOnRent</a> connects you with trusted <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`} >rental providers</a> offering <a href={`${WEB_BASE_DOMAIN_URL}/cars`}>cars</a>, <a href={`${WEB_BASE_DOMAIN_URL}/bikes`}>bikes</a>, <a href={`${WEB_BASE_DOMAIN_URL}/scooters`}>scooters</a>, and <a href={`${WEB_BASE_DOMAIN_URL}/cars-with-driver`}>cars with driver</a> services. Compare options, check availability, and connect directly with providers for your travel needs.
                </p>

                <ul className={styles.about_media_list} aria-label="Key features of Find On Rent">
                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <LuCircleCheckBig size={30} style={{ color: "#ff3600" }} aria-hidden="true"/>
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h4 className={`${styles.media_title}`}>
                          Verified providers across vehicle categories
                        </h4>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          Browse multiple verified rental providers offering a wide range of vehicles in one place. Choose what fits your travel requirements.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <LuPiggyBank size={30} style={{ color: "#ff3600" }} aria-hidden="true"/>
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h4 className={`${styles.media_title}`}>
                          Transparent pricing, no hidden charges
                        </h4>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          View clear rental pricing shared directly by providers. No platform fees, no commissions, no surprises.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                         <LuTruck size={30} style={{ color:"#ff3600"}} aria-hidden="true"/>
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h4 className={`${styles.media_title}`}>
                          Flexible pickup and service options
                        </h4>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          Pickup, delivery, and service availability depend on the provider and location. Details are shared upfront before you connect.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className={`d-flex align-items-center justify-content-center justify-content-sm-start mt-3 mt-sm-4  roh_redBtns`}>
                  <div className="roh_button_custom"><a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact us</a></div>
                  <div className="roh_circl_btn">
                    <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent"><ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true"/></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-12 col-md-12 col-lg-6 order-1 order-md-1 order-lg-2">
              <div className={styles.body_img_egg}>
                <div className={`${styles.egg_img1_wrap} ${styles.about_img_1}`}>
                  <div className={styles.egg_img1}>
                    <Image className={styles.eggimg1}
                      src="/images/vechiclespg/Your-Go-To-Platform-for-Reliable-vehicle-Rentals2.webp"
                      alt="Your Go To Platform for Reliable vehicle Rentals 2"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
                <div className={`${styles.egg_img2_wrap} ${styles.about_img_2}`}>
                  <div className={styles.egg_img2}>
                    <Image className={styles.eggimg2}
                      src="/images/vechiclespg/Your-Go-To-Platform-for-Reliable-vehicle-Rentals.webp"
                      alt="Your Go To Platform for Reliable vehicle Rentals 1"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* End Right */}
          </div>
        </div>
      </section>
    </>
  );

}