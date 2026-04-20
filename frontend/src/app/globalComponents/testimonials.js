"use client";
import "../globals.css"
import styles from './css/testimonials.module.css';
import Image from "next/image";


export default function Testimonials() {

    return (
        <>
    <section className={styles.testimonial_wrap}>
      <div className={`container p-0 testimonial_inner`}>
        <div className={styles.testimonial_wrap_main}>
          <div className={`d-flex justify-content-center align-items-center`}>
            <div className={styles.star_box}>
              <div className={`d-flex align-items-center gap-1 ${styles.star_inner}`}>
                <Image
                  src="/images/homepg/star.svg"
                  alt="star"
                  width={20}
                  height={20}
                />
                <span className="roh_star_title">Testimonials</span>
              </div>
            </div>
          </div>

          <h2 className={`text-center`}>
            What our customers are <br /> saying about us
          </h2>

          <div className={` mt-5 position-relative ${styles.testmonial_grid}`}>

              {/* Testimonial Item 1 */}

                <div className={`card ${styles.fleetscard}`}>
                  <div className={`card-body`}>
                    <div className={styles.ratings}>
                      <Image
                        src="/images/rating.png"
                        alt="rating"
                        width={100}
                        height={20}
                      />
                    </div>
                    <div className={styles.testimonial_desc_wrap}>
                      <p className={`mb-0 ${styles.global_heading} ${styles.gray_global_heading} ${styles.testimonial_desc}` }>
                        Booked a Scooty in Jaipur — smooth experience and great
                        pricing.
                      </p>
                    </div>
                    <div className={styles.testimonial_profile_wrap}>
                      <div className={styles.user_image}>
                        <Image
                          src="/images/user1.jpg"
                          alt="user"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className={styles.profile_data}>
                        <strong className={styles.author_name}>Billu S., Jaipur</strong>
                        <span className={`${styles.author_desc} ${styles.gray_global_heading}`}>
                          Project Manager
                        </span>
                      </div>
                    </div>
                  </div>
                </div>


              {/* Testimonial Item 2 */}

                <div className={`card ${styles.fleetscard}`}>
                  <div className={`card-body`}>
                    <div className={styles.ratings}>
                      <Image
                        src="/images/rating.png"
                        alt="rating"
                        width={100}
                        height={20}
                      />
                    </div>
                    <div className={styles.testimonial_desc_wrap}>
                      <p className={`mb-0 ${styles.global_heading} ${styles.gray_global_heading} ${styles.testimonial_desc}` }>
                        Booked a Scooty in Jaipur — smooth experience and great
                        pricing.
                      </p>
                    </div>
                    <div className={styles.testimonial_profile_wrap}>
                      <div className={styles.user_image}>
                        <Image
                          src="/images/user1.jpg"
                          alt="user"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className={styles.profile_data}>
                        <strong className={styles.author_name}>Billu S., Jaipur</strong>
                        <span className={`${styles.author_desc} ${styles.gray_global_heading}`}>
                          Project Manager
                        </span>
                      </div>
                    </div>
                  </div>
                </div>



            {/* Custom Navigation */}

          </div>
        </div>
      </div>
    </section>
        </>
    );

}