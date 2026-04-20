"use client";
import { useState, useEffect, useRef } from "react";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddTagForm({ onSuccess, onClose }) {
  const initialFormState = {
    tag_name: "",
    cat_id: "",
    sub_cat_id: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchedOnce = useRef(false);

  const token = getAuthToken();
  const authUser = JSON.parse(getAuthUser());
  const authid = authUser.id;

  /** Fetch main categories */
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

        if (data.rcode === 0) {
          window.location.href = "/auth/admin";
          return;
        }

        if (res.ok && data.status === true) {
          setCategories(data.data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  /** Fetch subcategories */
  const handleCategorySelect = async (categoryId) => {
    setForm({ ...form, cat_id: categoryId, sub_cat_id: "" });
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

      if (res.ok && data.status === true) {
        setSubCategories(data.data.sub_categories || []);
      }
    } catch (err) {
      console.error("Error fetching sub-categories:", err);
    }
  };

  /** Handle input */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  /** Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.tag_name) {
      setErrorMessage("Tag Name is required.");
      return;
    }

    const payload = {
      tag_name: form.tag_name,
      cat_id: form.sub_cat_id || null,
      add_id: authid,
    };

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/tag/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        setErrorMessage(data.message || "Error creating tag.");
        return;
      }

      alert("Tag created successfully!");
      setForm(initialFormState);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Error creating tag:", err);
      setErrorMessage("Unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      <div className="row g-3">

        {/* Tag Name */}
        <div className="col-md-6">
          <label className="form-label">
            Tag Name <span className="text-danger">*</span>
          </label>
          <input type="text" name="tag_name" value={form.tag_name} onChange={handleChange} className="form-control" required/>
        </div>

        {/* Category Dropdown */}
        <div className="col-md-6">
          <label className="form-label">Select Category</label>
          <select name="cat_id" value={form.cat_id} onChange={(e) => handleCategorySelect(e.target.value)} className="form-select">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        {subCategories.length > 0 && (
          <div className="col-md-6">
            <label className="form-label">Select Subcategory</label>
            <select name="sub_cat_id" value={form.sub_cat_id} onChange={handleChange} className="form-select">
              <option value="">Select Subcategory</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="modal-footer justify-content-between mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" className="btn btn-success">
          Register Tag
        </button>
      </div>
    </form>
  );
}