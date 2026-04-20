"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../admin.module.css";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddBrandForm({ onSuccess, onClose }) {
  const initialFormState = {
    brand_name: "",
    cat_id: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const fetchedOnce = useRef(false);
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  /** Fetch categories to attach brand under a category */
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

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
        if (data.rcode == 0) {
          window.location.href = "/auth/admin";
          return;
        }

        if (res.ok && data.status === true && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        } else {
          console.error("Failed to fetch categories:", data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [token]);

  /** Fetch sub-categories when a category is selected */
  const handleCategorySelect = async (categoryId) => {
    setForm((prev) => ({ ...prev, cat_id: categoryId, sub_cat_id: "" }));
    setSubCategories([]);

    if (!categoryId) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/category/getSubCategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parent_category_id: categoryId }),
      });

      const data = await res.json();
      if (res.ok && data.status === true && Array.isArray(data.data.sub_categories)) {
        setSubCategories(data.data.sub_categories);
      } else {
        console.error("Failed to fetch sub-categories:", data);
      }
    } catch (err) {
      console.error("Error fetching sub-categories:", err);
    }
  };

  /** Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /** Handle submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Build payload (JSON, not FormData)
    const payload = {
      brand_name: form.brand_name,
      cat_id: form.sub_cat_id || null,
      add_id: authid,
    };

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/brand/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      //  Handle backend validation or errors
      if (!res.ok || data.status === false) {
        alert(data.message || "Error creating brand.");
        return;
      }

      //  Reset form & refresh list if applicable
      setForm(initialFormState);
      if (onSuccess) onSuccess();
      if (onClose) onClose();

      alert("🎉 Brand created successfully!");
    } catch (err) {
      console.error("❌ Error creating brand:", err);
      alert("Something went wrong. Please try again.");
    }
  };

return (
  <form onSubmit={handleSubmit}>

    {/* ERROR MESSAGE */}
    {/* {errorMessage && (
      <div className="alert alert-danger" role="alert">
        {errorMessage}
      </div>
    )} */}

    <div className="row g-3">

      {/* BRAND NAME */}
      <div className="col-md-6">
        <label htmlFor="brand_name" className="form-label">
          Brand Name <span className="text-danger">*</span>
        </label>
        <input type="text" id="brand_name" name="brand_name" value={form.brand_name} onChange={handleChange} className="form-control" required />
      </div>

      {/* CATEGORY */}
      <div className="col-md-6">
        <label htmlFor="cat_id" className="form-label">Category</label>
        <select id="cat_id" name="cat_id" value={form.cat_id} onChange={(e) => handleCategorySelect(e.target.value)} className="form-select">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* SUB CATEGORY (only show when available) */}
      {subCategories.length > 0 && (
        <div className="col-md-12">
          <label htmlFor="sub_cat_id" className="form-label">Sub Category</label>
          <select id="sub_cat_id" name="sub_cat_id" value={form.sub_cat_id} onChange={handleChange} className="form-select">
            <option value="">Select Sub Category</option>
            {subCategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

    </div>

    {/* FOOTER BUTTONS */}
    <div className="modal-footer d-flex justify-content-between mt-4 border-top">
      <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="btn btn-success">
        Register Brand
      </button>
    </div>

  </form>
);

}