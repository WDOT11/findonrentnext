"use client";
import { useState } from "react";
import styles from "./footer.module.css";
import RohLogo from "../../../public/images/global-imgs/site-logo.svg";
import { LuFacebook, LuTwitter, LuInstagram, LuLinkedin, LuHouse, LuLayoutGrid, LuSlidersHorizontal, LuUser, LuHeadset  } from "react-icons/lu";
import { usePathname } from "next/navigation";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function FooterClient({ city, categories, trending }) {

  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const formatCategoryName = (nameOrSlug) => {
    const lowercaseWords = ["with", "in", "for", "on", "at", "by", "of"];

    return nameOrSlug
      .replace(/-/g, " ")
      .split(" ")
      .map((word, index) => {
        if (index !== 0 && lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };
const [activeTab, setActiveTab] = useState("searches");


  return (
    <footer className={`${styles.footer} ${styles.roh_container} position-relative`}>
      <div className={`container ${styles.roh_footer_container}`}>

    <div className={styles.roh_seo_section}>
      <div className={styles.roh_seo_heading}>
        <h4>Popular Rental Searches & Cities</h4>
      </div>
        {/* Tabs Header */}
        <div className={styles.roh_seo_tabs}>
          <button
            className={activeTab === "searches" ? styles.active_tab : ""}
            onClick={() => setActiveTab("searches")}
            aria-label="Popular rental searches">
            Trending Searches
          </button>

          <button
            className={activeTab === "cities" ? styles.active_tab : ""}
            onClick={() => setActiveTab("cities")}
            aria-label="Popular rental cities">
            Popular Cities
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "searches" && (
          <>
          <div className={styles.roh_seo_links_block}>
              {trending.map((loc) =>
                loc.categories.map((cat) => {
                  const link = WEB_BASE_DOMAIN_URL + `/${cat.category_slug}/${loc.location_slug}`;
                  return (
                    <a
                      href={link}
                      key={`${cat.category_id}-${loc.location_slug}`}
                      aria-label={`Rent a ${formatCategoryName(cat.category_name)} in ${loc.location_name}`}
                      title={`Rent a ${formatCategoryName(cat.category_name)} in ${loc.location_name}`}>
                      {`Rent a ${formatCategoryName(cat.category_name)} in ${loc.location_name}`}
                    </a>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeTab === "cities" && (
          <>
            <div className={styles.roh_seo_links_block}>
              {trending.map((loc) => (
                <a
                  key={loc.location_slug}
                  href={ WEB_BASE_DOMAIN_URL + `/${loc.location_slug}`}
                  aria-label={`Best rentals in ${loc.location_name}`}
                  title={`Best rentals in ${loc.location_name}`}
                >
                  Best rentals in {loc.location_name}
                </a>
              ))}
            </div>
          </>
        )}
      </div>

        <div className="row gy-4">
          {/* Brand */}
          <div className="col-12 col-md-12 col-lg-3">
            <div className={styles.roh_brandBlock}>
              <a href={`${WEB_BASE_DOMAIN_URL}/`} className={styles.logoLink} aria-label="Find On Rent Home">
                <RohLogo aria-hidden="true" />
              </a>

              <p className={`${styles.desc} mt-3`}>
                We offer everything you need - furniture, electronics, vehicles,
                tools, and more - on rent. Flexible plans, easy booking, and
                doorstep delivery make renting hassle-free.
              </p>

              <ul className={styles.roh_social}>
                <li><a href="#"><LuFacebook /></a></li>
                <li><a href="#"><LuTwitter /></a></li>
                <li><a href="#"><LuLinkedin /></a></li>
                <li><a href="#"><LuInstagram /></a></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className={styles.roh_title}>Company</h5>
            <ul className={styles.roh_list}>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/about-us`} className={pathname === "/about-us" ? styles.roh_active : ""}aria-label="About Find On Rent">About Us</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/blog`} className={pathname.startsWith("/blog") ? styles.roh_active : ""} aria-label="Find On Rent blog">Blog</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} className={pathname === "/contact-us" ? styles.roh_active : ""} aria-label="Contact Find On Rent">Contact</a></li>
              <li>
                <a
                  href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}
                  className={pathname.startsWith("/rental-service-providers") ? styles.roh_active : ""} aria-label="Rental service providers on Find On Rent">Rental Service Providers
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className={styles.roh_title}>Services</h5>
            <ul className={styles.roh_list}>
              <li>
                <a
                  href={`${WEB_BASE_DOMAIN_URL}/services/vehicles`}
                  className={pathname.startsWith("/services") ? styles.roh_active : ""} aria-label="Browse all vehicles available for rent">All Vehicles
                </a>
              </li>

              {categories.map((cat) => {
                const link = city ? `/${cat.slug}/${city}` : `/${cat.slug}`;
                return (
                  <li key={cat.id}>
                    <a href={`${WEB_BASE_DOMAIN_URL}${link}`} className={pathname === link ? styles.roh_active : ""}  aria-label={city ? `${cat.name} rental services in ${city}` : `${cat.name} rental services`}>
                        {cat.name}{" "}
                        {city && <>in <span className="text-capitalize">{city}</span></>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Help */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className={styles.roh_title}>Help</h5>
            <ul className={styles.roh_list}>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/how-it-works`} className={pathname === "/how-it-works" ? styles.roh_active : ""} aria-label="How Find On Rent works">How It Works</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/become-a-host`} className={pathname === "/become-a-host" ? styles.roh_active : ""} aria-label="Rent your item on Find On Rent">Rent Your Item</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/faqs`} className={pathname === "/faqs" ? styles.roh_active : ""} aria-label="Frequently asked questions">FAQs</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers-faqs`} className={pathname === "/rental-service-providers-faqs" ? styles.roh_active : ""} aria-label="FAQs for rental service providers">Provider FAQs</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/why-list-with-us`} className={pathname === "/why-list-with-us" ? styles.roh_active : ""} aria-label="Why list your items with Find On Rent">Why List with Us</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/safety-guidelines`} className={pathname === "/safety-guidelines" ? styles.roh_active : ""} aria-label="Safety guidelines for rentals">Safety Guidelines</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/cancellation-and-refund`} className={pathname === "/cancellation-and-refund" ? styles.roh_active : ""} aria-label="Cancellation and refund policy">Cancellation & Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`${styles.roh_copyBar} d-flex flex-wrap align-items-center mt-4`}>
          <div className="col-12 col-md-6">
            <div className={styles.roh_fineLinks}>
              <a href={`${WEB_BASE_DOMAIN_URL}/privacy-policy`} className={`${styles.roh_fineLink} ${pathname === "/privacy-policy" ? styles.roh_active : ""}`}  aria-label="Privacy policy">Privacy & Policy</a>
              <a href={`${WEB_BASE_DOMAIN_URL}/terms-and-conditions`} className={`${styles.roh_fineLink} ${pathname === "/terms-and-conditions" ? styles.roh_active : ""}`} aria-label="Terms and conditions">Terms & Conditions</a>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <p className={styles.roh_copyText}>
              © {currentYear} <strong>Find On Rent</strong>. All rights reserved. |
              Powered by <a href="https://webdevops.ltd/" target="_blank" rel="noopener noreferrer" aria-label="WebDevOps Private Limited website"> WebDevOps Pvt Ltd</a>
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.roh_bottomNavWrapper} d-sm-none d-block`}>
      <nav className={`${styles.roh_bottomNav}`}>
      <a href={`${WEB_BASE_DOMAIN_URL}/`} className={`${styles.roh_bottomNavBtn} ${ pathname === "/" ? styles.roh_active : "" }`}>
        <div className="nav-icon"><LuHouse size={18}/></div> Home
      </a>
      <a href={`${WEB_BASE_DOMAIN_URL}/services/vehicles`} className={`${styles.roh_bottomNavBtn} ${ pathname === "/services/vehicles" ? styles.roh_active : "" }`}>
        <div className="nav-icon"><LuLayoutGrid size={18}/></div> Categories
      </a>
      {/* <a href="#" className={`${styles.roh_bottomNavBtn} ${ pathname === "/Filters" ? styles.roh_active : "" }`}>
        <div className="nav-icon"><LuSlidersHorizontal size={18}/></div> Filters
      </a> */}
      <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} className={`${styles.roh_bottomNavBtn} ${ pathname === "/contact-us" ? styles.roh_active : "" }`}>
        <div className="nav-icon"><LuHeadset size={18}/></div> Contact
      </a>
      <a href={`${WEB_BASE_DOMAIN_URL}/dashboard`} className={`${styles.roh_bottomNavBtn} ${ pathname === "/dashboard" ? styles.roh_active : "" }`}>
        <div className="nav-icon"><LuUser size={18}/></div> Account
      </a>
    </nav>
      </div>
    </footer>
  );
}
