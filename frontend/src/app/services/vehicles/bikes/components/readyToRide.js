"use client";
import "../../../../globals.css";
import styles from "../../bikes/components/readyToRide.module.css";
import Image from "next/image";

export default function ReadyToRide() {
  return (
    <>
      <section className={styles.roh_singlePost_wrap}>
        <div className={`${styles.roh_singlePost_wrap_inner} container p-0`}>
          <div
            className={`${styles.roh_singlePost_main} ${styles.roh_singlePost_black_bg}`}
          >
            <div className={`container`}>
              <div className={`row`}>
                <div className={`col-12 col-md-6 col-lg-6`}>
                  <div className={`${styles.roh_singlePost_content}`}>
                    <h3
                      className={`text-white mb-0 ${styles.roh_second_heading}`}
                    >
                      Zip through the city. Rent your ride now.
                    </h3>
                    <p
                      className={`text-white mb-0 ${styles.roh_global_heading} ${styles.roh_singlePost_desc}`}
                    >
                      Our friendly customer service team is here to help.
                      Contact us anytime for support and inquiries.
                    </p>
                    <div
                      className={`d-flex align-items-center justify-content-start roh_redBtns`}
                    >
                      <div className={`roh_button_custom`}>
                        <a href="/contact-us">Contact us</a>
                      </div>
                      <div className={`roh_circl_btn`}>
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
                <div className={`col-12 col-md-6 col-lg-6`}>
                  <div className={`${styles.roh_singlePost_imgwrap}`}>
                    <Image
                      src="/images/vechiclespg/cta-bike-img.png"
                      alt="CTA Bike"
                      width={550}
                      height={270}
                      style={{ width: "100%", height: "auto" }}
                    />
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
