"use client";
import styles from "./privacypolicy.module.css";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function PrivacyPolicyClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Privacy Policy">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Privacy Policy</h1>
              <p className={styles.roh_pLarge}>Your privacy is important to us.</p>
              <span className={styles.roh_last_updated}>Last Updated: December 23, 2025</span>
               <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Privacy Policy</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

    <section className={styles.roh_cancellation_wrapper} aria-label="Privacy policy details">
      <div className={styles.roh_container}>
        <div className={styles.roh_cancellation_content}>
          <p>Welcome to <a href="https://findonrent.com/">FindOnRent</a> (“we”, “our”, “the website”). This Privacy Policy explains how we collect, use, and protect your information<br/> when you use <a href="https://findonrent.com/">https://findonrent.com/</a>.</p>

        <div className={styles.roh_cancellation_list}>
          {/* 1. Information We Collect */}
              <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>01.</span>
                Information We Collect
              </h2>
              <div className={styles.roh_policy_content}>
                <p>We collect only the minimum information required to operate the platform.</p>
                <p className="mb-1"><strong>a) Information You Provide</strong></p>
                <ul>
                  <li>Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Login Credentials</li>
                  <li>Location (city/state)</li>
                </ul>
                <p className="mb-1">This information is collected when you:</p>
                <ul>
                  <li>Register or log in</li>
                  <li>List a rental item</li>
                  <li>Contact a rental service provider</li>
                </ul>
                <p className="mb-1"><strong>b) Automatically Collected Information</strong></p>
                <ul>
                  <li>IP Address</li>
                  <li>Browser Type</li>
                  <li>Device Information</li>
                  <li>Pages Visited</li>
                  <li>Date & time of access</li>
                </ul>
                <p>This data is collected for security, analytics, and performance improvement only.</p>
              </div>
            </div>

    {/* 2. How We Use Your Information  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>02.</span>
                How We Use Your Information
              </h2>
              <div className={styles.roh_policy_content}>
                <p className="mb-1">We use your information to:</p>
                <ul>
                  <li>Enable login and account access</li>
                  <li>Show contact details of providers to logged-in users</li>
                  <li>Prevent spam, misuse, and unauthorized access</li>
                  <li>Improve platform performance and user experience</li>
                  <li>Communicate important platform-related updates</li>
                </ul>
                <div className={styles.roh_highlight_box} aria-label="Important privacy policy notice">
              <h3 className="fw-bold mb-2 d-flex align-items-center" style={{fontSize: "16px", color: "#991B1B"}}><span className="me-1" aria-hidden="true">⚠️ </span> We do NOT: </h3>
              <ul>
                <li>Sell user data</li>
                <li>Share contact details publicly</li>
                <li>Process payments</li>
                <li>Interfere in rental transactions</li>
              </ul>
            </div>
              </div>
            </div>

        {/* 3. Contact Details Visibility  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>03.</span>
                Contact Details Visibility
              </h2>
              <div className={styles.roh_policy_content}>
              <ul>
                <li>Provider contact details are visible only to logged-in users</li>
                <li>This is done solely to reduce spam and misuse</li>
                <li>We are not responsible for any communication that occurs after contact is made</li>
              </ul>
              </div>
            </div>
      {/* 4. Cookies  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>04.</span>
                Cookies
              </h2>
              <div className={styles.roh_policy_content}>
                <p className="mb-1">We use cookies to:</p>
                <ul>
                  <li>Maintain login sessions</li>
                  <li>Improve site functionality</li>
                  <li>Analyze traffic patterns</li>
                </ul>
                <p>You can disable cookies via your browser, but some features may not work properly.</p>
              </div>
            </div>

          {/* 5. Data Security */}
            <div className={styles.roh_policy_section}>
            <h2 className={styles.roh_policy_title}>
              <span className={styles.roh_policy_number}>05.</span>
              Data Security
            </h2>
            <div className={styles.roh_policy_content}>
              <p>We use reasonable technical and administrative measures to protect your data. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
            </div>
          </div>

    {/* 6. Third-Party Services  */}
        <div className={styles.roh_policy_section}>
              <h2 className={styles.roh_policy_title}>
                <span className={styles.roh_policy_number}>06.</span>
                Third-Party Services
              </h2>
              <div className={styles.roh_policy_content}>
                <p className="mb-1">We may use third-party tools for:</p>
                <ul>
                  <li>Analytics</li>
                  <li>Performance Monitoring</li>
                  <li>Security</li>
                </ul>
                <p>These services follow their own privacy policies. We are not responsible for their practices.</p>
              </div>
            </div>
          {/* 7. User Responsibility */}
          <div className={styles.roh_policy_section}>
                <h2 className={styles.roh_policy_title}>
                  <span className={styles.roh_policy_number}>07.</span>
                  User Responsibility
                </h2>
                <div className={styles.roh_policy_content}>
                  <p className="mb-1">Users are responsible for:</p>
                  <ul>
                    <li>Verifying rental items personally</li>
                    <li>Ensuring authenticity of service providers</li>
                    <li>Sharing information responsibly</li>
                  </ul>
                </div>
              </div>
            {/* 8. Policy Updates  */}
              <div className={styles.roh_policy_section}>
            <h2 className={styles.roh_policy_title}>
              <span className={styles.roh_policy_number}>08.</span>
              Policy Updates
            </h2>
            <div className={styles.roh_policy_content}>
              <p>We may update this Privacy Policy at any time. Changes will be posted on this page.</p>
            </div>
          </div>
          {/* 9. Contact Us  */}
          <div className={styles.roh_policy_section}>
          <h2 className={styles.roh_policy_title}>
            <span className={styles.roh_policy_number}>09.</span>
            Contact Us
          </h2>
          <div className={styles.roh_policy_content}>
            <p className="mb-0">If you have questions regarding this Privacy Policy, contact us via the website <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`}>contact</a> page.</p>
          </div>
        </div>
        </div>
          </div>
        </div>


    </section>
    </>
  );
}
