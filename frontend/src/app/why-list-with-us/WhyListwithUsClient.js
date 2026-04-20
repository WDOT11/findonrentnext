"use client";
import styles from "./whylistwithus.module.css";
import { LuZap, LuPercent, LuMessageCircle, LuMapPin, LuSlidersHorizontal, LuShieldCheck, LuCircleCheck, LuTrendingUp, LuCheck, } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function WhyListwithUsClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Why List with Us">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Why List with Us</h1>
              <p className={styles.roh_pLarge}>
                Grow your rental business with a platform built to connect you
                directly with real customers. Get visibility, inquiries, and
                bookings without commission or complexity.
              </p>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Why List with Us</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section className={styles.roh_features_wrapper} aria-label="Benefits of listing rental items on FindOnRent">
        <div className={styles.roh_container}>
          <div className={styles.roh_grid_features}>
            {/* Feature 1  */}
            <div className={styles.roh_feature_card}>
              <div className={styles.roh_feature_icon}>
                <LuZap size={28} aria-hidden="true"/>
              </div>
              <h4 className={styles.roh_feature_subtitle}>
                Simple and Free Listing
              </h4>
              <h3 className={styles.roh_feature_title}>
                List Your Item in Minutes
              </h3>
              <div className={styles.roh_feature_desc}>
                Getting started on <a href="https://findonrent.com/">FindOnRent</a> is quick and simple. Create an
                account, verify your details, and list your rental items in just
                a few steps.
              </div>
              <ul className={styles.roh_feature_list}>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Free item listings
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Instant verification
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Go live quickly
                </li>
              </ul>
            </div>

            {/* Feature 2  */}
            <div className={styles.roh_feature_card}>
              <div className={styles.roh_feature_icon}>
                <LuPercent size={28} />
              </div>
              <h4 className={styles.roh_feature_subtitle}>
                No Commission or Hidden Fees
              </h4>
              <h3 className={styles.roh_feature_title}>
                Keep 100% of Your Earnings
              </h3>
              <div className={styles.roh_feature_desc}>
                <a href="https://findonrent.com/">FindOnRent</a> does not charge commission, subscription fees, or
                hidden costs. You deal directly with customers and receive
                payments in full.
              </div>
              <ul className={styles.roh_feature_list}>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Zero commission
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Direct customer payments
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Full control over pricing
                </li>
              </ul>
            </div>

            {/*  Feature 3  */}
            <div className={styles.roh_feature_card}>
              <div className={styles.roh_feature_icon}>
                <LuMessageCircle size={28} aria-hidden="true"/>
              </div>
              <h4 className={styles.roh_feature_subtitle}>
                Direct Customer Contact
              </h4>
              <h3 className={styles.roh_feature_title}>
                You Talk Directly to Customers
              </h3>
              <div className={styles.roh_feature_desc}>
                All inquiries come straight to you. There are no middlemen or
                booking restrictions. You decide the terms and final details.
              </div>
              <ul className={styles.roh_feature_list}>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Direct calls and messages
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Faster confirmations
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Better customer relationships
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className={styles.roh_feature_card}>
              <div className={styles.roh_feature_icon}>
                <LuMapPin size={28} aria-hidden="true"/>
              </div>
              <h4 className={styles.roh_feature_subtitle}>
                Increased Visibility
              </h4>
              <h3 className={styles.roh_feature_title}>
                Get Found by Local Customers
              </h3>
              <div className={styles.roh_feature_desc}>
                Your listings appear to customers searching in your city.
                Location-based discovery helps you reach people actively looking
                to rent.
              </div>
              <ul className={styles.roh_feature_list}>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> City based visibility&nbsp;
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Search and filter exposure
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Higher intent customers
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className={styles.roh_feature_card}>
              <div className={styles.roh_feature_icon}>
                <LuSlidersHorizontal size={28} aria-hidden="true"/>
              </div>
              <h4 className={styles.roh_feature_subtitle}>Full Control</h4>
              <h3 className={styles.roh_feature_title}>
                Manage Items Your Way
              </h3>
              <div className={styles.roh_feature_desc}>
                You control everything about your listings. Update prices,
                availability, services, and details anytime from your dashboard.
              </div>
              <ul className={styles.roh_feature_list}>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Edit listings anytime
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> List multiple items
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Flexible rental terms
                </li>
              </ul>
            </div>

            {/* Feature 6  */}
            <div className={styles.roh_feature_card}>
              <div className={styles.roh_feature_icon}>
                <LuShieldCheck size={28} aria-hidden="true"/>
              </div>
              <h4 className={styles.roh_feature_subtitle}>
                Trusted Marketplace
              </h4>
              <h3 className={styles.roh_feature_title}>
                Safety and Transparency
              </h3>
              <div className={styles.roh_feature_desc}>
                <a href="https://findonrent.com/">FindOnRent</a> is designed to create a trustworthy ecosystem.
                Verified contact details and clear listings help set the right
                expectations.
              </div>
              <ul className={styles.roh_feature_list}>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Verified providers
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Transparent listings
                </li>
                <li>
                  <LuCircleCheck style={{color:"#10B981"}} aria-hidden="true"/> Community driven trust
                </li>
              </ul>
            </div>
          </div>

          {/* Designed for Growth */}
          <div className={styles.roh_growth_wrapper}>
            <div className={styles.roh_growth_icon}>
                <LuTrendingUp size={32} aria-hidden="true"/>
            </div>
            <h2>Designed for Growth</h2>
            <p className={styles.roh_pLarge}>Whether you are an individual owner or a growing rental business, <a href="https://findonrent.com/">FindOnRent</a> supports you at every stage.</p>
            <div className={styles.roh_checkList}>
              <div style={{display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "#374151"}}>
                <LuCheck style={{color:"#ff3600"}} aria-hidden="true"/> Suitable for small &amp; large providers
              </div>
              <div style={{display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "#374151"}}>
                <LuCheck style={{color:"#ff3600"}} aria-hidden="true"/> No limits on listings
              </div>
              <div style={{display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "#374151"}}>
                <LuCheck style={{color:"#ff3600"}} aria-hidden="true"/> Continuous improvements
              </div>
            </div>
          </div>
          {/* Cta Section */}
          <div className={styles.roh_cta_section}>
            <div className={styles.roh_cta_content}>
              <h2>Start Listing Today</h2>
              <p>Turn Your Rental Items Into Income. Join a growing network of <a className={styles.roh_link_white} href="/rental-service-providers">rental service providers</a> and start receiving inquiries from customers near you.</p>
              <div className={styles.roh_cta_buttons}>
                <a className={styles.roh_redBtn} href={`${WEB_BASE_DOMAIN_URL}/become-a-host`} aria-label="List Your Item">Rent Your Item</a>
                <a className={styles.roh_blackBtn} href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Provider Support">Contact Provider Support</a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
