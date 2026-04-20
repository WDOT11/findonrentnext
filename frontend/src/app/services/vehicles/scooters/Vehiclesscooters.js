"use client";
import "../../../globals.css";
import styles from "./scooter.module.css";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Viewproductspop from "../../../products/components/Viewproductspop";
import Link from "next/link";
import trackItemView from "../../../../utils/trackItemView";
import { LuBadgePercent, LuHandshake, LuShieldCheck } from "react-icons/lu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const ROH_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

function formatPriceINR(v) {
  return Number(v ?? 0).toLocaleString("en-IN");
}

export default function Vehiclescars() {
  const searchParams = useSearchParams();

  // URL Params
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialBrand = searchParams.get("brand_slug") || "";
  const initialTag = searchParams.get("tag_slug") || "";

  // State
  const [page] = useState(initialPage);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
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

  const limit = 28;
  const totalPages = useMemo(
    () => Math.ceil((total || 0) / limit) || 1,
    [total]
  );

  /** ====================
   *   FETCH FUNCTIONS
   *  ==================== */

  // Fetch brands
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrands`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cat_id: 8 }),
          }
        );
        const data = await res.json();
        setBrands(data.brands || []);

        //  preselect brand if slug found in URL
        if (initialBrand && data.brands?.length) {
          const found = data.brands.find((b) => b.brand_slug === initialBrand);
          if (found) setSelectedBrand(found.brand_slug);
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setBrands([]);
      }
    })();
  }, [initialBrand]);

  // Fetch tags
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getvehiclestags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cat_id: 8 }),
        });
        const data = await res.json();
        setTags(data.models || []);

        //  preselect tag if slug found in URL
        if (initialTag && data.models?.length) {
          const found = data.models.find((t) => t.tag_slug === initialTag);
          if (found) setSelectedTag(found.tag_slug);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        setTags([]);
      }
    })();
  }, [initialTag]);

  // Fetch filtered products
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const url = new URL(
          `${ROH_PUBLIC_API_BASE_URL}/getallvehiclesscooters`
        );
        url.searchParams.set("page", String(initialPage));
        url.searchParams.set("limit", String(limit));
        url.searchParams.set("cat_id", "8");

        if (initialQuery) url.searchParams.set("q", initialQuery);
        if (initialLocation) url.searchParams.set("location", initialLocation);
        if (initialBrand) url.searchParams.set("brand_slug", initialBrand);
        if (initialTag) url.searchParams.set("tag_slug", initialTag);

        const loc = JSON.parse(localStorage.getItem("user_location") || "{}");
        if (loc.city) url.searchParams.set("user_city", loc.city);

        const res = await fetch(url.toString());
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(Number(data.total || 0));
      } catch (e) {
        console.error("Fetch products failed:", e);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialPage, initialQuery, initialLocation, initialBrand, initialTag]);

  /** ====================
   *   BUILD PAGINATION URL
   *  ==================== */
  const buildUrl = (newPage) => {
    const qp = new URLSearchParams();
    if (initialQuery) qp.set("q", initialQuery);
    if (initialLocation) qp.set("location", initialLocation);
    if (selectedBrand) qp.set("brand_slug", selectedBrand);
    if (selectedTag) qp.set("tag_slug", selectedTag);
    qp.set("page", String(newPage));
    return `${window.location.pathname}?${qp.toString()}`;
  };

  /** ====================
   *   RENDER
   *  ==================== */

  return (
    <section className={styles.hero_wrap}>
      <div className={styles.hero_section}>
        <div className={`container ${styles.hero_container}`}>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className={styles.main_heading}>
                <h1>Scooters</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="col-12">
              <div className={`container ${styles.custom_searchbar_wrap}`}>
                <div className={styles.custom_searchbar}>
                  {/*  Full Reload Form */}
                  <form className="w-100" method="GET" action="">
                    <input type="hidden" name="page" value="1" />

                    {/* === Filters === */}
                    <div className={`row ${styles.roh_filtter_top_bar}`}>
                      {/* Location */}
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
                              className={`w-100 ${styles.roh_locationInput}`}
                              id="location"
                              type="search"
                              name="location"
                              placeholder="Enter your destination..."
                              defaultValue={initialLocation}
                            />
                            <img src="/images/homepg/pin.svg" alt="pin" />
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

          <div className="container px-2 px-md-3 px-lg-3 position-relative mt-4 mt-lg-5">
            <div className="row d-flex justify-content-start g-3">
              {loading && (
                <div className="col-12">
                  <p className="text-center text-muted m-0">Loading items…</p>
                </div>
              )}

              <div className={styles.roh_vehicleslisting_grid}>
                {!loading &&
                  products.map((p) => (
                    <a
                      className={`card ${styles.fleetscard} h-100`}
                      aria-label={`View item ${p?.item_name ?? ""}`}
                      onClick={() => {
                        trackItemView(p.id);
                        setSelectedId(p.id);
                      }}
                    >
                      <img
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
                              alt="Rental Period"
                              width={20}
                              height={20}
                            />
                            <span>Rental Period</span>
                          </div>
                          <span className="fw-semibold">
                            {p?.rental_period ?? "-"}
                          </span>
                        </div>

                        <div
                          className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-3`}
                        >
                          <div className="d-flex align-items-center gap-1 feets_data_list">
                            <Image
                              src="/availability-icon.svg"
                              alt="Availability"
                              width={20}
                              height={20}
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

                          <a
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
                              width={30}
                              height={30}
                            />
                          </a>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>

              {!loading && products.length === 0 && (
                <div className="col-12">
                  <p className="text-center text-muted m-0">
                    No products found.
                  </p>
                </div>
              )}
            </div>

            {!loading && totalPages > 1 && (
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
