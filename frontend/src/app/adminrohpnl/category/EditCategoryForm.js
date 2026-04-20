'use client'
import { useState, useEffect, useRef } from "react";
import styles from "./css/category.module.css";
import { getAuthToken, getAuthUser } from "../../../utils/utilities";
import { useRouter } from "next/navigation";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function EditCategoryForm({ category, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_category_id: "",
    description: "",
    category_picture_file: null,
    active: '1',
    cate_available: '1',

  });

  const [preview, setPreview] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingParents, setLoadingParents] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);

  const token = getAuthToken();
  const admindtl = getAuthUser();
  const router = useRouter();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  const fileInputRef = useRef(null);

  // Load category data
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        sinName: category.cat_singular_name || "",
        parent_category_id: category.parent_category_id
          ? String(category.parent_category_id)
          : "",
        description: category.description || "",
        active: String(category.active) || '1', // Set status
        cate_available: String(category.cate_available ?? '1'), 
        category_picture_file: null,
      });

      // show current image
      if (category.image_url) {
        setPreview(category.image_url);
      } else {
        setPreview(null);
      }
    }
  }, [category]);

  // Load parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      setLoadingParents(true);
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
          router.push("/auth/admin");
          return;
        }

        if (res.ok && data.status === true && Array.isArray(data.data.categories)) {
          setParentCategories(data.data.categories);
        }
      } catch (err) {
        console.error("Error fetching parent categories:", err);
      } finally {
        setLoadingParents(false);
      }
    };

    fetchParentCategories();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "slug") {
      setSlugTouched(true);
    }

    if (name === "name" && !slugTouched) {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
      return;
    }

    if (name === "cate_available") {
      setFormData(prev => ({
        ...prev,
        cate_available: e.target.checked ? '1' : '0',
      }));
      return;
    }


    if (name === "category_picture_file" && files?.length) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, category_picture_file: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, category_picture_file: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const fd = new FormData();
      fd.append("id", category.id);
      fd.append("name", formData.name);
      fd.append("slug", formData.slug);
      fd.append("sin_name", formData.sinName);
      fd.append("parent_category_id", formData.parent_category_id || "");
      fd.append("description", formData.description);
      fd.append("active", formData.active);
      fd.append("cate_available", formData.cate_available);
      fd.append("edit_id", authid);

      if (formData.category_picture_file) {
        fd.append("category_picture_file", formData.category_picture_file);
      }

      const res = await fetch(`${API_ADMIN_BASE_URL}/category/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // Note: Browser automatically sets Content-Type to multipart/form-data with boundary
        },
        body: fd,
      });

      const data = await res.json();

      // Handle session expiration or unauthorized access
      if (data.rcode === 0) {
          router.push("/auth/admin");
          return;
      }

      // Handle Uniqueness or Validation Errors from Node.js
      if (!res.ok || data.status === false) {
        // If the error message mentions 'slug', we know it's a uniqueness conflict
        const msg = data.message || "Failed to update category";
        setErrorMessage(msg);

        // Optional: Scroll to top of modal to show error
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTop = 0;

      } else {
        // Success Case
        alert("Category updated successfully!");
        onSuccess?.(); // Trigger list refresh
        onClose?.();   // Close modal
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setErrorMessage("An unexpected error occurred. Please check your connection.");
    }
  };
  if (!category) return null;

  return (
    <>
      <div className={`${styles.modalOverlay} modal d-block`} tabIndex="-1" role="dialog" aria-modal="true">
        {/* Bootstrap Modal Dialog */}
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">

            {/* Modal Header */}
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title">✏️ Update Category: {category.name}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* Modal Body */}
            <form className="modal-body" onSubmit={handleSubmit}>

              {/* Error Message */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Form Fields */}
              <div className="row g-3">

                {/* Category Name */}
                <div className="col-md-6">
                  <label htmlFor="categoryName" className="form-label">Category Name <span className="text-danger">*</span></label>
                  <input type="text" id="categoryName" name="name" value={formData.name} onChange={handleChange} className="form-control" required/>
                </div>

                {/* Parent Category */}
                <div className="col-md-6">
                  <label htmlFor="parentCategory" className="form-label">Parent Category</label>
                  <select id="parentCategory" name="parent_category_id" value={formData.parent_category_id} onChange={handleChange} className="form-select" disabled={loadingParents}>
                    <option value="">None</option>
                    {loadingParents ? (
                      <option disabled>Loading...</option>
                    ) : (
                      parentCategories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Category Slug */}
                <div className="col-md-6">
                  <label htmlFor="categorySlug" className="form-label">Category Slug <span className="text-danger">*</span></label>
                  <input type="text" id="categorySlug" name="slug" value={formData.slug} onChange={handleChange} className="form-control" required/>
                </div>

                {/* Category Singular Name */}
                <div className="col-md-6">
                  <label htmlFor="categorySinName" className="form-label">Category Singular Name <span className="text-danger">*</span></label>
                  <input type="text" id="categorySinName" name="sinName" value={formData.sinName} onChange={handleChange} className="form-control" required/>
                </div>

                {/* Status (Active/Inactive) */}
                <div className="col-md-6">
                  <label htmlFor="categoryStatus" className="form-label">Status <span className="text-danger">*</span></label>
                  <select id="categoryStatus" name="active" value={formData.active} onChange={handleChange} className="form-select" required>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                {/* Category Availability */}
                <div className="col-md-6">
                  <label className="form-label d-block">
                    Category Availability
                  </label>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="cateAvailable"
                      name="cate_available"
                      checked={formData.cate_available === '1'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="cateAvailable">
                      Available for listing
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3"/>
                </div>

                {/* Image Upload */}
                <div className="col-12">
                  <label htmlFor="categoryImage" className="form-label">Category Image (Optional)</label>
                  <input type="file" id="categoryImage" name="category_picture_file" accept="image/*" ref={fileInputRef} onChange={handleChange} className="form-control"/>

                  {/* Image Preview & Remove Button */}
                  {preview && (
                    <div className="mt-3 d-inline-block position-relative">
                      <img src={preview.startsWith(WEB_BASE_URL) ? preview : `${WEB_BASE_URL}${preview}`} alt="Category Preview" width={120} height={120} className="rounded shadow-sm" style={{ objectFit: "cover" }}/>
                      <button type="button" onClick={removeImage} className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle" style={{ height: '28px', width: '28px', padding: '0', lineHeight: '1' }} title="Remove Image"> × </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer (Form Actions) */}
              <div className="modal-footer justify-content-between mt-4">
                <button type="button" onClick={onClose} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning" >
                  💾 Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}