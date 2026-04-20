"use client";
import styles from "./providerfaqs.module.css";
import { LuMail, LuLifeBuoy} from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function ProviderFaqsClientClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Provider FAQs">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Provider FAQs</h1>
              <p className={styles.roh_pLarge}>
                Find answers to common questions about listing, managing, and growing your rental services on FindOnRent.
              </p>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Provider FAQs</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}

      <section className={styles.roh_faqs_wrapper} aria-label="FindOnRent frequently asked questions and answers">
        <div className={styles.roh_container}>
          <div className={styles.roh_faqs_content}>
            <div className={styles.roh_faqs_contentInner}>
              <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Getting Started</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">1</div>What is FindOnRent for providers?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p><a href="https://findonrent.com/">FindOnRent</a> is a rental marketplace that helps service providers connect directly with customers looking for <a href={`${WEB_BASE_DOMAIN_URL}/cars`}>self-drive cars</a>, <a href={`${WEB_BASE_DOMAIN_URL}/bikes`}>bikes</a>, <a href={`${WEB_BASE_DOMAIN_URL}/scooty-scooters`}>scooty or scooters</a>, <a href={`${WEB_BASE_DOMAIN_URL}/cars-with-driver`}>cars with driver</a> and other rental items. Providers can list their items, showcase services, and receive direct inquiries without paying any commission.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">2</div>Who can list items on FindOnRent?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Any individual or business offering rental items can list on FindOnRent. This includes <a href={`${WEB_BASE_DOMAIN_URL}/cars`}>self-drive car rentals</a>, <a href={`${WEB_BASE_DOMAIN_URL}/bikes`}>bike rentals</a>, <a href={`${WEB_BASE_DOMAIN_URL}/scooty-scooters`}>scooty or scooter rentals</a>, <a href={`${WEB_BASE_DOMAIN_URL}/cars-with-driver`}>cars with driver</a>, and multi category rental providers.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">3</div>How do I list my item on FindOnRent?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Click on “<a href={`${WEB_BASE_DOMAIN_URL}/become-a-host`}>Rent Your Item</a>”, create an account, and submit your item or service details. Once completed, your listing will be visible to customers on the platform.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">4</div>Is there any cost to list my items?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>No. Listing items on FindOnRent is completely free. There are no listing fees, subscription fees, or commissions.</p>
                        </div>
                    </div>
              </div>

              <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Verification and Trust</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">5</div>How does the verification process work?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>The verification process is simple. You need to verify your email address and phone number. Once both are verified, your provider account is marked as verified and your listings go live.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">6</div>Are any documents required for verification?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>No. FindOnRent does not require document uploads for verification. Email and phone number verification are sufficient to get started.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">7</div>How long does verification take?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Verification is instant once your email address and phone number are successfully verified.</p>
                        </div>
                    </div>
              </div>

               <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Listings and Profile Management</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">8</div>What information appears on my provider profile?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p className="mb-1">Your profile may display:</p>
                            <ul>
                              <li>Provider or business name</li>
                              <li>Items or services offered</li>
                              <li>Location and service area</li>
                              <li>Starting prices</li>
                              <li>Delivery or pickup options</li>
                              <li>Contact details</li>
                            </ul>
                            <p>This helps customers understand your offerings clearly.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">9</div>Can I edit my listings or profile later?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Yes. You can update your listings, pricing, availability, and profile details at any time through your provider dashboard.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">10</div>Can I list multiple items or service types?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Yes. You can list multiple rental items or service types under a single provider account.</p>
                        </div>
                    </div>
              </div>

               <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Bookings and Payments</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">11</div>How do customers contact me?</h4>
                        <div className={styles.roh_faq_answer}>
                            <p>Customers contact you directly using the contact details shown on your listing. You handle all communication, booking confirmation, and rental terms directly.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">12</div>Does FindOnRent handle payments?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>No. All payments are handled directly between you and the customer. FindOnRent does not process or collect payments.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">13</div>Can I set my own pricing and rental policies?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Yes. You have full control over pricing, security deposits, cancellation policies, and rental terms.</p>
                        </div>
                    </div>
              </div>

               <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Support and Issues</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">14</div>What if I receive fake or irrelevant inquiries?</h4>
                        <div className={styles.roh_faq_answer}>
                            <p>If you receive suspicious or irrelevant inquiries, you can report them to the FindOnRent support team for review.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">15</div>What happens if a customer reports my listing?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>All reports are reviewed carefully. If clarification is required, our team may contact you. Listings may be temporarily paused if policy violations are found.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">16</div>Can my provider account be suspended?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Yes. Accounts may be suspended if there are repeated complaints, false information, or policy violations. Providers are notified unless immediate action is required.</p>
                        </div>
                    </div>
              </div>

               <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Visibility and Growth</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">17</div>How can I improve my listing visibility?</h4>
                        <div className={styles.roh_faq_answer}>
                            <p>You can improve visibility by keeping your listings accurate, responding quickly to inquiries, offering competitive pricing, and maintaining good service quality.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">18</div>Does FindOnRent guarantee bookings?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>No. <a href="https://findonrent.com/">FindOnRent</a> provides visibility but does not guarantee bookings. Customer interest depends on pricing, availability, and responsiveness.</p>
                        </div>
                    </div>
              </div>

               <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Legal and Safety</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">19</div>Is insurance mandatory for providers?</h4>
                        <div className={styles.roh_faq_answer}>
                            <p>Insurance requirements depend on the type of rental item and local regulations. Providers are responsible for maintaining any required insurance.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">20</div>Who is responsible for rental disputes?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>All rental agreements are directly between the provider and the customer. <a href="https://findonrent.com/">FindOnRent</a> is not a party to rental transactions but may assist with issue review if reported.</p>
                        </div>
                    </div>
              </div>

               <div className={styles.roh_faq_section}>
                <h3 className={styles.roh_faq_section_title}>Account and Removal</h3>
                    <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">21</div>Can I remove or deactivate my listings?</h4>
                        <div className={styles.roh_faq_answer}>
                            <p>Yes. You can deactivate or remove your listings at any time through your dashboard or by contacting support.</p>
                        </div>
                    </div>
                      <div className={styles.roh_faq_item}>
                      <h4 className={styles.roh_faq_question}>
                        <div className={styles.roh_faq_number} aria-hidden="true">22</div>What happens to my data if I leave the platform?</h4>
                        <div className={styles.roh_faq_answer}>
                          <p>Your data is handled according to our Privacy Policy. You may request account and data deletion, subject to legal requirements.</p>
                        </div>
                    </div>
              </div>

              <div className={styles.roh_contact_box} aria-label="Need More Help?">
                <h2>Need More Help?</h2>
                <p>If you couldn't find the answer you were looking for, our team is here to help.</p>

                <div className={styles.roh_contact_links}>
                  <a className={styles.roh_ctaBtn} href="mailto:vendor@findonrent.com" >
                    <LuMail size={18} aria-hidden="true"/>
                    vendor@findonrent.com
                  </a>
                  <a className={styles.roh_ctaBtn} href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Support"><LuLifeBuoy size={18} aria-hidden="true"/>Contact Support
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


    </>
  );
}
