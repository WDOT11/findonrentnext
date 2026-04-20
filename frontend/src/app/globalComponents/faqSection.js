"use client";
import Image from "next/image";
import styles from "./css/faqSection.module.css";

export default function FAQSection() {

    return (
        <>
          <section className={` ${styles.faq_wrap}`}>
      <div className={`${styles.faq_inner}`}>
        <div className={styles.faq_wrap_main}>
          <div className="container position-relative">
            <div className="row align-items-center">
              {/* ===== Left Column (Images) ===== */}
              <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                <div className={`${styles.faq_left_outer} pe-0 pe-md-4`}>
                 <Image src="/images/vechiclespg/vehicles-faq-img.webp" width={550} height={550} alt="FAQ Image"/>
                </div>
              </div>

              {/* ===== Right Column (Dynamic FAQs) ===== */}
              <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                <div className="d-flex justify-content-start align-items-center mt-4 mt-md-4 mt-lg-0">
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
                      <span className={styles.star_title}>
                        Frequently Asked Questions
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className={`text-left ${styles.second_heading}`}>
                  Everything You Need to Know Sample FAQs:
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
                        <h5
                          className={`accordion-header ${styles.accordion_header}`}
                          id={`heading-${index}`}
                        >
                          <button
                            className={`accordion-button ${styles.accordion_button} ${
                              index !== 0 ? styles.changecollapsed : ""
                            }`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${index}`}
                            aria-expanded={index === 0 ? "true" : "false"}
                            aria-controls={`collapse-${index}`}
                          >
                            {faq.title}
                          </button>
                        </h5>
                        <div
                          id={`collapse-${index}`}
                          className={`accordion-collapse collapse ${
                            index === 0 ? "show" : ""
                          } ${styles.accordion_collapse}`}
                          aria-labelledby={`heading-${index}`}
                          data-bs-parent="#accordionExample"
                        >
                          <div className={`accordion-body ${styles.accordion_body}`}>
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