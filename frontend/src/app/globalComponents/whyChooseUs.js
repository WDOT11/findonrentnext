"use client";
import "../globals.css"
import styles from './css/whyChooseUs.module.css';
import Image from "next/image";
import StarIcon from '/public/star.svg';
import { LuShieldCheck, LuUsers, LuUserCheck, LuBanknote } from "react-icons/lu";

export default function WhyChooseUs() {

  return (
    <>
      <section className={styles.whychoose_wrap} aria-label="Why choose FindOnRent vehicle rental platform">
        <div className={`container p-0 ${styles.whychoose_inner}`}>
          <div className={styles.whychoose_wrap_main}>
            <div className={`d-flex justify-content-center align-items-center`}>
              <div className={styles.star_box}>
                <div className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                 <StarIcon className="roh_icon" width={20} height={20}/>
                  <span className={styles.star_title}>Why Choose Us</span>
                </div>
              </div>
            </div>

            <h3 className={`roh_section_title_h3 text-center`}>
              Find the best rental options <br/>without the hassle
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
                            <h4 className={styles.media_title}>Verified Local Providers</h4>
                            <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                              All listed vendors are verified by us. Rent from trusted local businesses who know Goa and care about your experience.
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
                            <h4 className={styles.media_title}>Direct Contact, No Middleman</h4>
                            <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                              Connect directly with rental providers via phone or WhatsApp. Ask questions, confirm availability, and book at your convenience.
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
                      <Image className={styles.middle_img_cover}
                        src="/images/car5.jpg"
                        alt="Car"
                        width={400}
                        height={280}
                      />
                    </div>
                    {/* <div className={styles.why_imgTwo}>
                      <Image
                        src="/images/why-choose-car-img.png"
                        alt="Why Choose Car"
                        width={400}
                        height={280}
                      />
                    </div> */}
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
                            <h4 className={styles.media_title}>Multiple Vendors, One Platform</h4>
                            <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                              Compare rental providers in your area. See what’s available, check prices, and choose the option that fits your budget and needs.
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
                            <h4 className={styles.media_title}>Compare Real Prices</h4>
                            <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                              No more overpaying because you didn’t know better options existed. See transparent pricing from multiple providers and make informed decisions.
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