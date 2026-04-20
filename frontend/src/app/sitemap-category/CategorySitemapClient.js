"use client";

import React from "react";
import "../globals.css";
import styles from "./sitemap-category.module.css";

const WEB_BASE_DOMAIN_URL =
  process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function SitemapCategoryClient({ categories = [] }) {

  return (
    <><div
      className={styles.fleetswrap_inner}
      aria-labelledby="our-fleets-heading"
    >
      <div className={styles.fleets_wrap_main}>
      <div className={`${styles.roh_container} mt-5`}>
          <h1 className="mb-4">Categories</h1>
        <div className={styles.roh_seo_links_section}>
          

          {categories.length > 0 ? (
            categories.map((category) => {

              const modelsArray =
                Array.isArray(category?.models) ? category.models : (category?.models?.models || []);

              if (!modelsArray.length) return null;

              return (
                <div key={category.id} className="mb-2">

                  {/* ===== CATEGORY TITLE ===== */}
                  <h2 className="mb-3 border-bottom">
                    <a href={`${WEB_BASE_DOMAIN_URL}/${category.slug}`}>
                      {category.name}
                    </a>
                  </h2>

                  {/* ===== MODEL LINKS ===== */}
                  <div className={styles.roh_seo_links_block}>
                    {modelsArray.map((model) => {
                      const link = `${WEB_BASE_DOMAIN_URL}/${category.slug}/${model.model_slug}`;

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
            })
          ) : (
            <p>No categories found.</p>
          )}

        </div>
      </div>
      </div>
      </div>
    </>
  );
}
