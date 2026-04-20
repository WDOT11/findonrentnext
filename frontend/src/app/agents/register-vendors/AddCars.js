"use client";

import { useEffect, useState, useCallback } from "react";
// Added LuUpload and LuX for the image section
import { LuPlus, LuTrash2, LuUpload, LuX } from "react-icons/lu";
import styles from "./additem.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function CarForm({ subCategory, data, setData }) {
  const [brands, setBrands] = useState([]);
  const [modelsByItem, setModelsByItem] = useState({});

  const rawData = data.itemsBySubCategory?.[subCategory.id];
  // Ensure items is an array
  const items = Array.isArray(rawData) ? rawData : [{}];

  /* ------------------------------------------------
      FETCH MODELS (Memoized)
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

  /* ------------------------------------------------
      FETCH BRANDS ON MOUNT
  ------------------------------------------------ */
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

  /* ------------------------------------------------
      RE-FETCH MODELS FOR EXISTING DATA
  ------------------------------------------------ */
  useEffect(() => {
    items.forEach((item, idx) => {
      if (item.brand_id && !modelsByItem[idx]) {
        fetchModels(item.brand_id, idx);
      }
    });
  }, [items, modelsByItem, fetchModels]);

  /* ------------------------------------------------
    HELPERS
  ------------------------------------------------ */
  const updateField = (index, field, value) => {
    setData((prev) => {
      const currentSubCatItems = prev.itemsBySubCategory?.[subCategory.id] || [{}];
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
    const newItem = {
      brand_id: null,
      model_id: null,
      title: "",
      pricePerDay: "",
      securityDeposit: "",
      transmission: "",
      engine: "",
      images: [], // Initialize empty images array
    };
    const updatedItems = [...items, newItem];
    setData((prev) => ({
      ...prev,
      itemsBySubCategory: {
        ...prev.itemsBySubCategory,
        [subCategory.id]: updatedItems,
      },
    }));
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    const updatedItems = items.filter((_, i) => i !== index);

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

      // Create objects with file data and a preview URL
      const newImages = files.map((file) => ({
        file, // The actual File object to send to the backend
        preview: URL.createObjectURL(file), // Local preview URL
      }));

      // Merge with existing images
      const currentImages = items[index].images || [];
      updateField(index, "images", [...currentImages, ...newImages]);

      // Reset input value so same file can be selected again if needed
      e.target.value = "";
    }
  };

  const removeImage = (itemIndex, imgIndex) => {
    const currentImages = items[itemIndex].images || [];
    const updatedImages = currentImages.filter((_, i) => i !== imgIndex);
    updateField(itemIndex, "images", updatedImages);
  };

  return (
    <div className={styles.roh_additemForm}>
      {items.map((item, index) => (
        <div key={index} className="border p-4 rounded mb-4 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0 text-dark">Car #{index + 1}</h5>
            {items.length > 1 && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeItem(index)}
              >
                <LuTrash2 size={16} /> Remove Car
              </button>
            )}
          </div>

          {/* BRAND SELECTION */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Select Brand <span className="text-danger">*</span>
            </label>
            <div className="d-flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  type="button"
                  key={brand.id}
                  className={
                    String(item.brand_id) === String(brand.id)
                      ? styles.roh_brandtab_active
                      : styles.roh_brandtab
                  }
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
              <label className="form-label fw-bold">
                Select Model <span className="text-danger">*</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {modelsByItem[index]?.map((model) => (
                  <button
                    type="button"
                    key={model.id}
                    className={
                      String(item.model_id) === String(model.id)
                        ? styles.roh_brandtab_active
                        : styles.roh_brandtab
                    }
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

          {/* CAR NAME & TRANSMISSION */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Car Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Swift VXI 2023"
                value={item.title || ""}
                onChange={(e) => updateField(index, "title", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Transmission Type (Optional)</label>
              <select
                className="form-select"
                value={item.transmission || ""}
                onChange={(e) => updateField(index, "transmission", e.target.value)}
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="IMT">IMT</option>
              </select>
            </div>
          </div>

          {/* PRICING */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Engine Type (Optional)</label>
              <select
                className="form-select"
                value={item.engine || ""}
                onChange={(e) => updateField(index, "engine", e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small">Price Per Day (Optional)</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  value={item.pricePerDay || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    updateField(index, "pricePerDay", val);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold small">Security Deposit (Optional)</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control"
                  value={item.securityDeposit || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    updateField(index, "securityDeposit", val);
                  }}
                />
              </div>
            </div>
          </div>

          {/* ---------------- IMAGE UPLOAD SECTION ---------------- */}
          <div className="mb-3">
            <label className="form-label fw-bold">Car Images</label>
            <div className="d-flex flex-wrap gap-3 align-items-start">
              {/* Hidden File Input & Upload Button */}
              <div>
                <input
                  type="file"
                  id={`car-image-${index}`}
                  multiple
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => handleImageUpload(e, index)}
                />
                <label
                  htmlFor={`car-image-${index}`}
                  className="btn btn-outline-primary d-flex flex-column align-items-center justify-content-center"
                  style={{ width: "100px", height: "100px", borderStyle: "dashed" }}
                >
                  <LuUpload size={24} className="mb-1" />
                  <span style={{ fontSize: "12px" }}>Upload</span>
                </label>
              </div>

              {/* Image Previews */}
              {item.images?.map((img, imgIdx) => (
                <div
                  key={imgIdx}
                  className="position-relative rounded overflow-hidden border"
                  style={{ width: "100px", height: "100px" }}
                >
                  <img
                    src={img.preview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center"
                    style={{ width: "20px", height: "20px", borderRadius: "0 0 0 4px" }}
                    onClick={() => removeImage(index, imgIdx)}
                  >
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
        <LuPlus /> Add Another Car
      </button>
    </div>
  );
}