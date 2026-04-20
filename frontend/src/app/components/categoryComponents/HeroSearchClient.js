"use client";

import { useState, useRef } from "react";
import { LuMapPin, LuChevronDown, LuSearch } from "react-icons/lu";
import styles from "./vehiclelist.module.css";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function HeroSearchClient({
  brands,
  categorySinName,
  pathname
}) {

  const [selectedBrand, setSelectedBrand] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [locationSlug, setLocationSlug] = useState("");

  const cityTimerRef = useRef(null);

  /* ⭐ fetch cities */
  const fetchCities = async (keyword) => {
    try {
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
      setCityResults([]);
    } finally {
      setCityLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationValue(value);
    setLocationSlug("");

    if (!value.trim()) {
      setShowCityDropdown(false);
      setCityResults([]);
      return;
    }

    setShowCityDropdown(true);
    setCityLoading(true);

    if (cityTimerRef.current) clearTimeout(cityTimerRef.current);

    cityTimerRef.current = setTimeout(() => {
      fetchCities(value);
    }, 400);
  };

  const handleCitySelect = (city) => {
    setLocationValue(city.cat_singular_name);
    setLocationSlug(city.slug);
    setShowCityDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (selectedBrand) params.set("brand", selectedBrand);

    let basePath = `/${categorySinName}`;

    if (locationSlug) basePath += `/${locationSlug}`;

    const finalUrl =
      params.toString() ? `${basePath}?${params.toString()}` : basePath;

    window.location.href = finalUrl;
  };

  return (
    <div className="col-12">
      <div className={`container ${styles.custom_searchbar_wrap}`}>
        <div className={styles.custom_searchbar}>
          <form className="w-100" onSubmit={handleSearchSubmit}>

            <div className={`row ${styles.roh_filtter_top_bar}`}>

              {/* ⭐ CITY */}
              <div className={`${styles.border_rightF1} ${styles.roh_fiiters}`}>
                <div className="form-group w-100">
                  <label className={styles.loc_block_inner}>City</label>

                  <div className={styles.location_in_wrap}>
                    <input
                      type="search"
                      className={`w-100 ${styles.roh_locationInput}`}
                      placeholder="Enter your destination..."
                      value={locationValue}
                      onChange={handleLocationChange}
                      autoComplete="off"
                    />

                    <LuMapPin size={18} />

                    {showCityDropdown && (
                      <ul className={styles.city_dropdown}>
                        {cityLoading && (
                          <li className={styles.city_info}>Searching…</li>
                        )}

                        {!cityLoading &&
                          cityResults.map((city, i) => (
                            <li key={i} onClick={() => handleCitySelect(city)}>
                              {city.cat_singular_name}
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

              {/* ⭐ BRAND */}
              <div className={`${styles.border_rightF2} ${styles.roh_fiiters}`}>
                <div className="form-group w-100">
                  <label className={styles.cat_block_inner}>Brand</label>

                  <div className={styles.category_in_wrap}>
                    <select
                      className={`w-100 ${styles.roh_brandInput}`}
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

                    <LuChevronDown size={18} />
                  </div>
                </div>
              </div>

            </div>

            {/* ⭐ SEARCH BUTTON */}
            <div className={`row ${styles.roh_searchbar_bottom}`}>
              <div className={styles.roh_searchbar_bottom_fields}>
                <div className={styles.search_block_wrap}>
                  <div className={`${styles.search_block_inner} rounded-pill`}>
                    <div className={styles.rent_search_btn}>
                      <button className="button theme-btn-new" type="submit">
                        Search <LuSearch size={18} />
                      </button>

                      <a href={pathname} className={styles.roh_search_clearBtn}>
                        Clear
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}