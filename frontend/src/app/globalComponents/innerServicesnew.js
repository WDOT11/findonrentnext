"use client";
import "../globals.css";
import styles from './css/innerServicesnew.module.css';
import StarIcon from '../../../public/star.svg';
import ArrowrightIcon from '../../../public/arrow.svg';

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function InnerServicesnew({ categories = [] }) {
    return (
        <section className={styles.roh_explore_wrap}>
            <div className={styles.roh_explore_wrap_inner}>
                <div className={styles.roh_explore_wrap_main} id="discover-all-services">

                    <div className="d-flex justify-content-center align-items-center">
                        <div className="roh_star_box">
                            <div className="star_inner d-flex align-items-center gap-1">
                                <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                                <span className={styles.roh_star_title}>About us</span>
                            </div>
                        </div>
                    </div>

                    <h3 className={`${styles.roh_second_heading} text-center`}>
                        Explore our wide range of <br />rental services
                    </h3>

                    <div className="container mt-4 mt-sm-5 p-0">
                        <div className={styles.roh_main_data_wrap}>

                            {/* no data fallback */}
                            {categories.length === 0 && (
                                <p>No services available at the moment.</p>
                            )}

                            {/* categories */}
                            {categories.map((cat) => (
                                <a key={cat.id} className={styles.roh_card_box} href={`${WEB_BASE_DOMAIN_URL}/${cat.slug}`} aria-label={`Explore ${cat.name} rental services`}>
                                    <div
                                        className={styles.roh_card_box_inner}
                                        style={{
                                            backgroundImage: `url(${WEB_BASE_URL + cat.full_image_url})`,
                                        }}
                                    >
                                        <div className={styles.roh_explore_media_list}>
                                            <div className={styles.roh_media}>
                                                <div className="media-body">
                                                    <h2 className={styles.roh_media_title}>{cat.name}</h2>
                                                    <p className={`${styles.roh_global_heading} text-white mb-0`}>
                                                        {cat.description}
                                                    </p>
                                                </div>
                                                <div className={styles.roh_circl_btn}>
                                                    <span>
                                                        <ArrowrightIcon className="roh_icon" width={18} height={18} aria-hidden="true"/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}

                        </div>

                        {/* bottom static content (UNCHANGED) */}
                        <div className="row pt-5">
                            <div className="col-12">
                                <p className={`${styles.roh_explore_desc} ${styles.roh_gray_global_heading}`}>
                                    Discover our range of car rental services designed to meet all your travel needs.
                                    <br /> From a diverse fleet of vehicles to flexible rental plans.
                                </p>
                            </div>
                            <div className="col-12">
                                <div className={styles.roh_btn_exprore_wrap}>
                                    <div className="d-flex align-items-center justify-content-center roh_redBtns">
                                        <div className="roh_button_custom">
                                            <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact us</a>
                                        </div>
                                        <div className="roh_circl_btn">
                                            <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">
                                                <ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true"/>
                                            </a>
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
