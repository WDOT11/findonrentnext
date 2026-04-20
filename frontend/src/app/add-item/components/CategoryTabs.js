"use client";

import { useState, useEffect } from "react";
import styles from "../additem.module.css";

/*
  Dynamic Helper Export
*/
export const extractCategoryIds = (categories) => {
  return categories?.map((cat) => cat.id) || [];
};

export const CategoryTabs = ({ categories, onSelect, children }) => {
  const [activeTab, setActiveTab] = useState(categories?.[0]?.id || null);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[0].id);
      onSelect(categories[0]); // Auto-select first category
    }
  }, [categories]);

  const handleClick = (cat) => {
    setActiveTab(cat.id);
    onSelect(cat);
  };

  return (
    <div className="category-tabs">

      {/* ------- NAV TABS ------- */}
      <ul
        className={`nav nav-pills d-flex justify-content-start flex-wrap gap-2 mb-4 rounded-3 shadow-sm sticky-top ${styles.roh_tabNav_header}`}
      >
        {categories.map((cat) => (
          <li className="nav-item flex-1 text-center" key={cat.id}>
            <button
              type="button"
              className={`nav-link d-flex align-items-center justify-content-center gap-2 py-2 ${styles.roh_catTab} ${
                activeTab === cat.id ? "active" : ""
              }`}
              onClick={() => handleClick(cat)}
            >
              <span className="d-sm-inline">{cat.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ------- TAB CONTENT ------- */}
      <div className="tab-content mt-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`tab-pane fade ${activeTab === cat.id ? "show active" : ""}`}
          >
            {children(cat)}
          </div>
        ))}
      </div>

    </div>
  );
};
