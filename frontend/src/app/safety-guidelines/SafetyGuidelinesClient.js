"use client";
import styles from "./safetyguidelines.module.css";
import { LuMapPin, LuShieldCheck, LuCircleCheck, LuCircleCheckBig, LuChevronRight, LuSearch, LuCar, LuSquareCheckBig, LuRefreshCw, LuTriangleAlert, LuFilePlus } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function SafetyGuidelinesClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Safety Guidelines">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Safety Guidelines</h1>
              <p className={styles.roh_pLarge}>
                Your safety is our priority. These guidelines help ensure a transparent, secure, and reliable rental experience for every user.
              </p>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Safety Guidelines</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}

      <section className={styles.roh_features_wrapper} aria-label="Safety guidelines for customers and rental providers">
        <div className={styles.roh_container}>
              <div className={styles.roh_general_guidelines_card} aria-label="General Safety Guidelines">
                <h2>General Safety Guidelines</h2>
                <p style={{color: "#6B7280", marginBottom: "24px"}}>We encourage all users to follow these essential safety practices for every transaction:</p>
                <ul className={styles.roh_card_list}>
                  <li><LuCircleCheckBig  style={{color:"#ff3600"}} size={20} aria-hidden="true"/> Communicate clearly and confirm all rental details before booking</li>
                  <li><LuCircleCheckBig  style={{color:"#ff3600"}} size={20} aria-hidden="true"/> Read listing descriptions carefully and ask questions if anything is unclear</li>
                  <li><LuCircleCheckBig  style={{color:"#ff3600"}} size={20} aria-hidden="true"/> Share only necessary personal information to protect your privacy</li>
                  <li><LuCircleCheckBig  style={{color:"#ff3600"}} size={20} aria-hidden="true"/> Trust your judgment and avoid any transaction that feels suspicious</li>
                </ul>
              </div>


        <div className={styles.roh_grid_features_wrapper}>
            <h3>For Customers</h3>
           <div className={styles.roh_grid_features}>
                {/* Feature 1  */}
                <div className={styles.roh_feature_card}>
                  <h4 className={styles.roh_feature_title}><LuSearch size={22} style={{color:"#ff3600"}} aria-hidden="true"/>Before Booking</h4>
                  <ul className={styles.roh_card_list}>
                    <li>
                      <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Review the provider profile and listing details carefully</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Confirm pricing, security deposit, and cancellation terms</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Verify the exact pickup location and timing</li>
                      <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Request clear photos or additional details if needed</li>
                  </ul>
                </div>

                {/* Feature 2  */}
                <div className={styles.roh_feature_card}>
                  <h4 className={styles.roh_feature_title}><LuMapPin size={22} style={{color:"#ff3600"}} aria-hidden="true"/>At Pickup or Delivery</h4>
                  <ul className={styles.roh_card_list}>
                    <li>
                      <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Inspect the vehicle or rental item thoroughly before use</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Check for existing damage and inform the provider immediately</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Verify documents such as RC, insurance, and permits</li>
                      <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Take photos of the item for your own reference</li>
                  </ul>
                </div>

                {/*  Feature 3  */}
              <div className={styles.roh_feature_card}>
                  <h4 className={styles.roh_feature_title}><LuCar size={22} style={{color:"#ff3600"}} aria-hidden="true"/>During the Rental</h4>
                  <ul className={styles.roh_card_list}>
                    <li>
                      <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Use the rented vehicle or item responsibly</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Follow all local laws and traffic regulations</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Contact the provider immediately if you encounter any issues</li>
                  </ul>
                </div>

                {/* Feature 4 */}
                <div className={styles.roh_feature_card}>
                  <h4 className={styles.roh_feature_title}><LuSquareCheckBig size={22} style={{color:"#ff3600"}} aria-hidden="true"/>At Return</h4>
                  <ul className={styles.roh_card_list}>
                    <li>
                      <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Return the item on time and in the agreed condition</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Settle any pending charges directly with the provider</li>
                    <li>
                      <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Report any disputes or concerns to us promptly</li>
                  </ul>
                </div>
            </div>
         </div>

            <div className={styles.roh_grid_features_wrapper2} aria-label="Guidelines for Rental Providers">
            <h3>For Providers</h3>
          <div className={styles.roh_grid_features}>
            {/* Feature 1  */}
            <div className={styles.roh_feature_card}>
              <h4 className={styles.roh_feature_title}><LuFilePlus size={22} style={{color:"#ff3600"}} aria-hidden="true"/>Before Listing</h4>
              <ul className={styles.roh_card_list}>
                <li>
                  <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Provide accurate and honest information in listings</li>
                <li>
                  <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Keep pricing and item availability updated</li>
                <li>
                  <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Ensure your contact information is correct and reachable</li>
              </ul>
            </div>

            {/* Feature 2  */}
            <div className={styles.roh_feature_card}>
              <h4 className={styles.roh_feature_title}><LuRefreshCw size={22} style={{color:"#ff3600"}} aria-hidden="true"/>During Rentals</h4>
              <ul className={styles.roh_card_list}>
                <li>
                  <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Clearly communicate rental terms and policies</li>
                <li>
                  <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Ensure all vehicles and items are clean and safe to use</li>
                <li>
                  <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Provide all required documents and instructions</li>
              </ul>
            </div>

            {/*  Feature 3  */}
           <div className={styles.roh_feature_card}>
              <h4 className={styles.roh_feature_title}><LuCircleCheck size={22} style={{color:"#ff3600"}} aria-hidden="true"/>After Rentals</h4>
              <ul className={styles.roh_card_list}>
                <li>
                  <LuChevronRight style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Inspect returned items promptly upon handover</li>
                <li>
                  <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Address any customer concerns professionally</li>
                <li>
                  <LuChevronRight  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Report any misuse or disputes to the platform if necessary</li>
              </ul>
            </div>

          </div>
           </div>

            <div className={styles.roh_highlight_box} aria-label="Payments and Transactions">
          <div className={styles.roh_highlight_content}>
            <h3>Payments and Transactions</h3>
            <p><a href="https://findonrent.com/">FindOnRent</a> connects customers directly with <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>rental providers</a>. We do not collect or process payments on behalf of users.</p>
            <ul className={styles.roh_card_list}>
              <li><LuShieldCheck  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Payments are handled directly between users</li>
              <li><LuShieldCheck  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Do not share sensitive financial information publicly</li>
              <li><LuShieldCheck  style={{color:"#ff3600"}} size={18} aria-hidden="true"/> Confirm payment methods and receipts clearly</li>
            </ul>
          </div>
          <div className={styles.roh_highlight_content2}>
            <h3>Platform Responsibility</h3>
            <p><a href="https://findonrent.com/">FindOnRent</a> acts as a marketplace. We do not own, inspect, or operate rental items. While we strive to maintain a safe platform, rental agreements and responsibilities remain strictly between customers and <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>providers</a>.</p>
          </div>
        </div>

         {/* Cta Section */}
          <div className={styles.roh_cta_section} aria-label="Reporting Issues">
            <div className={styles.roh_cta_content}>
              <div className={styles.roh_cta_icon}>
                <LuTriangleAlert size={32} aria-hidden="true"/>
            </div>
              <h2>Reporting Issues</h2>
              <p>If you notice unsafe behavior, suspicious activity, or policy violations, report it immediately. Please provide the listing link, provider name, and description.</p>
              <div className={styles.roh_cta_buttons}>
                <a className={styles.roh_redBtn} href={`${WEB_BASE_DOMAIN_URL}/report-issue`} aria-label="Report Now">Report Now</a>
              </div>
            </div>
          </div>
          <p className="text-center mt-md-5 mt-4 mb-0">Following these guidelines helps ensure a positive, professional, and secure experience for everyone in the <a href="https://findonrent.com/">FindOnRent</a> community.</p>

        </div>
      </section>
    </>
  );
}
