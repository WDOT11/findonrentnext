"use client";

import { useEffect, useState, useCallback } from "react";
import { LuPlus, LuTrash2, LuUpload, LuX } from "react-icons/lu";
import styles from "./additem.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function AircraftForm({ subCategory, data, setData }) {
  const [brands, setBrands] = useState([]);
  const [modelsByItem, setModelsByItem] = useState({});

  // 1. Define default structure (Empty for aircraft unless you have specific defaults)
  const defaultItem = {
    images: []
  };
  // Ensure items is always an array
  const rawData = data.itemsBySubCategory?.[subCategory.id];
  const items = Array.isArray(rawData) && rawData.length > 0 ? rawData.map(item => ({ images: [], ...item })) : [defaultItem];

  /* ------------------------------------------------
    HELPERS (Functional State Updates)
  ------------------------------------------------ */
  const updateField = (index, field, value) => {
    setData((prev) => {
      const currentSubCatItems = prev.itemsBySubCategory?.[subCategory.id] || [defaultItem];
      const updatedItems = [...currentSubCatItems];

      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      return {
        ...prev,
        itemsBySubCategory: {
          ...prev.itemsBySubCategory,
          [subCategory.id]: updatedItems,
        },
      };
    });
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      itemsBySubCategory: {
        ...prev.itemsBySubCategory,
        [subCategory.id]: [...items, { images: [] }]},
    }));
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    const updatedItems = items.filter((_, i) => i !== index);

    // Clean up model state for the deleted index
    const newModels = { ...modelsByItem };
    delete newModels[index];
    setModelsByItem(newModels);

    setData((prev) => ({
      ...prev,
      itemsBySubCategory: {
        ...prev.itemsBySubCategory,
        [subCategory.id]: updatedItems,
      },
    }));
  };

  /* ------------------------------------------------
    IMAGE HANDLERS
  ------------------------------------------------ */
  const handleImageUpload = (e, index) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      const currentImages = items[index].images || [];

      updateField(index, "images", [...currentImages, ...newImages]);

      e.target.value = "";
    }
  };

  const removeImage = (itemIndex, imgIndex) => {
    const currentImages = items[itemIndex].images || [];
    const updatedImages = currentImages.filter((_, i) => i !== imgIndex);
    updateField(itemIndex, "images", updatedImages);
  };

  /* ------------------------------------------------
      API FETCHING
  ------------------------------------------------ */
  const fetchModels = useCallback(async (brandId, index) => {
    if (!brandId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/modelsByBrand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandId }),
      });
      const json = await res.json();
      setModelsByItem((prev) => ({ ...prev, [index]: json.models || [] }));
    } catch {
      setModelsByItem((prev) => ({ ...prev, [index]: [] }));
    }
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/brandsByCategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cat_id: subCategory.id }),
        });
        const json = await res.json();
        setBrands(json.brands || []);
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, [subCategory.id]);

  // Re-fetch models if data exists on mount (e.g. edit mode)
  useEffect(() => {
    items.forEach((item, idx) => {
      if (item.brand_id && !modelsByItem[idx]) {
        fetchModels(item.brand_id, idx);
      }
    });
  }, [items, modelsByItem, fetchModels]);

  return (
    <div className={styles.roh_additemForm}>
      {items.map((item, index) => (
        <div key={index} className="border p-4 rounded mb-4 bg-white shadow-sm position-relative">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 text-dark">Aircraft #{index + 1}</h5>
            {items.length > 1 && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeItem(index)}
              >
                <LuTrash2 size={16} /> Remove
              </button>
            )}
          </div>

          {/* BRAND SELECTION */}
          <div className="mb-3">
            <label className="form-label fw-bold">Select Manufacturer <span className="text-danger">*</span></label>
            <div className="d-flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  type="button"
                  key={brand.id}
                  className={String(item.brand_id) === String(brand.id) ? styles.roh_brandtab_active : styles.roh_brandtab}
                  onClick={() => {
                    updateField(index, "brand_id", brand.id);
                    updateField(index, "brand_name", brand.brand_name);
                    updateField(index, "model_id", null);
                    updateField(index, "model_name", null);
                    fetchModels(brand.id, index);
                  }}
                >
                  {brand.brand_name}
                </button>
              ))}
            </div>
          </div>

          {/* MODEL SELECTION */}
          {item.brand_id && (
            <div className="mb-3">
              <label className="form-label fw-bold">Select Model <span className="text-danger">*</span></label>
              <div className="d-flex flex-wrap gap-2">
                {modelsByItem[index]?.map((model) => (
                  <button
                    type="button"
                    key={model.id}
                    className={String(item.model_id) === String(model.id) ? styles.roh_brandtab_active : styles.roh_brandtab}
                    onClick={() => {
                      const isSelected = String(item.model_id) === String(model.id);
                      updateField(index, "model_id", isSelected ? null : model.id);
                      updateField(index, "model_name", isSelected ? null : model.model_name);
                    }}
                  >
                    {model.model_name}
                  </button>
                )) || <p className="small text-muted">Loading models...</p>}
              </div>
            </div>
          )}

          {/* TITLE AND PRICE */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Aircraft Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Cessna Citation CJ4"
                value={item.title || ""}
                onChange={(e) => updateField(index, "title", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0.00"
                  value={item.pricePerDay || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    updateField(index, "pricePerDay", val);
                  }}
                />
              </div>
            </div>
          </div>

          {/* ---------------- IMAGE UPLOAD SECTION ---------------- */}
          <div className="mb-3 mt-4">
            <label className="form-label fw-bold">Aircraft Images</label>

            <div className="d-flex flex-wrap gap-3 align-items-start">

              {/* Upload Button */}
              <div>
                <input type="file" id={`aircraft-image-${index}`} multiple accept="image/*" className="d-none" onChange={(e) => handleImageUpload(e, index)}/>
                <label htmlFor={`aircraft-image-${index}`} className="btn btn-outline-primary d-flex flex-column align-items-center justify-content-center" style={{ width: "100px", height: "100px", borderStyle: "dashed" }}>
                  <LuUpload size={24} className="mb-1" />
                  <span style={{ fontSize: "12px" }}>Upload</span>
                </label>
              </div>

              {/* Image Previews */}
              {item.images?.map((img, imgIdx) => (
                <div key={imgIdx} className="position-relative rounded overflow-hidden border" style={{ width: "100px", height: "100px" }}>
                  <img src={img.preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", borderRadius: "0 0 0 4px" }} onClick={() => removeImage(index, imgIdx)}>
                    <LuX size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="form-text small">
              Upload multiple images. Accepted formats: .jpg, .png, .jpeg
            </div>
          </div>
          {/* ---------------- END IMAGE UPLOAD SECTION ---------------- */}

        </div>
      ))}

      <button
        type="button"
        className="btn btn-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-2"
        onClick={addItem}
      >
        <LuPlus /> Add Another Aircraft
      </button>
    </div>
  );
}