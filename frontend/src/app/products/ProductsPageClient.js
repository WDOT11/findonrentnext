"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "./product.module.css";
import Viewproductspop from "./components/Viewproductspop";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

function formatPriceINR(v) {
  return Number(v ?? 0).toLocaleString("en-IN");
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams();

  // read from URL
  const initialPage = parseInt(searchParams.get("page") || "1", 10) || 1;
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";

  // local state for controls (UI)
  const [page] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const limit = 4;

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

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  const totalPages = useMemo(() => Math.ceil((total || 0) / limit) || 1, [total]);

  const buildUrl = (p = 1, cat = selectedCategory, qStr = query, locStr = location) => {
    const qp = new URLSearchParams();
    qp.set("page", String(p));
    if (cat) qp.set("category", String(cat));
    if (qStr) qp.set("q", qStr);
    if (locStr) qp.set("location", locStr);
    return `${window.location.pathname}?${qp.toString()}`;
  };
  const hardNav = (url) => window.location.assign(url);

  const goToPage = (p) => {
    hardNav(buildUrl(p));
  };

  // fetch categories once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setCatLoading(true);
        const res = await fetch(`${API_BASE_URL}/getallactivecategory`, {
          cache: "no-store" 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Fetch categories failed:", e);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setCatLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch products on first paint
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const url = new URL(`${API_BASE_URL}/getallproducts`);
        url.searchParams.set("page", String(initialPage));
        url.searchParams.set("limit", String(limit));
        if (initialCategory) url.searchParams.set("category", initialCategory);
        if (initialQuery) url.searchParams.set("q", initialQuery);
        if (initialLocation) url.searchParams.set("location", initialLocation);

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setProducts(data?.products || []);
        setTotal(Number(data?.total || 0));
      } catch (e) {
        console.error("Fetch products failed:", e);
        if (mounted) { setProducts([]); setTotal(0); }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []); 

  const categoryNameById = (id) =>
    categories.find((c) => String(c.id) === String(id))?.name ?? "Item";

  return (
    <section className={styles.hero_wrap}>
      <div className={styles.hero_section}>
        <div className={`container ${styles.hero_container}`}>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className={styles.main_heading}>
                <h1>Products</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="col-12">
              <div className={`container ${styles.custom_searchbar_wrap}`}>
                <div className={styles.custom_searchbar}>
                  <form
                    className="w-100"
                    method="GET"
                    onSubmit={(e) => {
                      const fd = new FormData(e.currentTarget);
                      fd.set("page", "1");

                      // add location to query
                      const locVal = document.getElementById("location").value.trim();
                      if (locVal) fd.set("location", locVal);

                      const url = `${window.location.pathname}?${new URLSearchParams(fd).toString()}`;
                      e.preventDefault();
                      hardNav(url);
                    }}
                  >
                    <input type="hidden" name="page" value="1" />

                    <div className="row">
                      {/* Location */}
                      <div className={`col-lg-3 col-md-6 col-12 ${styles.border_rightF1}`}>
                        <div className="form-group w-100">
                          <label htmlFor="location" className="loc_block_inner">Location</label>
                          <div className={styles.location_in_wrap}>
                            <input
                              className="w-100"
                              id="location"
                              type="search"
                              placeholder="Enter your destination..."
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                            <img src="/images/homepg/pin.svg" alt="pin" />
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className={`col-lg-3 col-md-6 col-12 ${styles.border_rightF2}`}>
                        <div className="form-group w-100">
                          <label htmlFor="category" className="cat_block_inner">Category</label>
                          <div className={styles.category_in_wrap}>
                            <select
                              id="category"
                              name="category"
                              className="text-muted w-100"
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                              <option value="">Select Category</option>
                              {!catLoading && categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                            <img className="toggle-icon" src="/images/homepg/down.svg" alt="toggle" />
                          </div>
                        </div>
                      </div>

                      {/* Search Query */}
                      <div className="col-lg-4 col-md-8 col-12">
                        <div className={styles.search_block_wrap}>
                          <div className={`${styles.search_block_inner} rounded-pill`}>
                            <div className="w-100">
                              <label className={styles.whatoftype} htmlFor="whatoftype">Search Rentals</label>
                              <input
                                id="whatoftype"
                                className="rounded-pill w-100"
                                type="search"
                                placeholder="Enter something..."
                                name="q"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="col-lg-2 col-md-12 col-12">
                        <div className={styles.rent_search_btn}>
                          <button className="button theme-btn-new" type="submit" aria-label="Search">
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-12">
                <div className="bottom_title">
                  <ul className={styles.list_bottom}>
                    <li>100% free</li>
                    <li>peer to peer rentals</li>
                    <li>no booking fees</li>
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
                <Image src="/images/homepg/star.svg" alt="star icon" width={20} height={20} />
                <span className={styles.star_title}>Our Fleets</span>
              </div>
            </div>
          </div>

          <h3 className={`${styles.second_heading} text-center`}>
            Explore our perfect and <br /> extensive fleet
          </h3>

          <div className="container-fluid px-2 px-md-3 px-lg-3 position-relative">
            <div className="row g-4">
              {loading && (
                <div className="col-12">
                  <p className="text-center text-muted m-0">Loading items…</p>
                </div>
              )}

              {!loading && products.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-lg-3">
                  <div className={`card ${styles.fleetscard} h-100`}>
                    <img
                      src={
                        p?.media_gallery?.[0]
                          ? p.media_gallery[0].file_path + p.media_gallery[0].file_name
                          : "/uploads/media/host/items/placeholder.png"
                      }
                      alt={p?.item_name || "Item image"}
                      width={600}
                      height={360}
                      className={`card-img-top p-4 ${styles.cardImg}`}
                    />
                    <div className={`card-body d-flex flex-column pt-2 ${styles.cardBody}`}>
                      <div>
                        <span className="badge rounded-pill px-3 py-2 badge-car">
                          {categoryNameById(p?.category_id)}
                        </span>
                        <h5 className={`${styles.feets_cardH} mt-3 mb-3`}>{p?.item_name}</h5>
                      </div>

                      <div className="d-flex justify-content-between text-secondary mb-2">
                        <div className="d-flex align-items-center gap-1 feets_data_list">
                          <Image src="/images/homepg/helmet.svg" alt="icon" width={20} height={20} />
                          <span>Rental Period</span>
                        </div>
                        <span className="text-dark fw-medium">{p?.rental_period ?? "-"}</span>
                      </div>

                      <div className="d-flex justify-content-between text-secondary mb-4">
                        <div className="d-flex align-items-center gap-1 feets_data_list">
                          <Image src="/images/homepg/pistons.svg" alt="icon" width={20} height={20} />
                          <span>Availability</span>
                        </div>
                        <span className="text-dark fw-medium">{p?.availability_status ?? "-"}</span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center border-top mt-auto pt-2">
                        <div className="mb-0">
                          <span className={styles.priceStrong}>₹{formatPriceINR(p?.price_per_day)}</span>
                          <span className={styles.priceMuted}> /Per Day</span>
                        </div>

                        <button
                          className={styles.ctaBtn}
                          aria-label={`View item ${p?.item_name ?? ""}`}
                          onClick={() => setSelectedId(p.id)}
                        >
                          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z" />
                            <path d="M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 1 1-1.414-1.414L24.586 17l-7.293-7.293a1 1 0 0 1 0-1.414z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && products.length === 0 && (
                <div className="col-12">
                  <p className="text-center text-muted m-0">No products found.</p>
                </div>
              )}
            </div>

            {!loading && totalPages > 1 && (
                <div className={`${styles.rohproducts_pagination} d-flex justify-content-center mt-4 gap-2 flex-wrap`}>
                    <button
                    className={`${styles.rohproducts_btn}`}
                    disabled={initialPage === 1}
                    onClick={() => goToPage(initialPage - 1)}
                    >
                    Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        className={`${styles.rohproducts_btn_page} ${initialPage === i + 1 ? styles.rohproducts_btn_active : styles.rohproducts_btn_inactive}`}
                        onClick={() => goToPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                    ))}
                    <button
                    className={`${styles.rohproducts_btn}`}
                    disabled={initialPage === totalPages}
                    onClick={() => goToPage(initialPage + 1)}
                    >
                    Next
                    </button>
                </div>
            )}

          </div>
        </div>
      </div>

      {selectedId !== null && (
        <Viewproductspop triggerId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}
