"use client";
import "../../../../globals.css";
import styles from "./aboutUs.module.css";
import Image from "next/image";

export default function AboutUs() {
  return (
    <>
      <section className={styles.roh_aboutUs_wrapper}>
        <div className="container p-0">
          <div className="row">
            {/* Left Images */}
            <div className="col-12 col-md-12 col-lg-6 order-2 order-md-2 order-lg-1 mt-3 mt-md-4 mt-lg-0">
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

                <h2 className={styles.second_heading}>
                  Your Go-To Platform for All Goa Rentals & Activities
                </h2>
                <p
                  className={`${styles.global_heading} ${styles.gray_global_heading}`}
                >
                  First time in Goa? We help you discover trusted local
                  providers for scooters, cars, bikes, and more all in one
                  place. Compare options, get real prices, and connect directly
                  with verified vendors.
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
                          Verified vendors across categories
                        </h5>
                        <p
                          className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                        >
                          From scooters to water sports, we list verified local
                          providers so you can explore Goa with confidence. No
                          more wandering around looking for rental shops.
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
                          Compare actual prices from multiple providers. No
                          platform fees, no inflated rates. Just honest
                          information to help you make the best choice.
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
                            alt="Pickup and drop-off"
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Services available across Goa
                        </h5>
                        <p
                          className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                        >
                          Whether you’re in North Goa’s party hubs or South
                          Goa’s quiet beaches, find what you need nearby. Many
                          vendors offer delivery and flexible pickup options.
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
                      src="/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-recreational-vehicles.webp"
                      alt="Your Go-To Platform for All Goa Rentals & Activities 1"
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
                      src="/images/vechiclespg/Your-Go-To-Platform-for-All-Goa-Rentals-and-Activities-recreational-vehicles2.webp"
                      alt="Your Go-To Platform for All Goa Rentals & Activities 2"
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
