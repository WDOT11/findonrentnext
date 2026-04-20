"use client";
import Link from "next/link";
import "../../globals.css";
import styles from "./needHelp.module.css";
import Image from "next/image";
import ArrowrightIcon from '/public/arrow.svg';
import ChatcircleIcon from '/public//help.svg';

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function NeedHelp() {
  return (
    <>
      <div className={styles.roh_help_wrap} aria-label="Need help">
        <div className={`container p-0`}>
          <div className={styles.help_wrap}>
            <div
              className={`d-flex justify-content-center align-items-center ${styles.help_svg}`}>
              <ChatcircleIcon width={80} height={80} aria-hidden="true"/>
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

            <div className={`mt-4 ${styles.help_btnwrap}`}>
              <div
                className={`d-flex align-items-center justify-content-center roh_redBtns`}>
                <div className={`roh_button_custom`}>
                  <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact us</a>
                </div>
                <div className={`roh_circl_btn`}>
                  <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">
                    <ArrowrightIcon className="roh_arrowicon" width={30} height={30} aria-hidden="true"/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
