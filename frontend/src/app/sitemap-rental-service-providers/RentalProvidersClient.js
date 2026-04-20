"use client";

import React from "react";
import "../globals.css";
import styles from "./rentalproviders.module.css";

const WEB_BASE_DOMAIN_URL =
  process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

const WEB_BASE_URL =
  process.env.NEXT_PUBLIC_WEB_BASE_URL;

const formatSlug = (slug) =>
  slug?.replace(/-/g, " ")
       ?.replace(/\b\w/g, (l) => l.toUpperCase());

export default function RentalProvidersClient({ locations = [] }) {

  // Remove empty locations
  const validLocations = locations.filter(
    (loc) => loc.vendors && loc.vendors.length > 0
  );

  // Sort alphabetically by city name
  const sortedLocations = [...validLocations].sort((a, b) =>
    formatSlug(a.slug).localeCompare(formatSlug(b.slug))
  );

  //  Group by first letter
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
    <section
      className={styles.roh_rental_providers_wrapper}
    >
      <div className={`${styles.roh_container} mt-5`}>

        <h1 className="text-center">
          Rental Service Providers
        </h1>

        {Object.keys(groupedByLetter).map((letter) => (
          <div key={letter} className="mb-sm-5 mb-4 mt-sm-5 mt-4">

            {groupedByLetter[letter].map((location) => (
              <div key={location.slug} className="mb-sm-5 mb-4 bg-white p-sm-4 p-3 rounded-4 shadow-sm">

                {/* ===== LOCATION TITLE ===== */}
                <div className="section-header text-start mb-sm-4 mb-3">
                  <h2 >
                    {formatSlug(location.slug)}
                  </h2>
                </div>

                {/* ===== VENDOR GRID ===== */}
                <div className={styles.roh_providers_grid}>
                  {location.vendors.map((vendor) => (
                    <a key={vendor.user_id} className={styles.roh_provider_card} href={`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${vendor.business_slug}`}
                            target="_blank"
                            rel="noopener">
                      <div className={styles.roh_provider_card_top}>
                        <img
                          src={
                            vendor.profile_image
                              ? WEB_BASE_URL + vendor.profile_image
                              : "/vendor-profiles/roh-provider-img.webp"
                          }
                          alt={`${vendor.business_name} rental service provider`}
                          className={styles.roh_provider_img}
                        />

                        <div className={styles.roh_provider_card_info}>
                            <h3>{vendor.business_name}</h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

              </div>
            ))}

          </div>
        ))}

      </div>
    </section>
  );
}
