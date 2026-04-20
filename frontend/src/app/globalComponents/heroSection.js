"use client";
import "../globals.css"
import styles from './css/heroSection.module.css';
import ArrowrightIcon from '../../../public/arrow.svg';

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function HeroSection() {

  return (
    <>
    <div className={styles.roh_prouct_hero_wrap}>
        <div className={styles.roh_prouct_hero_inner}>
          <div className={styles.roh_prouct_hero}>
            <img
                src={`${WEB_BASE_DOMAIN_URL}/images/vechiclespg/hero-vehicles-page.webp`}
                alt={"Blog Hero Image"}
                className={styles.roh_hero_img}
                fetchPriority="high"
                decoding="sync"
              />
              <div className={styles.roh_image_overlay}></div>
            <div className={`container`}>
              <div className={styles.Zindex}>
                <div className={styles.hero_heading}>
                  <h1 data-wow-duration="2s" id="page-hero-heading">
                    Find the Perfect Vehicle for <br /> Any Trip
                  </h1>
                  <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                      <ol className={styles.breadcrumbList}>
                      <li>
                          <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                      </li>
                      <li className={styles.separator} aria-hidden="true">›</li>
                      <li aria-current="page">Vehicles</li>
                      </ol>
                  </nav>
                </div>
                <p
                  data-wow-duration="2s"
                  className={`${styles.hero_description} ${styles.global_heading}`}>
                  Browse bikes, scooters, and cars available nearby from trusted
                  local providers.
                </p>

                <div className={`d-flex justify-content-center align-items-center`}>
                  <div className={`d-flex align-items-center justify-content-center roh_redBtns`}>
                    <div className="roh_button_custom"><a href="#discover-all-services" aria-label="Search vehicles">Search Vehicles</a></div>
                    <div className="roh_circl_btn">
                      <a href="#discover-all-services" aria-label="Search vehicles"><ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true"/></a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}