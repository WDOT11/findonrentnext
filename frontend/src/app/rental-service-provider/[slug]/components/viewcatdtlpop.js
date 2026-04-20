"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./vendorcatpop.module.css";
import Link from "next/link";
import ArrowrightIcon from '../../../../../public/arrow.svg';
import WhatsappIcon from '../../../../../public/whatsapp.svg';
import StarIcon from '../../../../../public/star.svg';
import StarFillIcon from '../../../../../public/images/product-popup/Star-fill.svg';
import StarFillDarkIcon from '../../../../../public/images/product-popup/star-fill-dark.svg';

import { LuLayers, LuMapPin, LuCalendarDays, LuThumbsUp, LuWallet, LuCircleCheckBig, LuFuel, LuSettings2, LuArmchair, LuPalette } from "react-icons/lu";
export default function ViewCatDtlPop({category, onClose, items = [], loading = false, vendor}) {

  const [showDetails, setShowDetails] = useState(false);
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
  const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

  /* Cookie Helper */
  const getCookie = (name) => {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  /* Validate Login */
  const checkLoginStatus = () => {
    try {
      const authUserRaw = getCookie("authUser");
      const token = getCookie("authToken") || getCookie("token") || getCookie("accessToken");
      if (!token || !authUserRaw) return false;
      return true;
    } catch {
      return false;
    }
  };

  // Detect viewport width
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable body scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const vendorName = vendor?.business_name || "Vendor Name Not Available";
  const locationText = vendor?.address ? [vendor.address.street_address, vendor.address.city, vendor.address.state, vendor.address.pincode].filter(Boolean).join(", ") : "Location not available";

  const activeSince = vendor?.created_at ? new Date(vendor.created_at).getFullYear() : "N/A";

  /* CARD CLICK → FETCH ITEM + (IF LOGGED IN) FETCH SERVICE PROVIDER */
  const handleCardClick = async (item) => {
    const itemId = item?.id;
    if (!itemId) return;

    const loginStatus = checkLoginStatus();
    setIsAuthenticated(loginStatus);

    try {
      const response = await fetch(`${ROH_PUBLIC_API_BASE_URL}/viewsingleitem/${itemId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      setSelectedItem(data);

      /** IF LOGGED IN → Fetch service provider info */
      if (loginStatus && data?.service_provider_id) {
        const res2 = await fetch(`${API_BASE_URL}/getserviceprovideinfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_provider_id: data.service_provider_id,
          }),
        });

        const spData = await res2.json();
        setServiceProvider(spData);
      }
    } catch (err) {
      console.error("Error:", err);
    }

    setShowDetails(true);
    setIsLeftActive(true);

    const header = document.querySelector(`.${styles.roh_popup_header}`);
    if (header) header.classList.add(styles.roh_popup_headerHide);
  };

  /* BACK TO LISTING */
  const handleBackToListing = () => {
    setShowDetails(false);
    setIsLeftActive(false);

    const header = document.querySelector(`.${styles.roh_popup_header}`);
    if (header) header.classList.remove(styles.roh_popup_headerHide);
  };

  const handleViewContact = async () => {

    if (!checkLoginStatus()) {
      handleLoginRedirect();
      return;
    }

    if (showContact || loadingContact) return;
    const authUserRaw = getCookie("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;

    try {
      setLoadingContact(true);
      const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/view-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: authUser?.id,
          item_id: selectedItem?.id,
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

  return (
    <div className={styles.roh_popup_overlay}>
      <div className={styles.roh_popup_box}>
        <button className={styles.roh_popup_close} onClick={onClose} aria-label="Close"> ✕ </button>

        {/* Header */}
        <div className={`container ${styles.roh_listingHeader_container}`}>
          <div className="row">
            <div className="col-md-12">
              <div className={`justify-content-center ${styles.roh_popup_header}`}>
                <h1 className="mb-0"> {category?.sub_category_name || category?.category_name || "Category"} </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.roh_popup_body}>
          <div className={styles.roh_vehicleSection}>
            <div className="container-fluid px-2 px-md-3 px-lg-3 position-relative">
              <div className="row d-flex justify-content-start g-4 mt-0">

                {/* Listing Main */}
                <div className={`mt-0 ${styles.roh_listingMain} ${isLeftActive ? styles.roh_listingMain_active : ""}`}
                  style={{width: !isMobileView ? showDetails ? "450px" : "100%" : "100%", display: isMobileView && showDetails ? "none" : "block", transition: "width 0.4s ease, opacity 0.3s ease"}}>
                  <div className={`${styles.roh_listingTitle_leftTop}`}>
                    <h2><LuLayers size={24} style={{ marginRight: "5px", color:"#ff3600" }} /> Available Vehicles</h2>
                  </div>

                  <div className={`${styles.roh_vehicleListing} ${isLeftActive ? styles.roh_vehicleListing_left : ""}`}>
                    {loading ? (
                      <p>Loading items...</p>
                    ) : items.length > 0 ? (
                      items.map((item) => (
                        <div key={item.id}  className={`card ${styles.roh_fleetscard} ${selectedItem?.id === item.id ? styles.roh_activeCard : ""}`} onClick={() => handleCardClick(item)} style={{ cursor: "pointer" }}>
                          <div className={styles.roh_cardImgWrapper}>
                          <img src={item?.media_gallery?.[0] ? `${WEB_BASE_URL}${item.media_gallery[0].file_path}${item.media_gallery[0].file_name}` : "/iteams-deafault-img.webp"} alt={item?.item_name || "Item image"} width={600} height={360} className={`card-img-top ${styles.roh_cardImg}`}/>

                          {/* show transmission type (Automatic or Manual) */}
                          {item?.sub_cat_id === 2 && (
                            <span className={`${styles.roh_car_type} ${styles.roh_car_type_normal}`}>
                              {item.transmission_type}
                            </span>
                          )}

                          </div>
                          <div className={`card-body d-flex justify-content-between flex-column pt-3 ${styles.roh_cardBody}`}>
                            <div>
                              <div>
                                <span className="badge-car">
                                  {item.category_name || "Vehicle"}
                                </span>

                                <h5 className={`${styles.feets_cardH}`}>
                                  {item.item_name}
                                </h5>
                              </div>

                              {/* <div className={`d-flex justify-content-between text-secondary mb-2 ${styles.roh_listingCard_genInfo}`}>
                                <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                  <Image src="/rental-period-icon.svg" alt="icon" width={20} height={20}/>
                                  <span>Price / Day</span>
                                </div>
                                <span className="text-dark fw-medium">
                                  {item?.price_per_day && Number(item.price_per_day) > 0 ? (
                                    <>₹{Number(item.price_per_day).toLocaleString("en-IN")}</>
                                  ) : (
                                    <span className={styles.priceMuted}>Contact vendor for price</span>
                                  )}
                                </span>
                              </div> */}

                              <div className={`d-flex justify-content-between text-secondary mb-2 ${styles.roh_listingCard_genInfo}`}>
                                <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                  <LuMapPin size={18} style={{color:"#9CA3AF"}}/>
                                  <span>Location</span>
                                </div>
                                <span className="fw-semibold text-dark  roh_capitalizeText">
                                  {item.city || item.item_state || "-"}
                                </span>
                              </div>
                              <div className={`d-flex justify-content-between text-secondary mb-4 ${styles.roh_listingCard_genInfo}`}>
                                <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                  <LuCircleCheckBig size={18} style={{color:"#9CA3AF"}}/>
                                  <span>Availability</span>
                                </div>
                                <span className="fw-semibold text-dark">
                                  {item.availability_status || "Unknown"}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center" style={{ borderTop: "1px dashed #E5E7EB" }}>
                              <div className={`d-flex justify-content-between align-items-center mt-auto pt-2 w-100 ${styles.roh_cardPrice_content}`}>
                                <div className="mb-0">
                                  {item?.price_per_day && Number(item.price_per_day) > 0 ? (
                                    <>
                                      <span className={styles.priceStrong}> ₹{Number(item.price_per_day).toLocaleString("en-IN")}</span>
                                      <span className={styles.priceMuted}> /Day</span>
                                    </>
                                  ) : (
                                    <span className={styles.priceMuted}> Contact vendor for price </span>
                                  )}
                                </div>

                                <button className={styles.ctaBtn}>
                                   <ArrowrightIcon className="roh_icon" width={30} height={30}/>
                                </button>
                              </div>
                                   {/* show transmission type (Automatic or Manual) */}
                          {item?.sub_cat_id === 2 && (
                            <span className={`${styles.roh_car_type_left}`}>
                              {item.transmission_type}
                            </span>
                          )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No vehicles found for this category.</p>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className={styles.roh_singleVehicle_details} style={{width: !isMobileView ? showDetails ? "calc(100% - 450px)" : "0" : "100%", display: isMobileView && !showDetails ? "none" : "block", transition: "width 0.4s ease, opacity 0.3s ease"}}>

                  {showDetails && (
                    <section>
                      <div className={styles.roh_container}>
                        <div className="roh_singleVehicle_detailsInner">
                          <div className={`${styles.roh_vehicleNmaeBack}`}>
                            <div className={`d-flex justify-content-start align-items-center gap-2 ${styles.roh_singleVehicle_detailsHeader}`}>
                              <button onClick={handleBackToListing} className={`border-0 bg-white pe-2 ${styles.roh_backTolisting}`}>
                                <Image src="/back.svg" width={20} height={20} alt="Back to Listing" />
                              </button>
                              <h4 className="mb-0 lh-base text-center">{selectedItem?.item_name || ""}</h4>
                            </div>
                          </div>

                          {/* Vehicle Name  */}
                          <div className={`row ${styles.roh_singleVehicle_detailsInner_content}`}>

                            <div className={`${styles.roh_Vehicle_detailsInner_contentLeft}`}>
                              <h2>{selectedItem?.item_name || ""}</h2>
                              <p>{selectedItem?.vehicle_description}</p>


                              {/* Vendor Overview */}
                              <div className={`${styles.roh_about_list_wrap} `}>
                                <div className={styles.roh_vendor_infoTop}>
                                  <div className="vendor_title">
                                    <div className="star_box">
                                      <div className="star_inner d-flex align-items-center gap-1">
                                        <StarIcon className="roh_icon" width={20} height={20}/>
                                        <span className={`roh_star_title`}>Vendor Information</span>
                                      </div>
                                    </div>
                                    {/* Dynamic vendor name */}
                                    <h3>Listed By: {vendorName}</h3>
                                  </div>

                                  <div className={`${styles.roh_Vehicle_detailsInner_contentRight}`}>
                                    <div className="roh_left_slide_wrap">
                                      <div className={`${styles.roh_left_slide_inner}`}>
                                        <div className={`${styles.roh_sidebar_pricing}`}>
                                          <span style={{fontSize: "13px"}}>Starting </span>
                                          <h3>
                                            {selectedItem?.price_per_day && Number(selectedItem.price_per_day) > 0 ? (
                                              <>
                                                ₹{Number(selectedItem.price_per_day).toLocaleString("en-IN")}
                                                <span>&nbsp;/Day</span>
                                              </>
                                            ) : (
                                              <span className={styles.priceMuted}>Contact vendor for price</span>
                                            )}
                                          </h3>

                                          <div className={`${styles.roh_productPrice}`}>
                                            <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                              <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                                <span>Per/Week:</span>
                                              </div>
                                              <span className="text-dark fw-medium">₹{selectedItem.price_per_week}</span>
                                            </div>
                                            <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                              <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                                <span>Per/Month:</span>
                                              </div>
                                              <span className="text-dark fw-medium">₹{selectedItem.price_per_month}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <ul className={`${styles.roh_about_media_list} ${styles.roh_vendor_info}`}>
                                  {/* Location */}
                                  <li>
                                    <div className={`media ${styles.roh_media}`}>
                                      <div className="media_imgbox">
                                        <div className={`${styles.roh_back_circle}`}>
                                          <LuMapPin size={24} />
                                        </div>
                                      </div>
                                      <div className="media-body">
                                        <h5 className={`${styles.roh_media_title}`}>Location</h5>
                                        <p className="global_heading media_desc gray_global_heading pb-0 mb-0">
                                          {locationText}
                                        </p>
                                      </div>
                                    </div>
                                  </li>

                                  {/* Active Since */}
                                  <li>
                                    <div className={`media ${styles.roh_media}`}>
                                      <div className="media_imgbox">
                                        <div className={`${styles.roh_back_circle}`}>
                                          <LuCalendarDays size={24} />
                                        </div>
                                      </div>
                                      <div className="media-body">
                                        <h6 className={`${styles.roh_media_title}`}>Active Since:</h6>
                                        <p className="global_heading gray_global_heading media_desc pb-0 mb-0">
                                          {activeSince}
                                        </p>
                                      </div>
                                    </div>
                                  </li>

                                  {/* Rating – still static for now */}
                                  <li>
                                    <div className={`media ${styles.roh_media}`}>
                                      <div className="media_imgbox">
                                        <div className={`${styles.roh_back_circle}`}>
                                        <LuThumbsUp size={24} />
                                        </div>
                                      </div>
                                      <div className="media-body">
                                        <h6 className={`${styles.roh_media_title}`}>Vendor Rating:</h6>
                                        <p className="global_heading gray_global_heading media_desc pb-0 mb-0">
                                          <StarFillIcon className="roh_icon" width={14} height={14}/>
                                          <StarFillIcon className="roh_icon" width={14} height={14}/>
                                          <StarFillIcon className="roh_icon" width={14} height={14}/>
                                          <StarFillIcon className="roh_icon" width={14} height={14}/>
                                          <StarFillDarkIcon className="roh_icon" width={14} height={14}/>
                                          (4.8/5 – 120+ Rentals)
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>

                                <div className="sidebar-bottom-btns mt-3">
                                  <div className="btn_singlepage_wrap d-flex align-items-center flex-wrap justify-content-start gap-2">

                                    {/* CHECK LOGIN */}
                                    {isAuthenticated ? (
                                      /** USER LOGGED IN → DIRECT CALL */
                                      <div className="d-flex align-items-center justify-content-center roh_redBtns" onClick={handleViewContact}>
                                        <div className="roh_button_custom">
                                          <a href={`tel:${serviceProvider.phone_number}`}> Contact Us </a>
                                        </div>
                                        <div className="roh_circl_btn">
                                          <a href={`tel:${serviceProvider.phone_number}`}>
                                             <ArrowrightIcon className="roh_icon" width={30} height={30}/>
                                          </a>
                                        </div>
                                      </div>
                                    ) : (

                                      /** USER NOT LOGGED IN → REDIRECT TO LOGIN */
                                      (() => {
                                        const currentURL =
                                          typeof window !== "undefined" ? window.location.href : "/";

                                        const loginRedirectUrl = `/login/?redirect=${encodeURIComponent(
                                          currentURL
                                        )}`;

                                        return (
                                          <div className="d-flex align-items-center justify-content-center roh_redBtns">
                                            <div className="roh_button_custom">
                                              <a href={loginRedirectUrl}>Contact Us</a>
                                            </div>
                                            <div className="roh_circl_btn">
                                              <a href={loginRedirectUrl}>
                                                 <ArrowrightIcon className="roh_icon" width={30} height={30}/>
                                              </a>
                                            </div>
                                          </div>
                                        );
                                      })()
                                      )}

                                      <div>
                                        <span className="text-muted">OR</span>
                                      </div>

                                      {/* WHATSAPP BUTTON */}
                                      {isAuthenticated ? (
                                        <div className="roh_iconBtn" onClick={handleViewContact}>
                                          <a href={`https://wa.me/${serviceProvider.phone_number}`}>
                                           <WhatsappIcon className="roh_icon" width={30} height={30}/>
                                          </a>
                                        </div>
                                      ) : (
                                        (() => {
                                          const currentURL = typeof window !== "undefined" ? window.location.href : "/";
                                          const loginRedirectUrl = `/login/?redirect=${encodeURIComponent( currentURL )}`;

                                          return (
                                            <div className="roh_iconBtn">
                                              <a href={loginRedirectUrl}>
                                               <WhatsappIcon className="roh_icon" width={30} height={30}/>
                                              </a>
                                            </div>
                                          );
                                        })()
                                      )}
                                  </div>
                                </div>
                              </div>

                              {/* Overview – About this Car */}
                              <div className={` ${styles.roh_general_info_wrap}`}>
                                <div className="star_box">
                                  <div className="star_inner d-flex align-items-center gap-1">
                                    <StarIcon className="roh_icon" width={20} height={20}/>
                                    <span className={`roh_star_title`}>Included Services</span>
                                  </div>
                                </div>
                                <h2>Overview</h2>
                                <p className="global_heading gray_global_heading media_desc ">{selectedItem.vehicle_description}</p>
                                <ul className={`${styles.roh_check_list}`}>
                                  <li>
                                    <div className={`${styles.roh_featureList}`}>
                                      <LuWallet size={20} />
                                      <h6>Security Deposit: <span>₹{selectedItem.security_deposit}</span></h6>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={`${styles.roh_featureList}`}>
                                      <LuCircleCheckBig  size={20}/>
                                      <h6>Availability: <span>{selectedItem.availability_status}</span></h6>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={`${styles.roh_featureList}`}>
                                      <LuFuel  size={20}/>
                                      <h6>Fuel: <span>{selectedItem.engine_type}</span></h6>
                                    </div>
                                  </li>
                                  <li>
                                    {/* show transmission type (Automatic or Manual) */}
                                    {selectedItem?.sub_cat_id === 2 && (
                                        <div className={`${styles.roh_featureList}`}>
                                        <LuSettings2 size={20} />
                                        <h6>Transmission: <span>{selectedItem.transmission_type}</span></h6>
                                      </div>
                                    )}

                                  </li>
                                  {/* <li>
                                    <div className={`${styles.roh_featureList}`}>
                                      <LuArmchair size={20} />
                                      <h6>Seats: <span>{selectedItem.seating_capacity}</span></h6>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={`${styles.roh_featureList}`}>
                                      <LuPalette size={20} />
                                      <h6>Color: <span>{selectedItem.color}</span></h6>
                                    </div>
                                  </li> */}
                                </ul>
                              </div>

                              {/* Policies and agreement */}
                              <div className={`${styles.roh_general_info_twowrap}`}>
                                <div className="star_box">
                                  <div className="star_inner d-flex align-items-center gap-1">
                                    <StarIcon className="roh_icon" width={20} height={20}/>
                                    <span className={`roh_star_title`}>Rental Conditions</span>
                                  </div>
                                </div>
                                <h3>Policies and agreement</h3>
                                <div className={`${styles.roh_policy_terms}`}>
                                  <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                      <h4 className="accordion-header">
                                        <button className={`accordion-button ${styles.roh_accordion_button}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                          Accessories
                                        </button>
                                      </h4>
                                      <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                          <p>Alloy Wheels Touchscreen Infotainment System Reverse Parking Camera Seat Covers Floor Mats Fog Lamps</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="accordion-item">
                                      <h4 className="accordion-header">
                                        <button className={`accordion-button ${styles.roh_accordion_button}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                          Booking Terms
                                        </button>
                                      </h4>
                                      <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                          <p>Booking amount: ₹3,000 (non-refundable) Final payment before delivery Price excludes fuel, tolls, RTO, insurance, and taxes Delivery subject to availability and clearance Accessories charged separately</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="accordion-item">
                                      <h4 className="accordion-header">
                                        <button className={`accordion-button ${styles.roh_accordion_button}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                          Booking Instructions
                                        </button>
                                      </h4>
                                      <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                          <p>Fill in the online booking form Upload valid ID proof (Aadhaar/Driving License/Passport) Pay the booking amount securely online Our team will confirm your booking within 24 hours Visit the showroom for final payment and delivery</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
