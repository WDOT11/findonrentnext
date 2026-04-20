"use client";
import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function BrandUpdateForm({ brandData, onSuccess, onClose }) {
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  /** Form state */
  const [form, setForm] = useState({
    id: brandData?.id || "",
    brand_name: brandData?.brand_name || "",
    main_cat_id: "",
    sub_cat_id: "",
  });

  const [categories, setCategories] = useState([]); // all main categories
  const [subCategories, setSubCategories] = useState([]); // filtered subs of selected main

  /**  Initialize form with brand data */
  useEffect(() => {
    if (brandData) {
      setForm((prev) => ({
        ...prev,
        id: brandData.id || "",
        brand_name: brandData.brand_name || "",
      }));
    }
  }, [brandData]);

  /** Fetch all active categories with subcategories */
  useEffect(() => {
      const fetchCategories = async () => {
          try {
              const res = await fetch(`${API_ADMIN_BASE_URL}/category/getAllActiveWithChildren`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              const data = await res.json();

              if (res.ok && data.status && data.data.mainCats) {
                  setCategories(data.data.mainCats);

                  // Identify which category/subcategory the brand belongs to
                  const allSubs = data.data.mainCats.flatMap((m) => m.subcategories);
                  const foundSub = allSubs.find((sub) => sub.cat_id == brandData.cat_id);

                  if (foundSub) {
                      // Brand belongs to a subcategory
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
                      // Brand belongs to a main category
                      setForm((prev) => ({
                      ...prev,
                      main_cat_id: brandData.cat_id,
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
  }, [brandData]);

  /** Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /** Handle main category change → load subcategories */
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

  /** Submit updated brand */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: form.id,
      brand_name: form.brand_name,
      cat_id: form.sub_cat_id || form.main_cat_id || null,
      edit_id: authid,
    };

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/brand/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        alert(data.message || "Error updating brand.");
        return;
      }

      alert("🎉 Brand updated successfully!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Error updating brand:", err);
      alert("Something went wrong while updating brand.");
    }
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content shadow-lg">

            {/* HEADER */}
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title">✏️ Edit Brand: {form.brand_name}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <form className="modal-body" onSubmit={handleSubmit}>

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
                  <input
                    type="text"
                    id="brand_name"
                    name="brand_name"
                    value={form.brand_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* MAIN CATEGORY */}
                <div className="col-md-6">
                  <label htmlFor="main_cat_id" className="form-label">Main Category</label>
                  <select
                    id="main_cat_id"
                    name="main_cat_id"
                    value={form.main_cat_id}
                    onChange={handleMainCategoryChange}
                    className="form-select"
                  >
                    <option value="">Select Main Category</option>
                    {categories.map((cat) => (
                      <option key={cat.cat_id} value={cat.cat_id}>
                        {cat.cat_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUB CATEGORY (if available) */}
                {subCategories.length > 0 && (
                  <div className="col-md-12">
                    <label htmlFor="sub_cat_id" className="form-label">Subcategory</label>
                    <select
                      id="sub_cat_id"
                      name="sub_cat_id"
                      value={form.sub_cat_id}
                      onChange={handleChange}
                      className="form-select"
                    >
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

              {/* FOOTER BUTTONS */}
              <div className="modal-footer justify-content-between mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-warning">
                  💾 Update Brand
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </>
  );

}