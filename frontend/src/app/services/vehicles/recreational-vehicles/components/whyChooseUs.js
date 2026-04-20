"use client";
import "../../../../globals.css";
import styles from "./whyChooseUs.module.css";
import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <>
      <section className={styles.whychoose_wrap}>
        <div className={`container p-0 ${styles.whychoose_inner}`}>
          <div className={styles.whychoose_wrap_main}>
            <div className={`d-flex justify-content-center align-items-center`}>
              <div className={styles.star_box}>
                <div
                  className={`d-flex align-items-center gap-1 ${styles.star_inner}`}
                >
                  <Image
                    src="/images/homepg/star.svg"
                    alt="Star"
                    width={24}
                    height={24}
                  />
                  <span className="roh_star_title">Why Choose Us</span>
                </div>
              </div>
            </div>

            <h2 className={`text-center`}>
              Find the best rental options <br />
              without the hassle
            </h2>

            <div className={`container mt-5 position-relative`}>
              <div className={`row`}>
                {/* Left Column */}
                <div className={`col-12 col-md-4 col-lg-4`}>
                  <div className={`${styles.why_block}`}>
                    <ul className={styles.about_media_list}>
                      <li>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              <Image
                                src="/verified-local-providers-red-icon.svg"
                                alt="Verified Local Providers"
                                width={24}
                                height={24}
                              />
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h5 className={styles.media_title}>
                              Verified Local Providers
                            </h5>
                            <p
                              className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                            >
                              All listed vendors are verified by us. Rent from
                              trusted local businesses who know Goa and care
                              about your experience.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              <Image
                                src="/direct-contact-red-icon.svg"
                                alt="Direct Contact, No Middleman"
                                width={24}
                                height={24}
                              />
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h5 className={styles.media_title}>
                              Direct Contact, No Middleman
                            </h5>
                            <p
                              className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                            >
                              Connect directly with rental providers via phone
                              or WhatsApp. Ask questions, confirm availability,
                              and book at your convenience.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Middle Column */}
                <div className={`col-12 col-md-4 col-lg-4`}>
                  <div className={styles.why_choose_img_wrap}>
                    <div className={styles.why_img}>
                      <Image
                        className={styles.middle_img_cover}
                        src="/images/vechiclespg/why-choose-recreational-img2.webp"
                        alt="Recreational Vehicle 1"
                        width={400}
                        height={280}
                      />
                    </div>
                    <div className={styles.why_imgTwo}>
                      <Image
                        src="/images/vechiclespg/why-choose-recreational-img.png"
                        alt="Why Choose Recreational Vehicle 2"
                        width={400}
                        height={280}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className={`col-12 col-md-4 col-lg-4`}>
                  <div className={styles.why_block}>
                    <ul className={styles.about_media_list}>
                      <li>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              <Image
                                src="/multiple-vendors-red-icon.svg"
                                alt="Multiple Vendors"
                                width={24}
                                height={24}
                              />
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h5 className={styles.media_title}>
                              Multiple Vendors, One Platform
                            </h5>
                            <p
                              className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                            >
                              Compare rental providers in your area. See what’s
                              available, check prices, and choose the option
                              that fits your budget and needs.
                            </p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              <Image
                                src="/compare-real-prices-red-icon.svg"
                                alt="Compare Real Prices"
                                width={24}
                                height={24}
                              />
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h5 className={styles.media_title}>
                              Compare Real Prices
                            </h5>
                            <p
                              className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}
                            >
                              No more overpaying because you didn’t know better
                              options existed. See transparent pricing from
                              multiple providers and make informed decisions.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
