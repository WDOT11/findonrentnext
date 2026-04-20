"use client";

import "../../globals.css";
import styles from "./vehiclelist.module.css";
import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Viewproductspop from "../../products/components/Viewproductspop";
import trackItemView from "../../../utils/trackItemView";
import {
  LuUser,
  LuCircleCheckBig,
  LuMapPin,
  LuBadgePercent,
  LuHandshake,
  LuShieldCheck,
  LuChevronDown,
  LuSearch,
  LuStore,
  LuArrowLeft,
  LuArrowRight,
} from "react-icons/lu";
import StarIcon from "../../../../public/star.svg";
import ArrowrightIcon from "../../../../public/arrow.svg";
import { usePathname } from "next/navigation";
import ScrollToFleet from "../../globalComponents/ScrollToFleet";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

const LIMIT = 28;

function formatPriceINR(v) {
  return Number(v ?? 0).toLocaleString("en-IN");
}

export default function VehicleList({
  initialProducts,
  total,
  categorySlug,
  categorySinName,
  locSlug,
  modelSlug,
  modelName,
  modelLabel,
  cate_id,
  categoryName,
  userCity,
  popularCities
}) {
  const searchParams = useSearchParams();
  const categoryFullName = categoryName;

  /* IMPORTANT: NO STATE FOR PRODUCTS */
  const products = initialProducts || [];
  const CatModPopularCities = popularCities || [];

  const page = Number(searchParams.get("page") || 1);
  const initialQuery = searchParams.get("search_by") || "";

  // State for View Details Popup
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

  /* ------------------ City Autosuggest State ------------------ */
  const [locationValue, setLocationValue] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const cityTimerRef = useRef(null);
  const [targetLocationSlug, setTargetLocationSlug] = useState(locSlug || "");

  const pathname = usePathname();

  const totalPages = useMemo(
    () => Math.ceil((total || 0) / LIMIT) || 1,
    [total]
  );

  /* ------------------ City API (Logic from File 1) ------------------ */
  const fetchCities = async (keyword) => {
    try {
      // Using the exact endpoint from your working file
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
    setTargetLocationSlug(""); // Reset slug if user types manually

    if (!value.trim()) {
      setShowCityDropdown(false);
      setCityLoading(false);
      setCityResults([]);
      return;
    }

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
    setTargetLocationSlug(city.slug);
    setShowCityDropdown(false);
  };

  /* ---------------- Search Submit ---------------- */
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    // Handle Text Search
    const searchVal = document.getElementById("whatoftype")?.value?.trim();
    if (searchVal) params.set("search_by", searchVal);

    // Build Path: /Category/Model/Location
    let basePath = `/${categorySlug}`;

    if (modelSlug) {
      basePath += `/${modelSlug}`;
    }

    // Append Location if selected
    if (targetLocationSlug) {
      basePath += `/${targetLocationSlug}`;
    }

    const finalUrl = params.toString()
      ? `${basePath}?${params.toString()}`
      : basePath;

    window.location.href = finalUrl;
  };

  /* ---------------- Pagination URL ---------------- */
  const buildUrl = (newPage) => {
    const qp = new URLSearchParams();

    if (initialQuery) qp.set("search_by", initialQuery);
    qp.set("page", String(newPage));

    let basePath = `/${categorySlug}`;
    if (modelSlug) basePath += `/${modelSlug}`;
    if (locSlug) basePath += `/${locSlug}`; // Use prop locSlug for pagination links

    return qp.toString() ? `${basePath}?${qp.toString()}` : basePath;
  };

  const renderCategoryLocationBreadcrumb = (categorySlug, locationSlug, categoryFullName) => {
    const cleanLocationSlug = locationSlug && locationSlug.includes("/")
    ? locationSlug.split("/").pop()
    : locationSlug;

  const readableCategory = categorySlug
    ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const readableLocation = cleanLocationSlug
    ? cleanLocationSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

    return (
      <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
        <ol className={styles.breadcrumbList}>
          <li>
            <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
          </li>

          <li className={styles.separator}>›</li>
          <li>
            <a href={`${WEB_BASE_DOMAIN_URL}/${categorySlug}`}>{categoryFullName}</a>
          </li>

          <li className={styles.separator}>›</li>
          <li aria-current="page">{modelLabel || modelName}</li>
        </ol>
      </nav>
    );
  };

  const gridClass = products.length === 1 ? "roh-single_grid": products.length === 2 ? "roh-double_grid": products.length === 3? "roh-triple_grid": "roh_vehicleslisting_grid";

  /* ---------------- RENDER ---------------- */
  return (
    <section className={styles.hero_wrap} aria-label={`${categorySinName.replace(/-/g, " ")} rentals.`}>
      <div className={styles.hero_section} style={{ position: "relative", minHeight: "auto", overflow: "hidden" }}>
        <Image
          src="/images/homepg/bg-img-3.svg" alt="" fill
          priority={true}
          style={{ objectFit: "cover", zIndex: -1 }}>
        </Image>
        <div className={`container ${styles.hero_container}`}>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className={styles.main_heading}>
                <h1 className="mb-0 mb-sm-3">{`${modelLabel || modelName} on Rent`}</h1>
                {/* Breadcrumb here */}
                {renderCategoryLocationBreadcrumb(categorySlug, modelSlug, categoryFullName)}
              </div>
            </div>

            {/* Search Bar */}
            <div className="col-12">
              <div className={`container ${styles.custom_searchbar_wrap}`}>
                <div className={styles.custom_searchbar}>
                  <form className="w-100" onSubmit={handleSearchSubmit} aria-label={`Search ${categorySinName.replace(/-/g, " ")} rentals`}>
                    <input type="hidden" name="page" value="1" />

                    {/* === Filters === */}
                    <div className={`row ${styles.roh_filtter_top_bar}`}>

                      {/* Location Filter (Replaces Category & Brand) */}
                      <div className={`col-12 ${styles.roh_fiiters} px-0`}>
                        <div className={`form-group w-100 h-100 ${styles.roh_form_group}`}>
                          <label htmlFor="location" className={`${styles.loc_block_inner}`}>
                            City
                          </label>
                          <div className={styles.roh_location_in_wrap_search}>
                          <div className={`${styles.location_in_wrap} pe-0 pe-md-3 w-100`}>
                            <input
                              id="location"
                              type="search"
                              className={`w-100 ${styles.roh_locationInput}`}
                              placeholder="Enter your destination..."
                              value={locationValue}
                              name="location"
                              onChange={handleLocationChange}
                              autoComplete="off"
                              aria-label="Search by city"
                              style={{ border: "none", outline: "none" }}
                            />
                            <LuMapPin size={18} style={{ color: "#6b7280" }} aria-hidden="true"/>

                            {/* City Dropdown */}
                            {showCityDropdown && (
                              <ul className={styles.city_dropdown} aria-label="City search suggestions"
                                style={{
                                  top: "100%",
                                  left: 0,
                                  width: "100%",
                                  zIndex: 1000,
                                }}
                              >
                                {cityLoading && (
                                  <li className={styles.city_info}>
                                    <img src="/images/loader.gif" alt="Loading" className={styles.dropdown_loader_img}/>
                                    <span>Searching…</span>
                                  </li>
                                )}
                                {!cityLoading &&
                                  cityResults.map((city, i) => (
                                    <li key={i} onClick={() => handleCitySelect(city)} aria-label={`Select city ${city.cat_singular_name}`}>
                                      {city.cat_singular_name}
                                    </li>
                                  ))
                                }

                                {!cityLoading && cityResults.length === 0 && (
                                  <li className={styles.city_info}>
                                    No city found
                                  </li>
                                )}
                              </ul>
                            )}
                            </div>
                            <div className={`${styles.roh_searchinput_btn_wrapper}`}>
                              <div className={styles.rent_search_btn}>
                                <button className="button theme-btn-new" type="submit" aria-label="Search rental listings">
                                  Search{" "}
                                  <LuSearch size={18} aria-hidden="true" />
                                </button>
                                <a href={pathname} className={`${styles.roh_search_clearBtn}`} type="clear" aria-label="Clear search filters">
                                  Clear
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-12 d-sm-block d-none">
                <div className="bottom_title">
                  <ul className={styles.list_bottom}>
                    <li>
                      <span style={{ color: "#ff3600" }}>
                        <LuBadgePercent size={20} />
                      </span>{" "}
                      Zero Commission
                    </li>
                    <li>
                      <span style={{ color: "#ff3600" }}>
                        <LuHandshake size={20} />
                      </span>{" "}
                      Direct Vendor Bookings
                    </li>
                    <li>
                      <span style={{ color: "#ff3600" }}>
                        <LuShieldCheck size={20} />
                      </span>{" "}
                      Hassle-free Rentals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className={styles.fleetswrap_inner}>
        <div className={styles.fleets_wrap_main}>
          <div className="d-flex justify-content-center align-items-center">
            <div className={styles.star_box}>
              <div className="d-flex align-items-center gap-1">
                <StarIcon className="roh_icon" width={20} height={20} />
                <span className="roh_star_title">Our Fleets</span>
              </div>
            </div>
          </div>

          {/* scroll to top */}
          <ScrollToFleet />
          
          <h3 id="fleet-heading" className="roh_section_title_h3 text-center">
            <span>{`Explore our perfect and`}</span>
            <br />
            <span>
              {`extensive fleet of ${modelLabel || modelSlug} ${categoryFullName}`}
            </span>
          </h3>

          <div className="container px-2 px-md-3 px-lg-3 position-relative mt-4 mt-lg-5">
            <div className="row d-flex justify-content-start g-3">
              <div className={styles[gridClass]} aria-label="Rental items list">
                {products.map((p) => (
                  <div key={p.id} className={`card ${styles.fleetscard} h-100`} role="button" tabIndex={0} aria-label={`View details for ${p?.item_name}`}
                    onClick={() => {
                      trackItemView(p.id);
                      setSelectedId(p.id);
                    }}
                  >
                    <div className={styles.roh_cardImgWrapper}>
                      <Image
                        src={p?.media_gallery?.[0] ? `${WEB_BASE_URL}${p.media_gallery[0].file_path}${p.media_gallery[0].file_name}` : "/iteams-deafault-img.webp"}
                        alt={p?.item_name || "Item image"} width={600} height={360} className={`card-img-top ${styles.cardImg}`} sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      {/* show transmission type (Automatic or Manual) */}
                      {[2, 10].includes(cate_id) && p?.transmission_type && (
                        <span className={styles.roh_car_type}>
                          {p.transmission_type}
                        </span>
                      )}
                    </div>
                    {categorySlug === "cars-with-driver" && (
                      <div className={styles.roh_cwd_label}>
                        <LuUser size={14} aria-hidden="true" />{" "}
                        <span>Car With Driver</span>
                      </div>
                    )}
                    <div className={`card-body d-flex flex-column pt-2 pt-lg-3 ${styles.cardBody}`}>
                      <div>
                        <h2 className={`${styles.feets_cardH}`}>
                          {p?.brand_name?.toLowerCase() !== "other" && `${p?.brand_name} `} {p?.item_name}
                        </h2>
                      </div>

                      {/* <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`} >
                        <div className={styles.roh_feets_data_list}>
                          <div>
                            <LuMapPin size={18} style={{ color: "#9CA3AF" }} aria-hidden="true"/>
                          </div>
                          <span>
                            {p?.address_1 ? `${p.address_1}, ${p?.city ?? "-"}` : p?.city ?? "-"}
                          </span>
                        </div>
                      </div> */}
                      <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`}>
                        <div className={styles.roh_feets_data_list}>
                          <div>
                            <LuMapPin size={18} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                          </div>

                          <span className="text-capitalize">
                            {p?.address_1 && `${p.address_1}, `}
                            <span
                              className={
                                p?.city?.toLowerCase() === userCity?.toLowerCase()
                                  ? styles.cityHighlight
                                  : ""
                              }
                            >
                              {p?.city ?? "-"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`} >
                        <div className={`${styles.roh_feets_data_list} ${
                            p?.availability_status === "Available"
                              ? styles.status_available
                              : p?.availability_status === "Rented"
                              ? styles.status_rented
                              : styles.status_default
                          }`}
                        >
                          <div>
                            <LuCircleCheckBig size={18} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                          </div>
                          <span>
                            {p?.availability_status === "Rented"? "Rented(Not Available)": p?.availability_status ?? "-"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2 mb-lg-3`}
                      >
                        <div className={styles.roh_feets_data_list}>
                          <div>
                            <LuStore size={18} style={{ color: "#9CA3AF" }} aria-hidden="true"/>
                          </div>
                          <a
                            href={
                              WEB_BASE_DOMAIN_URL +
                              `/rental-service-provider/${p?.business_slug}`
                            }
                            target="_blank"
                            rel="noopener"
                            className={styles.roh_vendor_link}
                            aria-label={`View rental provider ${p?.business_name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <span>
                              {p?.business_name ? `${p.business_name}` : "-"}
                            </span>
                          </a>
                        </div>
                      </div>

                       <div className={`d-flex flex-wrap justify-content-between align-items-center mt-auto pt-2 ${styles.roh_cardFooter}`} style={{ borderTop: "1px dashed #E5E7EB" }}>
                            { p?.price_per_day && Number(p.price_per_day) > 0 && (
                          <div className={styles.roh_cardFooter_price}>
                              <>
                                <span className={styles.priceStrong}>
                                  ₹{formatPriceINR(p.price_per_day)}
                                </span>
                                <span className={styles.priceMuted}> /Day</span>
                              </>
                          </div>
                            )
                          }

                        {/* <button
                          type="button"
                          className={styles.ctaBtn}
                          aria-label={`View details for ${p?.item_name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            trackItemView(p.id);
                            setSelectedId(p.id);
                          }}
                        >
                          <ArrowrightIcon
                            className="roh_icon"
                            width={18}
                            height={18}
                            aria-hidden="true"
                          />
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

              {products.length === 0 && (
                <div className="col-12">
                  <p className="text-center text-muted m-0">
                    No products found.
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div
                className={`${styles.rohproducts_pagination} d-flex justify-content-center mt-sm-5 mt-4 gap-2 flex-wrap`}
              >
                {/* Prev */}
                {page > 1 && (
                  <a
                    href={buildUrl(page - 1)}
                    className={styles.rohproducts_btn_page}
                    aria-label="Go to previous page"
                  >
                    <LuArrowLeft size={20} />
                  </a>
                )}

                {(() => {
                  const pages = [];
                  const delta = 2;

                  const range = [];
                  for (
                    let i = Math.max(2, page - delta);
                    i <= Math.min(totalPages - 1, page + delta);
                    i++
                  ) {
                    range.push(i);
                  }

                  pages.push(1);

                  if (page - delta > 2) {
                    pages.push("...");
                  }

                  pages.push(...range);

                  if (page + delta < totalPages - 1) {
                    pages.push("...");
                  }

                  if (totalPages > 1) {
                    pages.push(totalPages);
                  }

                  return pages.map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className={styles.pagination_dots}
                        >
                          …
                        </span>
                      );
                    }

                    return (
                      <a
                        key={p}
                        href={buildUrl(p)}
                        aria-label={`Go to page ${p}`}
                        className={`${styles.rohproducts_btn_page} ${
                          page === p
                            ? styles.rohproducts_btn_active
                            : styles.rohproducts_btn_inactive
                        }`}
                      >
                        {p}
                      </a>
                    );
                  });
                })()}

                {/* Next */}
                {page < totalPages && (
                  <a
                    href={buildUrl(page + 1)}
                    className={styles.rohproducts_btn_page}
                    aria-label="Go to next page"
                  >
                    <LuArrowRight size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {CatModPopularCities?.length > 0 && (
          <div className={styles.roh_seo_links_section}>
            <h4 className="mt-0 mb-2 mb-sm-3">Popular Cities</h4>

            <div className={styles.roh_seo_links_block}>
              {CatModPopularCities.map((city) => {
                const link = `${WEB_BASE_DOMAIN_URL}/${categorySlug}/${modelSlug}/${city.location_slug}`;

                const modelText = modelLabel || modelName;

                const displayText = `Rent a ${modelText} in ${city.location_name}`;

                return (
                  <a
                    className="d-flex align-items-center gap-1"
                    href={link}
                    key={city.location_slug}
                    aria-label={displayText}
                    title={displayText}
                  >
                    <LuMapPin size={12} color="#ff3600" />
                    {displayText}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedId !== null && (
        <Viewproductspop
          triggerId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}