"use client";
import { useState, useEffect, useRef } from "react";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function TagUpdateForm({ tagData, onSuccess, onClose }) {
  const token = getAuthToken();
  const authUser = JSON.parse(getAuthUser());
  const authid = authUser.id;

  const [form, setForm] = useState({
    id: "",
    tag_name: "",
    main_cat_id: "",
    sub_cat_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Load tag data
  useEffect(() => {
    if (tagData) {
      setForm((prev) => ({
        ...prev,
        id: tagData.id,
        tag_name: tagData.tag_name,
      }));
    }
  }, [tagData]);

  // Fetch categories and detect selected category + child
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/category/getAllActiveWithChildren`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.status && data.data.mainCats) {
          setCategories(data.data.mainCats);

          const allSubs = data.data.mainCats.flatMap((m) => m.subcategories);
          const foundSub = allSubs.find((sub) => sub.cat_id == tagData.cat_id);

          if (foundSub) {
            const parentMain = data.data.mainCats.find(
              (m) => m.cat_id == foundSub.parent_category_id
            );

            setForm((prev) => ({
              ...prev,
              main_cat_id: parentMain?.cat_id || "",
              sub_cat_id: foundSub.cat_id,
            }));

            setSubCategories(parentMain?.subcategories || []);
          } else {
            setForm((prev) => ({
              ...prev,
              main_cat_id: tagData.cat_id,
              sub_cat_id: "",
            }));

            setSubCategories([]);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [tagData]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  // Handle category change
  const handleMainCategoryChange = (e) => {
    const mainCatId = e.target.value;

    setForm({
      ...form,
      main_cat_id: mainCatId,
      sub_cat_id: "",
    });

    const selectedMain = categories.find((cat) => cat.cat_id == mainCatId);
    setSubCategories(selectedMain?.subcategories || []);
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.tag_name) {
      setErrorMessage("Tag Name is required.");
      return;
    }

    const payload = {
      id: form.id,
      tag_name: form.tag_name,
      cat_id: form.sub_cat_id || form.main_cat_id || null,
      edit_id: authid,
    };

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/tag/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        setErrorMessage(data.message || "Error updating tag.");
        return;
      }

      alert("Tag updated successfully!");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Error updating tag:", err);
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

        {/* TAG NAME */}
        <div className="col-md-6">
          <label className="form-label">
            Tag Name <span className="text-danger">*</span>
          </label>
          <input type="text" name="tag_name" value={form.tag_name} onChange={handleChange} className="form-control" required/>
        </div>

        {/* MAIN CATEGORY SELECT */}
        <div className="col-md-6">
          <label className="form-label">Main Category</label>
          <select name="main_cat_id" value={form.main_cat_id} onChange={handleMainCategoryChange} className="form-select">
            <option value="">Select Main Category</option>
            {categories.map((cat) => (
              <option key={cat.cat_id} value={cat.cat_id}>
                {cat.cat_name}
              </option>
            ))}
          </select>
        </div>

        {/* SUBCATEGORY SELECT */}
        {subCategories.length > 0 && (
          <div className="col-md-6">
            <label className="form-label">Subcategory</label>
            <select name="sub_cat_id" value={form.sub_cat_id} onChange={handleChange} className="form-select">
              <option value="">Select Subcategory</option>
              {subCategories.map((sub) => (
                <option key={sub.cat_id} value={sub.cat_id}>
                  {sub.cat_name}
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

        <button type="submit" className="btn btn-warning">
          💾 Update Tag
        </button>
      </div>
    </form>
  );
}