"use client";
import "../../../../globals.css"
import styles from './aboutUs.module.css';
import Image from "next/image";


export default function AboutUs() {

  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Left Images */}
            <div className="col-12 col-md-12 col-lg-6">
              <div className={styles.body_img_egg}>
                <div className={`${styles.egg_img1_wrap} ${styles.about_img_1}`}>
                  <div className={styles.egg_img1}>
                    <Image className={styles.eggimg1}
                      src="/images/homepg/big5.jpg"
                      alt="Electronic rental 1"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
                <div className={`${styles.egg_img2_wrap} ${styles.about_img_2}`}>
                  <div className={styles.egg_img2}>
                    <Image className={styles.eggimg2}
                      src="/images/homepg/big6.jpg"
                      alt="Electronic rental 2"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-12 col-md-12 col-lg-6">
              <div className={styles.banner_bottom}>
                <div className={styles.star_box}>
                  <div className={`align-items-center gap-1 ${styles.star_inner} ${styles.star_inner}`}>
                    <Image
                      src="/images/homepg/star.svg"
                      alt="Star icon"
                      width={20}
                      height={20}
                    />
                    <span className={styles.star_title}>About us</span>
                  </div>
                </div>

                <h2 className={styles.second_heading}>
                  Your Go-To Platform for Reliable Electronic Rentals
                </h2>
                <p className={`${styles.global_heading} ${styles.gray_global_heading}`}>
                  Need a laptop for work, a DSLR for an event, or a projector for
                  your presentation? We connect you with trusted owners offering
                  well-maintained, ready-to-use devices.
                </p>

                <ul className={styles.about_media_list}>
                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <Image
                            src="/images/homepg/operating-system.svg"
                            alt="Verified electronics"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Verified electronics & tested hardware
                        </h5>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          We Have Optimized The Booking Process So That Our
                          Clients Can Experience The Easiest And The Safest
                          Service
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <Image
                            src="/images/homepg/best-price.svg"
                            alt="Best price"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Transparent pricing — no hidden charges
                        </h5>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          We Have Optimized The Booking Process So That Our
                          Clients Can Experience The Easiest And The Safest
                          Service
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className={styles.media}>
                      <div className={styles.media_imgbox}>
                        <div className={styles.back_circle}>
                          <Image
                            src="/images/homepg/cross-docking.svg"
                            alt="Pickup and drop-off"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <div className={`media-body`}>
                        <h5 className={`${styles.media_title}`}>
                          Pickup & drop-off available locally
                        </h5>
                        <p className={`${styles.global_heading} ${styles.media_desc} ${styles.gray_global_heading}`}>
                          We Have Optimized The Booking Process So That Our
                          Clients Can Experience The Easiest And The Safest
                          Service
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className={`d-flex align-items-center justify-content-center roh_redBtns`}>
                  <div className="roh_button_custom"><a href="/contact-us">Contact us</a></div>
                  <div className="roh_circl_btn">
                    <a href="/contact-us"><Image src="/arrow.svg" alt="Arrow Right" width={30} height={30} /></a>
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