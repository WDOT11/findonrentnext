"use client";
import Link from "next/link";
import "../../../globals.css";
import styles from "./needHelp.module.css";
import Image from "next/image";
import ChatcircleIcon from '/public/help.svg';
import { LuArrowRight, LuHeadset } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function NeedHelp() {
  return (
    <>
      <div className={styles.roh_help_wrap} aria-label="Need help ?">
        <div className={`container p-0`}>
          <div className={styles.help_wrap}>
            <div className={`d-flex justify-content-center align-items-center ${styles.help_svg}`}>
              <LuHeadset size={28} color="#ff3600" aria-hidden="true"/>
            </div>

            <div className={styles.hep_heading}>
              <h3 className={`roh_section_title_h3 text-center`}>Need help ?</h3>
            </div>

            <div className={styles.help_abot}>
              <p
                className={`mb-0 text-center ${styles.global_heading} ${styles.gray_global_heading} ${styles.media_desc}`}>
                We strive to provide exceptional customer service and support.
                Whether you have questions.
              </p>
            </div>

            <div className={`mx-auto ${styles.help_btnwrap}`}>
             <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} className={`${styles.roh_blueBtn} justify-content-center justify-content-sm-start mt-3 mt-sm-4 mx-sm-0 mx-auto`}>Contact Support <LuArrowRight size={28} /> </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
