"use client";
import "../../../../globals.css";
import styles from "./aboutUs.module.css";
import Image from "next/image";

export default function AboutUs() {
  return (
    <>
      <section className={styles.roh_aboutUs_wrapper}>
        <div className={styles.roh_container}>
          <div className="row">
            {/* Left Images */}
            <div className="col-12 col-md-12 col-lg-6 order-2 order-md-2 order-lg-1 mt-3 mt-md-4 mt-lg-0 ">
              <div className={styles.banner_bottom}>
                <div className={styles.star_box}>
                  <div
                    className={`align-items-center gap-1 ${styles.star_inner} ${styles.star_inner}`}
                  >
                    <Image
                      src="/images/homepg/star.svg"
                      alt="Star icon"
                      width={20}
                      height={20}
                    />
                    <span className="roh_star_title">About us</span>
                  </div>
                </div>

                <h2>Your Go-To Platform for Scooter Rentals in Goa</h2>
                <p
                  className={`${styles.global_heading} ${styles.gray_global_heading}`}
                >
                  Exploring Goa’s beaches, cafes, and hidden gems? We connect
                  you with trusted local scooter rental providers offering
                  well-maintained, ready-to-ride scooters at transparent prices.
                </p>

                <ul className={styles.about_media_list}>
                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <Image
                            src="/verified-red-icon.svg"
                            alt="Verified Vendor"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Verified vendors & quality scooters
                        </h5>
                        <p
                          className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                        >
                          Browse multiple verified rental providers in one
                          place. Compare options, check real prices, and choose
                          what works best for your Goa adventure.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <Image
                            src="/transparent-pricing-red-icon.svg"
                            alt="Transparent pricing no hidden charges"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Transparent pricing no hidden charges
                        </h5>
                        <p
                          className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                        >
                          See actual rental rates upfront. No surprise fees, no
                          inflated tourist prices. Directly contact the vendor
                          and pay price without any fees.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <Image
                            src="/pickup-and-drop-off-red-icon.svg"
                            alt="Delivery available across Goa"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Delivery available across Goa
                        </h5>
                        <p
                          className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                        >
                          Many vendors offer doorstep delivery to your hotel or
                          homestay. Save time and start your trip without the
                          hassle of finding a rental shop.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  className={`d-flex align-items-center justify-content-center justify-content-sm-start mt-3 mt-sm-4  roh_redBtns`}
                >
                  <div className="roh_button_custom">
                    <a href="/contact-us">Contact us</a>
                  </div>
                  <div className="roh_circl_btn">
                    <a href="/contact-us">
                      <Image
                        src="/arrow.svg"
                        alt="Arrow Right"
                        width={30}
                        height={30}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-12 col-md-12 col-lg-6 order-1 order-md-1 order-lg-2">
              <div className={styles.body_img_egg}>
                <div
                  className={`${styles.egg_img1_wrap} ${styles.about_img_1}`}
                >
                  <div className={styles.egg_img1}>
                    <Image
                      className={styles.eggimg1}
                      src="/images/vechiclespg/Your-Go-To-Platform-for-Scooter-Rentals-in-Goa-Scooter2.webp"
                      alt="Your Go-To Platform for Scooter Rentals in Go 1"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
                <div
                  className={`${styles.egg_img2_wrap} ${styles.about_img_2}`}
                >
                  <div className={styles.egg_img2}>
                    <Image
                      className={styles.eggimg2}
                      src="/images/vechiclespg/Your-Go-To-Platform-for-Scooter-Rentals-in-Goa-Scooter.webp"
                      alt="Your Go-To Platform for Scooter Rentals in Go 2"
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
