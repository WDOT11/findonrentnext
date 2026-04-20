"use client";
import Image from "next/image";
import "../../globals.css";
import styles from "./faqSection.module.css";
import StarIcon from "../../../../public/star.svg";

/* Category-wise image mapping (ID based) */
const categoryImages = {
  2: "/images/vechiclespg/vehicles-cars-faq-img.webp",
  3: "/images/vechiclespg/vehicles-bikes-faq-img.webp",
  8: "/images/vechiclespg/vehicles-scooters-faq-img.webp",
  10: "/images/vechiclespg/vehicles-cars-faq-img.webp",
};

export default function FAQSection({ faqData, cate_id }) {

  if (!faqData) return null;

  const {
    category,
    model,
    city,
    price_range,
    vendors = [],
    total_listings,
    brand
  } = faqData;

  const providerList = vendors.map(v => v.name).join(", ");
  const safeBrand = typeof brand === "string" ? brand : "";

  const providerHtml =
  vendors.length > 0
    ? `<ul>
        ${vendors
          .map(
            v =>
              `<li><a href="/rental-service-provider/${v.slug}" target="_blank">${v.name}</a></li>`
          )
          .join("")}
      </ul>`
    : "Multiple rental providers may offer this model depending on availability.";

const viewAllBtn =
  vendors.length >= 5
    ? `<br/><br/>
       <a href="/rental-service-providers?city=${faqData.city_slug}"
          class="button theme-btn-new"
          target="_blank">
          View all rental service providers
       </a>`
    : "";

  const priceHtml =
  price_range && price_range !== "0"
    ? `<br/><br/>
      Typical price ranges offered by providers are:
      <ul>
        <li>${price_range}</li>
      </ul>`
    : `
      Please contact the rental providers directly for pricing details.`;

const faqs = [
  {
    id: 1,
    title: `What is the rental price range for ${model} in ${city}?`,
    description: `
      The rental price range for ${model} in ${city} may vary depending on rental duration, vehicle condition, demand, and rental service provider policies.
      ${priceHtml}
      For exact pricing and availability, please contact the rental providers directly.
    `
  },
  {
    id: 2,
    title: `Which rental service providers offer ${model} on rent in ${city}?`,
    description: `
      Some of the popular rental service providers who offer ${model} on rent in ${city} include:
      ${providerHtml}
      ${viewAllBtn}
      Users can explore provider profiles, compare rental options, and choose the most suitable provider based on pricing, vehicle availability, and rental terms.
    `
  },
  {
    id: 3,
    title: `How popular is ${model} among ${category} rentals in ${city}?`,
    description: `
      The popularity of ${model} in the ${category} rental segment in ${city} depends on factors such as user demand, travel preferences, pricing range, and rental provider availability.
      Rental trends may change during tourist seasons or weekends when demand for commonly preferred models usually increases.
    `
  },
  {
    id: 4,
    title: `Is security deposit required for ${model} ${category} rental in ${city}?`,
    description: `
      Most rental service providers may require a security deposit for renting ${model} ${category} in ${city}, which depends on factors such as vehicle type, rental duration, and provider policies.
      The deposit amount and refund conditions should be verified at the time of booking.
    `
  },
  {
    id: 5,
    title: `What documents or eligibility requirements should I check before renting ${model} ${category} in ${city}?`,
    description: `
      Before booking ${model} ${category} on rent in ${city}, users should ensure they meet the basic rental eligibility criteria such as valid identification proof, required driving credentials (if applicable), and compliance with rental provider terms.
      Document requirements and eligibility conditions may vary depending on the rental provider and vehicle type.
    `
  }
];

  const faqImage =
    categoryImages[cate_id] ||
    "/images/vechiclespg/vehicles-bikes-faq-img.webp";

  return (
    <section className={styles.faq_wrap} aria-label="Frequently asked questions">
      <div className={styles.faq_inner}>
        <div className={styles.faq_wrap_main}>
          <div className={styles.roh_container}>
            <div className="row align-items-center">
              {/* ===== Left Column (Image) ===== */}
              <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                <div className={`${styles.faq_left_outer} pe-0 pe-md-4`}>
                  <Image src={faqImage} width={550} height={550} alt="FAQ Image" />
                </div>
              </div>

              {/* ===== Right Column (FAQs) ===== */}
              <div className="col-12 col-md-6 col-lg-6">
                <div className="d-flex justify-content-start align-items-center mt-4 mt-md-4 mt-lg-0">
                  <div className={styles.star_box}>
                    <div className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                      <StarIcon width={20} height={20} />
                      <span className="roh_star_title">
                        Frequently Asked Questions
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="roh_section_title_h3">Everything You Need to Know</h3>

                <div className={styles.accordion} id="accordionExample" aria-label="Rental service frequently asked questions list">
                  {faqs.map((faq, index) => (
                    <div key={faq.id} className={`accordion-item ${styles.accordion_item}`}>
                      <h4 className={`accordion-header ${styles.accordion_header}`} id={`heading-${index}`}>
                        <button
                          className={`accordion-button ${styles.accordion_button} ${index !== 0 ? styles.collapsed : ""}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${index}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                        >
                          {faq.title}
                        </button>
                      </h4>

                      <div
                        id={`collapse-${index}`}
                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""} ${styles.accordion_collapse}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div
                          className={`accordion-body ${styles.accordion_body}`}
                          dangerouslySetInnerHTML={{ __html: faq.description }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}