"use client";
import styles from "./cancellationandrefund.module.css";
import {LuMail} from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function CancellationAndRefundClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Cancellation and Refund Policy">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Cancellation and Refund Policy</h1>
              <p className={styles.roh_pLarge}> Understanding your rights and responsibilities regarding bookings, cancellations, and refunds.</p>
              <span className={styles.roh_last_updated}>Last Updated: December 23, 2025</span>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Cancellation and Refund Policy</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.roh_cancellation_wrapper} aria-label="Cancellation and refund policy details">
        <div className={styles.roh_container}>
          <div className={styles.roh_cancellation_content}>
            <p>This Cancellation and Refund Policy governs the handling of cancellations, refunds, and related inquiries on the <a href="https://findonrent.com/">FindOnRent</a> platform. By accessing or using our services, you acknowledge and agree to the terms outlined herein.</p>
            <p><a href="https://findonrent.com/">FindOnRent</a> operates exclusively as a marketplace connecting customers with independent <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>rental service providers</a>. We do not own inventory, determine rental pricing, or process financial transactions directly.</p>

          <div className={styles.roh_cancellation_list}>
            {/* 1. General Policy Overview  */}
                <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>01.</span>
                  General Policy Overview
                </h2>
                <div className={styles.roh_policy_content}>
                  <p className="mb-1">All rental agreements are executed directly between customers and providers.</p>
                  <ul>
                    <li>Cancellation and refund terms are strictly defined by individual providers.</li>
                    <li>FindOnRent does not control, manage, or guarantee refunds.</li>
                    <li>Users are strongly advised to confirm specific cancellation and refund terms with the provider prior to booking.</li>
                  </ul>
                </div>
              </div>

      {/* 2. Cancellation by Customers  */}
          <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>02.</span>
                  Cancellation by Customers
                </h2>
                <div className={styles.roh_policy_content}>
                  <p className="mb-1">Customers may request cancellation of a rental booking subject to the provider’s stated policies. Before confirming a booking, please clarify:</p>
                  <ul>
                    <li>Eligibility for cancellation.</li>
                    <li>Applicable cancellation charges or fees.</li>
                    <li>Time limits for full or partial refunds.</li>
                    <li>Expected timelines for refund processing.</li>
                  </ul>
                  <p>All cancellation requests must be communicated directly to the <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>rental provider</a>.</p>
                </div>
              </div>

          {/* 3. Cancellation by Providers  */}
          <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>03.</span>
                  Cancellation by Providers
                </h2>
                <div className={styles.roh_policy_content}>
                  <p>Providers reserve the right to cancel a booking due to item unavailability, operational constraints, safety concerns, or force majeure events.</p>
                  <p>In such instances, the provider is responsible for promptly informing the customer and facilitating any applicable refund or alternative arrangement.</p>
                </div>
              </div>
        {/* 4. Refund Policy  */}
          <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>04.</span>
                  Refund Policy
                </h2>
                <div className={styles.roh_policy_content}>
                  <p className="mb-1">Refunds, where applicable, are processed solely by the <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>rental provider</a>.</p>
                  <ul>
                    <li>Refund amounts and processing timelines are determined by the provider’s internal policies.</li>
                    <li><a href="https://findonrent.com/">FindOnRent</a> does not hold funds and cannot issue refunds on behalf of providers.</li>
                    <li>Customers must verify the refund method and estimated processing time directly with the provider.</li>
                  </ul>
                </div>
              </div>

            {/* 5. No Show and Early return */}
              <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>05.</span>
                No Show and Early Return
              </h2>
              <div className={styles.roh_policy_content}>
                <p>Failure to arrive for a booking ("No Show") may result in partial or full charges as per the provider’s policy.</p>
                <p>Early returns may not automatically qualify for refunds. Eligibility is subject to the provider’s discretion. We recommend clarifying these conditions beforehand.</p>
              </div>
            </div>

      {/* 6. Changes to Bookings  */}
          <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>06.</span>
                  Changes to Bookings
                </h2>
                <div className={styles.roh_policy_content}>
                  <p>Modifications to booking dates, duration, pickup details, or item selection must be approved by the provider. Any resulting pricing adjustments are at the sole discretion of the provider.</p>
                </div>
              </div>
            {/* 7. Disputes and Complaints */}
            <div className={styles.roh_policy_section}>
                  <h2 className={styles.roh_policy_title}>
                    <span className={styles.roh_policy_number}>07.</span>
                    Disputes and Complaints
                  </h2>
                  <div className={styles.roh_policy_content}>
                    <p className="mb-1">In the event of a dispute regarding cancellations or refunds:</p>
                    <ul>
                      <li>Customers must first attempt to resolve the matter directly with the provider.</li>
                      <li>If the issue remains unresolved, it may be reported to FindOnRent for review.</li>
                      <li>While <a href="https://findonrent.com/">FindOnRent</a> may investigate complaints and penalize providers for policy violations, the platform is not liable for financial reimbursement.</li>
                    </ul>
                  </div>
                </div>
              {/* 8. Platform Responsibility Disclaimer  */}
                    <div className={`${styles.roh_policy_section} ${styles.roh_disclaimer_section}`} aria-label="Platform Responsibility Disclaimer">
                  <h2 className={styles.roh_policy_title}>
                    <span className={styles.roh_policy_number}>08.</span>
                    Platform Responsibility Disclaimer
                  </h2>
                  <div className={styles.roh_policy_content}>
                    <p className="mb-0"><a href="https://findonrent.com/">FindOnRent</a> is not a party to any rental agreements, does not hold funds, and is not responsible for enforcing cancellation or refund terms between users and providers. FindOnRent acts solely as an intermediary marketplace. We are not a party to rental agreements, do not hold funds, and are not responsible for enforcing cancellation or refund terms between users and providers.</p>
                  </div>
                </div>
                {/* 9. Policy Violations  */}
                <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>09.</span>
                Policy Violations
              </h2>
              <div className={styles.roh_policy_content}>
                <p>Providers found to be misrepresenting cancellation or refund terms may face disciplinary actions, including listing suspension or permanent removal from the platform.</p>
              </div>
            </div>
            {/* 10. Updates to This Policy  */}
            <div className={styles.roh_policy_section}>
            <h2 className={styles.roh_policy_title}>
              <span className={styles.roh_policy_number}>10.</span>
              Updates to This Policy
            </h2>
            <div className={styles.roh_policy_content}>
              <p><a href="https://findonrent.com/">FindOnRent</a> reserves the right to update this policy at any time. Modifications will be posted on this page with a revised date. Continued use of the platform constitutes acceptance of the updated policy.</p>
            </div>
          </div>
        {/* 11. Contact Information  */}
        <div className={styles.roh_policy_section}>
            <h2 className={styles.roh_policy_title}>
              <span className={styles.roh_policy_number}>11.</span>
              Contact Information
            </h2>
            <div className={styles.roh_policy_content}>
              <p>For inquiries regarding this policy, please contact us:</p>
              <div className={styles.roh_contact_grid}>
                <a className={styles.roh_contact_card} href="mailto:support@findonrent.com">
                  <div className={styles.roh_contact_icon}>
                    <LuMail size={20} aria-hidden="true"/>
                  </div>
                  <div className={styles.roh_contact_info}>
                    <h4>General Support</h4>
                    <span>support@findonrent.com</span>
                  </div>
                </a>
                <a className={styles.roh_contact_card} href="mailto:report@findonrent.com">
                  <div className={styles.roh_contact_icon}>
                    <LuMail size={20} aria-hidden="true"/>
                  </div>
                  <div className={styles.roh_contact_info}>
                    <h4>Report Issues</h4>
                    <span >report@findonrent.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          </div>
          <div className={styles.roh_highlight_box} aria-label="Important cancellation and refund notice">
            <p className="fw-semibold mb-0">Important: Cancellation and refund terms are determined exclusively by individual providers. Please confirm all policies directly with the provider before completing your booking.</p>
          </div>


            </div>
          </div>


      </section>
    </>
  );
}
