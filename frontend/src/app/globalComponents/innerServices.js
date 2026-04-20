"use client";
import { useEffect, useState } from 'react';
import "../globals.css"
import styles from './css/innerServices.module.css';
import Image from "next/image";
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function InnerServices() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** fetch child categories on mount */
    const fetchCategories = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parent_category_id: 1 }), /** vehicles parent id hardcoded */
        });

        const data = await resp.json();
        /** adjust this based on your API shape */
        setCategories(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories', err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className={styles.roh_explore_wrap}>
      <div className={styles.roh_explore_wrap_inner}>
        <div className={styles.roh_explore_wrap_main}>
          <div className="d-flex justify-content-center align-items-center">
            <div className="roh_star_box">
              <div className="star_inner d-flex align-items-center gap-1">
                <Image src="/images/homepg/star.svg" alt="star icon" width={19} height={17} />
                <span className={styles.roh_star_title}>About us</span>
              </div>
            </div>
          </div>

          <h3 className={`${styles.roh_second_heading} text-center`}>
            Explore our wide range of <br />rental services
          </h3>

          <div className="container mt-5">
            <div className={styles.roh_main_data_wrap}>
              {/* show loading */}
              {loading && <p>Loading services…</p>}

              {/* no data fallback */}
              {!loading && categories.length === 0 && (
                <p>No services available at the moment.</p>
              )}

              {/* get vehicles sub categories section start */}
              {!loading && categories.length > 0 && categories.map((cat) => (
                <div key={cat.id} className={`${styles.roh_card_box}`}>
                  <div className={styles.roh_card_box_inner}>
                    <ul className={styles.roh_explore_media_list}>
                      <li>
                        <div className={styles.roh_media}>
                          <div className="roh_media_imgbox">
                            <div className={styles.roh_back_circle}>
                              {/* keep same icon */}
                              <img src="/images/vechiclespg/checkcar.svg" alt="icon" />
                            </div>
                          </div>
                          <div className="media-body">
                            {/* name from API */}
                            <a href={`/services/vehicles/${cat.slug}`}>
                              <h5 className={styles.roh_media_title}>{cat.name}</h5>
                            </a>
                            {/* description from API */}
                            <p className={`${styles.roh_global_heading} ${styles.roh_gray_global_heading}`}>
                              {cat.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div className={styles.roh_circl_btn}>

                      <a href={`/services/vehicles/${cat.slug}`}>
                        <button>
                          <img src="/images/global-imgs/arrow.svg" alt="arrow" />
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              {/* get vehicles sub categories section end */}
            </div>

            {/* static bottom content */}
            <div className="row pt-5">
              <div className="col-12">
                <p className={`${styles.roh_global_heading} ${styles.roh_explore_desc} ${styles.roh_gray_global_heading}`}>
                  Discover our range of car rental services designed to meet all your travel needs.
                  <br /> From a diverse fleet of vehicles to flexible rental plans.
                </p>
              </div>
              <div className="col-12">
                <div className={styles.roh_btn_exprore_wrap}>
                  <div className={`d-flex align-items-center justify-content-center roh_redBtns`}>
                    <div className="roh_button_custom"><a href="/contact-us">Contact us</a></div>
                    <div className="roh_circl_btn">
                      <a href="/contact-us"><Image src="/arrow.svg" alt="Arrow Right" width={30} height={30} /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
