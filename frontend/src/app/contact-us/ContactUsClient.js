"use client";
import "../globals.css"
import { useState, useEffect } from "react";
import style from "./contact.module.css";
import ArrowrightIcon from '../../../public/arrow.svg';
import { LuHeadphones, LuStore, LuBriefcase, LuMessageSquare, LuInstagram, LuFacebook, LuLinkedin, LuTwitter, LuTriangleAlert } from "react-icons/lu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function ContactUsClient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");

  /** 🔹 Fetch IP address */
  useEffect(() => {
    async function fetchIP() {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
      } catch (err) {
        console.warn("IP fetch failed", err);
      }
    }
    fetchIP();
  }, []);

  /** 🔹 Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** 🔹 Validation */
  const validate = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Please enter a valid email address.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit number.";
    if (!form.subject.trim()) newErrors.subject = "Please select a subject.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  /** 🔹 Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        ip_address: ip || "unknown",
      };

      const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/contactinquirie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setSubmitted(true);
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      alert("❌ Something went wrong, please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={style.roh_contact_wrapper} aria-label="Contact FindOnRent support team">
        <div className={style.roh_contact_container}>
          <h1 className={style.roh_contact_title}>Contact Us</h1>
          <p className={style.roh_contact_subtitle}>
            Have questions or need help? We’d love to hear from you.
          </p>

          {submitted ? (
            <p className={style.roh_contact_success}>
               Thank you! Your message has been sent successfully.
            </p>
          ) : (
            <form
              className={style.roh_contact_form}
              onSubmit={handleSubmit}
              noValidate>
              {loading && (
                <div className={style.roh_contact_overlay}>
                  <div className={style.roh_contact_spinner}></div>
                  <p>Sending your message...</p>
                </div>
              )}

              {/* === First & Last Name === */}
              <div className={style.roh_fields}>
                <div className={`${style.roh_contact_field} ${style.roh_inoputField}`}>
                  <label className={style.roh_contact_label}>
                    First Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`${style.roh_contact_input} ${
                      errors.first_name ? style.roh_contact_errorInput : ""
                    }`}
                    placeholder="Enter your first name"/>
                  {errors.first_name && (
                    <span className={style.roh_contact_error}>
                      {errors.first_name}
                    </span>
                  )}
                </div>

                <div className={`${style.roh_contact_field} ${style.roh_inoputField}`}>
                  <label className={style.roh_contact_label}>
                    Last Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`${style.roh_contact_input} ${
                      errors.last_name ? style.roh_contact_errorInput : ""
                    }`}
                    placeholder="Enter your last name"/>
                  {errors.last_name && (
                    <span className={style.roh_contact_error}>
                      {errors.last_name}
                    </span>
                  )}
                </div>
              </div>

              {/* === Email & Phone === */}
              <div className={style.roh_fields}>
                <div className={`${style.roh_contact_field} ${style.roh_inoputField}`}>
                  <label className={style.roh_contact_label}>Email <span>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`${style.roh_contact_input} ${
                      errors.email ? style.roh_contact_errorInput : ""
                    }`}
                    placeholder="you@example.com"/>
                  {errors.email && (
                    <span className={style.roh_contact_error}>{errors.email}</span>
                  )}
                </div>

                <div className={`${style.roh_contact_field} ${style.roh_inoputField}`}>
                  <label className={style.roh_contact_label}>Phone <span>*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      /** Allow only numbers and limit to 10 digits */
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        handleChange(e);
                      }
                    }}
                    disabled={loading}
                    className={`${style.roh_contact_input} ${
                      errors.phone ? style.roh_contact_errorInput : ""
                    }`}
                    placeholder="9876543210"
                    inputMode="numeric"
                    maxLength={10}/>

                  {errors.phone && (
                    <span className={style.roh_contact_error}>{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* === Subject === */}
              <div className={style.roh_contact_field}>
                <label className={style.roh_contact_label}>Subject <span>*</span></label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${style.roh_contact_input} ${
                    errors.subject ? style.roh_contact_errorInput : ""
                  }`}>
                  <option value="">-- Select Subject --</option>
                  <option value="General Inquirie">General Inquirie</option>
                  <option value="Vehicle Rental Support">Vehicle Rental Support</option>
                  <option value="List My Vehicle">List My Vehicle</option>
                  <option value="Payment or Billing">Payment or Billing</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Partnership / Business Inquirie">
                    Partnership / Business Inquirie
                  </option>
                </select>
                {errors.subject && (
                  <span className={style.roh_contact_error}>{errors.subject}</span>
                )}
              </div>

              {/* === Message === */}
              <div className={style.roh_contact_field}>
                <label className={style.roh_contact_label}>Message <span>*</span></label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${style.roh_contact_textarea} ${
                    errors.message ? style.roh_contact_errorInput : ""
                  }`}
                  placeholder="Type your message..."
                ></textarea>
                {errors.message && (
                  <span className={style.roh_contact_error}>{errors.message}</span>
                )}
              </div>

              {/* === Submit Button === */}
              <div
                className={`d-flex align-items-center justify-content-center ${style.roh_redBtns}`}>
                <div className={style.roh_button_custom}>
                  <button
                    type="submit"
                    className={style.roh_contact_btn}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
                <div className={style.roh_circl_btn}>
                  <button type="button" disabled={loading} aria-label="Submit contact form">
                    <ArrowrightIcon className="roh_icon" width={30} height={30} aria-hidden="true"/>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>


      <section className={style.roh_ways_to_connect_wraper} aria-label="Other ways to contact FindOnRent">
      <div className={style.roh_container}>
        <div className="other-ways-header text-center">
          <h2>More Ways to Connect</h2>
          <p>Choose the right channel for your specific needs</p>
        </div>

        <div className={style.roh_contact_grid}>
          <div className={style.roh_contact_card}>
            <div className={style.roh_icon_box}>
              <div style={{width: "28px", height: "28px", display: "flex", alignItems: "center",justifyContent: "center"}}>
               <LuHeadphones size={28} aria-hidden="true"/>
              </div>
            </div>
            <h4 className="card-title">Customer Support</h4>
            <p className="card-desc">For help with bookings, vendor communication, or general questions.</p>
            <p style={{fontSize: "14px", color: "#6B7280", marginBottom: "8px"}}>Response Time: Within 24 hours</p>
            <a href="mailto:support@findonrent.com" className={style.roh_email_link}>support@findonrent.com</a>
          </div>

          <div className={style.roh_contact_card}>
            <div className={style.roh_icon_box}>
              <div style={{width: "28px", height: "28px", display: "flex", alignItems: "center",justifyContent: "center"}}>
               <LuStore size="28" aria-hidden="true"/>
              </div>
            </div>
            <h4 className="card-title">Vendor Support</h4>
            <p className="card-desc">If you are a provider and need help with your listings or account management.</p>
            <a href="mailto:vendor@findonrent.com" className={style.roh_email_link}>vendor@findonrent.com</a>
          </div>

          <div className={style.roh_contact_card}>
            <div className={style.roh_icon_box}>
              <div style={{width: "28px", height: "28px", display: "flex", alignItems: "center",justifyContent: "center"}}>
               <LuBriefcase size="28" aria-hidden="true"/>
              </div>
            </div>
            <h4 className="card-title">Business &amp; Partnerships</h4>
            <p className="card-desc">Interested in collaborations, strategic partnerships, or business inquiries.</p>
            <a href="mailto:business@findonrent.com" className={style.roh_email_link}>business@findonrent.com</a>
          </div>

          <div className={style.roh_contact_card}>
            <div className={style.roh_icon_box}>
              <div style={{width: "28px", height: "28px", display: "flex", alignItems: "center",justifyContent: "center"}}>
                <LuMessageSquare size={28} aria-hidden="true"/>
              </div>
            </div>
            <h4 className="card-title">Feedback &amp; Suggestions</h4>
            <p className="card-desc">Your feedback helps us improve. Share your ideas and suggestions with us.</p>
            <a href="mailto:feedback@findonrent.com" className={style.roh_email_link}>feedback@findonrent.com</a>
          </div>
        </div>
      </div>
    </section>

    <section className={style.roh_loaction_wrapper} aria-label="FindOnRent office location and social media links">
      <div className={style.roh_container}>
        <div className="row align-items-center">
          <div className={`${style.roh_location_info} col-12 col-md-12 col-lg-6 col-xl-6`}>
            <h2>Office Location</h2>
            <div className={style.roh_location_details}>
              <p className="fw-bold">FindOnRent</p>
              <p>Vaishali Nagar</p>
              <p>Jaipur, Rajasthan, India</p>
            </div>

            <h3>Stay Connected</h3>
            <p style={{color: "#4B5563", marginBottom: "16px"}}>Follow us for updates, new features, and announcements.</p>
          <div className={style.roh_social_links_row}>
               <a href="#" className={style.roh_social_link_item}>
                 <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuInstagram /></div> Instagram
               </a>
               <a href="#" className={style.roh_social_link_item}>
                 <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuFacebook /></div> Facebook
               </a>
               <a href="#" className={style.roh_social_link_item}>
                 <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuLinkedin /></div> LinkedIn
               </a>
               <a href="#" className={style.roh_social_link_item}>
                 <div style={{width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}><LuTwitter /></div> Twitter
               </a>
            </div>
          </div>

          <div className={`col-12 col-md-12 col-lg-6 col-xl-6 mt-4 mt-md-4 mt-lg-0 mt-xl-0 ${style.roh_mapBlock}`}>
            <iframe title="FindOnRent office location in Jaipur" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56925.36614125147!2d75.75277647926875!3d26.90871900504655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db49e043a7acb%3A0xdad09ace57371810!2sVaishali%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1765531231170!5m2!1sen!2sin"  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </section>

      {/* Report an Issue */}

    <section className={style.roh_reportIssue_wraper} aria-label="Report an issue on FindOnRent">
      <div className={style.roh_container}>
        <div className={`${style.roh_report_banner} row`}>
          <div className="col-12 col-md-12 col-lg-8 col-xl-8">
            <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px"}}>
              <div style={{width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626"}}>
                <LuTriangleAlert size={24} aria-hidden="true"/>

              </div>
              <h3 className="mb-0">Report an Issue</h3>
            </div>
            <p>If you come across suspicious listings, unresponsive vendors, or any activity that does not follow our guidelines, please report it to us. We review all reports carefully to keep the platform safe.</p>
          </div>
          <div className="col-12 col-md-12 col-lg-4 col-xl-4 d-flex  mt-2 mt-md-3 mt-lg-0 mt-xl-0 justify-content-start justify-content-start justify-content-lg-end">

          <a href={`${WEB_BASE_DOMAIN_URL}/report-issue`} className={style.roh_btnred} aria-label="Report Now">Report Now</a>
          </div>
        </div>
      </div>
    </section>


    </>
  );
}
