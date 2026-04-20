"use client";
import styles from "./reportissue.module.css";
import { LuTriangleAlert, LuCircleAlert, LuUserX, LuTag, LuCopy, LuShieldAlert, LuFileX, LuSettings, LuMail, LuCheck, LuSend, LuRefreshCcw, LuLock, LuHeartHandshake, } from "react-icons/lu";
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
export default function ReportIssueClient() {
  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Report an issue">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Report an Issue</h1>
              <p className={styles.roh_pLarge}>
                Your safety and experience matter to us. If you notice anything
                that feels incorrect, unprofessional, or suspicious on
                FindOnRent, please let us know. Reporting an issue helps us keep
                the platform reliable for everyone.
              </p>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li>
                      <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                    </li>
                    <li className={styles.separator} aria-hidden="true">›</li>
                    <li aria-current="page">Report an Issue</li>
                  </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.roh_report_issue_wrapperMain} aria-label="Report an issue information and reporting process">
        <di className={styles.roh_container}>
          <div className={styles.roh_report_issue_content}>
            {/* When to Report Grid */}
            <div className={styles.roh_content_card}>
              <div className={styles.roh_section_header}>
                <div className={styles.roh_section_icon}>
                  <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <LuTriangleAlert size={24} aria-hidden="true"/>
                  </div>
                </div>
                <h2 className={styles.roh_section_title}>When to Report an Issue</h2>
              </div>

              <div className={styles.roh_report_grid}>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <LuCircleAlert size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Incorrect or misleading listings
                  </span>
                </div>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                     <LuUserX size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Unresponsive or unprofessional vendors
                  </span>
                </div>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <LuTag size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Overpricing, hidden charges, or incorrect rental information
                  </span>
                </div>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <LuCopy size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Fake profiles or duplicate listings
                  </span>
                </div>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <LuShieldAlert size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Damaged or unsafe vehicles provided by vendors
                  </span>
                </div>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                     <LuFileX size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Any activity that violates our platform policies
                  </span>
                </div>
                <div className={styles.roh_report_item}>
                  <div className={styles.roh_item_icon_circle}>
                    <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <LuSettings size={20} aria-hidden="true"/>
                    </div>
                  </div>
                  <span className={styles.roh_item_text}>
                    Technical problems with the website or your account
                  </span>
                </div>
              </div>

              <div className={styles.roh_section_note}>
                If you are unsure, you can still report it. Our team will review
                the issue and take the right action.
              </div>
            </div>

            {/* How to Report & CTA  */}
            <div className={styles.roh_content_card}>
              <div className={styles.roh_section_header}>
                <div className={styles.roh_section_icon}>
                  <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <LuMail size={24} aria-hidden="true"/>
                  </div>
                </div>
                <h2 className={styles.roh_section_title}>How to Report</h2>
              </div>

              <div className={styles.roh_split_layout}>
                <div>
                  <p>
                    Please provide as much detail as possible so our team can
                    investigate quickly. Share the following information:
                  </p>
                  <ul className={styles.roh_info_list}>
                    <li>
                      <div style={{width: "24px", height: "24px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", flexShrink: "0"}}>
                        <LuCheck size={14} aria-hidden="true"/>
                      </div>
                      Your name
                    </li>
                    <li>
                      <div style={{width: "24px", height: "24px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", flexShrink: "0"}}>
                       <LuCheck size={14} aria-hidden="true"/>
                      </div>
                      Your email address
                    </li>
                    <li>
                      <div style={{width: "24px", height: "24px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", flexShrink: "0"}}>
                       <LuCheck size={14} aria-hidden="true"/>
                      </div>
                      The listing link or vendor name
                    </li>
                    <li>
                      <div style={{width: "24px", height: "24px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", flexShrink: "0"}}>
                        <LuCheck size={14} aria-hidden="true"/>
                      </div>
                      Screenshots if available
                    </li>
                    <li>
                      <div style={{width: "24px", height: "24px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", flexShrink: "0"}}>
                        <LuCheck size={14} aria-hidden="true"/>
                      </div>
                      A short description of the issue
                    </li>
                  </ul>
                </div>

                <div className={styles.roh_cta_box}>
                  <div style={{width: "48px", height: "48px", background: "#fff", borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff3600", border: "1px solid #FFE4DD"}}>
                    <LuSend  size={24} aria-hidden="true"/>
                  </div>
                  <h5 >
                    Submit Details
                  </h5>
                  <p >
                    Send your report via email
                  </p>
                  <a
                    href="mailto:support@findonrent.com?subject=Report an issue"
                    className={styles.roh_redbtn} aria-label="Report an issue by email at report@findonrent.com">
                    support@findonrent.com
                  </a>
                  <div style={{fontSize: "13px", color: "#9CA3AF"}}>
                    Response time: 24-48 hours
                  </div>
                </div>
              </div>
            </div>

            {/* Process & Privacy  */}
            <div className={styles.roh_content_card}>
              <div className={styles.roh_section_header}>
                <div className={styles.roh_section_icon}>
                  <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                   <LuRefreshCcw  size={24} aria-hidden="true"/>
                  </div>
                </div>
                <h2 className={styles.roh_section_title}>What Happens After You Report</h2>
              </div>

              <div className={styles.roh_process_timeline} aria-label="Issue reporting process steps">
                <div className={styles.roh_process_card}>
                  <div className={styles.roh_step_badge}>1</div>
                  <div className={styles.roh_step_desc}>Our team reviews the issue.</div>
                </div>
                <div className={styles.roh_process_card}>
                  <div className={styles.roh_step_badge}>2</div>
                  <div className={styles.roh_step_desc}>
                    We verify the information with the vendor or internal data.
                  </div>
                </div>
                <div className={styles.roh_process_card}>
                  <div className={styles.roh_step_badge}>3</div>
                  <div className={styles.roh_step_desc}>
                    If confirmed, the listing or vendor is flagged or suspended.
                  </div>
                </div>
                <div className={styles.roh_process_card}>
                  <div className={styles.roh_step_badge}>4</div>
                  <div className={styles.roh_step_desc}>
                    You receive an update on the actions taken, if required.
                  </div>
                </div>
              </div>

              <div className={styles.roh_privacy_banner}>
                <div className={styles.roh_privacy_icon}>
                  <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                   <LuLock  size={20} aria-hidden="true"/>
                  </div>
                </div>
                <div className={styles.roh_privacy_content}>
                  <h5>Your Privacy</h5>
                  <p>
                    All reports are handled with complete confidentiality. Your
                    personal information is never shared with vendors without
                    your approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Thank You  */}
            <div className={styles.roh_thank_you_card}>
              <div style={{width: "56px", height: "56px", background: "#DCFCE7", color: "#16A34A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px"}}>
               <LuHeartHandshake size={28} aria-hidden="true"/>

              </div>
              <h3 className="mb-0">
                Thank You for Helping Us Improve
              </h3>
              <p className="mb-0" style={{maxWidth:"600px"}}>
                Every report helps create a safer and more transparent rental
                experience for everyone. We appreciate your effort in making
                FindOnRent a platform users can trust.
              </p>
            </div>
          </div>
        </di>
      </section>
    </>
  );
}
