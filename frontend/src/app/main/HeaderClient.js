"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import styles from "./header.module.css";
import saveUserLocation from "../../utils/saveLocation";
import { useAlert } from "../globalComponents/alerts/AlertContext";
import RohLogo from "../../../public/images/global-imgs/roh_logo.svg";
import UserIcon from "../../../public/user.svg";
import HumbergerIcon from "../../../public/menu-icon.svg";
import { LuUserRound, LuHeadset, LuLogOut, LuChevronDown } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { getClientCookie } from "../../utils/utilities";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

const toggleDropdown = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const parent = e.currentTarget.closest(`.${styles.roh_hasDropdown}`);
  parent.classList.toggle(styles.roh_active);
};

export default function HeaderClient({
  isMounted,
  isLoggedIn,
  city,
  categories,
  loading, // ADDED (nothing else touched)
}) {
  const pathname = usePathname();

  const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const disableGA = pathname === "/agents/register-vendors" || isLocalhost;

  // const disableGA = pathname === "/agents/register-vendors";

  const { showConfirm, showSuccess } = useAlert();

  const [isAdminImpersonating, setIsAdminImpersonating] = useState(false);

  useEffect(() => {
    const adminToken = getClientCookie("adminAuthToken");
    setIsAdminImpersonating(!!adminToken);
  }, [pathname]);

  const handleSwitchBack = () => {
    const adminToken = getClientCookie("adminAuthToken");
    const adminUser = getClientCookie("adminAuthUser");

    if (adminToken && adminUser) {
      // Restore original admin session (matching raw format)
      document.cookie = `authToken=${adminToken}; path=/; max-age=1296000`; // 15 days
      document.cookie = `authUser=${adminUser}; path=/; max-age=1296000`;

      // Delete temp cookies
      document.cookie = "adminAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "adminAuthUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      alert("Switching back to Admin... Redirecting...");
      window.location.href = "/adminrohpnl/user";
    }
  };


  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".mainbar");
      if (window.scrollY > 50) {
        header.classList.add("roh_scrolled_header_sticky");
      } else {
        header.classList.remove("roh_scrolled_header_sticky");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    saveUserLocation();
  }, []);

  // Sync Google Translate manual widget changes back to our system popup cookie
  useEffect(() => {
    const handleLangChange = (e) => {
      // Check if the change event came from the Google Translate native dropdown
      if (e.target && e.target.classList && e.target.classList.contains("goog-te-combo")) {
        const langCode = e.target.value; // e.g., 'hi', 'gu', 'en'
        const reverseMap = {
          "en": "English", "as": "Assamese", "bn": "Bengali", "brx": "Bodo", "doi": "Dogri",
          "gu": "Gujarati", "hi": "Hindi", "kn": "Kannada", "ks": "Kashmiri", "gom": "Konkani",
          "mai": "Maithili", "ml": "Malayalam", "mni-Mtei": "Manipuri", "mr": "Marathi",
          "ne": "Nepali", "or": "Odia", "pa": "Punjabi", "sa": "Sanskrit", "sat": "Santali",
          "sd": "Sindhi", "ta": "Tamil", "te": "Telugu", "ur": "Urdu"
        };
        const selectedLangName = reverseMap[langCode] || "English";

        // Save back to our custom cookie so it stays synced for 180 days
        const days = 180;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `roh_pop_lang_pop=${selectedLangName}; expires=${date.toUTCString()}; path=/`;
      }
    };

    // Google Translate injects the select lazily, so we use event delegation on document body
    document.body.addEventListener("change", handleLangChange);
    return () => {
      document.body.removeEventListener("change", handleLangChange);
    };
  }, []);


  useEffect(() => {
    const updateGooglePlaceholder = () => {
      const select = document.querySelector(".goog-te-combo");

      if (select && select.options.length > 0) {
        select.options[0].text = "🌐 Language";
        return true;
      }
      return false;
    };

    // Try immediately
    if (updateGooglePlaceholder()) return;

    // Retry until loaded
    const interval = setInterval(() => {
      if (updateGooglePlaceholder()) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    showConfirm(
      "Are you sure you want to logout?",
      () => {
        document.cookie = "authToken=; Max-Age=0; path=/";
        document.cookie = "authUser=; Max-Age=0; path=/";
        showSuccess("Logged out successfully!");
        window.location.href = "/login";
      },
      () => { }
    );
  };

  return (
    <>
      {!disableGA && (
        <>
          {/* google analytics script */}
          {/* The script move in the GoogleTranslate.js file please check */}
        </>
      )}
      {/* Google Translate Integration */}
      {/* The script move in the GoogleTranslate.js file please check */}

      <header className={`mainbar ${styles.roh_header_area} ${styles.roh_is_sticky}`}>
        <div className={`${styles.roh_header_block} ${styles.roh_container} py-2`}>
          <div className={`header_manage`}>
            <div className={`row align-items-center d-flex justify-content-between`}>

              <div className={`col-4 col-md-6 col-lg-2 ${styles.roh_logo_block}`}>
                <a href={`${WEB_BASE_DOMAIN_URL}/`} aria-label="Find On Rent Home">
                  <Image src="/images/global-imgs/roh_logo.svg" alt="FindOnRent" width={82} height={37} priority as="image" type="image/svg+xml" />
                </a>
              </div>

              {/* Desktop Nav */}
              <div className={`col-2 col-md-2 col-lg-7 order-1 order-lg-0 ${styles.roh_desktop_headerNav}`}>
                <nav className={`navbar navbar-expand-lg navbar-dark bg-transparent ${styles.roh_header_nav}`}>
                  <div className={`navbar-collapse justify-content-start collapse show ${styles.roh_navbarNav}`} id="navbarNav">
                    <ul className={`navbar-nav w-100 justify-content-around ${styles.roh_navBar}`}>

                      {/* Dynamic Services Dropdown */}
                      <li className={`nav-item dropdown ${styles.roh_dropdown}`}>
                        <a className={`nav-link dropdown_toggle ${styles.dropdown_toggle} ${styles.roh_navLink} ${pathname.startsWith("/services") ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/services/vehicles`} id="navbarDropdown" role="button" aria-label="Services menu" aria-haspopup="true" aria-expanded="false">
                          Services
                        </a>
                        <div className={`dropdown-menu ${styles.roh_dropdown_menu}`} aria-labelledby="navbarDropdown">
                          {loading ? (
                            <span className="dropdown-item disabled">Loading...</span>
                          ) : (
                            categories.map((cat) => (
                              <a key={cat.id} className={`dropdown-item ${styles.roh_dropdown_item} ${pathname === `/${cat.slug}` ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/${cat.slug}`} aria-label={`${cat.name} rental services`}>{cat.name}</a>
                            ))
                          )}
                        </div>
                      </li>

                      <li className={`nav-item`}><a className={`nav-link ${styles.roh_navLink} ${pathname === "/how-it-works" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/how-it-works`} aria-label="How Find On Rent works">How It Works</a></li>
                      <li className={`nav-item`}><a className={`nav-link ${styles.roh_navLink} ${pathname === "/faqs" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/faqs`} aria-label="Frequently asked questions">FAQs</a></li>
                      <li className={`nav-item`}><a className={`nav-link ${styles.roh_navLink} ${pathname === "/about-us" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/about-us`} aria-label="About Find On Rent">About Us</a></li>
                      <li className={`nav-item`}><a className={`nav-link ${styles.roh_navLink} ${pathname === "/contact-us" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact Us</a></li>
                    </ul>
                  </div>
                </nav>
              </div>

              <div className={`col-6 col-md-6 col-lg-3 text-end`}>
                <div className={`d-flex align-items-center ${styles.roh_headerRight_button}`}>
                  <div className={`d-flex align-items-center justify-content-center roh_redBtns`}>
                    <div className="roh_button_custom"><a href={isLoggedIn ? `${WEB_BASE_DOMAIN_URL}/become-a-host` : `${WEB_BASE_DOMAIN_URL}/register`} aria-label={isLoggedIn ? "Rent your item by becoming a host" : "Rent your item by registering"} className={styles.roh_redBtn}>Rent Your Item</a></div>
                  </div>

                  {isLoggedIn ? (
                    <div className={`roh_dashboard_profile`}>
                      <div className={`${styles.roh_profile_box}`}>
                        <div className="dropdown">
                          <button type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="User menu">
                            <UserIcon width={30} height={30} aria-hidden="true" />
                          </button>

                          <div className={`dropdown-menu profil-dropdown p-0 ${styles.dropdownmob_menu}`}>
                            <div className="roh_adrop_outer" style={{ display: "block" }}>
                              <div className={styles.roh_adrop_box_wrap}>
                                <ul className={styles.roh_adrop_list}>
                                  <li>
                                    <a href={`${WEB_BASE_DOMAIN_URL}/dashboard`} className={styles.loginBtn} aria-label="Dashboard">
                                      <LuUserRound size={20} aria-hidden="true" /> Dashboard
                                    </a>
                                  </li>
                                  <li>
                                    <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Support">
                                      <LuHeadset size={20} aria-hidden="true" /> Support
                                    </a>
                                  </li>
                                  {isAdminImpersonating && (
                                    <li>
                                      <a onClick={handleSwitchBack} style={{ cursor: "pointer" }} className="text-secondary" aria-label="Switch back to admin">
                                        <LuUserRound size={20} aria-hidden="true" /> Switch Back
                                      </a>
                                    </li>
                                  )}
                                  <li>
                                    <a onClick={handleLogout} style={{ cursor: "pointer" }} aria-label="Logout">
                                      <LuLogOut size={20} aria-hidden="true" /> Logout
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a href={`${WEB_BASE_DOMAIN_URL}/login`} className={styles.roh_loginBtn} aria-label="Login">Login</a>
                  )}
                  <div id="google_translate_element"></div>


                  {/* Mobile Menu Offcanvas */}
                  <div className={styles.roh_mobileMenu}>
                    <button className={`px-0 navbar-toggler ${styles.roh_custom_mobileMenuBtn}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-label="Open menu">
                      <HumbergerIcon width={30} height={30} aria-hidden="true" />
                    </button>

                    <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" style={{width:"clamp(280px, 28vw, 400px)", zIndex:"9"}}>
                      <div className={`offcanvas-header ${styles.roh_offcanvas_header}`}>
                        <a href={`${WEB_BASE_DOMAIN_URL}/`} aria-label="Find On Rent Home"><Image src="/images/global-imgs/roh_logo.svg" alt="FindOnRent" width={100} height={36} priority as="image" type="image/svg+xml" /></a>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu"></button>
                      </div>

                      <div className={`offcanvas-body ${styles.roh_offcanvas_body}`}>
                        <ul className={`navbar-nav ${styles.roh_navBar}`}>
                          <li className="nav-item"><a className={`${styles.roh_navLink} ${pathname === "/" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/`} aria-label="Find On Rent Home">Home</a></li>

                          {/* Mobile Services Dropdown */}
                          <li className={`nav-item ${styles.roh_hasDropdown}`}>
                            <div className={styles.roh_menuRow}>
                              <a href={`${WEB_BASE_DOMAIN_URL}/services/vehicles`} className={`${styles.roh_navLink} ${pathname.startsWith("/services") ? styles.roh_active : ""}`} role="button" aria-label="Services menu" aria-haspopup="true" aria-expanded="false">Services</a>
                              <span className={styles.roh_menuArrow} onClick={toggleDropdown}>
                                <LuChevronDown size={20} aria-hidden="true" />
                              </span>
                            </div>

                            <ul className={styles.roh_dropdownMenu}>
                              {categories.map((cat) => (
                                <li key={cat.id}>
                                  <a className={pathname === `/${cat.slug}` ? styles.roh_active : ""} href={`${WEB_BASE_DOMAIN_URL}/${cat.slug}`} aria-label={`${cat.name} rental services`}>{cat.name}</a>
                                </li>
                              ))}
                            </ul>
                          </li>

                          <li className="nav-item"><a className={`${styles.roh_navLink} ${pathname === "/how-it-works" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/how-it-works`} aria-label="How Find On Rent works">How It Works</a></li>
                          <li className="nav-item"><a className={`${styles.roh_navLink} ${pathname === "/faqs" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/faqs`} aria-label="Frequently asked questions">FAQs</a></li>
                          <li className="nav-item"><a className={`${styles.roh_navLink} ${pathname === "/about-us" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/about-us`} aria-label="About Find On Rent">About Us</a></li>
                          <li className="nav-item"><a className={`${styles.roh_navLink} ${pathname === "/contact-us" ? styles.roh_active : ""}`} href={`${WEB_BASE_DOMAIN_URL}/contact-us`} aria-label="Contact Find On Rent">Contact Us</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
