"use client";

import Image from "next/image";
import styles from "./faqSection.module.css";
import { LuMessageSquare, LuArrowRight } from "react-icons/lu";

export default function FAQSection() {

  const faqs = [
    {
      id: 1,
      title: "Are the devices tested before renting?",
      description:
        "Yes, all providers are required to test and verify the working condition of electronics before handing them over to ensure a seamless experience for you."
    },
    {
      id: 2,
      title: "Do I need to pay a security deposit for expensive tech?",
      description:
        "Some high-value devices may require a refundable security deposit depending on the provider."
    },
    {
      id: 3,
      title: "What happens if the device gets damaged?",
      description:
        "Most electronics are available on daily, weekly, and monthly rental plans."
    },
    {
      id: 4,
      title: "Can I rent a laptop for just one day?",
      description:
        "Yes, rental duration can usually be extended based on availability."
    },
    {
      id: 5,
      title: "What documents are required to rent electronics?",
      description:
        "Delivery is available in major cities including Mumbai, Delhi, Bangalore, and Pune."
    }
  ];

  return (
    <section className={styles.faq_wrap} aria-label="Frequently Asked Questions">

      <div className={styles.faq_inner}>

        <div className={styles.faq_wrap_main}>

          <div className={styles.roh_container}>

            <div className="row align-items-center">

              {/* LEFT IMAGE */}
              <div className="col-12 col-lg-6">

                <div className={`${styles.faq_left_outer} pe-md-4`}>

                  <Image
                    src="/images/electronicspg/faq-electronics-workspace.webp"
                    width={550}
                    height={550}
                    alt="Electronics FAQ Illustration"
                  />

                </div>

              </div>


              {/* RIGHT FAQ */}
              <div className="col-12 col-lg-6">

                <div className="d-flex align-items-center mt-4 mt-lg-0">

                  <span className={styles.roh_section_label}>
                    <LuMessageSquare size={16} />
                    The Platform
                  </span>

                </div>

                <h3 className="roh_section_title_h3">
                  Everything You Need to Know
                </h3>


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
                        >

                          {faq.description}

                        </div>

                      </div>

                    </div>

                  ))}

                </div>
                <div className="d-flex gap-3 mt-4">
                    <span>Still have questions?</span> <a href="#" className="d-flex align-items-center gap-1 fw-semibold text-decoration-none" style={{color:"#ff5600"}}>Contact Support <LuArrowRight size={16}/></a>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}