"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./vendorcatpop.module.css";

export default function ViewCatDtlPop({ category, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  //  Detect viewport width
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Disable body scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Enable back when popup closes
    };
  }, []);

  //  On card click
  const handleCardClick = () => {
    setShowDetails(true);
    setIsLeftActive(true);

    // 👉 Add hide class to header
    const header = document.querySelector(`.${styles.roh_popup_header}`);
    if (header) header.classList.add(styles.roh_popup_headerHide);
  };

  //  On back to listing
  const handleBackToListing = () => {
    setShowDetails(false);
    setIsLeftActive(false);

    // 👉 Remove hide class from header
    const header = document.querySelector(`.${styles.roh_popup_header}`);
    if (header) header.classList.remove(styles.roh_popup_headerHide);
  };

  return (
    <div className={styles.roh_popup_overlay}>
      <div className={styles.roh_popup_box}>
        <button className={styles.roh_popup_close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Header */}
        <div className={`container ${styles.roh_listingHeader_container}`}>
          <div className="row">
            <div className="col-md-12">
              <div className={`justify-content-center ${styles.roh_popup_header}`}>
                <h1 className="mb-0">{category}s</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.roh_popup_body}>
          <div className="roh_vehicleSection">
            <div className="container-fluid px-2 px-md-3 px-lg-3 position-relative">
              <div className="row d-flex justify-content-start g-4 mt-0">

                {/*  Listing Main */}
                <div className={`mt-0 ${styles.roh_listingMain} ${isLeftActive ? styles.roh_listingMain_active : ""}`}
                  style={{ width: !isMobileView ? showDetails ? "450px" : "100%" : "100%", display: isMobileView && showDetails ? "none" : "block", transition: "width 0.4s ease, opacity 0.3s ease" }}>
                  <div className={`${styles.roh_listingTitle_leftTop}`}>
                    <h2>Available Vehicles </h2>
                  </div>

                  <div className={`${styles.roh_vehicleListing} ${isLeftActive ? styles.roh_vehicleListing_left : ""}`}>
                    {[...Array(20)].map((_, index) => (
                      <div key={index} className={`card p-4 ${styles.roh_fleetscard}`} onClick={handleCardClick} style={{ cursor: "pointer" }}>
                        <Image src="/images/bikes/duke250.jpg" alt="Item image" width={600} height={360} className={`card-img-top ${styles.roh_cardImg}`} />
                        <div className={`card-body d-flex flex-column pt-3 ${styles.roh_cardBody}`}>
                          <div>
                            <span className="badge rounded-pill px-3 py-2 badge-car">
                              categoryName
                            </span>
                            <h5 className={`${styles.feets_cardH} `}>
                              Duke 250
                            </h5>
                            <div className={`${styles.roh_vehicle_info}`}>
                            <p><span>Fuel: Petrol</span>, <span>Seats: 2</span></p>
                            </div>
                          </div>

                          <div className={`d-flex justify-content-between text-secondary mb-2 ${styles.roh_listingCard_genInfo}`}>
                            <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                              <Image src="/rental-period.svg" alt="icon" width={20} height={20} />
                              <span>Rental Period</span>
                            </div>
                            <span className="text-dark fw-medium">2 Days</span>
                          </div>

                          <div className={`d-flex justify-content-between text-secondary mb-4 ${styles.roh_listingCard_genInfo}`}>
                            <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                              <Image src="/car-availability.svg" alt="icon" width={20} height={20} />
                              <span>Availability</span>
                            </div>
                            <span className="text-dark fw-medium">
                              Available
                            </span>
                          </div>

                          <div className={`d-flex justify-content-between align-items-center border-top mt-auto pt-2 ${styles.roh_cardPrice_content}`}>
                            <div className="mb-0">
                              <span className={styles.priceStrong}>₹200 </span>
                              <span className={styles.priceMuted}> /Per Day</span>
                            </div>

                            <button className={styles.ctaBtn}>
                              <Image src="/arrow.svg" alt="Arrow" width={30} height={30} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/*  Vehicle Details */}
                <div
                  className={styles.roh_singleVehicle_details}
                  style={{
                    width: !isMobileView
                      ? showDetails
                        ? "calc(100% - 450px)"
                        : "0"
                      : "100%",
                    display: isMobileView && !showDetails ? "none" : "block",
                    transition: "width 0.4s ease, opacity 0.3s ease",
                  }}
                >
                  {showDetails && (
                    <section>
                      <div className="roh_singleVehicle_detailsInner">
                        <div className={`${styles.roh_vehicleNmaeBack}`}>
                          <div className={`d-flex justify-content-start align-items-center gap-2 ${styles.roh_singleVehicle_detailsHeader}`}>
                            <button onClick={handleBackToListing} className={`border-0 bg-white pe-2 ${styles.roh_backTolisting}`}>
                              <Image src="/back.svg" width={20} height={20} alt="Back to Listing" />
                            </button>
                            <h4 className="mb-0 lh-base text-center">Duke 250 </h4>
                          </div>
                        </div>

                        {/* Vehicle Name  */}
                        <div className={`row ${styles.roh_singleVehicle_detailsInner_content}`}>

                          <div className={`${styles.roh_Vehicle_detailsInner_contentLeft}`}>
                            <h2>Duke 250</h2>
                            <p>This section shows more information about the selected vehicle (e.g., Duke 250).</p>

                            {/* Vehicle Price  */}
                            <div className={`${styles.roh_left_slide_priceMobile}`}>
                              <div className={`${styles.roh_left_slide_inner}`}>
                                <div className={`${styles.roh_sidebar_pricing}`}>
                                  {/* <h2><sup><span>Starting </span></sup> ₹{item.price_per_day}<span>/Per Day</span></h2> */}
                                  <h3><sup><span>Starting </span></sup>₹200
                                    <span>&nbsp;/Per Day</span>
                                  </h3>

                                  <div className={`${styles.roh_productPrice}`}>
                                    <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                      <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                        <span>Per/Week:</span>
                                      </div>
                                      <span className="text-dark fw-medium">₹2000</span>
                                    </div>
                                    <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                      <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                        <span>Per/Month:</span>
                                      </div>
                                      <span className="text-dark fw-medium">₹20000</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={`${styles.roh_about_list_wrap} `}>
                              <div className="star_box">
                                <div className="star_inner d-flex align-items-center gap-1">
                                  <Image src="/star.svg" alt="Star" width={19} height={17} />
                                  <span className={`roh_star_title`}>Vendor Information</span>
                                </div>
                              </div>
                              <h5 >Listed By: Urban Drive Rentals, Delhi NCR</h5>

                              <ul className={`${styles.roh_about_media_list} ${styles.roh_vendor_info}`}>
                                <li>
                                  <div className={`media ${styles.roh_media}`}>
                                    <div className="media_imgbox">
                                      <div className={`${styles.roh_back_circle}`}>
                                        <Image src="/images/product-popup/location-icon.svg" alt="Location" width={32} height={32} />
                                      </div>
                                    </div>
                                    <div className="media-body">
                                      <h5 className={`${styles.roh_media_title}`}>Location</h5>
                                      <p className="global_heading media_desc gray_global_heading pb-0 mb-0">Karol Bagh, New Delhi</p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className={`media ${styles.roh_media}`}>
                                    <div className="media_imgbox">
                                      <div className={`${styles.roh_back_circle}`}>
                                        <Image src="/images/product-popup/calendar-icon.svg" alt="Calendar" width={32} height={32} />
                                      </div>
                                    </div>
                                    <div className="media-body">
                                      <h6 className={`${styles.roh_media_title}`}>Active Since:</h6>
                                      <p className="global_heading gray_global_heading media_desc pb-0 mb-0">2022</p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className={`media ${styles.roh_media}`}>
                                    <div className="media_imgbox">
                                      <div className={`${styles.roh_back_circle}`}>
                                        <Image src="/images/product-popup/rating-icon.svg" alt="Rating" width={32} height={32} />
                                      </div>
                                    </div>
                                    <div className="media-body">
                                      <h6 className={`${styles.roh_media_title}`}>Vendor Rating:</h6>
                                      <p className="global_heading gray_global_heading media_desc pb-0 mb-0">
                                        <Image src="/images/product-popup/Star-fill.svg" alt="Rating" width={14} height={14} />
                                        <Image src="/images/product-popup/Star-fill.svg" alt="Rating" width={14} height={14} />
                                        <Image src="/images/product-popup/Star-fill.svg" alt="Rating" width={14} height={14} />
                                        <Image src="/images/product-popup/star-fill-dark.svg" alt="Rating" width={14} height={14} />
                                        <Image src="/images/product-popup/star-fill-dark.svg" alt="Rating" width={14} height={14} />
                                        (4.8/5 – 120+ Rentals)</p>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                              <div className="sidebar-bottom-btns mt-3">
                                <div className="btn_singlepage_wrap d-flex align-items-center flex-wrap justify-content-start gap-2">
                                  <div className="d-flex align-items-center justify-content-center roh_redBtns">
                                    <div className="roh_button_custom">
                                      <a href="tel:+91-9876543210">Contact Us
                                        {/* ({serviceProvider.phone_number}) */}
                                      </a>
                                    </div>
                                    <div className="roh_circl_btn">
                                      <a href="te:+91-9876543210">
                                        <Image src="/arrow.svg" alt="Arrow Right" width={30} height={30} />
                                      </a>
                                    </div>
                                  </div>

                                  <div><span className="text-muted">OR</span></div>

                                  {/* WhatsApp Link with Authentication Check */}
                                  <div className="roh_iconBtn">
                                    <a href="#">
                                      <Image src="/whatsapp.svg" alt="WhatsApp" width={30} height={30} />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Overview – About this Car */}
                            <div className={` ${styles.roh_general_info_wrap}`}>
                              <div className="star_box">
                                <div className="star_inner d-flex align-items-center gap-1">
                                  <Image src="/star.svg" alt="Star" width={19} height={17} />
                                  <span className={`roh_star_title`}>Included Services</span>
                                </div>
                              </div>
                              <h2>Overview – About this Car</h2>
                              <p className="global_heading gray_global_heading media_desc ">Experience the thrill of zipping through the city with the Maruti Suzuki Swift — a stylish and reliable hatchback designed for comfort, fuel efficiency, and a great driving experience. Whether it’s a short weekend trip or daily city commuting, this Swift is your perfect companion.</p>
                              <ul className={`${styles.roh_check_list}`}>
                                <li>
                                  <div className={`${styles.roh_featureList}`}>
                                    <Image src="/images/product-popup/car-security-deposit.svg" alt="Door" width={28} height={28} />
                                    <h6>Security Deposit: <span>₹2000</span></h6>
                                  </div>
                                </li>
                                <li>
                                  <div className={`${styles.roh_featureList}`}>
                                    <Image src="/images/product-popup/car-engine.svg" alt="Door" width={28} height={28} />
                                    <h6>Availability: <span>Available</span></h6>
                                  </div>
                                </li>
                                <li>
                                  <div className={`${styles.roh_featureList}`}>
                                    <Image src="/images/product-popup/car-engine.svg" alt="Door" width={28} height={28} />
                                    <h6>Fuel: <span>Petrol</span></h6>
                                  </div>
                                </li>
                                <li>
                                  <div className={`${styles.roh_featureList}`}>
                                    <Image src="/images/product-popup/car-transmission.svg" alt="Transmission" width={28} height={28} />
                                    <h6>Transmission: <span>Manual</span></h6>
                                  </div>
                                </li>
                                <li>
                                  <div className={`${styles.roh_featureList}`}>
                                    <Image src="/images/product-popup/car-seats.svg" alt="Age" width={28} height={28} />
                                    <h6>Seats: <span>2</span></h6>
                                  </div>
                                </li>
                                <li>
                                  <div className={`${styles.roh_featureList}`}>
                                    <Image src="/images/product-popup/car-color.svg" alt="Luggage" width={28} height={28} />
                                    <h6>Color: <span>Black</span></h6>
                                  </div>
                                </li>

                              </ul>
                            </div>

                            {/* Policies and agreement */}
                            <div className={`${styles.roh_general_info_twowrap}`}>
                              <div className="star_box">
                                <div className="star_inner d-flex align-items-center gap-1">
                                  <Image src="/star.svg" alt="Star" width={19} height={17} />
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
                                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
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
                                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
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

                          <div className={`${styles.roh_Vehicle_detailsInner_contentRight}`}>
                            <div className="roh_left_slide_wrap">
                              <div className={`${styles.roh_left_slide_inner}`}>
                                <div className={`${styles.roh_sidebar_pricing}`}>
                                  {/* <h2><sup><span>Starting </span></sup> ₹{item.price_per_day}<span>/Per Day</span></h2> */}
                                  <h3><sup><span>Starting </span></sup>₹200
                                    <span>&nbsp;/Per Day</span>
                                  </h3>

                                  <div className={`${styles.roh_productPrice}`}>
                                    <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                      <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                        <span>Per/Week:</span>
                                      </div>
                                      <span className="text-dark fw-medium">₹2000</span>
                                    </div>
                                    <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                      <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                        <span>Per/Month:</span>
                                      </div>
                                      <span className="text-dark fw-medium">₹20000</span>
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
