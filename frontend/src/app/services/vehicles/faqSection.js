"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "../../globals.css";
import StarIcon from '../../../../public/star.svg';
import styles from "./faqSection.module.css";
import { usePathname } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function FAQSection({ cate_id }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); /**  */

  const slug = pathname
    ?.split("/")
    .filter(Boolean)
    .pop();

  /** Fetch FAQs by category */
  useEffect(() => {
    if (!cate_id) return;
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${ROH_PUBLIC_API_BASE_URL}/getsinglecategoryrecentfaqs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cate_id,
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
      } finally {
        setLoading(false);
      }
    };

    if (cate_id) fetchFaqs();
  }, [cate_id]);

  return (
    <>
      <section className={` ${styles.faq_wrap}`} aria-label="Frequently Asked Questions">
        <div className={`${styles.faq_inner}`}>
          <div className={styles.faq_wrap_main}>
            <div className={styles.roh_container}>
              <div className="row align-items-center">
                {/* ===== Left Column (Images) ===== */}
                <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                  <div className={`${styles.faq_left_outer} pe-0 pe-md-4`}>
                    <Image
                      src="/images/vechiclespg/vehicles-faq-img.webp"
                      width={550}
                      height={550}
                      alt="Illustration representing frequently asked questions about vehicle rentals"/>
                  </div>
                </div>

                {/* ===== Right Column (Dynamic FAQs) ===== */}
                <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="d-flex justify-content-start align-items-center mt-4 mt-md-4 mt-lg-0">
                    <div className={styles.star_box}>
                      <div
                        className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                          <StarIcon className="roh_icon" width={20} height={20}/>
                        <span className="roh_star_title">
                          Frequently Asked Questions
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className={`text-left roh_section_title_h3`}>
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
                          className={`accordion-item ${styles.accordion_item}`}>
                          <h4
                            className={`accordion-header ${styles.accordion_header}`}
                            id={`heading-${index}`}>
                            <button
                              className={`accordion-button ${
                                styles.accordion_button
                              } ${index !== 0 ? styles.changecollapsed : ""}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse-${index}`}
                              aria-expanded={index === 0 ? "true" : "false"}
                              aria-controls={`collapse-${index}`}>
                              {faq.title}
                            </button>
                          </h4>
                          <div
                            id={`collapse-${index}`}
                            className={`accordion-collapse collapse ${
                              index === 0 ? "show" : ""
                            } ${styles.accordion_collapse}`}
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#accordionExample">
                            <div
                              className={`accordion-body ${styles.accordion_body}`}>
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
