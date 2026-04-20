"use client";
import { useEffect, useState } from "react";
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

function generateFaqs(data) {

  if (!data) return [];

  const category = data.category;
  const city = data.city;

  const models = data.popular_models?.join(", ") || "";

  const modelLinks = (data.popular_models || [])
    .map(m => {
      const url = `/${data.category_slug}/${m.slug}/${data.city_slug}`;
      return `<div>• <a href="${url}" target="_blank">${m.name}</a></div>`;
    })
    .join("");

  const vendors = data.vendors || [];

  const priceLines = (data.model_price_ranges || [])
    .sort((a, b) => {

      const getMin = (str) => {
        const match = str.price_range.match(/\d+/);
        return match ? Number(match[0]) : 0;
      };

      return getMin(a) - getMin(b);

    })
    .map(p => `${p.model}: ${p.price_range}`)
    .join("<br/>");

    const priceInfo =
      priceLines
        ? `<br/><br/>${priceLines}`
        : data.price_range
          ? `<br/><br/>${category}: ${data.price_range}`
          : `Please contact the rental service provider for prices.`;

    const priceDescription = `
    The average ${category} rental price in ${city} depends on factors such as the vehicle type, rental duration, and rental providers policies.
    ${priceInfo}
    `;

  const providerProfileLink = vendors[0]
    ? `/rental-service-provider/${vendors[0].slug}`
    : "";

  const providerList = vendors
    .map(v => `<a href="/rental-service-provider/${v.slug}"  target="_blank">${v.name}</a>`)
    .join(", ");

  const viewAllProvidersLink = `/rental-service-providers?city=${encodeURIComponent(city)}`;

  let providerAnswer = "";

  /* -------- CASE 1: ONE PROVIDER -------- */

  if (vendors.length === 1) {

    providerAnswer = `
      Right now, we have only one rental service provider 
      <a href="${providerProfileLink}" target="_blank">${vendors[0].name}</a> 
      who provides ${category} on rent in ${city}. <br/>
      You can view the provider profile and available rental options here:<br/>
      <a href="${providerProfileLink}" target="_blank">View provider profile</a>
    `;

  }

  /* -------- CASE 2: MULTIPLE PROVIDERS -------- */
  else if (vendors.length > 1) {
    providerAnswer = `
      Below are some of the most popular rental service providers who offer ${category} on rent in ${city}:
      ${providerList}.<br/><br/>
      You can also view all ${category} rental providers in ${city} here:<br/>
      <a href="${viewAllProvidersLink}" target="_blank">View all providers</a>
    `;
  }

  return [

    {
      id: 1,
      title: `What is the average ${category} rental price in ${city}?`,
      description: priceDescription,
    },

    {
      id: 2,
      title: `What are the popular ${category} available for rent in ${city}?`,
      description: `Some popular ${category} available for rent in ${city} are:
      <br/><br/>
      ${modelLinks}
      `,
    },

    {
      id: 3,
      title: `What documents are required for ${category} rental in ${city}?`,
      description: `In most cases, renting ${category} requires a valid ID proof and a driving license. However, the exact document requirements may vary depending on the rental providers and vehicle type.`,
    },

    {
      id: 4,
      title: `Who are the popular ${category} rental providers in ${city}?`,
      description: providerAnswer,
    },

    {
      id: 5,
      title: `Is advance booking available for ${category} rental in ${city}?`,
      description: `Yes, many rental providers allow advance booking for ${category} rentals. However, availability and booking policies may vary depending on the rental providers and vehicle type.`,
    }

  ];

}

export default function FAQSection({ faqData, cate_id, loc_id }) {
  const faqs = generateFaqs(faqData);

  const faqImage = categoryImages[cate_id] ||"/images/vechiclespg/vehicles-bikes-faq-img.webp";

  if (!faqs.length) return null;

  return (
    <section className={styles.faq_wrap} aria-label="Frequently asked questions">
      <div className={styles.faq_inner}>
        <div className={styles.faq_wrap_main}>
          <div className={styles.roh_container}>
            <div className="row align-items-center">
              {/* ===== Left Column (Image) ===== */}
              <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                <div className={`${styles.faq_left_outer} pe-0 pe-md-4`}>
                  <Image
                    src={faqImage}
                    width={550}
                    height={550}
                    alt="FAQ Image"
                  />
                </div>
              </div>

              {/* ===== Right Column (FAQs) ===== */}
              <div className="col-12 col-md-6 col-lg-6">
                <div className="d-flex justify-content-start align-items-center mt-4 mt-md-4 mt-lg-0">
                  <div className={styles.star_box}>
                    <div
                      className={`d-flex align-items-center gap-1 ${styles.star_inner}`}
                    >
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
                      <div
                        key={faq.id}
                        className={`accordion-item ${styles.accordion_item}`}
                      >
                        <h4
                          className={`accordion-header ${styles.accordion_header}`}
                          id={`heading-${index}`}
                        >
                          <button
                            className={`accordion-button ${
                              styles.accordion_button
                            } ${index !== 0 ? styles.collapsed : ""}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${index}`}
                            aria-expanded={index === 0 ? "true" : "false"}
                            aria-label={`Toggle FAQ: ${faq.title}`}>
                            {faq.title}
                          </button>
                        </h4>

                        <div
                          id={`collapse-${index}`}
                          className={`accordion-collapse collapse ${
                            index === 0 ? "show" : ""
                          } ${styles.accordion_collapse}`}
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
