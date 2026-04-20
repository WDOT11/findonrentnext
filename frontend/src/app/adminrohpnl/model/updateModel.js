"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../admin.module.css";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function UpdateModelForm({ modelData, onClose, onSuccess }) {
  const [form, setForm] = useState({
    model_name: "",
    model_label: "",
    model_slug: "",
    model_old_slug: "",
    cat_id: "",
    sub_cat_id: "",
    brand_id: "",
    tag_id: "",
    description: "",
    model_picture_file: null,
    active: "1",
  });

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const token = getAuthToken();
  const admindtl = getAuthUser();
  const authUser = JSON.parse(admindtl || "{}");
  const authid = authUser?.id;

  /** * Helper: Convert string to URL-friendly slug
   */
  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  /** * Fetch Parent Categories on mount
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/category/getParent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.status && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [token]);

  /** * Prefill Form when modelData is passed
   */
  useEffect(() => {
    if (!modelData) return;

    setForm({
      model_name: modelData.model_name || "",
      model_label: modelData.model_label || "",
      model_slug: modelData.model_slug || "",
      model_old_slug: modelData.model_old_slug || "",
      cat_id: modelData.parent_category_id || "",
      sub_cat_id: modelData.sub_category_id || "",
      brand_id: modelData.brand_id || "",
      tag_id: modelData.tag_id || "",
      description: modelData.description || "",
      active: String(modelData.active ?? 1),
      model_picture_file: null,
    });

    if (modelData.image_url) {
      setPreview(modelData.image_url);
    } else {
      setPreview(null);
    }

    if (modelData.parent_category_id) {
      handleCategorySelect(modelData.parent_category_id, true);
    }
    if (modelData.sub_category_id) {
      handleSubCategorySelect(modelData.sub_category_id, true);
    }
  }, [modelData]);

  /** * Handle Main Category Selection
   */
  const handleCategorySelect = async (catId, isPrefill = false) => {
    if (!isPrefill) {
      setForm((prev) => ({
        ...prev,
        cat_id: catId,
        sub_cat_id: "",
        brand_id: "",
        tag_id: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, cat_id: catId }));
    }

    setSubCategories([]);
    setBrands([]);
    setTags([]);

    if (!catId) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/category/getSubCategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parent_category_id: catId }),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        setSubCategories(data.data.sub_categories || []);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  /** * Handle Subcategory Selection (Fetch Brands/Tags)
   */
  const handleSubCategorySelect = async (subCatId, isPrefill = false) => {
    if (!isPrefill) {
      setForm((prev) => ({
        ...prev,
        sub_cat_id: subCatId,
        brand_id: "",
        tag_id: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, sub_cat_id: subCatId }));
    }

    setBrands([]);
    setTags([]);

    if (!subCatId) return;

    try {
      const resBrand = await fetch(`${API_ADMIN_BASE_URL}/brand/dropdown`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cat_id: subCatId }),
      });
      const dataBrand = await resBrand.json();
      if (resBrand.ok && dataBrand.status) {
        setBrands(dataBrand.data.brands || []);
      }

      const resTag = await fetch(`${API_ADMIN_BASE_URL}/tag/getByCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sub_cat_id: subCatId }),
      });
      const dataTag = await resTag.json();
      if (resTag.ok && dataTag.status) {
        setTags(dataTag.data.tags || []);
      }
    } catch (err) {
      console.error("Error fetching brand/tag:", err);
    }
  };

  /** * Helper to get current brand slug from the loaded brands list
   */
  const getBrandSlug = (brandId) => {
    const brand = brands.find((b) => String(b.id) === String(brandId));
    return brand ? brand.brand_slug : "";
  };

  /** * Input Change Handler with Auto-Slug Generation
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "model_picture_file" && files?.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, model_picture_file: file }));
      setPreview(URL.createObjectURL(file));
    }
    else if (name === "model_name") {
      const bSlug = getBrandSlug(form.brand_id);
      const mSlug = convertToSlug(value);

      setForm((prev) => ({
        ...prev,
        model_name: value,
        // Prefix with brand slug if brand is selected, else just model slug
        model_slug: bSlug ? `${bSlug}-${mSlug}` : mSlug,
      }));
    }
    else if (name === "brand_id") {
      const bSlug = getBrandSlug(value); // 'value' is the new brand_id from select
      const mSlug = convertToSlug(form.model_name);

      setForm((prev) => ({
        ...prev,
        brand_id: value,
        // Update slug to: brandslug-modelslug
        model_slug: bSlug ? `${bSlug}-${mSlug}` : mSlug,
      }));
    }
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /** * Remove Image Preview
   */
  const removeImage = () => {
    setForm((prev) => ({ ...prev, model_picture_file: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** * Submit Updated Data
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validation List
    const requiredFields = [
      { field: form.model_name, label: "Model Name" },
      { field: form.model_slug, label: "Model Slug" },
      { field: form.cat_id, label: "Category" },
      { field: form.sub_cat_id, label: "Subcategory" },
      { field: form.brand_id, label: "Brand" },
      { field: form.tag_id, label: "Tag" },
    ];

    // Check if any required field is empty
    for (const item of requiredFields) {
      if (!item.field || String(item.field).trim() === "") {
        alert(`Please select or enter the ${item.label}.`);
        return;
      }
    }

    const fd = new FormData();
    fd.append("id", modelData.id);
    fd.append("model_name", form.model_name);
    fd.append("model_slug", form.model_slug);
    fd.append("model_label", form.model_label || "");
    fd.append("cat_id", form.cat_id); // Ensure category is sent if API needs it
    fd.append("sub_cat_id", form.sub_cat_id);
    fd.append("brand_id", form.brand_id);
    fd.append("tag_id", form.tag_id);
    fd.append("description", form.description || "");
    fd.append("active", Number(form.active));
    fd.append("edit_id", authid);

    if (form.model_picture_file) {
      fd.append("model_picture_file", form.model_picture_file);
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_ADMIN_BASE_URL}/model/update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        alert(data.message || "Failed to update model.");
        return;
      }

      alert("🎉 Model updated successfully!");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      alert("Something went wrong while updating model.");
    } finally {
      setLoading(false);
    }
  };

if (!modelData) return null;

  return (
    <div className={styles.formContainer}>
      <h4 className="mb-3">Edit Model: {form.model_name}</h4>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* MODEL NAME */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Model Name <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              name="model_name"
              value={form.model_name}
              onChange={handleChange}
              placeholder="e.g. iPhone 15 Pro"
            />
          </div>

          {/* MODEL SLUG (New Field) */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Model Slug <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              name="model_slug"
              value={form.model_slug}
              onChange={handleChange}
              placeholder="iphone-15-pro"
            />
            <small className="text-muted">Auto-generated from name, but can be edited.</small>
          </div>
        </div>

        <div className="row">
          {/* MODEL LABEL */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Model Label <small className="text-muted">(Optional)</small></label>
            <input
              type="text"
              className="form-control"
              name="model_label"
              value={form.model_label}
              onChange={handleChange}
              placeholder="e.g. New Arrival, 2024 Edition"
            />
          </div>

          {/* MODEL OLD SLUG (New Field) */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Model Old Slug <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              name="model_old_slug"
              value={form.model_old_slug}
              onChange={handleChange}
              placeholder="iphone-15-pro"
            />
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="mb-3">
          <label className="form-label">Model Image</label>
          <input
            type="file"
            name="model_picture_file"
            ref={fileInputRef}
            onChange={handleChange}
            className="form-control"
            accept="image/*"
          />
          {preview && (
            <div className="mt-3 position-relative d-inline-block">
              <img
                src={preview.startsWith("blob:") ? preview : `${WEB_BASE_URL}${preview}`}
                width={120}
                height={120}
                alt="Preview"
                style={{ objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle"
                style={{ borderRadius: "50%" }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter model details..."
          />
        </div>

        <hr />

        <div className="row">
          {/* CATEGORY */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Category<span className="text-danger"> *</span></label>
            <select
              className="form-select"
              value={form.cat_id}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* SUBCATEGORY */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Subcategory<span className="text-danger"> *</span></label>
            <select
              className="form-select"
              value={form.sub_cat_id}
              onChange={(e) => handleSubCategorySelect(e.target.value)}
              disabled={subCategories.length === 0}
            >
              <option value="">Select Subcategory</option>
              {subCategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          {/* BRAND */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Brand<span className="text-danger"> *</span></label>
            <select
              className="form-select"
              name="brand_id" // Crucial for handleChange logic
              value={form.brand_id}
              onChange={handleChange}
              disabled={brands.length === 0}
            >
              <option value="">Select Brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>
                  {b.brand_name || b.name}
                </option>
              ))}
            </select>
          </div>

          {/* TAG */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Tag<span className="text-danger"> *</span></label>
            <select
              className="form-select"
              name="tag_id"
              value={form.tag_id}
              onChange={handleChange}
              disabled={tags.length === 0}
            >
              <option value="">Select Tag</option>
              {tags.map(t => (
                <option key={t.id} value={t.id}>{t.tag_name || t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* STATUS */}
        <div className="mb-3 col-md-4">
          <label className="form-label">Status *</label>
          <select
            name="active"
            value={form.active}
            onChange={handleChange}
            className="form-select"
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="d-flex justify-content-end mt-4 border-top pt-3">
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-warning text-dark fw-bold" disabled={loading}>
            {loading ? "Updating..." : "Update Model"}
          </button>
        </div>
      </form>
    </div>
  );
}