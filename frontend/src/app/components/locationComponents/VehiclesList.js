"use client";

import "../../globals.css";
import styles from "./vehiclelist.module.css";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Viewproductspop from "../../products/components/Viewproductspop";
import trackItemView from "../../../utils/trackItemView";
import { LuUser, LuChevronDown, LuSearch, LuMapPin, LuCircleCheckBig, LuBadgePercent, LuHandshake, LuShieldCheck, LuArrowRight, LuStore } from "react-icons/lu";
import StarIcon from '../../../../public/star.svg';
import ArrowrightIcon from '../../../../public/arrow.svg';
import { usePathname } from "next/navigation";
import ScrollToFleet from "../../globalComponents/ScrollToFleet";


const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const PUBLIC_WEB_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

function formatPriceINR(v) {
  return Number(v ?? 0).toLocaleString("en-IN");
}

export default function VehiclesList({ initialProducts, city_data, loc_slug, popularModels, city_name}) {
  const searchParams = useSearchParams();

  const models = popularModels || [];

  const categories = initialProducts?.categories || [];
  const initialQuery = searchParams.get("q") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialTag = searchParams.get("tag") || "";

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
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedTag, setSelectedTag] = useState(initialTag);

  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const pathname = usePathname();
  const locationSlug = pathname.replace(/^\/+/, "");

  const modelsBySubCategory = useMemo(() => {
    return models.reduce((acc, model) => {
      if (!acc[model.sub_cat_id]) {
        acc[model.sub_cat_id] = [];
      }
      acc[model.sub_cat_id].push(model);
      return acc;
    }, {});
  }, [models]);

  const subCategoryMap = useMemo(() => {
    const map = {};

    categories.forEach((mainCat) => {
      mainCat.sub_categories.forEach((subCat) => {
        map[subCat.sub_cat_id] = subCat;
      });
    });

    return map;
  }, [categories]);

  /* ------------------ Search Submit ------------------ */
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory) return;

    const params = new URLSearchParams();

    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedTag) params.set("tag", selectedTag);

    const baseUrl = `/${selectedCategory}/${locationSlug}`;

    const finalUrl = params.toString()
      ? `${baseUrl}?${params.toString()}`
      : baseUrl;

    window.location.href = finalUrl;
  };

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

  const handleCategoryChange = async (e) => {
    const selectedSlug = e.target.value;
    setSelectedBrand(""); // reset brand
    setBrands([]);

    if (!selectedSlug) return;

    const catId = categorySlugToIdMap[selectedSlug];
    if (!catId) return;

    try {
      setLoadingBrands(true);

      const res = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrands`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cat_id: catId,
            city_slug: city_data.city_slug,
          }),
        }
      );

      const data = await res.json();
      setBrands(data.brands || []);
    } catch (err) {
      console.error("Brand fetch failed", err);
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  const categoryOptions = categories.flatMap((mainCat) =>
    (mainCat.sub_categories || []).map((subCat) => ({
      id: subCat.sub_cat_id,
      name: subCat.sub_cat_name,
      slug: subCat.sub_cat_slug,
    }))
  );

  const categorySlugToIdMap = categories.reduce((acc, mainCat) => {
    (mainCat.sub_categories || []).forEach((sub) => {
      acc[sub.sub_cat_slug] = sub.sub_cat_id;
    });
    return acc;
  }, {});

  function decodeHtml(html) {
    if (typeof window === "undefined") {
      return html || "";
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.documentElement.textContent || "";
  }

  const renderBreadcrumb = (locationSlug) => {
    const readableLocation = locationSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
      <nav aria-label="Breadcrumb" className={styles.breadcrumbWrap}>
        <ol className={styles.breadcrumbList}>
          <li>
            <a href={`${WEB_BASE_DOMAIN_URL}/`}>Home</a>
          </li>
          <li className={styles.separator} aria-hidden="true">›</li>
          <li aria-current="page">{readableLocation}</li>
        </ol>
      </nav>
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <section className={styles.hero_wrap}>
        {/* ---------------- HERO ---------------- */}
        <div className={styles.hero_section} aria-label={`Rental listings in ${initialProducts.location}`}>
          <div className={`container ${styles.hero_container}`}>
            <div className="row justify-content-center">
              <div className="col-12">
                <div className={styles.main_heading}>
                  {/* <h1>Cars</h1> */}
                  {/* <h1>{categorySlug.replace(/-/g, " ")}</h1> */}
                  <h1 className="mb-0 mb-sm-3">{`Rentals in ${initialProducts.location}`}</h1>
                  {/* Breadcrumb here */}
                  {renderBreadcrumb(locationSlug)}
                </div>
              </div>

              {/* Search Bar */}
              <div className="col-12">
                <div className={`${styles.custom_searchbar_wrap}`}>
                  <div className={styles.custom_searchbar}>
                    {/*  Full Reload Form */}
                    <form className="w-100" onSubmit={handleSearchSubmit}  aria-label={`Search rentals in ${initialProducts.location}`}>
                      <input type="hidden" name="page" value="1" />

                      {/* === Filters === */}
                      <div className={`row ${styles.roh_filtter_top_bar}`}>

                        {/* Category */}
                        <div className={`${styles.border_rightF1} ${styles.roh_fiiters}`}>
                          <div className="form-group w-100">
                            <label htmlFor="brand" className={`${styles.cat_block_inner}`}> Category</label>
                            <div className={styles.category_in_wrap}>
                                <select id="category" name="category" className={`text-muted w-100 ${styles.roh_brandInput}`} value={selectedCategory}
                                  onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    handleCategoryChange(e); /** IMPORTANT */
                                  }} aria-label="Filter rentals by category">
                                  <option value="">Select Category</option>
                                  {categoryOptions.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              <LuChevronDown size={18}  style={{color: "#6b7280"}} aria-hidden="true"/>
                            </div>
                          </div>
                        </div>

                        {/* Brand */}
                        <div className={`${styles.border_rightF2} ${styles.roh_fiiters}`}>
                          <div className="form-group w-100">
                            <label htmlFor="brand" className={`${styles.cat_block_inner}`}> Brand </label>
                            <div className={styles.category_in_wrap}>
                                <select
                                  id="brand"
                                  name="brand_slug"
                                  className={`text-muted w-100 ${styles.roh_brandInput}`}
                                  value={selectedBrand}
                                  onChange={(e) => setSelectedBrand(e.target.value)}
                                  aria-label="Filter rentals by brand">
                                  <option value="">
                                    {loadingBrands ? "" : "Select Brand"}
                                  </option>

                                  {brands.map((b) => (
                                    <option key={b.id} value={b.brand_slug}>
                                      {b.brand_name}
                                    </option>
                                  ))}
                                </select>
                                <LuChevronDown size={18}  style={{color: "#6b7280"}} aria-hidden="true"/>
                            </div>
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
                                  <button className="button theme-btn-new" type="submit" aria-label="Search rental listings">
                                    Search{" "}
                                    <LuSearch size={18} aria-hidden="true"/>
                                  </button>
                                  <a href={pathname} className={`${styles.roh_search_clearBtn}`} type="clear" aria-label="Clear search">
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
                          <LuBadgePercent size={20} aria-hidden="true"/>
                        </span>{" "}
                        Zero Commission
                      </li>
                      <li>
                        <span style={{ color: "#ff3600" }}>
                          <LuHandshake size={20} aria-hidden="true"/>
                        </span>{" "}
                        Direct Vendor Bookings
                      </li>
                      <li>
                        <span style={{ color: "#ff3600" }}>
                          <LuShieldCheck size={20} aria-hidden="true"/>
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

        {/* ---------------- PRODUCTS ---------------- */}
        <div className={styles.fleetswrap_inner} aria-labelledby="fleet-heading">
          <div className={styles.fleets_wrap_main}>

            {city_data?.city_desc && (
              <div className={styles.roh_location_content}>
              <div className="d-flex align-items-center gap-1 justify-content-center mb-3 mb-sm-4">
                   <LuMapPin size={18} style={{color:"#ff3600"}} aria-hidden="true"/>
                  <span className="roh_star_title" style={{lineHeight: "1em"}}>About {city_data?.city_name}</span>
                </div>
                <div className={styles.roh_city_desc}
                  dangerouslySetInnerHTML={{
                    // __html: decodeHtml(city_data?.city_desc || ""),
                    __html: city_data?.city_desc || "",
                  }}
                />
            </div>
            )}

            <div className="d-flex justify-content-center align-items-center">
              <div className={styles.star_box}>
                <div className="d-flex align-items-center gap-1">
                   <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
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
                {`extensive vehicles in ${city_name}`}
              </span>
            </h3>

            <div className={`${styles.roh_container} mt-4 mt-lg-5`}>

              {/* ===== LOOP MAIN CATEGORIES ===== */}
              {categories.map((mainCat) => (
                <div key={mainCat.category_id} className="mb-5">
                  {/* ---- MAIN CATEGORY TITLE ---- */}
                  {/* <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className={styles.subCategoryTitle}>
                      {mainCat.category_name}
                    </h3>
                  </div> */}

                  {mainCat.sub_categories.map((subCat) => {
                    const iconKey = (subCat.sub_cat_name || subCat.category_name || "").toLowerCase().trim().replace(/\s+/g, "_");

                    const subCatModels = modelsBySubCategory[subCat.sub_cat_id] || [];

                    // Get icon from mapping
                    const iconSrc = categoryIcons[iconKey] || categoryIcons.default;

                    return (
                      <div key={subCat.sub_cat_id} className={` ${styles.roh_vehicleslisting_wrapper}`}>

                        {/* ---- SUB CATEGORY TITLE ---- */}
                        <a href={`${WEB_BASE_DOMAIN_URL}/${subCat.sub_cat_slug}/${locationSlug}`}  className={`d-flex justify-content-start gap-2 align-items-center ${styles.roh_vehicleslisting_titleHeader}`} aria-label={`View all ${subCat.sub_cat_name} rentals in ${locationSlug.replace(/-/g, " ")}`}>
                          <div className={styles.roh_category_icon_wrapper}>
                            {/* <Image src="" alt="category icon" width={20} height={20} /> */}
                            <Image src={iconSrc} alt={subCat.sub_cat_name} width={24} height={24}/>
                          </div>
                          <h2 className={styles.subCategoryTitle}>
                           {subCat.sub_cat_name}
                          </h2>

                        </a>

                        {/* ---- PRODUCTS GRID ---- */}
                        <div className={styles.roh_vehicleslisting_grid}>
                          {subCat.products.map((p) => (

                            <div key={p.id} className={`card ${styles.fleetscard} h-100`} role="button" tabIndex={0}
                              onClick={() => {
                                trackItemView(p.id);
                                setSelectedId(p.id);
                              }}
                              aria-label={`View details for ${p.item_name}`}>
                              <div className={styles.roh_cardImgWrapper}>
                              <Image src={p?.media_gallery?.[0] ? `${WEB_BASE_URL}${p.media_gallery[0].file_path}${p.media_gallery[0].file_name}` : "/iteams-deafault-img.webp"}
                                alt={p.item_name} width={600} height={360} className={`card-img-top ${styles.cardImg}`}
                              />

                              {/* show transmission type (Automatic or Manual) */}
                              {[2].includes(subCat?.sub_cat_id) && p?.transmission_type && (
                                <span className={styles.roh_car_type}>
                                  {p.transmission_type}
                                </span>
                              )}

                              </div>
                              {subCat.sub_cat_id === 10 && (
                                <div className={styles.roh_cwd_label}><LuUser size={14} aria-hidden="true"/> <span>Car With Driver</span></div>
                              )}

                              <div className={`card-body d-flex flex-column pt-2 pt-lg-3 ${styles.cardBody}`}>
                                <h4 className={styles.feets_cardH}>
                                  {p?.brand_name?.toLowerCase() !== "other" && `${p?.brand_name} `} {p?.item_name}
                                </h4>

                                {/* <div className={`${styles.roh_feets_list} d-flex justify-content-between`}>
                                  <LuMapPin size={18} style={{color:"#9CA3AF"}}/>
                                  <span>Location</span>
                                  <span className={`roh_capitalizeText`}>{p.city ?? "-"}</span>
                                </div>

                                <div className={`${styles.roh_feets_list} d-flex justify-content-between mb-3`}>
                                  <LuCircleCheckBig size={18} style={{color:"#9CA3AF"}}/>
                                  <span>Availability</span>
                                  <span>{p.availability_status ?? "-"}</span>
                                </div> */}

                                <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`} >
                                  <div className={styles.roh_feets_data_list}>
                                    <div><LuMapPin size={18} style={{color:"#9CA3AF"}} aria-hidden="true"/></div>
                                  {/* <span className="fw-semibold">{p?.landmark || p?.city ? `${p?.landmark ?? ""}${p?.landmark && p?.city ? ", " : ""}${p?.city ?? ""}` : "-"}</span> */}
                                  <span className="text-capitalize">
                                    {p?.address_1
                                      ? `${p.address_1}, ${p?.city ?? "-"}`
                                      : p?.city ?? "-"
                                    }
                                  </span>
                                  </div>

                                </div>

                                <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`}>
                                    <div className={`${styles.roh_feets_data_list} ${
                                          p?.availability_status === "Available"
                                            ? styles.status_available
                                            : p?.availability_status === "Rented"
                                            ? styles.status_rented
                                            : styles.status_default
                                        }`}
                                      >
                                    <div><LuCircleCheckBig size={18} style={{color:"#9CA3AF"}} aria-hidden="true"/></div>
                                  <span>
                                    {p?.availability_status === "Rented"? "Rented(Not Available)": p?.availability_status ?? "-"}
                                  </span>
                                  </div>
                                </div>
                                <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2 mb-lg-3`}>
                                  <div className={styles.roh_feets_data_list}>
                                    <div><LuStore size={18} style={{color:"#9CA3AF"}} aria-hidden="true"/></div>
                                      <a href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${p?.business_slug}`} target="_blank" rel="noopener" className={styles.roh_vendor_link}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                      >
                                    <span>
                                      {p?.business_name
                                        ? `${p.business_name}`
                                        : "-"}
                                    </span>
                                  </a>

                                  </div>
                                </div>

                                {/* <div className="d-flex justify-content-between align-items-center mt-auto pt-2" style={{ borderTop: "1px dashed #E5E7EB" }}>
                                  <div>
                                    <span className={styles.priceStrong}>
                                      ₹{formatPriceINR(p.price_per_day)}
                                    </span>
                                    <span className={styles.priceMuted}> /Day</span>
                                  </div>

                                  <button type="button" className={styles.ctaBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      trackItemView(p.id);
                                      setSelectedId(p.id);
                                    }}
                                  >
                                    <Image src="/arrow.svg" alt="Arrow" width={18} height={18} />
                                  </button>
                                </div> */}

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
                                    )}

                              <span className={`${styles.ctaBtn_new} ${ p?.price_per_day && Number(p.price_per_day) > 0 ? "roh_max_content" : "w-100" }`}>
                              {p?.price_per_day && Number(p.price_per_day) > 0 ? "Contact Owner" : "Contact Owner for price"}
                              <LuArrowRight size={14} />
                            </span>
                                </div>

                              </div>
                            </div>
                          ))}
                        </div>

                        <div className={styles.roh_viewAllbtn_wrap}><a href={`${WEB_BASE_DOMAIN_URL}/${subCat.sub_cat_slug}/${locationSlug}`} className={styles.roh_viewAll} aria-label={`View all ${subCat.sub_cat_name} rentals in ${locationSlug.replace(/-/g, " ")}`}>View All {subCat.sub_cat_name}<LuArrowRight size={16} aria-hidden="true"/></a></div>

                        {/* {subCatModels.length > 0 && (
                          <div className={styles.roh_seo_links_section}>
                            <h4 className="mt-0 mb-2 mb-sm-3">
                              Popular {subCat.sub_cat_name} Models
                            </h4>

                            <div className={styles.roh_seo_links_block}>
                              {subCatModels.map((model) => {
                                const link = `${WEB_BASE_DOMAIN_URL}/${subCat.sub_cat_slug}/${model.model_slug}/${locationSlug}`;

                                return (
                                  <a
                                    key={model.model_id}
                                    href={link}
                                    aria-label={`Rent a ${model.model_name} in ${locationSlug.replace(/-/g, " ")}`}
                                    title={`Rent a ${model.model_name}`}
                                  >
                                    {`Rent a ${model.model_name}`}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )} */}


                        {subCat.products.length === 0 && (
                          <p className="text-center text-muted">No items found.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ================= POPULAR MODELS SECTION ================= */}
            {/* {models && models.length > 0 && (
              <div className={`${styles.roh_container} mt-5`}>
                <div className={styles.roh_seo_links_section}>
                  <h3 className="mb-3">Popular Models</h3>

                  {Object.entries(modelsBySubCategory).map(([subCatId, subCatModels]) => {
                    const subCat = subCategoryMap[subCatId];

                    // Safety check
                    if (!subCat || subCatModels.length === 0) return null;

                    return (
                      <div key={subCatId} className="mb-4">
                        <h4 className="mb-2">
                          {subCat.sub_cat_name}
                        </h4>

                        <div className={styles.roh_seo_links_block}>
                          {subCatModels.map((model) => {
                            const link = `${WEB_BASE_DOMAIN_URL}/${subCat.sub_cat_slug}/${model.model_slug}/${locationSlug}`;

                            const displayText = `Rent a ${model.model_label || model.model_name}`;
                            return (
                              <a key={model.model_id} href={link} aria-label={displayText} title={displayText}>
                                {displayText}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )} */}
            {models && models.length > 0 && (
            <div className={`${styles.roh_container} mt-5`}>
              <div className={styles.roh_seo_links_section}>
                <h3 className="mb-3">Popular Models</h3>

                {models.map((category) => {
                  if (!category.models || category.models.length === 0) return null;

                  return (
                    <div key={category.category_id} className="mb-4">

                      {/* ---- CATEGORY TITLE ---- */}
                      <h4 className="mb-2">
                        {category.category_name}
                      </h4>

                      {/* ---- MODEL LINKS ---- */}
                      <div className={styles.roh_seo_links_block}>
                        {category.models.map((model) => {
                          const link = `${WEB_BASE_DOMAIN_URL}/${category.category_slug}/${model.model_slug}/${locationSlug}`;

                          const displayText = `Rent a ${model.model_label || model.model_name}`;

                          return (
                            <a
                              key={model.model_id}
                              href={link}
                              aria-label={displayText}
                              title={displayText}
                            >
                              {displayText}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          </div>
        </div>

        {/* ---------------- POPUP ---------------- */}
        {selectedId !== null && (
          <Viewproductspop
            triggerId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </section>
    </>
  );
}
