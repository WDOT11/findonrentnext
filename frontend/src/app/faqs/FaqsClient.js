"use client";
import styles from "./faqs.module.css";
import { LuCircleHelp } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function FaqsClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Frequently asked questions about FindOnRent">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Frequently Asked Questions</h1>
              <p className={styles.roh_pLarge}>
                Find quick answers to the most common questions about renting
                and listing on FindOnRent.
              </p>
               <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                      <li>
                        <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                      </li>
                      <li className={styles.separator} aria-hidden="true">›</li>
                      <li aria-current="page">FAQs</li>
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

              <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  1. What is FindOnRent?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>
                    <a href="https://findonrent.com/">FindOnRent</a> is an online rental marketplace that helps you find and book vehicles and other rental items from verified local providers. You can compare prices, explore options, and contact <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a> directly with no middlemen or commission. </p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  2. How do I book a vehicle or item on FindOnRent?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>
                    Search for what you need, compare listings, and contact the provider directly through the details shown on the listing page. Confirm availability, discuss requirements, and finalize the booking with the vendor.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  3. Do I need to create an account to book?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>
                    No. You can browse and contact <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a> without creating an account. However, creating an account gives you access to saved preferences, faster browsing, and the ability to manage your listings if you are a provider.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  4. Does FindOnRent charge any booking fees or commission?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>
                    No. <a href="https://findonrent.com/">FindOnRent</a> does not charge any booking fees or commission. You pay the vendor directly.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  5. How does FindOnRent verify vendors?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>
                    Every vendor is verified before their listings go live. Verification includes identity or business checks, contact validation, and item authenticity checks. Only reliable providers are approved.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  6. What documents are required to rent a vehicle?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p className="mb-1">
                    Requirements may vary by provider, but commonly include:</p>
                    <ul>
                      <li>A valid driving license</li>
                      <li>Government ID proof</li>
                      <li>A refundable security deposit</li>
                    </ul>
                    <p>Always confirm the exact requirements with the vendor before booking.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  7. How do I know if a vehicle or item is available?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>
                    Availability is updated by the provider. You can contact them directly through the listing to confirm real-time availability.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  8. How do payments work?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>All payments are handled directly by the rental provider. <a href="https://findonrent.com/">FindOnRent</a> does not collect or hold any payments. <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>Vendors</a> may accept cash, UPI, bank transfer, or online payment links.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  9. Can I get delivery of the vehicle or item?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Many providers offer pickup and drop or home delivery. Availability depends on the vendor and your location. Check the listing details or contact the provider.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  10. What if I need to cancel my booking?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Cancellation policies differ by vendor. Always confirm the cancellation fee, refund rules, and notice period required before booking. Cancellations are handled directly between you and the provider.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  11. What if the provider does not respond?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Try reaching out through the contact options such as call or WhatsApp. If you still face issues, browse similar listings or report inactive providers to us for review.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  12. Can I list my vehicle or product on FindOnRent?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Yes. Click on "List Your Item," create an account, and submit your details. After verification, your listing will go live and customers will be able to contact you directly.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  13. Is there any cost to list my item on FindOnRent?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>No. Listing is completely free, and you keep 100 percent of your earnings. There are no hidden charges.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  14. Are the vehicles insured?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Most providers offer vehicles with valid insurance, but coverage may vary. Confirm insurance details with the vendor before renting.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  15. What happens if the vehicle breaks down or has issues?
                </h2>
                  <div className={styles.roh_faq_answer}>
                   <p>Contact the provider immediately. Most <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a> offer support or replacement options. Policies vary, so check the listing for service or assistance information.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  16. Does FindOnRent provide customer support?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Yes. You can contact our support team for help with issues such as unresponsive vendors, suspicious listings, or general assistance. Our goal is to ensure a safe and smooth rental experience.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  17. Is my personal information safe?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Yes. We only share your details with the provider you choose to contact. <a href="https://findonrent.com/">FindOnRent</a> does not misuse or sell personal information.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  18. Can I rent for long-term use such as weekly or monthly?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p>Many <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}>vendors</a> offer long-term rental plans. Ask the provider directly for extended duration pricing.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  19. What locations do you serve?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p><a href="https://findonrent.com/">FindOnRent</a> works with providers across multiple cities. Availability depends on vendor listings in your area. Use your location in the search field to see what is available near you.</p>
                  </div>
              </div>

               <div className={styles.roh_faq_item}>
                <h2 className={styles.roh_faq_question}>
                  <div className={styles.roh_faq_icon}>
                    <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuCircleHelp size={24} aria-hidden="true"/></div>
                  </div>
                  20. What should I check before accepting a rental vehicle?
                </h2>
                  <div className={styles.roh_faq_answer}>
                    <p className="mb-1">Before starting your rental, check the following:</p>
                    <ul>
                      <li>Fuel level</li>
                      <li>Existing scratches or damage</li>
                      <li>Tire and brake condition</li>
                      <li>Insurance papers</li>
                      <li>RC book or permit</li>
                      <li>Working lights and indicators</li>
                    </ul>
                    <p className="mb-0">Taking photos is recommended for safety.</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
