"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../bikes/components/faqSection.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function FAQSection({ cate_id }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch FAQs by category */
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getsinglecategoryrecentfaqs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_id: cate_id }),
        });
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setFaqs(data.data);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (cate_id) fetchFaqs();
  }, [cate_id]);

  return (
   <>
    <section className={`${styles.faq_wrap}`}>
        <div className={`${styles.faq_inner}`}>
          <div className={styles.faq_wrap_main}>
            <div className={styles.roh_container}>
              <div className="row">
                {/* ===== Left Column (Images) ===== */}
                <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                  <div className={`${styles.faq_left_outer} pe-0 pe-md-4`}>
                    <Image
                      src="/images/vechiclespg/vehicles-scooters-faq-img.webp"
                      width={550}
                      height={550}
                      alt="FAQ Image"
                    />
                  </div>
                </div>

                {/* ===== Right Column (Dynamic FAQs) ===== */}
                <div className="col-12 col-md-12 col-lg-6">
                  <div className="d-flex justify-content-start align-items-center mt-4 mt-md-5 mt-lg-0">
                    <div className={styles.star_box}>
                      <div
                        className={`d-flex align-items-center gap-1 ${styles.star_inner}`}
                      >
                        <Image
                          src="/images/homepg/star.svg"
                          alt="Star"
                          width={24}
                          height={24}
                        />
                        <span className="roh_star_title">
                          Frequently Asked Questions
                        </span>
                      </div>
                    </div>
                  </div>

                  <h2 className={`text-left`}>
                    Everything You Need to Know
                  </h2>

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
                          <h2
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
                          </h2>
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
                            >
                              {faq.description || "No description available."}
                            </div>
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
