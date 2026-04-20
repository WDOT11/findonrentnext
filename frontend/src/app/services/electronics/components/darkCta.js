"use client";
import "../../../globals.css";
import styles from './darkCta.module.css';
import Image from "next/image";
import Link from 'next/link';
import { LuArrowRight, LuZap } from "react-icons/lu";
// import ArrowrightIcon from '../../../public/arrow.svg';

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
                                         <span className={styles.roh_section_label}><LuZap size={16} color="rgba(251, 191, 36, 1)"/>Limited availability on high-demand devices</span>
                                        <h3 className={`roh_section_title_h3 text-white mb-0`}>Power Up Your Workflow Today</h3>
                                        <p className={`mb-0 ${styles.roh_global_heading} ${styles.roh_singlePost_desc}`}>Whether it's a camera for a shoot or a laptop for remote work, find exactly the tech you need instantly.</p>
                                         <a href="#" className={`${styles.roh_blueBtn} justify-content-center justify-content-sm-start mt-3 mt-sm-4 mx-sm-0 mx-auto`}>Learn More About Us <LuArrowRight size={28} /> </a>
                                    </div>
                                </div>
                                <div className={`col-12 col-md-12 col-xl-6 col-lg-12 mt-sm-0 mt-3`}>
                                    <div className={`${styles.roh_singlePost_imgwrap}`}>
                                        <Image src="/images/electronicspg/premium-tech.webp" alt='CTA Car' width={500} height={364} style={{ width: '100%', height: 'auto' }} />

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