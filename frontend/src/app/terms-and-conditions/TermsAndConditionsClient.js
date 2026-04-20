"use client";
import styles from "./termsandconditions.module.css";
import {LuCircleCheckBig, LuCircleX, } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function TermsAndConditionsClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Terms & Conditions">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Terms & Conditions</h1>
              <p className={styles.roh_pLarge}>By accessing or using FindOnRent, you agree to the following Terms & Conditions.</p>
              <span className={styles.roh_last_updated}>Last Updated: December 23, 2025</span>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Terms & Conditions</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

    <section className={styles.roh_cancellation_wrapper} aria-label="Terms and conditions details">
      <div className={styles.roh_container}>
        <div className={styles.roh_cancellation_content}>
        <div className={styles.roh_cancellation_list}>
          {/* 1. Platform Nature */}
              <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>01.</span>
                Platform Nature
              </h2>
              <div className={styles.roh_policy_content}>
                <p>FindOnRent is only a listing and discovery platform.</p>
                <div className={`${styles.roh_check_list_item} ${styles.roh_positive}`}>
                  <div className={styles.roh_icon_wrapper}><LuCircleCheckBig size={20} aria-hidden="true"/></div>
                  <span>We connect rental service providers and users</span>
              </div>
              <div className={`${styles.roh_check_list_item} ${styles.roh_negative}`}>
                <div className={styles.roh_negative_header}>
                    <div className={styles.roh_icon_wrapper}><LuCircleX size={20} aria-hidden="true"/></div>
                    <h3 style={{fontSize: "16px", marginBottom: "0px"}}>We do not:</h3>
                </div>
                <ul className={styles.roh_nested_list}>
                    <li>Act as a broker, agent, or intermediary</li>
                    <li>Handle payments</li>
                    <li>Verify items, users, or documents</li>
                    <li>Take commission</li>
                    <li>Resolve disputes</li>
                </ul>
            </div>
              </div>
            </div>

    {/* 2. No Involvement in Transactions  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>02.</span>
                No Involvement in Transactions
              </h2>
              <div className={styles.roh_policy_content}>
                <p>All rental transactions, agreements, payments, disputes, damages, and liabilities are strictly between the provider and the user.</p>
                <p className="mb-1">FindOnRent has no role or responsibility in:</p>
                <ul>
                  <li>Rental Quality</li>
                  <li>Pricing</li>
                  <li>Item condition</li>
                  <li>Delivery</li>
                  <li>Refunds</li>
                  <li>Cancellations</li>
                  <li>Legal or financial disputes</li>
                </ul>
              </div>
            </div>

        {/* 3. User Responsibilities  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>03.</span>
                User Responsibilities
              </h2>
              <div className={styles.roh_policy_content}>
                <h4 style={{fontSize: "16px", marginTop: "8px"}}>a) Users Renting Items Must:</h4>
              <ul>
                <li>Personally inspect the item before renting</li>
                <li>Verify provider identity</li>
                <li>Understand and agree to provider’s terms & conditions</li>
                <li>Use items responsibly and lawfully</li>
              </ul>
                <h4 style={{fontSize: "16px", marginTop: "8px"}}>b) Providers Must:</h4>
              <ul>
                <li>Ensure item accuracy and availability</li>
                <li>Verify user identity and documents</li>
                <li>Clearly communicate rental terms, pricing, and conditions</li>
                <li>Comply with applicable laws</li>
              </ul>
              </div>
            </div>
      {/* 4. No Guarantees or Warranties  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>04.</span>
                No Guarantees or Warranties
              </h2>
              <div className={styles.roh_policy_content}>
                <p className="mb-1">FindOnRent makes no guarantees regarding:</p>
                <ul>
                  <li>Authenticity of listings</li>
                  <li>Accuracy of information</li>
                  <li>Quality or legality of items</li>
                  <li>Conduct of users or providers</li>
                </ul>
                <p>All services are provided “as is”.</p>
              </div>
            </div>

          {/* 5. Account Usage */}
            <div className={styles.roh_policy_section}>
            <h2 className={styles.roh_policy_title}>
              <span className={styles.roh_policy_number}>05.</span>
              Account Usage
            </h2>
            <div className={styles.roh_policy_content}>
              <ul>
                <li>Users must provide accurate information</li>
                <li>Sharing accounts is prohibited</li>
                <li>Misuse, spam, or abuse may lead to account suspension or termination without notice</li>
              </ul>
            </div>
          </div>

    {/* 6. Limitation of Liability  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>06.</span>
                Limitation of Liability
              </h2>
              <div className={styles.roh_policy_content}>
                <p className="mb-1">FindOnRent shall not be liable for:</p>
                <ul>
                  <li>Losses, damages, injuries, or disputes</li>
                  <li>Fraud, misrepresentation, or misconduct</li>
                  <li>Financial or legal consequences arising from rentals</li>
                </ul>
                <p>Use of the platform is entirely at your own risk.</p>
              </div>
            </div>
          {/* 7. Content & Listings */}
          <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>07.</span>
                  Content & Listings
                </h2>
                <div className={styles.roh_policy_content}>
                  <ul>
                    <li>Providers are responsible for their listings</li>
                    <li>We reserve the right to remove content that violates laws or platform guidelines</li>
                    <li>We do not verify listings by default</li>
                  </ul>
                </div>
              </div>
            {/* 8. Termination  */}
              <div className={styles.roh_policy_section}>
            <h2 className={styles.roh_policy_title}>
              <span className={styles.roh_policy_number}>08.</span>
              Termination
            </h2>
            <div className={styles.roh_policy_content}>
              <p className="mb-1">We reserve the right to:</p>
              <ul>
                <li>Suspend or terminate accounts</li>
                <li>Remove listings</li>
                <li>Restrict access</li>
              </ul>
              <p>Without obligation to provide reasons.</p>
            </div>
          </div>
          {/* 9. Governing Law  */}
          <div className={styles.roh_policy_section}>
          <h2 className={styles.roh_policy_title}>
            <span className={styles.roh_policy_number}>09.</span>
            Governing Law
          </h2>
          <div className={styles.roh_policy_content}>
            <p>These Terms shall be governed by the laws of India.<br/>
            Any disputes shall fall under the jurisdiction of Indian courts.
            </p>
          </div>
        </div>
          {/* 10. Acceptance  */}
          <div className={styles.roh_policy_section}>
          <h2 className={styles.roh_policy_title}>
            <span className={styles.roh_policy_number}>10.</span>
            Acceptance
          </h2>
          <div className={styles.roh_policy_content}>
            <p className="mb-1">By using this website, you acknowledge that:</p>
            <ul className="mb-0">
              <li>You understand these Terms</li>
              <li>You accept full responsibility for your actions</li>
              <li>You release FindOnRent from all liabilities</li>
            </ul>
          </div>
        </div>
        </div>
          </div>
        </div>


    </section>
    </>
  );
}
