"use client";
import "../globals.css"
import styles from './css/readyToRide.module.css';
import Image from "next/image";
import Link from 'next/link';
import ArrowrightIcon from '../../../public/arrow.svg';

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function ReadyToRide() {

    return (
        <>
            <section className={styles.roh_singlePost_wrap} aria-label="Ready to ride">
                <div className={`${styles.roh_singlePost_wrap_inner} container p-0`}>
                    <div className={`${styles.roh_singlePost_main} ${styles.roh_singlePost_black_bg}`}>
                        <div className={`container`}>
                            <div className={`row`}>
                                <div className={`col-12 col-md-12 col-xl-6 col-lg-12`}>
                                    <div className={`${styles.roh_singlePost_content}`}>
                                        <h3 className={`roh_section_title_h3 text-white mb-0`}>Find your perfect ride.<br /> Book instantly.</h3>
                                        <p className={`text-white mb-0 ${styles.roh_global_heading} ${styles.roh_singlePost_desc}`}>Our friendly customer service team is here to help. Contact us anytime for support and inquiries.</p>
                                        <div className={`d-flex align-items-center justify-content-start roh_redBtns`}>
                                            <div className="roh_button_custom"><a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact us</a></div>
                                            <div className="roh_circl_btn">
                                                <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent"><ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true"/></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-12 col-xl-6 col-lg-12`}>
                                    <div className={`${styles.roh_singlePost_imgwrap}`}>
                                        <Image src="/cta-car-img.png" alt='CTA Car' width={550} height={270} style={{ width: '100%', height: 'auto' }} />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}