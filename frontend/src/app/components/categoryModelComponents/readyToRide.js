"use client";
import "../../globals.css";
import styles from "./readyToRide.module.css";
import Image from "next/image";
import ArrowrightIcon from "../../../../public/arrow.svg";
import Link from "next/link";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

/* Category-wise image mapping */
const categoryImages = {
  2: "/images/vechiclespg/cta-car-img.png",
  3: "/images/vechiclespg/cta-bike-img.png",
  8: "/images/vechiclespg/cta-scooters-img.png",
  10: "/images/vechiclespg/cta-car-img.png",
};

export default function ReadyToRide({ cate_id }) {
  return (
    <>
      <section className={styles.roh_singlePost_wrap} aria-label="Ready To Ride" >
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
                        <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact us</a>
                      </div>
                      <div className={`roh_circl_btn`}>
                        <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">
                          <ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
               <div className={`col-12 col-md-6 col-lg-6`}>
                <div className={`${styles.roh_singlePost_imgwrap}`}>
                  {categoryImages[cate_id] && (
                    <Image
                      src={categoryImages[cate_id]}
                      alt={`CTA image for category ${cate_id}`}
                      width={550}
                      height={270}
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
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
