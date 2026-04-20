"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "../../globals.css";
import styles from "./faqSection.module.css";
import StarIcon from '../../../../public/star.svg';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

/* Category-wise image mapping */
const categoryImages = {
  2: "/images/vechiclespg/vehicles-cars-faq-img.webp",
  3: "/images/vechiclespg/vehicles-bikes-faq-img.webp",
  8: "/images/vechiclespg/vehicles-scooters-faq-img.webp",
  10: "/images/vechiclespg/vehicles-cars-faq-img.webp",
};

export default function FAQSection({ loc_id, faqData = [] }) {
  const pathname = usePathname(); /** goa */
  const [slug, setSlug] = useState("");
  const [faqs, setFaqs] = useState(faqData);
  const [loading, setLoading] = useState(faqData.length === 0);

  /* ============================
     GET SLUG FROM URL
  ============================ */
  useEffect(() => {
    if (!pathname) return;

    /** remove empty parts */
    const parts = pathname.split("/").filter(Boolean);

    /** last part → goa / jaipur */
    const currentSlug = parts[parts.length - 1];

    setSlug(currentSlug);
  }, [pathname]);

  /* ============================
     FETCH FAQs USING SLUG
  ============================ */
  useEffect(() => {
    if (!loc_id || faqData.length > 0) return;

    const fetchFaqs = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${ROH_PUBLIC_API_BASE_URL}/getsinglecategoryrecentfaqs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loc_id
            }),
          }
        );

        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
          setFaqs(data.data);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [slug]);

  if (!loading && faqs.length === 0) {
    return null;
  }
  return (
   <>
    <section className={`${styles.faq_wrap}`} aria-label="Frequently asked questions">
        <div className={`${styles.faq_inner}`}>
          <div className={styles.faq_wrap_main}>
          <div className={styles.roh_container}>
              <div className="row align-items-center">
                {/* ===== Left Column (Images) ===== */}
                <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                  <div className={`${styles.faq_left_outer} pe-0 pe-md-4`}>
                    <Image
                      src={categoryImages[slug] || "/images/vechiclespg/vehicles-cars-faq-img.webp"}
                      width={550}
                      height={550}
                       alt="Frequently asked questions illustration"
                    />
                  </div>
                </div>

                {/* ===== Right Column (Dynamic FAQs) ===== */}
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="d-flex justify-content-start align-items-center mt-4 mt-md-4 mt-lg-0">
                    <div className={styles.star_box}>
                      <div className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                         <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                        <span className="roh_star_title">
                          Frequently Asked Questions
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className={`roh_section_title_h3 text-left`}>
                    Everything You Need to Know
                  </h3>

                  {loading ? (
                    <p className="mt-4">Loading FAQs...</p>
                  ) : faqs.length === 0 ? (
                    <p className="mt-4">No FAQs found for this category.</p>
                  ) : (
                    <div className={styles.accordion} id="accordionExample">
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
                              aria-controls={`collapse-${index}`}
                            >
                              {faq.title}
                            </button>
                          </h4>
                          <div
                            id={`collapse-${index}`}
                            className={`accordion-collapse collapse ${
                              index === 0 ? "show" : ""
                            } ${styles.accordion_collapse}`}
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#accordionExample"
                          >
                            <div
                              className={`accordion-body ${styles.accordion_body}`}
                              dangerouslySetInnerHTML={{ __html: faq.description || "No description available." }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
   </>
  );
}
