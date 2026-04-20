"use client";
import React, { useState, useRef, useMemo } from "react";
import styles from "./home.module.css";
import Image from "next/image";
import { LuMapPin, LuChevronDown, LuCircleCheck } from "react-icons/lu";
import SearchbtnIcon from "../../public/images/assets/search.svg";
import HeroHeading from "./HeroHeading";
import HeroBottomBullets from "./HeroBottomBullets";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function RentHomePage({ categories = [], isLoggedIn, homeFaqs }) {
  
  const masterFaqs = useMemo(() => {
    if (!homeFaqs || !homeFaqs.length) return [];

    const categoryListHtml = homeFaqs
      .map((c) => `<li><a href="/${c.category_slug}">${c.category_name}</a></li>`)
      .join("");

    const priceListHtml = homeFaqs
      .map((c) => {
        const min = Math.round(Number(c.min_price));
        const max = Math.round(Number(c.max_price));
        return `<li><a href="/${c.category_slug}">${c.category_name}</a>: Starting from ₹${min} up to ₹${max}</li>`;
      })
      .join("");

    return [
      {
        q: "What types of vehicles are available for rent on FindOnRent?",
        a: `FindOnRent is a comprehensive rental marketplace where you can book vehicles across major categories such as <ul>${categoryListHtml}</ul> We list verified local vendors to ensure you find the perfect ride for city commutes, weekend getaways, or long-distance travel.`,
      },
      {
        q: "What is the rental price range for different categories?",
        a: `At FindOnRent, we believe in transparent and competitive pricing. The estimated rental price range across categories is:<ul>${priceListHtml}</ul> Final prices may vary based on city location, seasonality, and vehicle availability.`,
      },
      {
        q: "Does FindOnRent charge any booking fees or commissions?",
        a: "Absolutely not. FindOnRent is a 100% zero-commission platform where you connect directly with verified rental vendors and pay them without any extra platform fees.",
      },
      {
        q: "What documents are required to rent a vehicle?",
        a: "Generally you need a valid Government ID and Driving License. Some vendors may also require a refundable security deposit or local reference which you can confirm directly with them.",
      },
      {
        q: "How do I book a vehicle on FindOnRent and are there any hidden charges?",
        a: "Simply choose your preferred category, contact the verified vendor via call or WhatsApp, confirm availability and book. There are no hidden or convenience charges on FindOnRent.",
      },
    ];
  }, [homeFaqs]);

  /* ------------------ City Autosuggest ------------------ */
  const [locationValue, setLocationValue] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const cityTimerRef = useRef(null);
  const [locationSlug, setLocationSlug] = useState("");

  const fetchCities = async (keyword) => {
    try {
      const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getallavailablecity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const json = await res.json();
      setCityResults(json.success ? json.data || [] : []);
    } catch (err) {
      console.error("City search error:", err);
      setCityResults([]);
    } finally {
      setCityLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationValue(value);
    setLocationSlug("");

    if (!value.trim()) {
      setShowCityDropdown(false);
      setCityLoading(false);
      setCityResults([]);
      return;
    }

    setShowCityDropdown(true);
    setCityLoading(true);
    setCityResults([]);

    clearTimeout(cityTimerRef.current);
    cityTimerRef.current = setTimeout(() => {
      fetchCities(value);
    }, 300); 
  };

  const handleCitySelect = (city) => {
    setLocationValue(city.cat_singular_name);
    setLocationSlug(city.slug);
    setShowCityDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catEl = document.getElementById("category")?.selectedOptions[0];
    const categorySlug = catEl?.value || "";
    const location = locationSlug || "";

    let url = "/";
    if (categorySlug && location) url = `/${categorySlug}/${location}`;
    else if (categorySlug) url = `/${categorySlug}`;
    else if (location) url = `/${location}`;

    window.location.href = url;
  };

  return (
    <>
      <section className={styles.hero_wrap} aria-label="Search and book rental services">
        <div className={styles.hero_section} style={{ position: "relative", minHeight: "auto", overflow: "hidden" }}>
           {/* LCP OPTIMIZATION: */}
           <Image
            src="/images/homepg/bg-img-3.svg" 
            alt="Find On Rent Background" 
            fill
            priority
            loading="eager"
            style={{ objectFit: "cover", zIndex: -1 }}>
          </Image>
          
          <div className={`container ${styles.hero_container}`}>
            <div className="row justify-content-center">
              <HeroHeading />
              <div className="col-12">
                <div className={styles.custom_searchbar_wrap}>
                  <div className={styles.custom_searchbar}>
                    <form className="w-100" onSubmit={handleSubmit} aria-label="Search rentals by city and category">
                      <div className={`row ${styles.roh_filtter_top_bar}`}>

                        {/* LOCATION */}
                        <div className={`${styles.roh_search_filtters} ${styles.border_rightF1}`}>
                          <label className={styles.loc_block_inner}>City</label>
                          <div className={`${styles.location_in_wrap} position-relative`}>
                            <input
                              type="search"
                              className={`w-100 ${styles.roh_locationInput}`}
                              placeholder="Enter your destination..."
                              value={locationValue}
                              onChange={handleLocationChange}
                              autoComplete="off"
                              aria-label="Search by city"/>
                            <LuMapPin size={18} aria-hidden="true"/>

                            {showCityDropdown && (
                              <ul className={styles.city_dropdown} aria-label="City suggestions">
                                {cityLoading && (
                                  <li className={styles.city_info}>
                                    <img src="/images/loader.gif" alt="Loading" className={styles.dropdown_loader_img} />
                                    <span>Searching…</span>
                                  </li>
                                )}
                                {!cityLoading &&
                                  cityResults.map((city, i) => (
                                    <li key={i} onClick={() => handleCitySelect(city)} aria-label={`Select city ${city.cat_singular_name}`}>
                                      {city.cat_singular_name}
                                    </li>
                                  ))}
                                {!cityLoading && cityResults.length === 0 && (
                                  <li className={styles.city_info}>No city found</li>
                                )}
                              </ul>
                            )}
                          </div>
                        </div>

                        {/* CATEGORY */}
                        <div className={styles.roh_search_filtters}>
                          <div className={styles.search_block_wrap}>
                            <div className="form-group w-100">
                              <label className={styles.cat_block_inner}>Category</label>
                              <div className={styles.category_in_wrap}>
                                <select id="category" className={`w-100 ${styles.roh_catInput}`} defaultValue="" aria-label="Select rental category">
                                  <option value="">Select Category</option>
                                  {categories.map((parent) => (
                                    <React.Fragment key={parent.id}>
                                      {parent.children?.map((child) => (
                                        <option key={child.id} value={child.slug}>{child.name}</option>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                </select>
                                <LuChevronDown size={18} aria-hidden="true" />
                              </div>
                            </div>

                            {/* BUTTON */}
                            <div className={styles.rent_search_btn}>
                              <button className="button theme-btn-new" type="submit" aria-label="Search rentals">
                                <SearchbtnIcon width={34} height={34} aria-hidden="true"/>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </form>
                  </div>
                </div>
                <HeroBottomBullets />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RENT & EARN SECTION - Layout preserved exactly */}
      <section className={`${styles.roh_rent_earn_section}`} aria-label="Rent & Earn">
        <div className={styles.roh_container}>
          <div className="d-block px-4 px-sm-5 py-4 py-sm-5 rounded-4 m-auto text-center bg-white" style={{boxShadow: "0px 3px 25.16px 0.84px rgba(0, 0, 0, 0.09)", maxWidth: "1024px"}}>
            <h2 className="fw-bold mb-4">
              Have a vehicle to rent out? <span className="fw-bold" style={{color: "#ff3600"}}>Turn It Into Daily Income!</span>
            </h2>
            <div className="row justify-content-center mb-4">
              <div className="col-md-8 text-start mx-auto d-flex justify-content-center">
                <ul className={`list-unstyled ${styles.roh_rent_earn_list}`}>
                  <li className="mb-2 d-flex justify-content-sm-center justify-content-start align-items-center gap-2"><div><LuCircleCheck size={20} aria-hidden="true" style={{ color: "#139c01" }}/></div><div>Do you have a <a href={`${WEB_BASE_DOMAIN_URL}/bikes`}>bike</a> available for rent?</div></li>
                  <li className="mb-2 d-flex justify-content-sm-center justify-content-start align-items-center gap-2"><div><LuCircleCheck size={20} aria-hidden="true" style={{ color: "#139c01" }}/></div><div>Do you have a <a href={`${WEB_BASE_DOMAIN_URL}/cars`}>self-drive car</a> available for rent?</div></li>
                  <li className="mb-2 d-flex justify-content-sm-center justify-content-start align-items-center gap-2"><div><LuCircleCheck size={20} aria-hidden="true" style={{ color: "#139c01" }}/></div><div>Do you have a <a href={`${WEB_BASE_DOMAIN_URL}/cars-with-driver`}>car with driver</a> available for rent?</div></li>
                  <li className="mb-2 d-flex justify-content--sm-center justify-content-start align-items-center gap-2"><div><LuCircleCheck size={20} aria-hidden="true" style={{ color: "#139c01" }}/></div><div>Do you have a <a href={`${WEB_BASE_DOMAIN_URL}/scooty-scooters`}>scooter or scooty</a> available for rent?</div></li>
                </ul>
              </div>
            </div>
            <h3 className="text-muted fw-medium mb-1">
              Turn your vehicles into a steady source of income with <strong className="fw-bold text-dark">Find<span style={{color:"#ff3600"}}>On</span>Rent</strong>
            </h3>
            <p>India’s transparent marketplace for self-drive vehicle rentals.</p>
            <div className="d-flex justify-content-center roh_redBtn mx-auto mt-4 mt-sm-5">
              <a href={isLoggedIn ? `${WEB_BASE_DOMAIN_URL}/become-a-host` : `${WEB_BASE_DOMAIN_URL}/register` } aria-label="rent your item" className="btn btn-lg px-5 fw-semibold">
                Rent Your Item – It’s Free
              </a>
            </div>
          </div>

          {/* HOME MASTER FAQ */}
          <section className={styles.faq_wrap}>
            <h2 className="fw-bold mb-4 text-center">Frequently Asked Questions</h2>
            <div className={styles.accordion} id="accordionExample" aria-label="Rental service frequently asked questions list">
              {masterFaqs.map((f, index) => (
                <div key={index} className={`accordion-item ${styles.accordion_item}`}>
                  <h4 className={`accordion-header ${styles.accordion_header}`} id={`heading-${index}`}>
                    <button className={`accordion-button ${styles.accordion_button} ${index !== 0 ? styles.collapsed : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`} aria-expanded={index === 0 ? "true" : "false"} aria-label={`Toggle FAQ: ${f.q}`}>
                      {f.q}
                    </button>
                  </h4>
                  <div id={`collapse-${index}`} className={`accordion-collapse collapse ${index === 0 ? "show" : ""} ${styles.accordion_collapse}`} data-bs-parent="#accordionExample">
                    <div className={`accordion-body ${styles.accordion_body}`} dangerouslySetInnerHTML={{ __html: f.a }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
</>    
  );
}