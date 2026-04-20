"use client";
// import { useState } from "react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "./footer.module.css";
import RohLogo from "../../../public/images/global-imgs/site-logo.svg";
import { LuFacebook, LuTwitter, LuInstagram, LuLinkedin, LuHouse, LuLayoutGrid, LuSlidersHorizontal, LuUser, LuHeadset, LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { getClientCookie } from "../../utils/utilities";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function FooterClient({ city, categories, trending, categoryModels, categoryModelsLocations }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  //  Seo content block  
  const seoWrapperRef = useRef(null);
  const seoContentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /** category tabs for footer */
  const categoryTabs = categoryModels.reduce((acc, item) => {
    if (!acc[item.category_slug]) {
      acc[item.category_slug] = {
        category_name: item.category_name,
        models: []
      };
    }

    acc[item.category_slug].models.push({
      slug: item.model_slug,
      label: item.model_label || null
    });

    return acc;
  }, {});

  /** category + model + location tabs for footer */
  const categoryModelLocationTabs = categoryModelsLocations.reduce((acc, item) => {
    if (!acc[item.category_slug]) {
      acc[item.category_slug] = {
        category_name: item.category_name,
        items: []
      };
    }

    acc[item.category_slug].items.push({
      model_slug: item.model_slug,
      model_label: item.model_label || item.model_name,
      city_slug: item.city_slug,
      city_name: item.city_name
    });

    return acc;
  }, {});



  const formatCategoryName = (nameOrSlug) => {
    return nameOrSlug;
  };

  const [activeTab, setActiveTab] = useState("searches");
  const [expandedCategories, setExpandedCategories] = useState({});

  /** category model location toggle */
  const toggleCategory = (slug) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <footer className={`${styles.footer} ${styles.roh_container} position-relative`}>
      <div className={`container ${styles.roh_footer_container}`}>

        <div ref={seoWrapperRef}>
          <div ref={seoContentRef} className={`${styles.roh_seo_section} ${isVisible ? styles.visible : ""}`}>
            <div className={styles.roh_seo_heading}>
              {/* <h4>Popular Rental Searches & Cities</h4> */}
            </div>
            {/* Tabs Header */}
            <div className={styles.roh_seo_tabs}>
              <button
                className={activeTab === "searches" ? styles.active_tab : ""}
                onClick={() => setActiveTab("searches")}
                aria-label="Popular rental searches">
                Trending Searches
              </button>

              {Object.entries(categoryTabs)
                .slice(0, 4) /** max 4 tabs (client requirement) */
                .map(([slug, data]) => (
                  <button
                    key={slug}
                    className={activeTab === slug ? styles.active_tab : ""}
                    onClick={() => setActiveTab(slug)}
                  >
                    {data.category_name}
                  </button>
                ))}

              {/* <button
              className={activeTab === "category-model-location" ? styles.active_tab : ""}
              onClick={() => setActiveTab("category-model-location")}
            >
              Category Model Location
            </button> */}

            </div>

            {/* Tab Content */}
            {activeTab === "searches" && (
              <>
                <div className={styles.roh_seo_links_block}>
                  <div className="row">
                    {trending.map((loc) => (
                      <div className="col-12 col-sm-6 col-lg-3 mb-0" key={loc.location_slug}>

                        {/* City main link */}
                        <a
                          href={`${WEB_BASE_DOMAIN_URL}/${loc.location_slug}`}
                          className={styles.roh_city_heading}
                          aria-label={`Best rentals in ${loc.location_name}`}
                          title={`Best rentals in ${loc.location_name}`} style={{ border: "none" }}>
                          <strong>{`Best rentals in ${loc.location_name}`}</strong>
                        </a>

                        {/* Category links under city */}
                        <ul className={styles.roh_city_category_list}>
                          {loc.categories.map((cat) => {
                            const link = `${WEB_BASE_DOMAIN_URL}/${cat.category_slug}/${loc.location_slug}`;
                            const catlocnm = `Rent a ${formatCategoryName(cat.category_name)} in ${loc.location_name}`;
                            return (
                              <li key={`${cat.category_slug}-${loc.location_slug}`}>
                                <a style={{ border: "none" }}
                                  href={link}
                                  aria-label={`Rent a ${formatCategoryName(cat.category_name)} in ${loc.location_name}`}
                                  title={`Rent a ${formatCategoryName(cat.category_name)} in ${loc.location_name}`}
                                >
                                  {catlocnm}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CATEGORY MODEL TABS */}
            {activeTab !== "searches" && categoryTabs[activeTab] && (
              <div className={styles.roh_seo_links_block}>
                {categoryTabs[activeTab].models.map((model) => {
                  const modelName = model.label
                    ? model.label
                    : formatCategoryName(model.slug);

                  const link = `${WEB_BASE_DOMAIN_URL}/${activeTab}/${model.slug}`;

                  return (
                    <a
                      key={model.slug}
                      href={link}
                      aria-label={`Rent a ${modelName}`}
                      title={`Rent a ${modelName}`}
                    >
                      Rent a {modelName}
                    </a>
                  );
                })}
              </div>
            )}

            {/* CATEGORY MODEL LOCATION TAB */}
            {activeTab === "category-model-location" && (
              <div className={styles.roh_seo_links_block}>
                {Object.entries(categoryModelLocationTabs)
                  .sort((a, b) =>
                    a[1].category_name.localeCompare(b[1].category_name)
                  )
                  .map(([catSlug, catData]) => {
                    const isExpanded = expandedCategories[catSlug];
                    const visibleItems = isExpanded
                      ? catData.items
                      : catData.items.slice(0, 20);

                    return (
                      <div key={catSlug} className={styles.roh_category_block}>
                        <h6 className={styles.roh_category_heading}>
                          <a href={`${WEB_BASE_DOMAIN_URL}/${catSlug}`} aria-label={catData.category_name} title={catData.category_name}>{catData.category_name}</a>
                        </h6>

                        <div className={`${styles.roh_category_links} ${isExpanded ? styles.expanded : styles.collapsed
                          }`}
                        >
                          {visibleItems.map((item, idx) => {
                            const link = `${WEB_BASE_DOMAIN_URL}/${catSlug}/${item.model_slug}/${item.city_slug}`;
                            const text = `Rent a ${item.model_label} in ${item.city_name}`;

                            return (
                              <a
                                key={`${catSlug}-${item.model_slug}-${item.city_slug}-${idx}`}
                                href={link}
                                aria-label={text}
                                title={text}
                              >
                                {text}
                              </a>
                            );
                          })}
                        </div>

                        {catData.items.length > 20 && (
                          <button
                            type="button"
                            className={styles.roh_show_more_btn}
                            onClick={() => toggleCategory(catSlug)}
                          >
                            {isExpanded
                              ? "Show Less"
                              : `Show ${catData.items.length - 20} More`}
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        <div className="row gy-4">
          {/* Brand */}
          <div className="col-12 col-md-12 col-lg-3">
            <div className={styles.roh_brandBlock}>
              <a href={`${WEB_BASE_DOMAIN_URL}/`} className={styles.logoLink} aria-label="Find On Rent Home">
                <Image src="/images/global-imgs/site-logo.svg" alt="FindOnRent" width={50} height={50} />
              </a>

              <p className={`${styles.desc} mt-3`}>
                We offer everything you need - furniture, electronics, vehicles,
                tools, and more - on rent. Flexible plans, easy booking, and
                doorstep delivery make renting hassle-free.
              </p>

              <ul className={styles.roh_social}>
                <li><a href="https://www.facebook.com/findonrent/" target="_blank" aria-label="Find On Rent Facebook"><LuFacebook /></a></li>
                <li><a href="https://www.instagram.com/findonrent/" target="_blank" aria-label="Find On Rent Instagram"><LuInstagram /></a></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="col-6 col-md-4 col-lg-3">
            <h5 className={styles.roh_title}>Company</h5>
            <ul className={styles.roh_list}>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/about-us`} className={pathname === "/about-us" ? styles.roh_active : ""}>About Us</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/blog`} className={pathname.startsWith("/blog") ? styles.roh_active : ""}>Blog</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} className={pathname === "/contact-us" ? styles.roh_active : ""}>Contact</a></li>
              <li>
                <a
                  href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`}
                  className={pathname.startsWith("/rental-service-providers") ? styles.roh_active : ""}>Rental Service Providers
                </a>
              </li>
              <li>
                <a
                  href={`${WEB_BASE_DOMAIN_URL}/sitemap-locations`} className={pathname.startsWith("/sitemap-locations") ? styles.roh_active : ""}>Locations Sitemap
                </a>
              </li>
              <li>
                <a
                  href={`${WEB_BASE_DOMAIN_URL}/sitemap-category`} className={pathname.startsWith("/sitemap-category") ? styles.roh_active : ""}>Models Sitemap
                </a>
              </li>
              <li>
                <a
                  href={`${WEB_BASE_DOMAIN_URL}/sitemap-rental-service-providers`} className={pathname.startsWith("/sitemap-rental-service-providers") ? styles.roh_active : ""}>Rental Service Providers Sitemap
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
                    <a href={`${WEB_BASE_DOMAIN_URL}${link}`} className={pathname === link ? styles.roh_active : ""} aria-label={city ? `${cat.name} rental services in ${city}` : `${cat.name} rental services`}>
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
              <li><a href={`${WEB_BASE_DOMAIN_URL}/how-it-works`} className={pathname === "/how-it-works" ? styles.roh_active : ""}>How It Works</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/become-a-host`} className={pathname === "/become-a-host" ? styles.roh_active : ""}>Rent Your Item</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/faqs`} className={pathname === "/faqs" ? styles.roh_active : ""} >FAQs</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers-faqs`} className={pathname === "/rental-service-providers-faqs" ? styles.roh_active : ""}>Provider FAQs</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/why-list-with-us`} className={pathname === "/why-list-with-us" ? styles.roh_active : ""} >Why List with Us</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/safety-guidelines`} className={pathname === "/safety-guidelines" ? styles.roh_active : ""} >Safety Guidelines</a></li>
              <li><a href={`${WEB_BASE_DOMAIN_URL}/cancellation-and-refund`} className={pathname === "/cancellation-and-refund" ? styles.roh_active : ""}>Cancellation & Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`${styles.roh_copyBar} d-flex flex-wrap align-items-center mt-4`}>
          <div className="col-12 col-md-6">
            <div className={styles.roh_fineLinks}>
              <a href={`${WEB_BASE_DOMAIN_URL}/privacy-policy`} className={`${styles.roh_fineLink} ${pathname === "/privacy-policy" ? styles.roh_active : ""}`}>Privacy & Policy</a>
              <a href={`${WEB_BASE_DOMAIN_URL}/terms-and-conditions`} className={`${styles.roh_fineLink} ${pathname === "/terms-and-conditions" ? styles.roh_active : ""}`} >Terms & Conditions</a>
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
          <a href={`${WEB_BASE_DOMAIN_URL}/`} className={`${styles.roh_bottomNavBtn} ${pathname === "/" ? styles.roh_active : ""}`}>
            <div className="nav-icon"><LuHouse size={18} /></div> Home
          </a>
          <a href={`${WEB_BASE_DOMAIN_URL}/services/vehicles`} className={`${styles.roh_bottomNavBtn} ${pathname === "/services/vehicles" ? styles.roh_active : ""}`}>
            <div className="nav-icon"><LuLayoutGrid size={18} /></div> Categories
          </a>
          {/* <a href="#" className={`${styles.roh_bottomNavBtn} ${ pathname === "/Filters" ? styles.roh_active : "" }`}>
        <div className="nav-icon"><LuSlidersHorizontal size={18}/></div> Filters
      </a> */}
          <a href={`${WEB_BASE_DOMAIN_URL}/contact-us`} className={`${styles.roh_bottomNavBtn} ${pathname === "/contact-us" ? styles.roh_active : ""}`}>
            <div className="nav-icon"><LuHeadset size={18} /></div> Contact
          </a>
          <a href={`${WEB_BASE_DOMAIN_URL}/dashboard`} className={`${styles.roh_bottomNavBtn} ${pathname === "/dashboard" ? styles.roh_active : ""}`}>
            <div className="nav-icon"><LuUser size={18} /></div> Account
          </a>
        </nav>
      </div>
    </footer>
  );
}
