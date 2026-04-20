"use client";
import styles from './heroSection.module.css';
import Image from 'next/image';
import { LuChevronDown, LuSearch } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;


export default function HeroSection() {

  return (
    <>
    <section className={styles.roh_prouct_hero_wrap}>
        <div className={styles.roh_prouct_hero_inner}>
          <div className={styles.roh_container}>
            <div className="row align-items-center">
              <div className="col-12 col-md-6 col-lg-6">
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                    <ol className={styles.breadcrumbList}>
                      <li>
                        <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                      </li>
                      <li className={styles.separator} aria-hidden="true">›</li>
                      <li aria-current="page">Electronics</li>
                    </ol>
                   </nav>
                   <h1 className="text-white text-start">Smart Tech, <br/>Smarter Rentals.</h1>
                   <p className="" style={{color:'#94A3B8'}}>Upgrade your digital lifestyle. Rent premium laptops, cameras, consoles, and audio gear instantly without the upfront investment.</p>
                   
                  <div>
                    <p className="text-uppercase fw-semibold" style={{color:"#06B6D4"}}>Search from 1,000+ electronics available for rent</p>
                  </div>

                 <form className={`${styles.roh_search_container} d-flex align-items-center gap-2 flex-wrap}`}>
                  {/* Category Select */}
                  <div className="roh_search_dropdown px-2">
                    <div className="d-flex align-items-center position-relative">
                      <select
                        className="form-select border-0 shadow-none pe-4"
                        defaultValue="all" >
                        <option value="all">All</option>
                        <option value="laptops">Laptops</option>
                        <option value="cameras">Cameras</option>
                        <option value="gaming">Gaming Consoles</option>
                        <option value="audio">Audio Gear</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="flex-grow-1 d-flex align-items-center px-3 gap-2 border-start position-relative">
                    <LuSearch size={20} color="#6B7280" style={{position: "absolute", left: "25px"}}/>
                    <input type="text" name="search" className="form-control  shadow-none roh_search_input " placeholder="Search laptops, cameras, gaming consoles..." />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className={`${styles.roh_search_btn} btn text-white px-4 py-2 fw-bold`}>Search </button>
                </form>
                <div className="mt-4 d-flex align-items-center gap-3 flex-wrap small ">

                    <span className="text-uppercase p-2 lh-1 fw-medium" style={{ color: "#ff3600", letterSpacing: "2px", backgroundColor: "#06b6d42b", padding: "2px 6px", borderRadius: "4px"}}>
                      Searching in Electronics
                    </span>
                    <div className="d-flex align-items-center gap-3">
                        <span style={{ color: "#64748B" }}> Try:</span>
                        <a className={styles.roh_try_link} href="#">MacBook</a>
                        <span style={{color:"#475569", fontSize:"24px"}}>•</span>
                        <a className={styles.roh_try_link} href="#">DSLR</a>
                        <span style={{color:"#475569", fontSize:"24px"}}>•</span>
                        <a className={styles.roh_try_link} href="#">PS5</a>
                        <span style={{color:"#475569", fontSize:"24px"}}>•</span>
                        <a className={styles.roh_try_link} href="#">Drone</a>
                    </div>
                  </div>

              </div>
              {/* Right Image */}
              <div className="col-12 col-md-6 col-lg-6 mt-sm-0 mt-5 text-sm-end text-center">
                <Image className={styles.roh_heroImage} src="/images/electronicspg/tech_devices_electronics.webp" alt='Hero Image' width={448} height={328} style={{ width: '100%', maxWidth:'fit-content', height: 'auto' }} />

              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );

}