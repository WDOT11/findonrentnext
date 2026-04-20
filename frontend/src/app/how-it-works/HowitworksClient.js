"use client";
import styles from "./howitworks.module.css";
import { LuSearch, LuSlidersHorizontal, LuMessageCircle, LuCalendarCheck, LuTruck, LuSmile, LuRotateCcw, LuShieldCheck, LuReceipt, LuHandshake, LuLayoutGrid, LuArrowRightLeft, } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function HowitworksClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="How FindOnRent works">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>How It Works</h1>
              <p className={styles.roh_pLarge}>Renting made simple, fast, and hassle-free. <br/>
                Whether you're looking for a self-drive cars, bike, scooty or scooters, or any rental item - FindOnRent connects you with trusted local providers in just a few steps.</p>
                 <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                    <ol className={styles.breadcrumbList}>
                      <li>
                        <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                      </li>
                      <li className={styles.separator} aria-hidden="true">›</li>
                      <li aria-current="page">How It Works</li>
                    </ol>
                  </nav>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.roh_steps_wrapper} aria-label="Steps to rent vehicles and items on FindOnRent">
        <div className={styles.roh_container}>
          <div className={styles.roh_steps_content}>
            <div className={styles.roh_steps_contentInner}>
              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuSearch size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>1. Search for What You Need</h3>
                  <p className="fw-bold">Find the perfect rental in seconds.</p>
                  <ul className={styles.roh_step_list}>
                    <li>Choose your category (<a href={`${WEB_BASE_DOMAIN_URL}/cars`}>self-drive cars</a>, <a href={`${WEB_BASE_DOMAIN_URL}/bikes`}>bikes</a>, <a href={`${WEB_BASE_DOMAIN_URL}/scooty-scooters`}>scooty or scooters</a>, <a href={`${WEB_BASE_DOMAIN_URL}/cars-with-driver`}>cars with driver</a>, etc.)</li>
                    <li>Enter your location</li>
                    <li>Browse listings from verified <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>rental providers</a></li>
                    <li>Check availability, features, and pricing</li>
                    <li>
                      No endless calls — everything you need is right on your
                      screen.
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuSlidersHorizontal size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>2. Compare Prices & Options</h3>
                  <p className="fw-bold">Get complete clarity before you book.</p>
                  <ul className={styles.roh_step_list}>
                    <li>View real-time prices from multiple <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a></li>
                    <li>Compare models, mileage limits, pickup options, and offers</li>
                    <li>Filter by brand, location, or rental duration</li>
                    <li>Our platform shows transparent pricing — no hidden charges.</li>
                  </ul>
                </div>
              </div>
              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuMessageCircle  size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>3. Connect Directly With the Provider</h3>
                  <p className="fw-bold">Once you find the right rental, simply select the listing to contact the provider.</p>
                  <ul className={styles.roh_step_list}>
                    <li>Call or message the rental <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendor</a> directly</li>
                    <li>Confirm availability and details</li>
                    <li>Ask any questions before finalizing the booking</li>
                    <li>You talk directly to the owner — zero middlemen, zero commission.</li>

                  </ul>
                </div>
              </div>
              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuCalendarCheck size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>4. Book Your Rental</h3>
                  <p className="fw-bold">After confirming with the provider, complete your booking.</p>
                  <ul className={styles.roh_step_list}>
                    <li>Share your ID proof (if required)</li>
                    <li>Choose pickup or doorstep delivery</li>
                    <li>Finalize payment directly with the vendor</li>
                    <li>Booking is fast, transparent, and fully between you and the provider.</li>
                  </ul>
                </div>
              </div>
              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuTruck size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>5. Pickup or Get It Delivered</h3>
                  <p className="fw-bold">Enjoy total convenience.</p>
                  <ul className={styles.roh_step_list}>
                    <li>Pick up the vehicle/item from the <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendor’s</a> location</li>
                    <li>Or get home delivery (available with selected providers)</li>
                    <li>Inspect the item before you start your rental</li>
                    <li>Your rental experience begins smoothly and stress-free.</li>
                  </ul>
                </div>
              </div>
              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuSmile size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>6. Enjoy Your Rental</h3>
                  <p className="fw-bold">Use your rented vehicle or item with confidence.</p>
                  <ul className={styles.roh_step_list}>
                    <li>All providers listed are verified and trustworthy</li>
                    <li>Vehicles/items are well-maintained</li>
                    <li>Support is available through vendor contact any time</li>
                  </ul>
                </div>
              </div>
              <div className={styles.roh_step_card}>
                <div className={styles.roh_step_icon_wrapper}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LuRotateCcw size={32} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_step_content}>
                  <h3>7. Return It Easily</h3>
                  <p className="fw-bold">When your rental period ends:</p>
                  <ul className={styles.roh_step_list}>
                    <li>Return the item to the vendor</li>
                    <li>Or request pickup (if offered)</li>
                    <li>Settle any remaining dues directly with the provider</li>
                    <li>Simple, fair, and completely hassle-free.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why FindOnRent? */}
      <section className={styles.roh_why_sectionWrapper} aria-label="Benefits of using FindOnRent rental platform">
        <div className={styles.roh_container}>
          <div className={styles.roh_why_innerContent}>
            <h2>
              Why FindOnRent?
            </h2>
            <div className={styles.roh_benefits_grid}>
          <div className={styles.roh_benefit_item}>
            <div className={styles.roh_benefitsBox_icon}>
              <div style={{width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <LuShieldCheck size={18} aria-hidden="true"/>
              </div>
            </div>
            <h4>Verified local providers</h4>
          </div>
          <div className={styles.roh_benefit_item}>
            <div className={styles.roh_benefitsBox_icon}>
              <div style={{width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <LuReceipt size={18} aria-hidden="true"/>
              </div>
            </div>
            <h4>Transparent pricing</h4>
          </div>
          <div className={styles.roh_benefit_item}>
            <div className={styles.roh_benefitsBox_icon}>
              <div style={{width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <LuHandshake size={18} aria-hidden="true"/>
              </div>
            </div>
            <h4>No middlemen or commission</h4>
          </div>
          <div className={styles.roh_benefit_item}>
            <div className={styles.roh_benefitsBox_icon}>
              <div style={{width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <LuLayoutGrid size={18} aria-hidden="true"/>
              </div>
            </div>
            <h4>Wide range of rental items</h4>
          </div>
          <div className={styles.roh_benefit_item}>
            <div className={styles.roh_benefitsBox_icon}>
              <div style={{width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <LuArrowRightLeft size={18} aria-hidden="true"/>
              </div>
            </div>
            <h4>Easy comparison in one place</h4>
          </div>
          <div className={styles.roh_benefit_item}>
            <div className={styles.roh_benefitsBox_icon}>
              <div style={{width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <LuMessageCircle  size={18} aria-hidden="true"/>
              </div>
            </div>
            <h4>Direct communication with vendors</h4>
          </div>
        </div>
          </div>

        </div>

      </section>
    </>
  );
}
