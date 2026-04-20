"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import styles from "./rentalproviders.module.css";
import { LuArrowDown, LuShieldCheck, LuTag, LuMessageCircle, LuLayers, LuLock, LuMapPin, LuArrowLeft, LuArrowRight, LuPhoneCall, LuBadgeCheck, LuSearch } from "react-icons/lu";
import SearchbtnIcon from '../../../public/images/assets/search.svg';
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

const isUserLoggedIn = () => {
  if (typeof window === "undefined") return false;
  const token = getCookie("authToken");
  const user = getCookie("authUser");
  return Boolean(token && user);
};

/* ===========================
   LOGIN CHECK (NO useEffect)
=========================== */
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? match[2] : null;
};

export default function RentalProvidersClient({ vendors, pagination, query, citySearchTerm }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query || "");
  const [locationValue, setLocationValue] = useState(citySearchTerm || "");
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const cityTimerRef = useRef(null);
  const [locationSlug, setLocationSlug] = useState("");
  const [businessLink, setBusinessLink] = useState("/login");
  const [isMounted, setIsMounted] = useState(false);
  const loggedIn = false;

  useEffect(() => {
    setIsMounted(true);

    const loggedIn = isUserLoggedIn();
    if (loggedIn) {
      setBusinessLink("/become-a-host");
    }
  }, []);

  /* ===========================
    MAIN FIX HERE
  =========================== */
  const displayCity = vendors && vendors.length > 0 ? vendors[0].locationName : "";

  const capitalize = (text) => text?.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");


  // Fetch cities for autocomplete
  const fetchCities = async (keyword) => {
    try {
      // const res = await fetch(`${API_BASE_URL}/getallactivecity`, { /** API for all citys get */
      const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getallavailablecity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const json = await res.json();

      if (json.success) {
        setCityResults(json.data || []);
      } else {
        setCityResults([]);
      }
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

    //KEY PRESS FIX
    setShowCityDropdown(true);
    setCityLoading(true);
    setCityResults([]);

    if (cityTimerRef.current) {
      clearTimeout(cityTimerRef.current);
    }

    cityTimerRef.current = setTimeout(() => {
      fetchCities(value);
    }, 400);
  };

  const handleCitySelect = (city) => {
    setLocationValue(city.cat_singular_name);
    setLocationSlug(city.slug);
    setShowCityDropdown(false);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    const search_by = searchTerm.trim();
    const citySlugOrName = locationSlug || locationValue.trim();
    const params = new URLSearchParams(window.location.search);

    if (!search_by) params.delete("search_by");
    else params.set("search_by", search_by);

    if (!citySlugOrName) params.delete("city");
    else params.set("city", citySlugOrName);

    /** IMPORTANT: RESET PAGE TO 1 */
    params.set("page", 1);

    window.location.href = `?${params.toString()}`;
  };


  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage);

    const url = `?${params.toString()}`;

    // Full page reload with new URL
    window.location.href = url;
  };

  // const businessLink = loggedIn ? "/become-a-host" : "/login";
  useEffect(() => {
    if (vendors && vendors.length > 0) {
      setLocationValue(vendors[0].locationName); /** HUMAN READABLE location search dropdown */
    }
  }, [vendors]);

  return (
    <>
      <section className={styles.roh_hero_wrap} aria-label="Rental service providers overview">
        <div className={styles.roh_hero_section}>
          <div className={`container ${styles.roh_hero_container}`}>
            <div className={styles.roh_hero_content}>
              <h1>Find Trusted Rental Service Providers Near You</h1>
              <p className={styles.roh_pLarge}>
                Discover verified rental providers offering cars, bikes,
                scooters, and more in your city. Compare options, explore
                services, and connect directly.
              </p>

                <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
                      <ol className={styles.breadcrumbList}>
                      <li>
                          <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
                      </li>
                      <li className={styles.separator} aria-hidden="true">›</li>
                      <li aria-current="page">Rental Service Providers</li>
                      </ol>
                </nav>
              <div
                className={`d-flex justify-content-center  align-items-center ${styles.roh_twoBtns}`}
              >
                <a className={styles.roh_redBtn} href="#browse-rental-providers" aria-label="Browse Providers">
                  Browse Providers <LuArrowDown size={16} aria-hidden="true"/>
                </a>
                {/* check user login or non-login */}
                {/* {loggedIn ? (
                  <a className={styles.roh_redBtnoutline} href="/become-a-host">List Your Business</a>
                ) : (
                  <a className={styles.roh_redBtnoutline} href="/login">List Your Business</a>
                )} */}
                <a className={styles.roh_redBtnoutline} href={`${WEB_BASE_DOMAIN_URL}${businessLink}`} aria-label="List Your Business">
                  List Your Business
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Fitter and Search */}
      <section className={styles.roh_rental_providersWrapper} id="browse-rental-providers"  aria-label="Search and filter rental service providers">
        <div className={styles.roh_container}>
          <div className={styles.custom_searchbar_wrap}>
            <div className={styles.custom_searchbar}>
              <form className="w-100" onSubmit={handleSearch} aria-label="Search providers by city or location and provider name or service type">
                <div className={`row ${styles.roh_filtter_top_bar}`}>
                  {/* City input */}
                  <div className={`${styles.roh_search_filtters} ${styles.border_rightF1}`}>
                    <label className={styles.loc_block_inner}>City/location</label>
                    <div className={`${styles.location_in_wrap} position-relative`}>
                      <input
                        id="location"
                        type="search"
                        className={`w-100 ${styles.roh_locationInput}`}
                        placeholder="Enter your destination..."
                        value={locationValue}
                        onChange={handleLocationChange}
                        autoComplete="off"
                        aria-label="Enter your destination"
                      />
                      <LuMapPin size={18} style={{color:"#9CA3AF"}} aria-hidden="true"/>
                      {showCityDropdown && (
                        <ul className={styles.city_dropdown}>
                          {cityLoading && (
                            <li className={styles.city_info}>
                              <img
                                src="/images/loader.gif"
                                alt="Loading"
                                className={styles.dropdown_loader_img}
                              />
                              <span>Searching…</span>
                            </li>
                          )}

                          {!cityLoading && cityResults.map((city, i) => (
                            <li key={i} onClick={() => handleCitySelect(city)} aria-label={`Select ${city.cat_singular_name}`}>
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

                  {/* Search by business name */}
                  <div className={`${styles.roh_search_filtters} ${styles.border_rightF2}`}>
                    <div className={styles.search_block_wrap}>
                      <div className={`${styles.search_block_inner} rounded-pill`}>
                        <div className="w-100">
                          <label className={styles.whatoftype} htmlFor="whatoftype">Search</label>
                          <div className={styles.roh_searchInput_wraper}>
                            <input
                              id="whatoftype"
                              className={`w-100 ${styles.roh_searchinput}`}
                              type="search"
                              placeholder="Provider name or service type..."
                              name="search_by"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              aria-label="Provider name or service type"
                            />
                            <LuSearch size={18} style={{color:"#9CA3AF"}} aria-hidden="true"/>
                          </div>
                        </div>
                      </div>
                      {/* <div className={styles.rent_search_btn}>
                        <button className="button theme-btn-new" type="submit">
                          <SearchbtnIcon width={30} height={30} />
                        </button>
                        <a href="/rental-service-providers" className={styles.roh_search_clearBtn}>Clear</a>
                      </div> */}
                    </div>
                  </div>
                </div>
                   {/* Search Query */}
                      <div className={`row ${styles.roh_searchbar_bottom}`}>
                        <div className={`${styles.roh_searchbar_bottom_fields}`}>
                          <div className={styles.search_block_wrap}>
                            <div className={`${styles.search_block_inner} rounded-pill`} >
                              <div className={`${styles.roh_searchinput_btn_wrapper}`} >
                                <div className={styles.rent_search_btn}>
                                  <button className="button theme-btn-new" type="submit" aria-label="Search rental service providers">
                                    Search{" "}
                                    <LuSearch size={18} aria-hidden="true"/>
                                  </button>
                                  <a href="/rental-service-providers" className={styles.roh_search_clearBtn} aria-label="Clear search" >Clear</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
              </form>
            </div>
            <p className="text-center py-3">Showing rental providers based on your current location. You can change the city anytime.</p>
          </div>
        </div>
      </section>

      {/* Rental Providers List */}
      <section className={styles.roh_rental_providers_wrapper} aria-label="Rental service providers list">
        <div className={styles.roh_container}>
          <div className="section-header">
            <div className="section-title text-center">
              <h3 className={styles.roh_section_title_h3}>
                {displayCity
                  ? `Rental Service Providers in ${displayCity}`
                  : "Rental Providers Near You"}
              </h3>

              <p>Verified service providers ensuring quality and transparency.</p>
            </div>
          </div>

          <div className={styles.roh_providers_grid}>
            {vendors && vendors.length > 0 ? vendors.map((vendor) => {
              const services = vendor.categories?.map(c => c.sub_category_name).filter(Boolean).join(", ");
              return (
                <div key={vendor.user_id} className={styles.roh_provider_card}>
                  <div className={styles.roh_provider_card_top}>
                    <img
                      src={vendor.profile_image ? WEB_BASE_URL + vendor.profile_image : "/vendor-profiles/roh-provider-img.webp"}
                      alt={`${vendor.business_name} rental service provider`}
                      className={styles.roh_provider_img}/>
                    <div className={styles.roh_provider_card_info}>
                      <div className="d-flex align-items-start align-items-sm-center justify-content-between">
                      <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${vendor.business_slug}`} target="_blank" rel="noopener"  aria-label={`View rental service provider ${vendor.business_name}`}><h2>{vendor.business_name}</h2></a>

                      {vendor.is_verified == 1 && (
                        <span className={styles.roh_provider_badge} aria-label="Verified rental service provider">
                          <img src="/verified.svg" alt="Verified"/>
                        </span>
                      )}
                      {/* <span className={styles.roh_provider_badge} ><img src="/verified.svg" alt="Verified"/></span> */}

                      {/* <span className={`${styles.roh_provider_badge} ${!isVerified ? styles.not_verified : "" }`} ><img src="/verified.svg" alt="Verified"/></span> */}

                      </div>
                      {/* <p className={styles.roh_provider_card_desc}>
                        {vendor.business_name} is a trusted rental service provider based in {vendor.city}, {vendor.state},
                        offering reliable and affordable rental solutions.
                      </p> */}
                      {/* <p className={styles.roh_provider_card_desc}>
                        {vendor.business_name} is a trusted rental service provider based in {vendor.city}, {vendor.state},
                        offering reliable and affordable rental solutions.
                      </p> */}
                      <p className={styles.roh_provider_card_desc}>
                      {vendor.business_description ? (
                        vendor.business_description
                      ) : (
                        <>
                          {vendor.business_name} is a trusted rental service provider based in {vendor.city}, {vendor.state}, offering reliable and affordable rental solutions.
                        </>
                      )}
                    </p>

                    </div>
                  </div>

                  <div className={styles.roh_provider_card_body}>
                    <div className={styles.roh_meta_item}>
                      <span className={styles.roh_meta_label}><LuMapPin size={16} aria-hidden="true"/> Location</span>
                      <span className={styles.roh_meta_value}>{vendor.locationName}, {capitalize(vendor.state)}</span>
                    </div>
                    <div className={styles.roh_meta_item}>
                      <span className={styles.roh_meta_label}><LuLayers size={16} aria-hidden="true"/> Services</span>
                      <span className={styles.roh_meta_value}>{services}</span>
                    </div>

                     <div className={`${styles.roh_meta_item} ${styles.roh_meta_itemPricewrap}`}>
                      <span className={styles.roh_meta_label}>Starting From</span>
                      {
                        (vendor.min_price_per_day) ? (
                          <span className={styles.roh_price_tag}>
                            ₹{vendor.min_price_per_day} <span style={{fontSize: "14px", fontWeight: "600", color: "#97999c"}}>/Day</span>
                          </span>
                        ) : (
                          <a className={styles.roh_call_for_price} href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${vendor.business_slug}`} target="_blank" rel="noopener">
                            <span><LuPhoneCall size={18} style={{color: "#ff3600" }} aria-hidden="true"/></span> Call For Price
                          </a>
                        )
                      }

                    </div>
                  </div>

                  <div className={styles.roh_provider_card_footer}>
                    {/* <a href={`/contact-us/`} className={styles.roh_btn_card_primary} target="_blank">Contact</a> */}
                    <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${vendor.business_slug}`} className={styles.roh_btn_card_secondary} target="_blank" rel="noopener" aria-label={`View rental service provider ${vendor.business_name}`}>View Provider</a>
                  </div>
                </div>
              );
            }) : (
              <p className="text-center">No rental providers found.</p>
            )}
          </div>

          {/* Pagination */}
          {vendors.length > 0 && pagination.totalPages > 1 && (
            <div className={styles.roh_pagination_wrapper}>
              {pagination.page > 1 && (
                <button onClick={() => handlePageChange(pagination.page - 1)} className={styles.roh_pagination_prev}   aria-label="Go to previous page"><LuArrowLeft size={18} aria-hidden="true"/></button>
              )}

              {(() => {
                const total = pagination.totalPages;
                const current = pagination.page;
                const pageNeighbors = 1;
                const pages = [];

                let start = Math.max(2, current - pageNeighbors);
                let end = Math.min(total - 1, current + pageNeighbors);

                pages.push(1);
                if (start > 2) pages.push("...");
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < total - 1) pages.push("...");
                if (total > 1) pages.push(total);


                return pages.map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={idx} className={styles.pagination_dots}> ... </span>
                    );
                  }

                  return (
                    <button key={idx} onClick={() => p !== current && handlePageChange(p)} className={`${styles.roh_pagination_btn} ${p === current ? styles.roh_active_page : ""}`} aria-label={`Go to page ${p}`}>
                      {p}
                    </button>
                  );
                });
              })()}

              {pagination.page < pagination.totalPages && (
                <button onClick={() => handlePageChange(pagination.page + 1)} className={styles.roh_pagination_next} aria-label="Go to next page"><LuArrowRight size={18} aria-hidden="true"/></button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Why Choose  */}
      <section className={styles.roh_why_choose_wrap} aria-label="Reasons to choose FindOnRent rental platform">
        <div className={styles.roh_container}>
          <div className="row">
            <div className="col-12 text-center">
              <h3 className={styles.roh_section_title_h3}>Why Choose FindOnRent</h3>
              <p>
                We are committed to building a rental ecosystem that is safe,
                accessible, and beneficial for both customers and providers.
              </p>
            </div>
            <div className="col-12">
              <div className={styles.roh_why_choose_grid}>
                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuShieldCheck size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Verified Providers</h4>
                  <p>
                    Every vendor on our platform is verified for identity and quality service.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuTag size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Transparent Pricing</h4>
                  <p>
                    What you see is what you pay. No hidden fees or surprise
                    charges.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuMessageCircle size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Direct Communication</h4>
                  <p>
                    Chat or call vendors directly to discuss your specific
                    needs.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuLayers size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Wide Variety</h4>
                  <p>
                    From scooters to luxury cars, find exactly what you are
                    looking for.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuLock size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>Safe Booking</h4>
                  <p>
                    Secure processes and trusted community guidelines for your
                    safety.
                  </p>
                </div>

                <div className={styles.roh_benefit_card}>
                  <div className={styles.roh_benefit_icon}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuMapPin size={24} aria-hidden="true"/>
                    </div>
                  </div>
                  <h4>City-wide Network</h4>
                  <p>
                    A growing network of providers across multiple locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us on */}
      <section className={styles.roh_darkCta_wrap} aria-label="Join Us on">
        <div className={styles.roh_container}>
          <div className={styles.roh_darkCta_content}>
            <div className={styles.roh_darkCta_innerContent}>
              <h3 className={`${styles.roh_section_title_h3} text-light`}>Own a Rental Business?</h3>
              <p className="text-light">
                Whether you are here to rent a vehicle or list your own, <a className={styles.roh_link_white} href="https://findonrent.com/"> FindOnRent</a> is designed for you. We are constantly improving,
                expanding, and introducing new features to create the best
                rental experience possible.
              </p>
              {/* check user login or non-login */}
              {loggedIn ? (
                <a href={`${WEB_BASE_DOMAIN_URL}/become-a-host`} className={`mt-4 mt-sm-5 ${styles.roh_redBtn}`} aria-label="Become a Host">List Your Business</a>
              ) : (
                <a href={`${WEB_BASE_DOMAIN_URL}/login`} className={`mt-4 mt-sm-5 ${styles.roh_redBtn}`} aria-label="Login">List Your Business</a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
