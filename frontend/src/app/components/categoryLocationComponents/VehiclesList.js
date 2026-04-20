"use client";

import "../../globals.css";
import styles from "./vehiclelist.module.css";
import { useEffect, useMemo, useState, useRef} from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Viewproductspop from "../../products/components/Viewproductspop";
import trackItemView from "../../../utils/trackItemView";
import { LuUser, LuCircleCheckBig, LuMapPin, LuBadgePercent, LuHandshake, LuShieldCheck, LuChevronDown, LuSearch, LuStore, LuArrowLeft, LuArrowRight } from "react-icons/lu";
import StarIcon from '../../../../public/star.svg';
import ArrowrightIcon from '../../../../public/arrow.svg';
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

export default function VehicleList({initialProducts, total, categories, categorySlug, categorySinName, locSlug, brands, cate_id, categoryName, loc_nm, popularModels}){
  const searchParams = useSearchParams();

  /* IMPORTANT: NO STATE FOR PRODUCTS */
  const products = initialProducts || [];
  const models = popularModels || [];
  const categoryFullName = categoryName;

  const page = Number(searchParams.get("page") || 1);
  const initialQuery = searchParams.get("search_by") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialBrand = searchParams.get("brand") || "";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
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
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [brandList, setBrandList] = useState(() => {
    if (Array.isArray(brands)) return brands;
    return brands?.brands || [];
  });

  /* ------------------ City Autosuggest ------------------ */
  const [locationValue, setLocationValue] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const cityTimerRef = useRef(null);
  // const [locationSlug, setLocationSlug] = useState("");

  const pathname = usePathname();
  const locationSlug = pathname.replace(/^\/+/, "");

  const categoryMainSlug = categorySlug;
  const [selectedCategory, setSelectedCategory] = useState(categoryMainSlug || "");

  useEffect(() => {
    // if (!initialBrand) return;

    /** Get the category ID from the slug */
    const catId = categorySlugToIdMap[categoryMainSlug];
    if (!catId) return;

    const fetchBrandsOnLoad = async () => {
      try {
        setLoadingBrands(true);

        const res = await fetch(
          `${ROH_PUBLIC_API_BASE_URL}/getvehiclesbrands`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cat_id: catId,
              city_slug: locSlug,
            }),
          }
        );

        const data = await res.json();
        const list = Array.isArray(data?.brands) ? data.brands : [];

        setBrandList(list);

        /** ensure selected brand exist in dropdown */
        const exists = list.some(
          (b) => b.brand_slug === initialBrand
        );

        if (exists) {
          setSelectedBrand(initialBrand);
        }
      } catch (err) {
        console.error("Initial brand fetch failed", err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrandsOnLoad();
  }, [initialBrand, categoryMainSlug, locSlug]);

  useEffect(() => {
    if (!initialBrand) return;

    const exists = brandList.some((b) => b.brand_slug == initialBrand);
    if (exists) {
      setSelectedBrand(initialBrand);
    }

  }, [brandList, initialBrand]);

  const totalPages = useMemo(
    () => Math.ceil((total || 0) / LIMIT) || 1,
    [total]
  );

  /* ---------------- Pagination URL ---------------- */
  const buildUrl = (newPage) => {
    const qp = new URLSearchParams();

    if (initialQuery) qp.set("q", initialQuery);
    if (selectedBrand) qp.set("brand", selectedBrand);

    qp.set("page", String(newPage));

    let basePath = `/${categoryMainSlug}`;

    if (locSlug) {
      basePath += `/${locSlug}`;
    }

    return qp.toString()
      ? `${basePath}?${qp.toString()}`
      : basePath;
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

  // const handleLocationChange = (e) => {
  //   const value = e.target.value;
  //   setLocationValue(value);
  //   setLocationSlug(""); /** reset slug if user types manually */

  //   if (cityTimerRef.current) {
  //     clearTimeout(cityTimerRef.current);
  //   }

  //   cityTimerRef.current = setTimeout(() => {
  //     fetchCities(value);
  //   }, 400);
  // };

  const handleCitySelect = (city) => {
    setLocationValue(city.city_name);
    setLocationSlug(city.city_slug);
    setShowCityDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (selectedBrand) params.set("brand", selectedBrand);

    const searchVal = document.getElementById("whatoftype")?.value?.trim();
    if (searchVal) params.set("search_by", searchVal);

    // params.set("page", "1");

    // USE selected category if present
    const categoryPath = selectedCategory || categoryMainSlug;

    let basePath = `/${categoryPath}/${locSlug}`;

    const finalUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath;

    window.location.href = finalUrl;
  };

  const handleCategoryChange = async (e) => {
    const selectedSlug = e.target.value;

    setSelectedCategory(selectedSlug);
    setSelectedBrand(""); // reset brand

    if (!selectedSlug) {
      setBrandList([]);
      return;
    }

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
            city_slug: locSlug,
          }),
        }
      );

      const data = await res.json();

      setBrandList(
        Array.isArray(data?.brands) ? data.brands : []
      );
    } catch (err) {
      setBrandList([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  const normalizedCategories = (categories || []).map((cat) => ({
    category_id: cat.id,
    category_name: cat.name,
    category_slug: cat.slug,
    sub_categories: (cat.children || []).map((child) => ({
      sub_cat_id: child.id,
      sub_cat_name: child.name,
      sub_cat_slug: child.slug,
      products: child.products || [],
    })),
  }));

  const categoryOptions = normalizedCategories.flatMap((mainCat) =>
    (mainCat.sub_categories || []).map((subCat) => ({
      id: subCat.sub_cat_id,
      name: subCat.sub_cat_name,
      slug: subCat.sub_cat_slug,
    }))
  );

  const categorySlugToIdMap = normalizedCategories.reduce((acc, mainCat) => {
    (mainCat.sub_categories || []).forEach((sub) => {
      acc[sub.sub_cat_slug] = sub.sub_cat_id;
    });
    return acc;
  }, {});

  const renderCategoryLocationBreadcrumb = (categorySlug, locationSlug, categoryFullName) => {
    const cleanLocationSlug = locationSlug.includes("/")
      ? locationSlug.split("/").pop()
      : locationSlug;

    const readableCategory = categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const readableLocation = cleanLocationSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

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
          <li aria-current="page">{readableLocation}</li>
        </ol>
      </nav>
    );
  };

  const gridClass = products.length === 1 ? "roh-single_grid": products.length === 2 ? "roh-double_grid": products.length === 3? "roh-triple_grid": "roh_vehicleslisting_grid";

  /* ---------------- RENDER ---------------- */
  return (
    <section className={styles.hero_wrap} aria-label={`${categorySinName.replace(/-/g, " ")} rentals in ${locSlug.replace(/-/g, " ")}`}>
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
                {/* <h1>Cars</h1> */}
                <h1 className="mb-0 mb-sm-3">
                    {`${categorySinName} rentals in ${locSlug}`}
                </h1>
                {/* Breadcrumb here */}
                {renderCategoryLocationBreadcrumb(categorySlug, locationSlug, categoryFullName)}
              </div>
            </div>

            {/* Search Bar */}
            <div className="col-12">
              <div className={`container ${styles.custom_searchbar_wrap}`}>
                <div className={styles.custom_searchbar}>
                  {/*  Full Reload Form */}
                  <form className="w-100" onSubmit={handleSearchSubmit} aria-label={`Search ${categorySinName.replace(/-/g, " ")} rentals in ${locSlug.replace(/-/g, " ")}`}>
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
                              <LuChevronDown size={18} style={{color:"#6b7280"}} aria-hidden="true"/>
                          </div>
                        </div>
                      </div>

                      {/* Brand */}
                      <div className={`${styles.border_rightF2} ${styles.roh_fiiters}`}>
                        <div className="form-group w-100">
                          <label htmlFor="brand" className={`${styles.cat_block_inner}`}> Brand </label>
                          <div className={styles.category_in_wrap}>
                            <select id="brand" name="brand" className={`text-muted w-100 ${styles.roh_brandInput}`} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} aria-label="Filter rentals by brand">
                              <option value="">
                                {loadingBrands ? "" : "Select Brand"}
                              </option>

                              {brandList.map((b) => (
                                <option key={b.id} value={b.brand_slug}>
                                  {b.brand_name}
                                </option>
                              ))}
                            </select>
                            <LuChevronDown size={18} style={{color:"#6b7280"}} aria-hidden="true"/>
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* Search Query */}
                    <div className={`row ${styles.roh_searchbar_bottom}`}>
                      <div className={`${styles.roh_searchbar_bottom_fields}`}>
                        <div className={styles.search_block_wrap}>
                          <div className={`${styles.search_block_inner} rounded-pill`}>
                            {/* <label className={styles.whatoftype} htmlFor="whatoftype">
                              Search Rentals
                            </label> */}
                            <div className={`${styles.roh_searchinput_btn_wrapper}`}>
                              {/* <div className={`${styles.search_wraperInput}`}>
                                <LuSearch size={18} style={{color:"#6b7280"}}/>
                                <input id="whatoftype" className={`w-100 ${styles.roh_searchinput}`} type="search" name="q" placeholder="Enter something..." defaultValue={initialQuery}/>
                              </div> */}
                              <div className={styles.rent_search_btn}>
                                <button className="button theme-btn-new" type="submit" aria-label="Search rental listings">
                                  Search{" "}
                                  <LuSearch size={18} aria-hidden="true"/>
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
                <StarIcon className="roh_icon" width={20} height={20}/>
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
              {`extensive fleet of ${categoryFullName} in ${loc_nm}`}
            </span>
          </h3>

          <div className="container px-2 px-md-3 px-lg-3 position-relative mt-4 mt-lg-5">
            <div className="row d-flex justify-content-start g-3">

              <div className={styles[gridClass]} aria-label="Rental items list">
                {products.map((p) => (
                  <div key={p.id} className={`card ${styles.fleetscard} h-100`} role="button" tabIndex={0}  aria-label={`View details for ${p?.item_name}`}
                    onClick={() => {
                      trackItemView(p.id);
                      setSelectedId(p.id);
                    }}
                  >
                  {/* <a key={p.id} className={`card ${styles.fleetscard} h-100`} aria-label={`View item ${p?.item_name ?? ""}`}
                    onClick={() => {
                      trackItemView(p.id);
                      setSelectedId(p.id);
                    }}
                  > */}
                  <div className={styles.roh_cardImgWrapper}>
                    <Image src={p?.media_gallery?.[0] ? `${WEB_BASE_URL}${p.media_gallery[0].file_path}${p.media_gallery[0].file_name}` : "/iteams-deafault-img.webp"} alt={p?.item_name || "Item image"} width={600} height={360} className={`card-img-top ${styles.cardImg}`} sizes="(max-width: 768px) 100vw, 33vw"/>

                    {/* show transmission type (Automatic or Manual) */}
                    {[2, 10].includes(cate_id) && p?.transmission_type && (
                      <span className={styles.roh_car_type}>
                        {p.transmission_type}
                      </span>
                    )}

                    </div>
                    {categoryMainSlug === "cars-with-driver" && (
                      <div className={styles.roh_cwd_label}><LuUser size={14} aria-hidden="true"/> <span>Car With Driver</span></div>
                    )}
                      <div className={`card-body d-flex flex-column pt-2 pt-lg-3 ${styles.cardBody}`}>
                        <div>
                          <h2 className={`${styles.feets_cardH}`}>
                            {p?.brand_name?.toLowerCase() !== "other" && `${p?.brand_name} `} {p?.item_name}
                          </h2>
                        </div>

                        <div className={`${styles.roh_feets_list} d-flex justify-content-between text-secondary mb-2`}>
                          <div className={styles.roh_feets_data_list}>
                            <div><LuMapPin size={18} style={{color:"#9CA3AF"}} aria-hidden="true"/></div>
                            {/* <span className="fw-semibold"> {p?.city ?? "-"}</span> */}
                            <span className="text-capitalize">
                              {p?.address_1 ? `${p.address_1}, ${p?.city ?? "-"}` : p?.city ?? "-"}
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
                             <a href={ WEB_BASE_DOMAIN_URL + `/rental-service-provider/${p?.business_slug}`} target="_blank" rel="noopener" className={styles.roh_vendor_link}  aria-label={`View rental provider ${p?.business_name}`}
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

                        {/* <div
                          className="d-flex justify-content-between align-items-center mt-auto pt-2"
                          style={{ borderTop: "1px dashed #E5E7EB" }}
                        >
                          <div className="mb-0">
                            <span className={styles.priceStrong}>
                              ₹{formatPriceINR(p?.price_per_day)}
                            </span>
                            <span className={styles.priceMuted}> /Per Day</span>
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
                              width={18}
                              height={18}
                            />
                          </a>
                            <button type="button" className={styles.ctaBtn} aria-label={`View item ${p?.item_name ?? ""}`} onClick={(e) => {
                              e.stopPropagation();
                              trackItemView(p.id);
                              setSelectedId(p.id);
                            }}>
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
                            )
                          }
{/* 
                          <button type="button" className={styles.ctaBtn} aria-label={`View details for ${p?.item_name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              trackItemView(p.id);
                              setSelectedId(p.id);
                            }}
                          >
                             <ArrowrightIcon className="roh_icon" width={18} height={18} aria-hidden="true"/>
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
                    className={styles.rohproducts_btn_page} aria-label="Go to previous page">
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
                    className={styles.rohproducts_btn_page} aria-label="Go to next page">
                     <LuArrowRight size={20}/>
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
        {models?.length > 0 && (
          <div className={styles.roh_seo_links_section}>
            <h4 className="mt-0 mb-2 mb-sm-3">Popular Models</h4>

            <div className={styles.roh_seo_links_block}>
              {models.map((model) => {
                const link = `${WEB_BASE_DOMAIN_URL}/${categorySlug}/${model.model_slug}/${locSlug}`;

                // Use label if available
                const displayText = `Rent a ${model.model_label || model.model_name} in ${locSlug}`;
                // const displayText = model.model_label ? model.model_label : `Rent a ${model.model_name} in ${locSlug}`;

                return (
                  <a href={link} key={model.model_id} aria-label={displayText} title={displayText}>
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