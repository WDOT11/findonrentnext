"use client";

import "../../../globals.css";
import styles from "./cars.module.css";
import { useMemo, useState, useRef, useLayoutEffect} from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Viewproductspop from "../../../products/components/Viewproductspop";
import trackItemView from "../../../../utils/trackItemView";
import { LuBadgePercent, LuHandshake, LuShieldCheck } from "react-icons/lu";

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

const LIMIT = 28;

function formatPriceINR(v) {
  return Number(v ?? 0).toLocaleString("en-IN");
}

export default function Vehiclescars({
  initialProducts,
  total,
  brands,
  tags,
}) {
  const searchParams = useSearchParams();
  const [products] = useState(initialProducts || []);


  const page = Number(searchParams.get("page") || 1);
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialBrand = searchParams.get("brand_slug") || "";
  const initialTag = searchParams.get("tag_slug") || "";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedTag, setSelectedTag] = useState(initialTag);
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

  /* ------------------ City Autosuggest ------------------ */
  const [locationValue, setLocationValue] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const cityTimerRef = useRef(null);
  const [locationSlug, setLocationSlug] = useState("");

  const [visible, setVisible] = useState(false);


  const pathname =
  typeof window !== "undefined" ? window.location.pathname : "";

  // /services/vehicles/cars → cars
  const categoryMainSlug = pathname.split("/").filter(Boolean).pop();


  const totalPages = useMemo(
    () => Math.ceil((total || 0) / LIMIT) || 1,
    [total]
  );

  /* ---------------- Pagination URL ---------------- */
  const buildUrl = (newPage) => {
    const qp = new URLSearchParams();

    if (initialQuery) qp.set("q", initialQuery);
    if (selectedBrand) qp.set("brand_slug", selectedBrand);
    if (selectedTag) qp.set("tag_slug", selectedTag);

    qp.set("page", String(newPage));

    let basePath = `/${categoryMainSlug}`;
    if (initialLocation) {
      basePath += `/${initialLocation}`;
    }

    return `${basePath}?${qp.toString()}`;
  };


      /* ------------------ City API (typing only) ------------------ */
  const fetchCities = async (keyword) => {
    if (!keyword.trim()) {
      setCityResults([]);
      setShowCityDropdown(false);
      return;
    }

    try {
      setCityLoading(true);
      const res = await fetch(`${API_BASE_URL}/getallactivecity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const json = await res.json();
      if (json.success) {
        setCityResults(json.data);
        setShowCityDropdown(true);
      } else {
        setCityResults([]);
      }
    } catch (err) {
      console.error("City search error:", err);
    } finally {
      setCityLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationValue(value);
    setLocationSlug(""); //reset slug if user types manually

    if (cityTimerRef.current) {
      clearTimeout(cityTimerRef.current);
    }

    cityTimerRef.current = setTimeout(() => {
      fetchCities(value);
    }, 400);
  };


  const handleCitySelect = (city) => {
    setLocationValue(city.city_name);
    setLocationSlug(city.city_slug);
    setShowCityDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (selectedBrand) params.set("brand_slug", selectedBrand);
    if (selectedTag) params.set("tag_slug", selectedTag);

    const searchVal = document.getElementById("whatoftype")?.value?.trim();
    if (searchVal) params.set("q", searchVal);

    params.set("page", "1"); // reset page on new search

    // Build base path
    let basePath = `/${categoryMainSlug}`;

    // Location slug path me
    if (locationSlug) {
      basePath += `/${locationSlug}`;
    }

    const finalUrl = params.toString()
      ? `${basePath}?${params.toString()}`
      : basePath;

    window.location.href = finalUrl;
  };

  // layout-safe reveal
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });
  }, []);



  /* ---------------- RENDER ---------------- */
  return (
        <section className={styles.hero_wrap}>
      <div className={styles.hero_section}>
        <div className={`container ${styles.hero_container}`}>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className={styles.main_heading}>
                <h1>Cars</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="col-12">
              <div className={`container ${styles.custom_searchbar_wrap}`}>
                <div className={styles.custom_searchbar}>
                  {/*  Full Reload Form */}
                  <form className="w-100" onSubmit={handleSearchSubmit}>
                    <input type="hidden" name="page" value="1" />

                    {/* === Filters === */}
                    <div className={`row ${styles.roh_filtter_top_bar}`}>
                      {/* LOCATION */}
                        <div
                          className={`${styles.border_rightF1} ${styles.roh_fiiters}`}
                        >
                          <div className="form-group w-100">
                            <label
                              htmlFor="location"
                              className={`${styles.loc_block_inner}`}
                            >
                              Location
                            </label>
                            <div className={styles.location_in_wrap}>
                              <input
                                id="location"
                                type="search"
                                className={`w-100 ${styles.roh_locationInput}`}
                                placeholder="Enter your destination..."
                                value={locationValue}
                                name="location"
                                onChange={handleLocationChange}
                                autoComplete="off"
                              />
                              <img src="/images/homepg/pin.svg" alt="pin" />
                               {/* City Dropdown */}
                               {showCityDropdown && (
                              <ul className={styles.city_dropdown}>
                                {cityLoading && (
                                  <li className={styles.city_info}>Searching…</li>
                                )}

                                {!cityLoading &&
                                  cityResults.map((city, i) => (
                                    <li
                                      key={i}
                                      onClick={() => handleCitySelect(city)}
                                    >
                                      {city.city_name}
                                    </li>

                                  ))}

                                {!cityLoading && cityResults.length === 0 && (
                                  <li className={styles.city_info}>No city found</li>
                                )}
                              </ul>
                            )}

                            </div>
                          </div>
                        </div>



                      {/* Brand */}
                      <div
                        className={`${styles.border_rightF2} ${styles.roh_fiiters}`}
                      >
                        <div className="form-group w-100">
                          <label
                            htmlFor="brand"
                            className={`${styles.cat_block_inner}`}
                          >
                            Brand
                          </label>
                          <div className={styles.category_in_wrap}>
                            <select
                              id="brand"
                              name="brand_slug"
                              className={`text-muted w-100 ${styles.roh_brandInput}`}
                              value={selectedBrand}
                              onChange={(e) => setSelectedBrand(e.target.value)}
                            >
                              <option value="">Select Brand</option>
                              {brands.map((b) => (
                                <option key={b.id} value={b.brand_slug}>
                                  {b.brand_name}
                                </option>
                              ))}
                            </select>
                            <img
                              className="toggle-icon"
                              src="/images/homepg/down.svg"
                              alt="toggle"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tag */}
                      <div
                        className={`${styles.roh_fiiters} ${styles.roh_boder_bottumMob}`}
                      >
                        <div className="form-group w-100">
                          <label
                            htmlFor="tag"
                            className={`${styles.cat_block_inner}`}
                          >
                            Tag
                          </label>
                          <div className={styles.category_in_wrap}>
                            <select
                              id="tag"
                              name="tag_slug"
                              className="text-muted w-100"
                              value={selectedTag}
                              onChange={(e) => setSelectedTag(e.target.value)}
                            >
                              <option value="">Select Tag</option>
                              {tags.map((t) => (
                                <option key={t.id} value={t.tag_slug}>
                                  {t.tag_name}
                                </option>
                              ))}
                            </select>
                            <img
                              className="toggle-icon"
                              src="/images/homepg/down.svg"
                              alt="toggle"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Query */}
                    <div className={`row ${styles.roh_searchbar_bottom}`}>
                      <div className={`${styles.roh_searchbar_bottom_fields}`}>
                        <div className={styles.search_block_wrap}>
                          <div
                            className={`${styles.search_block_inner} rounded-pill`}
                          >
                            <label
                              className={styles.whatoftype}
                              htmlFor="whatoftype"
                            >
                              Search Rentals
                            </label>
                            <div
                              className={`${styles.roh_searchinput_btn_wrapper}`}
                            >
                              <div className={`${styles.search_wraperInput}`}>
                                <Image
                                  src="/search-icon.svg"
                                  width={25}
                                  height={25}
                                  alt="Search Input Icon"
                                />
                                <input
                                  id="whatoftype"
                                  className={`w-100 ${styles.roh_searchinput}`}
                                  type="search"
                                  name="q"
                                  placeholder="Enter something..."
                                  defaultValue={initialQuery}
                                />
                              </div>
                              <div className={styles.rent_search_btn}>
                                <button
                                  className="button theme-btn-new"
                                  type="submit"
                                >
                                  Search{" "}
                                  <Image
                                    className="toggle-icon"
                                    src="/images/assets/search.svg"
                                    alt="star icon"
                                    width={20}
                                    height={20}
                                  />
                                </button>
                                <a
                                  href="/services/vehicles/cars"
                                  className={`${styles.roh_search_clearBtn}`}
                                  type="clear"
                                >
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

              <div className="col-12">
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
                <Image
                  src="/images/homepg/star.svg"
                  alt="star icon"
                  width={20}
                  height={20}
                />
                <span className="roh_star_title">Our Fleets</span>
              </div>
            </div>
          </div>

          <h2 className={`text-center`}>
            Explore our perfect and <br /> extensive fleet
          </h2>

        {visible && (
          <div className="container px-2 px-md-3 px-lg-3 position-relative mt-4 mt-lg-5">
            <div className="row d-flex justify-content-start g-3">

              <div className={`${styles.roh_vehicleslisting_grid} fastAppear`}>
                {
                  products.map((p) => (
                    <a
                      key={p.id}
                      className={`card ${styles.fleetscard} h-100`}
                      aria-label={`View item ${p?.item_name ?? ""}`}
                      onClick={() => {
                        trackItemView(p.id);
                        setSelectedId(p.id);
                      }}
                    >

                        <Image
                          src={
                            p?.media_gallery?.[0]
                              ? `${WEB_BASE_URL}${p.media_gallery[0].file_path}${p.media_gallery[0].file_name}`
                              : "/iteams-deafault-img.webp"
                          }
                          alt={p?.item_name || "Item image"}
                          width={600}
                          height={360}
                          className={`card-img-top ${styles.cardImg}`}
                        />

                      <div
                        className={`card-body d-flex flex-column pt-2 pt-lg-3 ${styles.cardBody}`}
                      >
                        <div>
                          <h5 className={`${styles.feets_cardH}`}>
                            {p?.item_name}
                          </h5>
                        </div>

                        <div
                          className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`}
                        >
                          <div className="d-flex align-items-center gap-1 feets_data_list">
                            <Image
                              src="/rental-period-icon.svg"
                              alt="icon"
                              width={14}
                              height={14}
                            />
                            <span>Rental Period</span>
                          </div>
                          <span className="fw-semibold">
                            {p?.rental_period ?? "-"}
                          </span>
                        </div>

                        <div
                          className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2 mb-lg-3`}
                        >
                          <div className="d-flex align-items-center gap-1 feets_data_list">
                            <Image
                              src="/availability-icon.svg"
                              alt="icon"
                              width={14}
                              height={14}
                            />
                            <span>Availability</span>
                          </div>
                          <span className="fw-semibold">
                            {p?.availability_status ?? "-"}
                          </span>
                        </div>

                        <div
                          className="d-flex justify-content-between align-items-center mt-auto pt-2"
                          style={{ borderTop: "1px dashed #E5E7EB" }}
                        >
                          <div className="mb-0">
                            <span className={styles.priceStrong}>
                              ₹{formatPriceINR(p?.price_per_day)}
                            </span>
                            <span className={styles.priceMuted}> /Day</span>
                          </div>

                          {/* <a
                            className={styles.ctaBtn}
                            aria-label={`View item ${p?.item_name ?? ""}`}
                            onClick={() => {
                              trackItemView(p.id);
                              setSelectedId(p.id);
                            }}
                          >
                            <Image
                              src="/arrow.svg"
                              alt="Arrow"
                              width={18}
                              height={18}
                            />
                          </a> */}
                           <button type="button" className={styles.ctaBtn} aria-label={`View item ${p?.item_name ?? ""}`} onClick={(e) => {
                              e.stopPropagation();
                              trackItemView(p.id);
                              setSelectedId(p.id);
                            }}>
                              <Image src="/arrow.svg" alt="Arrow" width={18} height={18} />
                            </button>
                        </div>
                      </div>
                    </a>
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
                className={`${styles.rohproducts_pagination} d-flex justify-content-center mt-4 gap-2 flex-wrap`}
              >
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pnum = i + 1;
                  const url = buildUrl(pnum);
                  return (
                    <a
                      key={pnum}
                      href={url}
                      className={`${styles.rohproducts_btn_page} ${
                        page === pnum
                          ? styles.rohproducts_btn_active
                          : styles.rohproducts_btn_inactive
                      }`}
                    >
                      {pnum}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </div>
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
