"use client";
import styles from "./aboutus.module.css";
import { LuShieldCheck, LuTag, LuMessageCircle, LuLayers, LuLock, LuMapPin, } from "react-icons/lu";
import Image from "next/image";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function AboutUsClient() {
  return (
    <>
      {/* What We Do */}

      <section className={styles.roh_what_we_do_wrap} aria-label="What FindOnRent does for customers and vendors">
        <div className={styles.roh_container}>
          <div className="row align-items-center">
            <div className="col-12 col-md-6 col-lg-6 mt-4 mt-md-0 order-2 order-md-2 order-lg-1">
              <Image
                src="/images/assets/what-we-do-about-us-img.webp"
                alt="How FindOnRent connects customers with local rental providers"
                width={640}
                height={438}
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  height: "auto",
                  borderRadius: "24px",
                }}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-6 order-1 order-md-1 order-lg-2">
              <h2>What We Do</h2>
              <p><a href="https://findonrent.com/">FindOnRent</a> is a marketplace that helps users:</p>
              <ul className={styles.roh_list_checkIcon}>
                <li>
                  Search for rental vehicles and items based on their location
                </li>
                <li>Compare prices and features from multiple providers</li>
                <li>Connect directly with verified <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a></li>
                <li>Book rentals without paying any commission</li>
              </ul>
              <p>
                Our platform helps customers make informed decisions while
                supporting local rental businesses with more visibility and
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Started */}

      <section className={styles.roh_why_we_started_wrap} aria-label="Why FindOnRent was started">
        <div className={styles.roh_container}>
          <div className="row align-items-center">
            <div className="col-12 col-md-6 col-lg-6">
              <h2>Why We Started</h2>
              <p>
                Traditional renting often involves long calls, unclear pricing,
                and unreliable sources. We saw the need for a platform that
                brings clarity and trust to the renting experience.
              </p>
              <p>
                By combining technology with a customer first approach, we
                created a system that makes renting simple for everyone. We
                started with a small idea and have grown into a community of
                trust.
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-6 mt-4 mt-md-0">
              <Image
                src="/images/assets/why-we-started-about-us-img.webp"
                alt="Why FindOnRent was created to improve the rental experience"
                width={640}
                height={438}
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  height: "auto",
                  borderRadius: "24px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose  */}

      <section className={styles.roh_why_choose_wrap} aria-label="Reasons to choose FindOnRent rental platform">
        <div className={styles.roh_container}>
          <div className="row">
            <div className="col-12 text-center">
              <h2>Why Choose FindOnRent</h2>
              <p>
                We are committed to building a rental ecosystem that is safe,
                accessible, and beneficial for both customers and providers.
              </p>
            </div>
            <div className="col-12">
              <div className={styles.roh_why_choose_grid}>
                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <LuShieldCheck size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Verified Providers</h4>
                  <p>
                    Every <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendor</a> on our platform is verified for identity and
                    quality service.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <LuTag size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Transparent Pricing</h4>
                  <p>
                    What you see is what you pay. No hidden fees or surprise
                    charges.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <LuMessageCircle size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Direct Communication</h4>
                  <p>
                    Chat or call <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a> directly to discuss your specific
                    needs.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <LuLayers size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Wide Variety</h4>
                  <p>
                    From scooters to luxury cars, find exactly what you are
                    looking for.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <LuLock size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Safe Booking</h4>
                  <p>
                    Secure processes and trusted community guidelines for your
                    safety.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <LuMapPin size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>City-wide Network</h4>
                  <p>
                    A growing network of providers across multiple locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision  */}

      <section className={styles.roh_our_vision_wrap} aria-label="FindOnRent vision for the future">
        <div className={styles.roh_container}>
          <div className="row align-items-center">
            <div className="col-12 col-md-6 col-lg-6 mt-4 mt-md-0 order-2 order-md-2 order-lg-1">
              <Image
                src="/images/assets/our-vision-about-us-img.webp"
                alt="FindOnRent vision for a trusted and accessible rental marketplace"
                width={640}
                height={438}
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  height: "auto",
                  borderRadius: "24px",
                }}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-6 order-1 order-md-1 order-lg-2">
              <h2>Our Vision</h2>
              <p>
                To become the most trusted rental marketplace that people rely
                on for everyday needs and travel experiences.
              </p>
              <p>
                We aim to build a platform that empowers users with choice and
                convenience while helping rental businesses grow through
                technology. We envision a world where access is valued over
                ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us on */}

      <section className={styles.roh_join_us_wrap} aria-label="Join FindOnRent rental community">
        <div className={styles.roh_container}>
          <div className={styles.roh_join_us_content}>
            <div className={styles.roh_join_us_innerContent}>
              <h3 className="roh_section_title_h3 text-light">Join Us on This Journey</h3>
              <p className="text-light">
                Whether you are here to rent a vehicle or list your own, <a className={styles.roh_link_white} href="https://findonrent.com/"> FindOnRent</a> is designed for you. We are constantly improving,
                expanding, and introducing new features to create the best
                rental experience possible.
              </p>
              <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} className={styles.roh_redBtn} aria-label="Join FindOnRent rental community">
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
