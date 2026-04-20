'use client';
import { useState, useEffect, useRef } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";
import { useRouter } from 'next/navigation';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddCategoryForm({ onSuccess, onClose }) {
  const router = useRouter();

  const initialFormState = {
    category_name: "",
    parent_category_id: "",
    category_description: "",
    category_picture_file: null,
    cate_available: '1',
  };
  // Fix: Initialize state with the object itself, not an object containing the object
  const [form, setForm] = useState(initialFormState);

  const [categories, setCategories] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const fetchedOnce = useRef(false);

  /** Getting the token from the cookies */
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;

  /* Fetch the parent categories to create a child category */
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    setLoadingParents(true);

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/category/getParent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        /** recode = 0 is used for the token error */
        if(data.rcode == 0){
          router.push("/auth/admin");
          return;
        }

        if (res.ok && data.status == true && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        } else {
          console.error('Failed to fetch categories:', data);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
      } finally {
        setLoadingParents(false);
      }
    };
    fetchCategories();
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic validation
    if (!form.category_name) {
      setErrorMessage("Category Name is required.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', form.category_name);
    formDataToSend.append('description', form.category_description || ""); // Ensure description is included
    formDataToSend.append('add_id', authid);
    formDataToSend.append('cate_available', form.cate_available);

    if (form.parent_category_id) {
      formDataToSend.append('parent_category_id', form.parent_category_id);
    }

    if (form.category_picture_file) {
      formDataToSend.append('category_picture_file', form.category_picture_file);
    }

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/category/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.rcode == 0) {
        router.push("/auth/admin");
        return;
      }

      if (!res.ok || data.status === false) {
        setErrorMessage(data.message || 'Error creating category.');
      } else {
        setForm(initialFormState);
        alert('Category created successfully!');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('An unexpected error occurred during category creation.');
    }
  };

  /* Handle change */
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === 'category_picture_file') {
      setForm({ ...form, [name]: files[0] });
      return;
    }

    if (name === 'cate_available') {
      setForm({ ...form, cate_available: checked ? '1' : '0' });
      return;
    }

    setForm({ ...form, [name]: value });
    setErrorMessage("");
  };


  return (
    <form onSubmit={handleSubmit}>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="row g-3">
        {/* Category Name */}
        <div className="col-md-6">
          <label htmlFor="category_name" className="form-label">
            Category Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={form.category_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Parent Category */}
        <div className="col-md-6">
          <label htmlFor="parent_category" className="form-label">Parent Category</label>
          <select
            id="parent_category"
            name="parent_category_id"
            value={form.parent_category_id}
            onChange={handleChange}
            className="form-select"
            disabled={loadingParents}
          >
            <option value="">{loadingParents ? "Loading categories..." : "Select Parent Category"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
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
              checked={form.cate_available === '1'}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="cateAvailable">
              Available for listing
            </label>
          </div>
        </div>


        {/* Category Picture */}
        <div className="col-12">
          <label htmlFor="category_picture_file" className="form-label">Category Picture (Optional)</label>
          <input
            type="file"
            id="category_picture_file"
            name="category_picture_file"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Description */}
        <div className="col-12">
          <label htmlFor="category_description" className="form-label">Description</label>
          <textarea
            id="category_description"
            name="category_description"
            value={form.category_description}
            onChange={handleChange}
            className="form-control"
            rows="3"
          ></textarea>
        </div>
      </div>

      {/* Modal Footer (Form Actions) */}
      <div className="modal-footer d-flex justify-content-between mt-4 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-success"
        >
          Register Category
        </button>
      </div>
    </form>  
  );
}