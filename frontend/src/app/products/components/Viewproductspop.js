"use client";
import { useState, useEffect, useRef } from "react";
import '../../globals.css';
import styles from "./view.module.css";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { LuWallet, LuCircleCheckBig, LuMapPin, LuPhone, LuCalendarDays, LuThumbsUp, LuFuel, LuArmchair, LuGauge, LuSettings2, LuPalette, LuCar, LuX, LuChevronDown, LuShare2, LuHeart, LuStore, LuShieldCheck, LuShieldPlus, LuCheck } from "react-icons/lu";
import ArrowrightIcon from '../../../../public/arrow.svg';
import WhatsappIcon from '../../../../public/whatsapp.svg';
import StarIcon from '../../../../public/star.svg';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function Viewproductspop({ triggerId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [parsedAuthUserData, setParsedAuthUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const abortRef = useRef(null);
  const [openSection, setOpenSection] = useState("vendor");

const toggleSection = (section) => {
  setOpenSection(openSection === section ? null : section);
};

  const getCookie = (name) => {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const getCurrentUrl = () => {
    if (typeof window !== "undefined") return window.location.href;
    return "/";
  };

  /** Validate JWT + role (optional) */
  const getValidSession = () => {
    try {
      const authUserRaw = getCookie("authUser");
      const token =
        getCookie("token") ||
        getCookie("authToken") ||
        getCookie("accessToken");

      const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
      if (!token || !authUser) return { isValid: false, authUser: null };

      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (!decoded?.exp || decoded.exp <= now) {
        return { isValid: false, authUser: null };
      }

      // Optional: role-based gating (example)
      // if (authUser.role_id !== 1) return { isValid: false, authUser: null };

      return { isValid: true, authUser };
    } catch (e) {
      return { isValid: false, authUser: null };
    }
  };

  /** Body scroll lock while modal open */
  useEffect(() => {
    if (!triggerId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [triggerId]);

  // Fetch item (+ conditionally fetch service provider info on valid token)
  useEffect(() => {
    const { isValid, authUser } = getValidSession();
    setIsAuthenticated(isValid);
    setParsedAuthUserData(authUser || null);

    if (!triggerId) return;

    setLoading(true);
    setItem(null);
    setServiceProvider(null);

    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const res = await fetch(
          `${ROH_PUBLIC_API_BASE_URL}/viewsingleitem/${triggerId}`,
          {
            method: "GET",
            signal: ac.signal,
          }
        );

        const data = await res.json();
        setItem(data);

        if (isValid && data?.service_provider_id) {
          const res2 = await fetch(
            `${API_BASE_URL}/getserviceprovideinfo`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                service_provider_id: data.service_provider_id,
              }),
              signal: ac.signal,
            }
          );
          const data2 = await res2.json();
          setServiceProvider(data2);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching item:", err);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [triggerId]);
const [selectedIndex, setSelectedIndex] = useState(0);

  // === Slider Logic ===
  const [currentIndex, setCurrentIndex] = useState(0);

  // Move to next image
  const handleNext = () => {
    if (!item?.media_gallery) return;
    setCurrentIndex((prev) => (prev + 1) % item.media_gallery.length);
  };

  // Move to previous image
  const handlePrev = () => {
    if (!item?.media_gallery) return;
    setCurrentIndex((prev) =>
      prev === 0 ? item.media_gallery.length - 1 : prev - 1
    );
  };

  // Auto-slide every 3.5s
  useEffect(() => {
    if (!item?.media_gallery || item.media_gallery.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % item.media_gallery.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [item?.media_gallery]);

  // const handleViewContact = async () => {
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
  //           item_id: item.id,
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
    // 1. GUARD: Prevent execution if already visible or currently fetching
    // This stops the second call from hitting the database
    if (showContact || loadingContact) return;

    const authUserRaw = getCookie("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;

    try {
      // 2. SET LOADING IMMEDIATELY
      // The next rapid click will now be caught by the Guard above
      setLoadingContact(true);

      const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/view-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: authUser?.id,
          item_id: item.id,
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
      // 3. RELEASE LOADING
      setLoadingContact(false);
    }
  };

  /** Pop up back functionality start Codec by Vishnu Jan 05 2025 */
  /** Push fake history state when popup opens */
  useEffect(() => {
    if (!triggerId) return;

    window.history.pushState(
      { rohModal: true },
      '',
      window.location.href
    );
  }, [triggerId]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (triggerId) {
        onClose?.();
        window.history.pushState(null, '', window.location.href);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape" && triggerId) {
        onClose?.();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [triggerId, onClose]);

  /** Pop up back functionality end Codec by Vishnu Jan 05 2025 */


  if (!triggerId) return null;

  return (
    <>
      <div className={`${styles.modalOverlay} ${styles.active}`} role="dialog" aria-modal="true" onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {/* <button className={styles.closeBtn} onClick={onClose} aria-label="Close">Close <LuX size={20} /></button> */}
          {/* CLOSE */}
          <div className={styles.roh_pop_header}>
          <h2 className={styles.roh_pop_title}>Product Details</h2>
         <button className={styles.closeBtn} onClick={onClose}> ✕</button>
          </div>

          {/* Loading */}
          {loading && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner}></div>
              <span className={styles.loadingText}>Loading…</span>
            </div>
          )}

          {/* Item view */}
          {!loading && item && (
            <>
            <div className={styles.roh_popupInner}>
            <div className={styles.popupContainer}>
              {/* LEFT - IMAGE */}
              <div className={styles.leftSection}>
                {item?.media_gallery?.length > 0 && (
                  <>
                    <div className={styles.mainImageWrap}>
                      <img
                        src={`${WEB_BASE_URL}${item.media_gallery[selectedIndex].file_path}${item.media_gallery[selectedIndex].file_name}`}
                        className={styles.mainImage}
                      />
                    </div>

                    {item?.media_gallery?.length > 1 && (
                      <div className={styles.thumbRow}>
                        {item.media_gallery.slice(0, 4).map((img, i) => (
                          <img
                            key={img.id}
                            src={`${WEB_BASE_URL}${img.file_path}${img.file_name}`}
                            className={`${styles.thumb} ${selectedIndex === i ? styles.activeThumb : ""}`}
                            onClick={() => setSelectedIndex(i)}
                          />
                        ))}
                      </div>
                    )}
                    </>
                  )}

            {/* Boking Guidelines info  */}
                  <div className={`${styles.roh_booking_guied_info} d-none d-sm-block`}>
                    <h3 className="border-bottom mt-0 mb-3 pb-2">Things to Know Before Booking</h3>
                    <ol className={styles.roh_number_list}>
                      <li><strong>Carry valid ID & license:</strong> Required at pickup for verification.</li>
                      <li><strong>Security deposit may apply:</strong> Refundable after vehicle inspection.</li>
                      <li><strong>Check fuel & usage policy: </strong>Confirm fuel type and km limits with the provider.</li>
                      <li><strong>Inspect the vehicle before starting: </strong>Note any existing damage to avoid disputes.</li>
                      <li><strong>Understand pickup & return timing: </strong>Late returns may incur extra charges.</li>
                      <li><strong>Follow local traffic rules:</strong> Fines or violations are the renter’s responsibility.</li>
                    </ol>
                      
                  </div>
              </div>

              {/* RIGHT - DETAILS */}
              <div className={styles.rightSection}>
                <div className={`${styles.roh_items_name} d-flex flex-row align-items-start gap-2 justify-content-between`}>
                  <h2 data-wow-duration="2s" className="m-0">{item.item_name}</h2>
                  <div className={`d-flex align-items-center ${styles.roh_feets_data_list} ${styles.roh_item_availability}`}>
                      <LuCircleCheckBig size={14} color="#fff"/>
                    <span className="fw-semibold" >{item.availability_status}</span>                      
                    </div>
                </div>
                  <div className={`${styles.roh_sidebar_pricing}`}>
                    {/* <h2><sup><span>Starting </span></sup> ₹{item.price_per_day}<span>/Per Day</span></h2> */}
                    {/* <span>Starting from </span> */}
                    <span className="fw-medium text-muted user-select-none text-uppercase" style={{fontSize:"12px"}}>Rental Rate</span>
                      {item?.price_per_day && Number(item.price_per_day) > 0 ? (
                        <h2 className="m-0">
                          ₹{Number(item.price_per_day).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          <span>&nbsp;/Day</span>
                        </h2>
                      ) : (
                        <h5 className={styles.priceMuted}>
                          Contact vendor for price
                        </h5>
                    )}
                  
                  {/* <div className={`d-flex justify-content-start gap-2  align-items-center text-dark ${styles.roh_content_layer} ${styles.roh_item_availability}`}>
                    <div className={`d-flex align-items-center gap-2 ${styles.roh_feets_data_list}`}>
                      <LuCircleCheckBig size={14} color="#10B981"/>
                    <span className="fw-semibold" >{item.availability_status}</span>                      
                    </div>
                  </div> */}
                  
                </div>
                  <div className={styles.roh_other_details}>

                     <div className={`media ${styles.roh_media}`}>
                        <div className="media_imgbox">
                          <div className={`${styles.roh_back_circle}`}>
                            <LuMapPin size={20}/>
                          </div>
                        </div>
                        <div className="media-body">
                          <h5 className={`${styles.roh_media_title} mb-1`}>Location</h5>
                          <p className="global_heading media_desc gray_global_heading pb-0 mb-0">{item.street_address || "No address available"}</p>
                        </div>
                    </div>
                     <div className={`media ${styles.roh_media} mt-3`}>
                        <div className="media_imgbox">
                          <div className={`${styles.roh_back_circle}`}>
                            <LuStore size={20}/>
                          </div>
                        </div>
                        <div className="media-body">
                          <h5 className={`${styles.roh_media_title} mb-1`}>{item?.business_name}</h5>
                          <span style={{color:"#6B7280", fontSize: "14px"}}><LuShieldCheck size={16}/> Verified Rental Provider</span>
                          {/* <p style={{marginBottom:"8px"}}>Active Since: {item.business_created_at}</p> */}
                            <a className={styles.roh_vendor_view_profileBtn} href={`/rental-service-provider/${item.business_slug}`} target="_blank" rel="noopener">View Profile</a>
                        </div>
                    </div>

                      <div className={styles.accordionWrap}>
                      {/* SECURITY */}
                      <div className={styles.accordionItem}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => toggleSection("security")} >
                          <span className="d-flex gap-2 justify-content-start align-items-center"><LuShieldPlus size={16}/>Security Deposit</span>
                          <span className={`${styles.arrow} ${openSection === "security" ? styles.rotate : ""}`}>
                            <LuChevronDown size={18} />
                          </span>
                        </div>

                        {openSection === "security" && (
                          <div className={`${styles.accordionBody}`}>
                            <span className="fw-semibold">₹{Number(item?.security_deposit || 0).toLocaleString("en-IN")}</span>
                          </div>
                        )}
                      </div>
                    </div>                   
                  </div>  
                  
                  {/* Item other info  */}
                  <div className={styles.roh_items_other_info}>
                    <h3 className="mt-0 mb-2">Overview</h3>
                    <div className={styles.roh_items_other_info_grid}>
                      {item.engine_type && (
                      <div className={styles.roh_info_box}>
                        <LuFuel size={20} color="#6B7280"/>
                         <span className="text-uppercase" style={{fontSize:"12px", color: "#6B7280", fontWeight: "500", lineHeight:"1em"}}>Fuel</span>
                        <span className="fw-semibold" style={{lineHeight:"1em"}}>{item.engine_type}</span>
                      </div>
                      )}

                        {item.transmission_type && (
                      <div className={styles.roh_info_box}>
                        <LuSettings2 size={20} color="#6B7280"/>
                        <span className="text-uppercase" style={{fontSize:"12px", color: "#6B7280", fontWeight: "500", lineHeight:"1em"}}>Transmission</span>
                        <span className="fw-semibold" style={{lineHeight:"1em"}}>{item.transmission_type}</span>
                      </div>
                        )}

                          {item.mileage && (
                          <div className={styles.roh_info_box}>
                            <LuGauge size={20} color="#6B7280"/>
                             <span className="text-uppercase" style={{fontSize:"12px", color: "#6B7280", fontWeight: "500", lineHeight:"1em"}}>Mileage</span>
                            <span className="fw-semibold" style={{lineHeight:"1em"}}>{item.mileage ?? "N/A"} kmpl</span>
                          </div>
                          )}   
                        {item.vehicle_condition && (
                              
                        <div className={styles.roh_info_box}>
                          <LuCar size={20} color="#6B7280"/>
                           <span className="text-uppercase" style={{fontSize:"12px", color: "#6B7280", fontWeight: "500", lineHeight:"1em"}}>condition</span>
                          <span className="fw-semibold" style={{lineHeight:"1em"}}>{item.vehicle_condition}</span>
                        </div>
                          )} 
                        </div>                

                  </div>   
                   {/* Boking Guidelines info  */}
                  <div className={`${styles.roh_booking_guied_info} d-block d-sm-none bg-gey border`}>
                    <h3 className="border-bottom mt-0 mb-3 pb-2">Things to Know Before Booking</h3>
                     <ol className={styles.roh_number_list}>
                      <li><strong>Carry valid ID & license:</strong> Required at pickup for verification.</li>
                      <li><strong>Security deposit may apply:</strong> Refundable after vehicle inspection.</li>
                      <li><strong>Check fuel & usage policy: </strong>Confirm fuel type and km limits with the provider.</li>
                      <li><strong>Inspect the vehicle before starting: </strong>Note any existing damage to avoid disputes.</li>
                      <li><strong>Understand pickup & return timing: </strong>Late returns may incur extra charges.</li>
                      <li><strong>Follow local traffic rules:</strong> Fines or violations are the renter’s responsibility.</li>
                    </ol>
                  </div>               
              </div>
            </div>
              
               
              {/* details section here */}
                      {/* Policies and agreement*/}
                        {(item.accessories || item.booking_instructions || item.booking_terms) && (
              <section className="mt-sm-4 mt-0">
                <div className={`container ${styles.roh_container}`}>
                  <div className="row">                   
                    <div className="col-12 col-md-12 col-lg-12 mt-0 mt-sm-4 mt-lg-0">                     

                      <div className={`${styles.roh_general_info_twowrap}`}>
                          
                        {(item.accessories || item.booking_instructions || item.booking_terms) && (
                          <h3  className="mb-2" style={{fontSize:"20px"}}>Rental Policies and agreement</h3>
                        )}

                        <div className={`${styles.roh_policy_terms}`}>
                          <div className="accordion" id="accordionExample">
                            {item.accessories && (
                              <div className="accordion-item">
                                <h4 className="accordion-header">
                                  <button className={`accordion-button ${styles.roh_accordion_button}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Accessories
                                  </button>
                                </h4>
                                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                  <div className="accordion-body">
                                    <p>{item.accessories}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {item.booking_terms && (
                              <div className="accordion-item">
                              <h4 className="accordion-header mt-0">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  Booking Terms
                                </button>
                              </h4>
                              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <p>{item.booking_terms}</p>
                                </div>
                              </div>
                            </div>
                            )}
                            {item.booking_instructions && (
                              <div className="accordion-item">
                              <h4 className="accordion-header mt-0">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  Booking Instructions
                                </button>
                              </h4>
                              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <p>{item.booking_instructions}</p>
                                </div>
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
                            )}
            </div>

            <div className={styles.roh_actions_wrap}>
              <div className="row align-items-center gap-2">
                <div className="col-12 col-md-12 d-flex justify-content-end gap-2 flex-wrap flex-sm-row flex-column-reverse">
                   {/* Fav and Share  */}
                      <div className={`${styles.roh_actions} d-none align-items-center gap-4 `}>
                        <div className={`${styles.roh_action} d-flex align-items-center gap-2`}>
                          <div className={styles.roh_action_icon}>
                            <LuHeart size={20} />
                          </div>
                          <div className={styles.roh_action_text}>
                            <span>Save</span>
                          </div>
                        </div>
                        <div className={`${styles.roh_action} d-flex align-items-center gap-2`}>
                          <div className={styles.roh_action_icon}>
                            <LuShare2 size={20} />
                          </div>
                          <div className={styles.roh_action_text}>
                            <span>Share</span>
                          </div>                          
                        </div>
                      </div>
                  <div className={styles.roh_btnGroup}>
                     
                      {serviceProvider ? (
                                isAuthenticated ? (
                                  // Valid token → direct contact
                                      <a className={styles.roh_contactBtn} href={`tel:${serviceProvider.phone_number}`} onClick={handleViewContact}><LuPhone size={20}/> Call Now
                                        {/* ({serviceProvider.phone_number}) */}
                                      </a>
                                ) : (
                                  // No/expired token → ask login with redirect                                 
                                      <a className={styles.roh_contactBtn} href={`/login/?redirect=${encodeURIComponent(getCurrentUrl())}`}> Contact Seller </a>                                  
                                )
                              ) : isAuthenticated ? (
                                // If service provider is still loading
                                
                                    <button disabled>Loading contact…</button>                              
                              ) : (
                                // If not authenticated and no service provider
                                    <a className={styles.roh_contactBtn} href={`/login/?redirect=${encodeURIComponent(getCurrentUrl())}`}><LuPhone size={20}/> Login to view phone number </a>
                              )}

                              {/* WhatsApp Link with Authentication Check */}
                              {isAuthenticated ? (
                                <div className={styles.roh_whatsappBtn} onClick={handleViewContact}>
                                  <a href={`https://wa.me/${serviceProvider?.phone_number}?text=Hello%20there!`}><WhatsappIcon className="roh_icon" width={20} height={20}/> WhatsApp</a>
                                </div>
                              ) : (
                                <div className={styles.roh_whatsappBtn}>
                                  <a href={`/login/?redirect=${encodeURIComponent(getCurrentUrl())}`}>
                                    <WhatsappIcon className="roh_icon" width={20} height={20}/> WhatsApp
                                  </a>
                                </div>
                              )}
                               {/* <a href={item.vendor_url} className={styles.roh_vendor_view_profileBtn} target="_blank">Check Availability</a> */}
                    </div>
                </div>
              </div>

            </div>
           
            </>
          )}
        </div>
      </div>
    </>
  );
}
