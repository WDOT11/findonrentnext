"use client";
import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddModelForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    model_name: "",
    model_label: "",
    model_slug: "", // Added here
    description: "",
    cat_id: "",
    sub_cat_id: "",
    brand_id: "",
    tag_id: "",
    model_picture_file: null
  });

  const token = getAuthToken();
  const admindtl = getAuthUser();
  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to create a slug
  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  /** * Helper to get current brand slug
   */
  const getBrandSlug = (brandId) => {
    const brand = brands.find((b) => String(b.id) === String(brandId));
    return brand ? brand.brand_slug : "";
  };

  /** * Updated handleChange
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "model_name") {
      const bSlug = getBrandSlug(form.brand_id);
      const mSlug = convertToSlug(value);

      setForm((prev) => ({
        ...prev,
        model_name: value,
        // Prefix with brand slug if brand is selected
        model_slug: bSlug ? `${bSlug}-${mSlug}` : mSlug,
      }));
    }
    else if (name === "brand_id") {
      const bSlug = getBrandSlug(value); // value is the new brand_id
      const mSlug = convertToSlug(form.model_name);

      setForm((prev) => ({
        ...prev,
        brand_id: value,
        // When brand changes, update slug to: brandslug-modelslug
        model_slug: bSlug ? `${bSlug}-${mSlug}` : mSlug,
      }));
    }
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /** Fetch parent categories on mount */
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

  /** Handle main category select → fetch subcategories */
  const handleCategorySelect = async (catId) => {
    setForm((prev) => ({
      ...prev,
      cat_id: catId,
      sub_cat_id: "",
      brand_id: "",
      tag_id: "",
    }));
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
      if (res.ok && data.status && Array.isArray(data.data.sub_categories)) {
        setSubCategories(data.data.sub_categories);
      }
    } catch (err) {
      console.error("❌ Error fetching subcategories:", err);
    }
  };

  /** Handle subcategory select → fetch brands + tags */
  const handleSubCategorySelect = async (subCatId) => {
    setForm((prev) => ({
      ...prev,
      sub_cat_id: subCatId,
      brand_id: "",
      tag_id: "",
    }));
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
      if (resBrand.ok && dataBrand.status && Array.isArray(dataBrand.data.brands)) {
        setBrands(dataBrand.data.brands);
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
      if (resTag.ok && dataTag.status && Array.isArray(dataTag.data.tags)) {
        setTags(dataTag.data.tags);
      }
    } catch (err) {
      console.error("❌ Error fetching brands or tags:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    const requiredFields = [
      { value: form.model_name, label: "Model Name" },
      { value: form.model_slug, label: "Model Slug" },
      { value: form.cat_id, label: "Category" },
      { value: form.sub_cat_id, label: "Subcategory" },
      { value: form.brand_id, label: "Brand" },
      { value: form.tag_id, label: "Tag" },
    ];

    for (const item of requiredFields) {
      if (!item.value || String(item.value).trim() === "") {
        alert(`Please fill in or select the ${item.label}.`);
        return; // Stop execution
      }
    }

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("model_name", form.model_name);
    formData.append("model_slug", form.model_slug);
    formData.append("description", form.description || "");
    formData.append("add_id", authid);
    formData.append("model_label", form.model_label || "");
    formData.append("cat_id", form.cat_id);
    formData.append("sub_cat_id", form.sub_cat_id);
    formData.append("brand_id", form.brand_id);
    formData.append("tag_id", form.tag_id);

    if (form.model_picture_file) {
      formData.append("model_picture_file", form.model_picture_file);
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_ADMIN_BASE_URL}/model/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        alert(data.message || "Failed to create model.");
        return;
      }

      alert("🎉 Model created successfully!");
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      alert("Something went wrong while creating model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-3">Add New Model</h4>

      <form onSubmit={handleSubmit}>

        {/* MODEL NAME */}
        <div className="mb-3">
          <label className="form-label">Model Name <span className="text-danger">*</span></label>
          <input type="text" name="model_name" className="form-control" value={form.model_name} onChange={handleChange} placeholder="Enter model name"/>
        </div>

        {/* Model Picture */}
        <div className="col-12">
          <label htmlFor="model_picture_file" className="form-label">Model Picture (Optional)</label>
          {/* <input type="file" id="model_picture_file" name="model_picture_file" accept="image/*" onChange={handleChange} className="form-control"/> */}
          <input type="file" id="model_picture_file" name="model_picture_file" accept="image/*" className="form-control"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                model_picture_file: e.target.files[0] || null,
              }))
            }
          />
        </div>

        {/* MODEL LABEL (New Field) */}
        <div className="mb-3">
          <label className="form-label">Model Label <small className="text-muted">(Optional)</small></label>
          <input
            type="text"
            name="model_label"
            className="form-control"
            value={form.model_label}
            onChange={handleChange}
            placeholder="e.g. New Arrival, Best Seller, Hot"
          />
        </div>

        {/* MODEL SLUG */}
        <div className="mb-3">
          <label className="form-label">Model Slug <span className="text-danger">*</span></label>
          <input
            type="text"
            name="model_slug"
            className="form-control"
            value={form.model_slug}
            onChange={handleChange}
            placeholder="Insert the slug for model page url"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" rows="3" className="form-control" value={form.description} onChange={handleChange} placeholder="Enter model description..."></textarea>
        </div>

        {/* MAIN CATEGORY */}
        <div className="mb-3">
          <label className="form-label">Category<span className="text-danger"> *</span></label>
          <select name="cat_id" className="form-select" value={form.cat_id} onChange={(e) => handleCategorySelect(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* SUB CATEGORY */}
        {subCategories.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Subcategory<span className="text-danger"> *</span></label>
            <select name="sub_cat_id" className="form-select" value={form.sub_cat_id} onChange={(e) => handleSubCategorySelect(e.target.value)}>
              <option value="">Select Subcategory</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BRAND */}
        {brands.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Brand<span className="text-danger"> *</span></label>
            <select
              name="brand_id"
              className="form-select"
              value={form.brand_id}
              onChange={handleChange} // This now triggers the prefix logic
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.brand_name || b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* TAG */}
        {tags.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Tag<span className="text-danger"> *</span></label>
            <select name="tag_id" className="form-select" value={form.tag_id} onChange={handleChange}>
              <option value="">Select Tag</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.tag_name || tag.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Saving..." : "Save Model"}
          </button>
        </div>

      </form>
    </div>
  );
}