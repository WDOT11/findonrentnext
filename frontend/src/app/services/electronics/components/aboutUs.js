"use client";
import styles from './aboutUs.module.css';
import Image from "next/image";
import {LuZap, LuRefreshCcw, LuReceipt, LuShieldCheck, LuArrowRight  } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;


export default function AboutUs() {

  return (
    <>
      <section className={styles.roh_aboutUs_wrapper} aria-label="About FindOnRent vehicle rental platform">
        <div className={styles.roh_container}>
          <div className="row align-items-center">
            {/* Left Images */}

            <div className="col-12 col-md-12 col-lg-6 order-2 order-md-2 order-lg-1 mt-3 mt-md-4 mt-lg-0 ">
              <div className={styles.banner_bottom}>
                 <span className={styles.roh_section_label}><LuZap size={16}/>The Platform</span>

                <h3 className="roh_section_title_h3">
                  Rent High-End Tech Without Commitment</h3>
                <p className={`${styles.global_heading} ${styles.gray_global_heading}`}>
                  <a href="https://findonrent.com/">FindOnRent</a> connects you with trusted rental providers offering the latest electronics. Skip the huge upfront costs and access premium devices on your terms.</p>

                <ul className={styles.about_media_list} aria-label="Key features of Find On Rent">
                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <LuRefreshCcw size={24} style={{ color: "#ff3600" }} aria-hidden="true"/>
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h4 className={`${styles.media_title}`}>
                          Upgrade Anytime, No Depreciation Loss
                        </h4>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          Stay ahead of the curve. Swap to the newest models whenever you need without taking a depreciation hit.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <LuReceipt size={24} style={{ color: "#ff3600" }} aria-hidden="true"/>
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h4 className={`${styles.media_title}`}>
                          Transparent Pricing, No Surprises
                        </h4>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          What you see is what you pay. No hidden fees, just straightforward daily, weekly, or monthly rates.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                         <LuShieldCheck size={24} style={{ color:"#ff3600"}} aria-hidden="true"/>
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h4 className={`${styles.media_title}`}>
                          Premium Devices, Verified Quality
                        </h4>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          Every device listed on our platform is thoroughly tested by our premium vendors before delivery.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <a href="#" className={`${styles.roh_learn_moreBtn} justify-content-center justify-content-sm-start mt-3 mt-sm-4 mx-sm-0 mx-auto`}>Learn More About Us <LuArrowRight size={28} /> </a>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-12 col-md-12 col-lg-6 order-1 order-md-1 order-lg-2">
              <div className={styles.body_img_egg}>
                <div className={`${styles.egg_img1_wrap} ${styles.about_img_1}`}>
                  <div className={styles.egg_img1}>
                    <Image className={styles.eggimg1}
                      src="/images/electronicspg/about-vr-tech.webp"
                      alt="Your Go To Platform for Reliable vehicle Rentals 2"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
                <div className={`${styles.egg_img2_wrap} ${styles.about_img_2}`}>
                  <div className={styles.egg_img2}>
                    <Image className={styles.eggimg2}
                      src="/images/electronicspg/about-camera-tech.webp"
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