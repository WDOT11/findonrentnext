"use client";
import styles from "./vendorsList.module.css"
import ArrowrightIcon from "../../../../public/arrow.svg";
import CarIcon from "../../../../public/arrow.svg";
import "../../blog/[slug]/singleblog.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuMapPin, LuLayers, LuArrowRight, LuPhoneCall,  } from "react-icons/lu";

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function VendorsList({ loc_slug, cate_id, categorySinName }) {

  const [rentalProviders, setRentalProviders] = useState([]);
  const [limit, setLimit] = useState(8);
  const locationSlug = loc_slug;
  const categoryId = cate_id;

  /* ------------------------------------------------
    FETCH RENTAL PROVIDERS BY CITY
  ------------------------------------------------ */
  useEffect(() => {
    if (!locationSlug) return;

    (async () => {
      try {

        const res = await fetch(
          `${ROH_PUBLIC_API_BASE_URL}/getVendorsByLocOrCat?limit=${limit}&categoryId=${categoryId}&locationSlug=${locationSlug}`
        );
        const json = await res.json();
        setRentalProviders(Array.isArray(json.vendors) ? json.vendors : []);
      } catch (err) {
        console.error(err);
        setRentalProviders([]);
      }
    })();
  }, [locationSlug, limit, categoryId]);

  const cityName = rentalProviders.length > 0 ? rentalProviders[0].city : "";
  const citySlug = rentalProviders.length > 0 ? rentalProviders[0].city?.toLowerCase().replace(/\s+/g, "-") : "";
  const stateName = rentalProviders.length > 0 ? rentalProviders[0].state : "";

  const { slug } = useParams();

  const createRipple = (e) => {
    const target = e.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add(style.ripple);
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 60;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    target.appendChild(ripple);
    requestAnimationFrame(() =>
      ripple.classList.add(style.ripple_effect)
    );
    setTimeout(() => ripple.remove(), 700);
  };

  const getServicesText = (categories = []) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return "N/A";
    }

    return categories
      .map(cat => cat.sub_category_name)
      .filter(Boolean)
      .join(", ");
  };

  const formatCityName = (city = "") => {
    if (!city) return "";
    return city.toString().toLowerCase().split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const displayCityName = formatCityName(cityName);
  const displayStateName = formatCityName(stateName);

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

  const decodeHtml = (html) => {
    if (typeof window === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const gridClass = rentalProviders.length === 1 ? "roh-single_grid": rentalProviders.length === 2 ? "roh-double_grid": rentalProviders.length === 3? "roh-triple_grid": "roh_providers_grid";

  return (
    <>
      {rentalProviders && rentalProviders.length > 0 && (
        <div className={`${styles.roh_provider_section_wrapper}`}  aria-label={`Top rated ${categorySinName} rental providers in ${displayCityName}`}>
          <div className={styles.roh_section_header}>
            <h2 className="mt-0">
              {`Top rated ${categorySinName} rental providers in ${displayCityName}`}
            </h2>
            <p>Trusted local rental providers based on ratings and availability</p>
          </div>

          {/* <div className={styles.roh_providers_grid}> */}
          <div className={styles[gridClass]}>
            {rentalProviders.map((vendor) => (
              <div key={vendor.user_id} className={styles.roh_provider_card} aria-label={`Rental provider ${vendor.business_name} in ${displayCityName}`}>
                <div className={styles.roh_provider_card_top}>
                  <div className={styles.roh_provider_card_info}>
                    <div className="d-flex align-items-start justify-content-between">
                      <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${vendor.business_slug}`} target="_blank" rel="noopener" aria-label={`View details of ${vendor.business_name}`}>
                        <h2>{vendor.business_name}</h2>
                      </a>
                      {vendor.is_verified == 1 && (
                        <span className={styles.roh_provider_badge} aria-label="Verified rental provider">
                          <img src="/verified.svg" alt="Verified" />
                        </span>
                      )}
                    </div>
                    <p className={styles.roh_provider_card_desc}>
                      {vendor.business_description ? (
                        vendor.business_description
                      ) : (
                        <>
                          {vendor.business_name} is a trusted rental service provider based in {displayCityName}, {displayStateName}, offering reliable and affordable rental solutions.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className={styles.roh_provider_card_body}>
                  <div className={styles.roh_meta_item}>
                    <span className={styles.roh_meta_label}><LuMapPin size={16} aria-hidden="true"/> Location</span>
                    <span className={styles.roh_meta_value}>{vendor.locationName}, {displayStateName}</span>
                  </div>
                  <div className={styles.roh_meta_item}>
                    <span className={styles.roh_meta_label}><LuLayers size={16} aria-hidden="true"/> Services</span>
                    <span className={styles.roh_meta_value}>{getServicesText(vendor.categories)}</span>
                  </div>

                  <div className={`${styles.roh_meta_item} ${styles.roh_meta_itemPricewrap}`}>
                    <span className={styles.roh_meta_label}>Starting From</span>
                    {vendor.min_price_per_day ? (
                      <span className={styles.roh_price_tag}>
                        ₹{vendor.min_price_per_day}
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#97999c" }}> /Day</span>
                      </span>
                    ) : (
                      <a className={styles.roh_call_for_price} href={`/rental-service-provider/${vendor.business_slug}`} target="_blank" rel="noopener" aria-label={`Call ${vendor.business_name} for rental pricing`}>
                        <span><LuPhoneCall size={18} style={{ color: "#ff3600" }} aria-hidden="true"/></span> Call For Price
                      </a>
                    )}
                  </div>
                </div>

                <div className={styles.roh_provider_card_footer}>
                  <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${vendor.business_slug}`} className={styles.roh_btn_card_secondary} target="_blank" rel="noopener" aria-label={`View rental provider ${vendor.business_name}`}>
                    View Provider
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.roh_view_all_container}>
            <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-providers?city=${citySlug}`} className={styles.roh_btn_view_all} aria-label={`View all rental providers in ${displayCityName}`}>
              View All Rental Providers in {displayCityName}
              <LuArrowRight size={16} aria-hidden="true"/>
            </a>
          </div>
        </div>
      )}
    </>
  );
}