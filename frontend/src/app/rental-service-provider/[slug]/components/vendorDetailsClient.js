"use client";

import React, { useState, useEffect } from "react";
import NeedHelp from "../../../globalComponents/needHelp";
import styles from "../vendorPage.module.css";
import Image from "next/image";
import Link from "next/link";
import ViewCatDtlPop from "./viewcatdtlpop";
import Viewproductspop from "../../../products/components/Viewproductspop";
import { LuBadgeCheck, LuMapPin, LuMail, LuPhone, LuUser, LuFacebook, LuTwitter, LuInstagram, LuYoutube, LuStore, LuCircleCheckBig, LuArrowRight } from "react-icons/lu";
import ArrowrightIcon from '../../../../../public/arrow.svg';
import StarIcon from '../../../../../public/star.svg';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function VendorDetailsClient({ vendorData, vendorItems, slug }) {
  const [vendor, setVendor] = useState(vendorData);
  const [vendorItem, setVendorItem] = useState([]);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* ---------- Shareable Deep Link Logic ---------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const rohKey = Array.from(searchParams.keys()).find(k => k.startsWith("roh_"));
      if (rohKey) {
        try {
          const decoded = atob(rohKey.replace("roh_", ""));
          const match = decoded.match(/^item-(\d+)$/);
          if (match && match[1]) setSelectedId(parseInt(match[1], 10));
        } catch (err) {}
      }
    }
  }, []);
  /* ----------------------------------------------- */

  const normalizeForFleetUI = (data = []) => {
    return data.map((cat) => ({
      category_id: cat.category_id,
      category_name: cat.category_name,

      sub_categories: (cat.sub_categories || []).map((sub) => ({
        sub_cat_id: sub.sub_category_id,
        sub_cat_name: sub.sub_category_name,

        // slug fallback (important for routing)
        sub_cat_slug: (sub.sub_category_name || "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-"),

        // rename items -> products
        products: sub.items || [],
      })),
    }));
  };

  const vendorCategories = normalizeForFleetUI(vendorItem);

  /* ---------- Helper: Smart Truncate ---------- */
  const truncateTitle = (title, maxLength = 62) => {
    if (!title || title.length <= maxLength) return title;
    let truncated = title.slice(0, maxLength);
    truncated = truncated.slice(0, Math.min(truncated.length, truncated.lastIndexOf(" ")));
    return truncated + "...";
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (vendorItems && vendorItems.length > 0) {
      const normalized = normalizeVendorItems(vendorItems);
      setVendorItem(normalized);
    }
  }, [vendorItems]);

  // Helper to get cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Helper to check login
  const isUserLoggedIn = () => {
    const token =
      getCookie("authToken") || getCookie("token") || getCookie("accessToken");

    const authUserRaw = getCookie("authUser");

    if (!token || !authUserRaw) return false;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  };

  const loggedIn = isMounted ? isUserLoggedIn() : false;

  // Fetch service provider info (client-side)
  useEffect(() => {
    const fetchProviderInfo = async () => {
      if (!isUserLoggedIn() || !vendor?.service_pr_id) return;

      try {
        const res = await fetch(`${API_BASE_URL}/getserviceprovideinfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_provider_id: vendor.service_pr_id,
          }),
        });

        const provider = await res.json();
        setServiceProvider(provider);
      } catch (err) {
        console.error("Provider fetch error:", err);
      }
    };

    fetchProviderInfo();
  }, [vendor]);

  const categoryIcons = {
    bikes: "/bike-red-icon.svg",
    scooty: "/scooty-red-icon.svg",
    scooters: "/scooty-red-icon.svg",
    cars: "/car-red-icon.svg",
    suv: "/suv-red-icon.svg",
    jeep: "/suv-red-icon.svg",
    truck: "/truck-red-icon.svg",
    bus: "/bus-red-icon.svg",
    commercial_vehicles: "/commercial-vehicles.svg",
    recreational_vehicles: "/recreational-vehicles.svg",
    default: "/car-red-icon.svg",
  };

  // Category click handler
  // const handleCategoryClick = async (cat) => {
  //   const businessId = vendor?.business_id;
  //   const categoryId = cat?.category_id;
  //   const subCategoryId = cat?.sub_category_id;

  //   if (!businessId || !categoryId || !subCategoryId) return;

  //   try {
  //     setLoadingItems(true);

  //     const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/vendor/items`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         business_id: businessId,
  //         category_id: categoryId,
  //         sub_category_id: subCategoryId,
  //       }),
  //     });

  //     const data = await res.json();
  //     setLoadingItems(false);

  //     if (data.success) {
  //       setSelectedCategory(cat);
  //       setItems(data.items || []);
  //       setShowPopup(true);
  //     } else {
  //       setItems([]);
  //     }
  //   } catch (err) {
  //     setLoadingItems(false);
  //   }
  // };
  const handleCategoryClick = (cat, iconKey) => {
    const targetId = `roh_cat_head_${iconKey}`;
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };



  const closePopup = () => {
    setShowPopup(false);
    setSelectedCategory(null);
  };

  // Vendor values
  const { business_name, business_description, owner_name, address, categories = [] } = vendor;

  // const handleViewContact = async () => {

  //   if (!isUserLoggedIn()) {
  //     handleLoginRedirect();
  //     return;
  //   }

  //   if (showContact || loadingContact) return;
  //   const authUserRaw = getCookie("authUser");
  //   const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;

  //   try {
  //     setLoadingContact(true);
  //     const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/view-contact`, {
  //       method: "POST",
  //       headers: {
  //           "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //           user_id: authUser?.id,
  //           item_id: null,
  //           service_provider_id: serviceProvider?.user_id
  //       }),
  //     });

  //     const json = await res.json();

  //     if (json.success) {
  //       setShowContact(true);
  //     } else {
  //       setShowContact(false);
  //     }
  //   } catch (err) {
  //     console.error("View contact error:", err);
  //   } finally {
  //     setLoadingContact(false);
  //   }
  // };

  const handleViewContact = async () => {

    // 1. Check if the user is logged in
    if (!isUserLoggedIn()) {
      handleLoginRedirect();
      return;
    }

    // 2. STAGE GUARD: Prevent execution if already showing or currently loading
    // This prevents the double-call if the function is triggered twice rapidly
    if (showContact || loadingContact) return;

    const authUserRaw = getCookie("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;

    try {
      // 3. SET LOADING IMMEDIATELY
      setLoadingContact(true);

      const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/view-contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: authUser?.id,
            item_id: null,
            service_provider_id: serviceProvider?.user_id
        }),
      });

      const json = await res.json();

      if (json.success) {
        setShowContact(true);
      } else {
        setShowContact(false);
      }
    } catch (err) {
      console.error("View contact error:", err);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleLoginRedirect = () => {
    // Optional: redirect back after login
    const redirectUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?redirect=${redirectUrl}`;
  };

  /** add category in title*/
  const formatCategoryTitle = (categories = []) => {
    const unique = Array.from(
      new Set(
        categories.map(
          (cat) => (cat.sub_category_name || cat.category_name || "").toLowerCase()
        )
      )
    )
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)); /**  */

    if (unique.length === 0) return "";
    if (unique.length === 1) return unique[0];
    if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;

    return `${unique.slice(0, -1).join(", ")} and ${unique[unique.length - 1]}`;
  };

  /** Get single vendor seo dtls  */
  const businessName = vendor?.business_name || "";
  const cityName = address?.city || "";
  const categoryText = formatCategoryTitle(categories);

  /** Else title */
  let fullTitle = "Vendor Details";

  if (businessName) {
    /** Pattern: "Business Name, City | Deals in Categories rental */
    fullTitle = `${businessName}${cityName ? `, ${cityName}` : ""} | Deals in ${categoryText} rental`;
  }

  /** truncate full title  */
  const finalTitle = truncateTitle(fullTitle, 62);

  const normalizeVendorItems = (vendorItems = []) => {
    return vendorItems.map((category) => {
      const subCategoryMap = {};

      (category.items || []).forEach((item) => {
        const subCatId = item.sub_cat_id || 0;
        const subCatName = item.sub_category_name || "Others";

        if (!subCategoryMap[subCatId]) {
          subCategoryMap[subCatId] = {
            sub_category_id: subCatId,
            sub_category_name: subCatName,
            items: [],
          };
        }

        subCategoryMap[subCatId].items.push(item);
      });

      return {
        category_id: category.category_id,
        category_name: category.category_name,
        sub_categories: Object.values(subCategoryMap),
      };
    });
  };

  function decodeHtml(html) {
    if (typeof window === "undefined") {
      return html || "";
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.documentElement.textContent || "";
  }

  function formatPriceINR(v) {
    return Number(v ?? 0).toLocaleString("en-IN");
  }

  const renderSingleVendorBreadcrumb = (vendorName) => {
    return (
      <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
        <ol className={styles.breadcrumbList}>
          <li>
            <a href={`${WEB_BASE_DOMAIN_URL}/`} aria-label="Home">
              Home
            </a>
          </li>

          <li className={styles.separator} aria-hidden="true">
            ›
          </li>

          <li>
            <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers`} aria-label="Rental Service Providers">
              Rental Service Providers
            </a>
          </li>

          <li className={styles.separator} aria-hidden="true">
            ›
          </li>

          <li aria-current="page">
            {vendorName || "Vendor"}
          </li>
        </ol>
      </nav>
    );
  };


  return (
    <>
      {/* Vendor profile */}
      <div className={styles.roh_vendormain_wrap} aria-label="Vendor profile information">
        <section className={`pt-3 pt-sm-5 pb-2 pb-md-2 pb-lg-2 mt-5 ${styles.roh_vendorProfileSection}`} aria-labelledby="vendor-profile-heading">
          <div className={styles.roh_container}>
            <div className="row">
              <div className="col-12">
                      {/* Breadcrumb here */}
                      {renderSingleVendorBreadcrumb(business_name)}
                <div className={styles.roh_vendorProfile_wrap}>
                  <div className={`${styles.roh_vendorProfile_inner}`}>
                    <div className={`${styles.roh_img_wrap_single}`}>
                      <img
                        src={
                          vendor?.profile_picture?.file_name
                            ? `${WEB_BASE_URL}${vendor.profile_picture.file_path}${vendor.profile_picture.file_name}`
                            : "/images/assets/team-4.jpg"
                        }
                        alt={
                          business_name
                            ? `${business_name}, ${address?.city || ""}`
                            : "Vendor profile image"
                        }
                        width={300}
                        height={364}
                      />

                    </div>

                    <div className={`${styles.roh_img_content_right}`}>
                      <div className={`${styles.roh_img_contentinner}`}>
                        <div className="d-flex justify-content-start flex-column">
                          <h1 className={`mb-2 ${styles.roh_vendorUsername}`} id="vendor-profile-heading">
                            {business_name ? `${business_name}, ${address?.city || ""}` : "Vendor"}
                             <span className={styles.roh_provider_badge}>
                            <img src="/verified.svg" alt="Verified vendor badge"/>
                          </span>
                          </h1>
                          {address && (
                            <div className={`d-flex flex-nowrap align-items-center gap-2 ${styles.roh_vendorAddress}`}>
                              <div style={{lineHeight:"0px"}}><LuMapPin size={16} aria-hidden="true"/></div>
                              <p className="mb-0">
                                {address.city}, {address.state}, {address.pincode}
                              </p>
                            </div>
                          )}
                        </div>
                        {vendor?.is_verified == 1 && (
                          <div className={styles.roh_verified_badge}>
                            <LuBadgeCheck size={16} aria-hidden="true"/>
                            Verified Vendor
                          </div>
                        )}
                      </div>

                      <div className={styles.roh_vendorinfo_warp}>
                        <h6>Contact Info:</h6>

                        {!isMounted ? null : !showContact ? (
                          !loggedIn ? (
                            <button type="button" onClick={handleLoginRedirect} className={styles.roh_contactbtn_details} aria-label="Login to view vendor contact details">
                              Login to view contact details
                            </button>
                          ) : (
                            <button type="button" onClick={handleViewContact} className={styles.roh_contactbtn_details} disabled={loadingContact} aria-label="View vendor contact details">
                              {loadingContact ? "Loading..." : "View contact details"}
                            </button>
                          )
                        ) : (
                          <ul className={`d-flex flex-wrap ${styles.roh_contactinfo}`}>
                            {serviceProvider?.phone_number && (
                              <li>
                                <a href={`tel:${serviceProvider.phone_number}`}>
                                  <LuPhone size={16} style={{ color: "#ff3600" }} aria-hidden="true"/>
                                  <span> +91-{serviceProvider.phone_number}</span>
                                </a>
                              </li>
                            )}

                            {serviceProvider?.email && (
                              <li>
                                <a href={`mailto:${serviceProvider.email}`} aria-label={`Email vendor at ${serviceProvider.email}`}>
                                  <LuMail size={16} style={{ color: "#ff3600" }} aria-hidden="true"/>
                                  <span>{serviceProvider.email}</span>
                                </a>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>

                      {/* Social Links */}
                      <ul className={`${styles.roh_solial_medialink}`}>
                        {/* {["facebook", "twitter-x", "instagram", "youtube"].map(
                          (platform) => ( */}
                            <li key="facebook">
                              <a target="_blank" href="#" rel="noopener" aria-label="facebook">
                                <LuFacebook size={18} aria-hidden="true"/>
                              </a>
                            </li>
                            <li key="Twitter">
                              <a target="_blank" href="#" rel="noopener" aria-label="Twitter">
                                <LuTwitter size={18} aria-hidden="true"/>
                              </a>
                            </li>
                            <li key="Instagram">
                              <a target="_blank" href="#" rel="noopener" aria-label="Instagram">
                               <LuInstagram size={18} aria-hidden="true"/>
                              </a>
                            </li>
                            <li key="Youtube">
                              <a target="_blank" href="#" rel="noopener" aria-label="Youtube">
                               <LuYoutube  size={18} aria-hidden="true"/>
                              </a>
                            </li>
                          {/* )
                        )} */}
                      </ul>

                      {/* Categories */}
                      {categories?.length > 0 && (
                        <div className={`${styles.roh_verndorService_category}`}>
                          <div className={styles.roh_categoryContent}>
                            {categories.map((cat, index) => {
                              const iconKey = (cat.sub_category_name || cat.category_name || "").toLowerCase().trim().replace(/\s+/g, "_");
                              const iconSrc = categoryIcons[iconKey] || categoryIcons.default;

                              return (
                                <button key={index} className={`${styles.roh_categoryBox}`} onClick={() => handleCategoryClick(cat, iconKey)} aria-label={cat.sub_category_name || cat.category_name}>
                                  <div className={`${styles.roh_back_circle}`}>
                                    <Image src={iconSrc} alt={cat.sub_category_name || cat.category_name} width={60} height={60}/>
                                  </div>
                                  {cat.sub_category_name || cat.category_name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${styles.roh_vendorProfile_inner_mobile}`}>
                    <div className={`${styles.roh_img_content_right}`}>

                      <div className={styles.roh_vendorinfo_warp}>
                        <h6>Contact Info:</h6>

                        {!isMounted ? null : !showContact ? (
                          !loggedIn ? (
                            <button type="button" onClick={handleLoginRedirect} className={styles.roh_contactbtn_details} aria-label="Login to view vendor contact details">
                              Login to view contact details
                            </button>
                          ) : (
                            <button type="button" onClick={handleViewContact} className={styles.roh_contactbtn_details} disabled={loadingContact} aria-label="View vendor contact details">
                              {loadingContact ? "Loading..." : "View contact details"}
                            </button>
                          )
                        ) : (
                          <ul className={`d-flex flex-wrap ${styles.roh_contactinfo}`}>
                            {serviceProvider?.phone_number && (
                              <li>
                                <a href={`tel:${serviceProvider.phone_number}`}>
                                  <LuPhone size={16} style={{ color: "#ff3600" }} aria-hidden="true"/>
                                  <span> +91-{serviceProvider.phone_number}</span>
                                </a>
                              </li>
                            )}

                            {serviceProvider?.email && (
                              <li>
                                <a href={`mailto:${serviceProvider.email}`} aria-label={`Email vendor at ${serviceProvider.email}`}>
                                  <LuMail size={16} style={{ color: "#ff3600" }} aria-hidden="true"/>
                                  <span>{serviceProvider.email}</span>
                                </a>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>

                      {/* Social Links */}
                      <ul className={`${styles.roh_solial_medialink}`}>
                        {/* {["facebook", "twitter-x", "instagram", "youtube"].map(
                          (platform) => ( */}
                            <li key="facebook">
                              <a target="_blank" href="#" rel="noopener" aria-label="facebook">
                                <LuFacebook size={18} aria-hidden="true"/>
                              </a>
                            </li>
                            <li key="Twitter">
                              <a target="_blank" href="#" rel="noopener" aria-label="Twitter">
                                <LuTwitter size={18} aria-hidden="true"/>
                              </a>
                            </li>
                            <li key="Instagram">
                              <a target="_blank" href="#" rel="noopener" aria-label="Instagram">
                               <LuInstagram size={18} aria-hidden="true"/>
                              </a>
                            </li>
                            <li key="Youtube">
                              <a target="_blank" href="#" rel="noopener" aria-label="Youtube">
                               <LuYoutube  size={18} aria-hidden="true"/>
                              </a>
                            </li>
                          {/* )
                        )} */}
                      </ul>

                      {/* Categories */}
                      {categories?.length > 0 && (
                        <div className={`${styles.roh_verndorService_category}`}>
                          <div className={styles.roh_categoryContent}>
                            {categories.map((cat, index) => {
                              const iconKey = (cat.sub_category_name || cat.category_name || "").toLowerCase().trim().replace(/\s+/g, "_");
                              const iconSrc = categoryIcons[iconKey] || categoryIcons.default;

                              return (
                                <button key={index} className={`${styles.roh_categoryBox}`} onClick={() => handleCategoryClick(cat, iconKey)} aria-label={cat.sub_category_name || cat.category_name}>
                                  <div className={`${styles.roh_back_circle}`}>
                                    <Image src={iconSrc} alt={cat.sub_category_name || cat.category_name} width={60} height={60}/>
                                  </div>
                                  {cat.sub_category_name || cat.category_name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-3 px-3">
          <div className={styles.roh_container}>
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12">
                {/* <div className={`${styles.roh_general_info_wrap}`}> */}
                <div className={`${styles.roh_general_info_wrap}`}>
                  <div className="star_box">
                    <div className="star_inner d-flex align-items-center gap-1">
                      <Image src="/images/homepg/star.svg" alt="star icon" width="19" height="17" aria-hidden="true"/>
                      <span className="roh_star_title">About Us</span>
                    </div>
                  </div>
                  <h2>About {business_name}</h2>
                  <p className="global_heading gray_global_heading media_desc ">
                    {business_description ? (
                          decodeHtml(business_description)
                      ) : (
                        <>
                          {business_name} is a local rental provider operating in {address?.city}, offering{" "}
                        <strong>{formatCategoryTitle(categories)}</strong> to meet a range of travel needs. Whether it’s short-distance travel, daily use, or longer journeys, the focus is on providing dependable rental options with clear terms and transparent pricing.
                        <br /><br />
                        The vehicles are maintained regularly to ensure they are road-ready and suitable for everyday use. Rental details such as pricing, duration, pickup location, and usage terms are shared clearly at the time of inquiry so customers know what to expect before confirming a booking.
                        <br /><br />
                        Serving both local residents and visitors to {address?.city}, {business_name} aims to keep the rental process straightforward, practical, and hassle-free.
                        </>
                      )}

                  </p>
                  <ul className={`${styles.roh_check_list}`} aria-label="Check List">
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" aria-hidden="true"/>
                        <span>{(vendor?.total_fleet_size ?? 50)}+ Vehicles Available</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" aria-hidden="true"/>
                        <span>Serving customers in {address?.city}</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" aria-hidden="true"/>
                        <span>Operating in {formatCategoryTitle(categories)}</span>
                      </div>
                    </li>

                    {/* <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Flexible Pickup &amp; Drop Timings</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Delivery Available Across Goa</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Multiple Payment Modes</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>4.8+ Star Rated by Customers</span>
                      </div>
                    </li> */}
                  </ul>
                </div>
                {/* <div className={`${styles.roh_general_info_wrap}`}>
                  <div className="star_box">
                    <div className="star_inner d-flex align-items-center gap-1">
                      <Image src="/images/homepg/star.svg" alt="star icon" width="19" height="17"/>
                      <span className="roh_star_title">Features</span>
                    </div>
                  </div>
                  <h2>Services Offered</h2>
                  <ul className={`${styles.roh_check_list}`}>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Daily &amp; Weekly Rentals</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Airport Pickup/Drop</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Doorstep Delivery</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Self-Drive &amp; Chauffeur-Driven Options</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Corporate Rentals</span>
                      </div>
                    </li>
                    <li>
                      <div className={`${styles.roh_list}`}>
                        <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20"/>
                        <span>Special Packages for Tourists</span>
                      </div>
                    </li>
                  </ul>
                </div> */}

                {/*------------------ Testimonials start --------*/}
                {/* <div className={` ${styles.roh_general_info_twowrap}`}>
                  <div className="star_box">
                    <div className="star_inner d-flex align-items-center gap-1">
                      <Image src="/images/homepg/star.svg" alt="star icon" width="19" height="17"/>
                      <span className="roh_star_title">Testimonials</span>
                    </div>
                  </div>
                  <h2>Customer Testimonials</h2>
                  <div id="mainslider" className="owl-carousel owl-theme owl-loaded owl-drag d-none">
                    <div className="owl-stage-outer owl-height" style={{ height: "206.761px" }}>
                      <div className="owl-stage" style={{transform: "translate3d(-1701px, 0px, 0px)", transition: "0.25s linear", width: "3403px"}}>
                        <div className="owl-item cloned" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap h-100">
                              <div className="quots"></div>
                              <div className="feedbacktext">
                                <p className="global_heading gray_global_heading media_desc mb-0">
                                  “We booked a Swift for 3 days in Goa. Super
                                  affordable and smooth ride!”{" "}
                                </p>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Ananya Desai, Pune</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item cloned" style={{ width: "425.34px"}}>
                          <div className="item">
                            <div className="right_slide_imgwrap  h-100">
                              <div>
                                <div className="quots"></div>
                                <div className="feedbacktext">
                                  <p className="global_heading gray_global_heading media_desc mb-0">
                                    “I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!”{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Nikhil Sharma, Mumbai</h4>
                                <p className="global_heading gray_global_heading media_desc ">
                                  John bringsM
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item cloned" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap h-100">
                              <div className="quots"></div>
                              <div className="feedbacktext">
                                <p className="global_heading gray_global_heading media_desc mb-0">
                                  “We booked a Swift for 3 days in Goa. Super affordable and smooth ride!”{" "}
                                </p>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Ananya Desai, Pune</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap  h-100">
                              <div>
                                <div className="quots"></div>
                                <div className="feedbacktext">
                                  <p className="global_heading gray_global_heading media_desc mb-0">
                                    “I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!”{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Nikhil Sharma, Mumbai</h4>
                                <p className="global_heading gray_global_heading media_desc ">
                                  John bringsM
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item active" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap h-100">
                              <div className="quots"></div>
                              <div className="feedbacktext">
                                <p className="global_heading gray_global_heading media_desc mb-0">
                                  “We booked a Swift for 3 days in Goa. Super affordable and smooth ride!”{" "}
                                </p>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Ananya Desai, Pune</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item cloned active" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap  h-100">
                              <div>
                                <div className="quots"></div>
                                <div className="feedbacktext">
                                  <p className="global_heading gray_global_heading media_desc mb-0">
                                    “I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!”{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Nikhil Sharma, Mumbai</h4>
                                <p className="global_heading gray_global_heading media_desc ">
                                  John bringsM
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item cloned active" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap h-100">
                              <div className="quots"></div>
                              <div className="feedbacktext">
                                <p className="global_heading gray_global_heading media_desc mb-0">
                                  “We booked a Swift for 3 days in Goa. Super affordable and smooth ride!”{" "}
                                </p>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Ananya Desai, Pune</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item cloned" style={{ width: "425.34px" }}>
                          <div className="item">
                            <div className="right_slide_imgwrap  h-100">
                              <div>
                                <div className="quots"></div>
                                <div className="feedbacktext">
                                  <p className="global_heading gray_global_heading media_desc mb-0">
                                    “I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!”{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="userinfo mt-1">
                                <h4>— Nikhil Sharma, Mumbai</h4>
                                <p className="global_heading gray_global_heading media_desc ">
                                  John bringsM
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="owl-nav disabled"><button type="button" role="presentation" className="owl-prev"><span aria-label="Previous">‹</span></button><button type="button" role="presentation" className="owl-next"><span aria-label="Next">›</span></button>
                        </div>
                        <div className="owl-dots disabled"><button role="button" className="owl-dot active"><span></span></button>
                        </div>
                  </div>
                </div> */}
                {/*------------------ Testimonials END --------*/}
              </div>
            </div>
          </div>
        </section>


        {/* ---------------- PRODUCTS ---------------- */}
        <div className={styles.fleetswrap_inner}>
          <div className={styles.fleets_wrap_main}>
            {/* <div
              className={styles.roh_location_content}
              dangerouslySetInnerHTML={{
                __html: decodeHtml(city_data?.city_desc || ""),
              }}
            /> */}

            <div className="d-flex justify-content-center align-items-center">
              <div className="star_box">
                <div className="d-flex align-items-center gap-1">
                  <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                  <span className="roh_star_title">Our Fleets</span>
                </div>
              </div>
            </div>

            <h3 className="roh_section_title_h3 text-center">
              Explore our perfect and <br /> extensive vehicles
            </h3>

            <div className={`${styles.roh_container} mt-4 mt-lg-5`}>
              {/* ===== LOOP MAIN CATEGORIES ===== */}
              {vendorCategories?.map((mainCat) => (
                <div key={mainCat.category_id} className="mb-0">
                  {/* ===== LOOP SUB CATEGORIES ===== */}
                  {mainCat.sub_categories?.map((subCat) => {
                    const iconKey = subCat.sub_cat_name
                      ?.toLowerCase()
                      .trim()
                      .replace(/\s+/g, "_");

                    const iconSrc =
                      categoryIcons[iconKey] || categoryIcons.default;

                    return (
                      <div
                        id={`roh_cat_head_${iconKey}`}
                        key={subCat.sub_cat_id}
                        className={styles.roh_vehicleslisting_wrapper}
                      >
                        {/* ---- SUB CATEGORY HEADER ---- */}
                        <div
                          // href={`/${subCat.sub_cat_slug}/${locationSlug}`}
                          // href="#"
                          className={`d-flex justify-content-start gap-2 align-items-center ${styles.roh_vehicleslisting_titleHeader}`}
                        >
                          <div className={styles.roh_category_icon_wrapper}>
                            <Image
                              src={iconSrc}
                              alt={subCat.sub_cat_name}
                              width={24}
                              height={24}
                            />
                          </div>
                          <h2 className={styles.subCategoryTitle}>
                            {subCat.sub_cat_name}
                          </h2>
                        </div>

                        {/* ---- PRODUCTS GRID ---- */}
                        <div className={styles.roh_vehicleslisting_grid}>
                          {subCat.products?.map((p) => (
                            <div
                              key={p.id}
                              className={`card ${styles.fleetscard} h-100`}
                              aria-label={`View details for ${p.item_name}`}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                // trackItemView(p.id);
                                setSelectedId(p.id);
                              }}
                            >
                              {/* IMAGE */}
                              <div className={styles.roh_cardImgWrapper}>
                                <Image
                                  src={
                                    p?.media_gallery?.[0]
                                      ? `${WEB_BASE_URL}${p.media_gallery[0].file_path}${p.media_gallery[0].file_name}`
                                      : "/iteams-deafault-img.webp"
                                  }
                                  alt={p.item_name}
                                  width={600}
                                  height={360}
                                  className={`card-img-top ${styles.cardImg}`}
                                />

                                {/* Transmission badge */}
                                {[2].includes(subCat.sub_cat_id) &&
                                  p?.transmission_type && (
                                    <span className={styles.roh_car_type}>
                                      {p.transmission_type}
                                    </span>
                                  )}
                              </div>

                              {/* Car with Driver */}
                              {subCat.sub_cat_id === 10 && (
                                <div className={styles.roh_cwd_label}>
                                  <LuUser size={14} aria-hidden="true"/> <span>Car With Driver</span>
                                </div>
                              )}

                              <div
                                className={`card-body d-flex flex-column pt-2 pt-lg-3 ${styles.cardBody}`}
                              >
                                <h4 className={styles.feets_cardH}>
                                  {p.item_name}
                                </h4>

                                {/* LOCATION */}
                                <div
                                  className={`${styles.roh_feets_list} text-secondary mb-2`}
                                >
                                  <div className={styles.roh_feets_data_list}>
                                    <LuMapPin size={18} aria-hidden="true"/>
                                    <span className="text-capitalize">
                                      {p?.address_1
                                        ? `${p.address_1}, ${p?.city ?? "-"}`
                                        : p?.city ?? "-"}
                                    </span>
                                  </div>
                                </div>

                                {/* AVAILABILITY */}
                                <div
                                  className={`${styles.roh_feets_list} text-secondary mb-2`}
                                >
                                    <div className={`${styles.roh_feets_data_list}`}
                                    >
                                    <LuCircleCheckBig size={18} aria-hidden="true"/>
                                    <span className={`${
                                        p?.availability_status === "Available"
                                          ? styles.status_available
                                          : p?.availability_status === "Rented"
                                          ? styles.status_rented
                                          : styles.status_default
                                      }`}>
                                      {p?.availability_status === "Rented"? "Rented(Not Available)": p?.availability_status ?? "-"}
                                    </span>
                                  </div>
                                </div>

                                {/* PRICE + CTA */}
                                <div className={`d-flex flex-wrap justify-content-between align-items-center mt-auto pt-2 ${styles.roh_cardFooter}`} style={{ borderTop: "1px dashed #E5E7EB" }}>
                            { p?.price_per_day && Number(p.price_per_day) > 0 && (
                          <div className={styles.roh_cardFooter_price}>
                                      <>
                                        <span className={styles.priceStrong}>
                                          ₹{formatPriceINR(p.price_per_day)}
                                        </span>
                                        <span className={styles.priceMuted}>
                                          {" "}
                                          /Day
                                        </span>
                                      </>
                                  </div>
                                  
                                    )}

                                  {/* <button
                                    type="button"
                                    className={styles.ctaBtn}
                                    aria-label={`View details for ${p.item_name}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // trackItemView(p.id);
                                      setSelectedId(p.id);
                                    }}
                                  >
                                    <ArrowrightIcon width={18} height={18} aria-hidden="true"/>
                                  </button> */}
                                  <span className={`${styles.ctaBtn_new} ${ p?.price_per_day && Number(p.price_per_day) > 0 ? "roh_max_content" : "w-100" }`}>
                                      {p?.price_per_day && Number(p.price_per_day) > 0 ? "Contact Owner" : "Contact Owner for price"}
                                      <LuArrowRight size={14} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* VIEW ALL */}
                        {/* <div className={styles.roh_viewAllbtn_wrap}>
                          <a
                            href="#"
                            // href={`/${subCat.sub_cat_slug}/${locationSlug}`}
                            className={styles.roh_viewAll}
                          >
                            View All {subCat.sub_cat_name}
                            <LuArrowRight size={16} />
                          </a>
                        </div> */}

                        {subCat.products.length === 0 && (
                          <p className="text-center text-muted">
                            No items found.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>





        <NeedHelp />
      </div>
      {/* {showPopup && (
        <ViewCatDtlPop
          category={selectedCategory}
          onClose={closePopup}
          items={items}
          loading={loadingItems}
          vendor={vendor}
        />
      )} */}
      {/* ---------------- POPUP ---------------- */}
      {selectedId !== null && (
        <Viewproductspop
          triggerId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
