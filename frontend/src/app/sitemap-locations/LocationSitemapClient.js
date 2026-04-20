"use client";

import React from "react";
import "../globals.css";
import styles from "./sitemap-locations.module.css";

const WEB_BASE_DOMAIN_URL =
  process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

const formatSlug = (slug) =>
  slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (l) => l.toUpperCase());

export default function SitemapLocationsClient({ locations = [] }) {

  // 1 Remove empty locations
  const validLocations = locations.filter(
    (loc) => loc.categories && loc.categories.length > 0
  );

  // 2 Sort alphabetically
  const sortedLocations = [...validLocations].sort((a, b) =>
    formatSlug(a.slug).localeCompare(formatSlug(b.slug))
  );

  // 3 Group by first letter
  const groupedByLetter = {};

  sortedLocations.forEach((loc) => {
    const cityName = formatSlug(loc.slug);
    const firstLetter = cityName.charAt(0).toUpperCase();

    if (!groupedByLetter[firstLetter]) {
      groupedByLetter[firstLetter] = [];
    }

    groupedByLetter[firstLetter].push(loc);
  });

  return (
    <div
      className={styles.fleetswrap_inner}
      aria-labelledby="our-fleets-heading"
    >
      <div className={styles.fleets_wrap_main}>
        <div className={`${styles.roh_container} mt-5`}>

          <h1 className="mb-4 mb-sm-5 text-center">
            Locations
          </h1>

          {Object.keys(groupedByLetter).map((letter) => (
            <div key={letter} className={styles.roh_seo_location_groupWrapper}>

              {groupedByLetter[letter].map((location) => (
                <div key={location.slug} className={styles.roh_seo_links_section}>

                  {/* ===== LOCATION TITLE ===== */}
                  <h2 className="mb-3 pb-sm-1 pb-2 border-bottom">
                    <a href={`${WEB_BASE_DOMAIN_URL}/${location.slug}`}>
                      {formatSlug(location.slug)}
                    </a>
                  </h2>

                  {/* ===== CATEGORY SECTIONS ===== */}
                  {location.categories.map((cat) => {
                    if (!cat.models || cat.models.length === 0) return null;

                    return (
                      <div key={cat.category_id} className="mb-4 ms-sm-3 ms-1">

                        <h3 className="mb-2">
                          <a href={`${WEB_BASE_DOMAIN_URL}/${cat.category_slug}/${location.slug}`}>
                            {cat.category_name}
                          </a>
                        </h3>

                        <div className={styles.roh_seo_links_block}>
                          {cat.models.map((model) => {

                            const link =
                              `${WEB_BASE_DOMAIN_URL}/${cat.category_slug}/${model.model_slug}/${location.slug}`;

                            const displayText =
                              `Rent a ${model.model_label || model.model_name}`;

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
              ))}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}