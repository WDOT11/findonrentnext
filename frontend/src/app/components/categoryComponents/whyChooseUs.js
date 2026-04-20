"use client";
import "../../globals.css";
import styles from "./whyChooseUs.module.css";
import Image from "next/image";
import StarIcon from '../../../../public/star.svg';
import { LuShieldCheck, LuUsers, LuUserCheck, LuBanknote } from "react-icons/lu";


/* Category-wise image mapping */
const categoryImages = {
  2: "/images/vechiclespg/why-choose-car.webp",
  3: "/images/vechiclespg/why-choose-bike-img2.webp",
  8: "/images/vechiclespg/why-choose-scooter1.webp",
  10: "/images/vechiclespg/why-choose-car.webp",
};

export default function WhyChooseUs({ cate_id }) {

  return (
    <>
      <section className={styles.whychoose_wrap} aria-label="Why choose Find On Rent">
        <div className={`${styles.roh_container} ${styles.whychoose_inner}`}>
          <div className={styles.whychoose_wrap_main}>
            <div className={`d-flex justify-content-center align-items-center`}>
              <div className={styles.star_box}>
                <div
                  className={`d-flex align-items-center gap-1 ${styles.star_inner}`}
                >
                   <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                  <span className="roh_star_title">Why Choose Us</span>
                </div>
              </div>
            </div>

            <h3 className={`roh_section_title_h3 text-center`}>
              Find the best rental options <br />
              without the hassle
            </h3>

            <div className={`${styles.roh_container} mt-sm-5 mt-4 position-relative`}>
              <div className={`row`}>
                {/* Left Column */}
                <div className={`col-12 col-md-4 col-lg-4`}>
                  <div className={`${styles.why_block}`}>
                    <ul className={styles.about_media_list} aria-label="Key benefits of using Find On Rent">
                      <li>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              <LuShieldCheck size={24} style={{color:"#ff3600"}} aria-hidden="true"/>
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h4 className={styles.media_title}>
                              Verified Local Providers
                            </h4>
                            <p
                              className={`${styles.media_desc}`}
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
                              <LuUserCheck size={24} style={{color:"#ff3600"}} aria-hidden="true"/>
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h4 className={styles.media_title}>
                              Direct Contact, No Middleman
                            </h4>
                            <p
                              className={`${styles.media_desc}`}
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
                <div className="col-12 col-md-4 col-lg-4 d-flex justify-content-center align-items-center">
                  <div className={styles.why_choose_img_wrap}>
                    <div className={styles.why_img}>
                      <Image
                        className={styles.middle_img_cover}
                        src={categoryImages[cate_id] || "/images/vechiclespg/why-choose-bike-img2.webp"}
                        alt="Illustration showing benefits of renting through Find On Rent"
                        width={400}
                        height={280}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className={`col-12 col-md-4 col-lg-4`}>
                  <div className={styles.why_block}>
                    <ul className={styles.about_media_list} aria-label="Key benefits of using Find On Rent">
                      <li>
                        <div className={styles.media}>
                          <div className={styles.media_imgbox}>
                            <div className={styles.back_circle}>
                              <LuUsers size={24} style={{color:"#ff3600"}} aria-hidden="true"/>
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h4 className={styles.media_title}>
                              Multiple Vendors, One Platform
                            </h4>
                            <p
                              className={`${styles.media_desc}`}
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
                              <LuBanknote size={24} style={{color:"#ff3600"}} aria-hidden="true"/>
                            </div>
                          </div>
                          <div className={styles.media_body}>
                            <h4 className={styles.media_title}>
                              Compare Real Prices
                            </h4>
                            <p
                              className={`${styles.media_desc}`}
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
