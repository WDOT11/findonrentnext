'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from "next/dynamic";
import styles from './post.module.css';
import { getAuthUser, getAuthToken } from '../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function AddPostForm({ onClose, onSuccess }) {
  const editor = useRef(null);

  const [formData, setFormData] = useState({
    post_title: '',
    post_slug: '',
    description: '',
    post_excerpt: '',
    post_status: 'draft',
    category_slug: '',
    category_id: null,  
    location_slug: '',
    location_id: null   
  });


  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===========================
     FETCH CATEGORY + LOCATION
  =========================== */
  useEffect(() => {
    const token = getAuthToken();

    const fetchCategories = async () => {
      const res = await fetch(
        `${API_ADMIN_BASE_URL}/category/admingetallactivecate`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (result?.status && result.data?.categories) {
        setCategories(result.data.categories);
      }
    };

    const fetchLocations = async () => {
      const res = await fetch(
        `${API_ADMIN_BASE_URL}/city/admingetallactivecity`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();

      // ✅ THIS IS THE REAL FIX
      if (result?.status && Array.isArray(result.data)) {
        setLocations(result.data);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  /* ===========================
     AUTO POST SLUG
  =========================== */
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      post_title: title,
      post_slug: title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-'),
    }));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  /* ===========================
     SUBMIT
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const user = JSON.parse(getAuthUser() || '{}');

      let dynamic_slug = '';
      if (formData.category_slug && formData.location_slug) {
        dynamic_slug = `${formData.category_slug}/${formData.location_slug}`;
      } else if (formData.category_slug) {
        dynamic_slug = formData.category_slug;
      } else if (formData.location_slug) {
        dynamic_slug = formData.location_slug;
      }

      const fd = new FormData();
      fd.append('post_title', formData.post_title);
      fd.append('post_slug', formData.post_slug);
      fd.append('description', formData.description);
      fd.append('post_excerpt', formData.post_excerpt);
      fd.append('post_status', formData.post_status);
      fd.append('dynamic_slug', dynamic_slug);
      fd.append('add_id', user?.id || null);
      fd.append('dynamic_cat_id', formData.category_id || '');
      fd.append('dynamic_loc_id', formData.location_id || '');

      if (imageFile) fd.append('post_picture_file', imageFile);

      const res = await fetch(`${API_ADMIN_BASE_URL}/post/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (data.status || data.success) {
        alert('Post created successfully!');
        onSuccess?.();
        onClose?.();
      } else {
        alert(data.message || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>

        <div className="d-flex justify-content-between mb-3">
          <h4>Add New Post</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Post Title</label>
            <input
              className="form-control"
              value={formData.post_title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Post Slug</label>
            <input
              className="form-control"
              name="post_slug"
              value={formData.post_slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Category</label>
              <select
                className="form-select"
                value={formData.category_slug}
                onChange={(e) => {
                  const slug = e.target.value;
                  const selected = categories.find(c => c.slug === slug);

                  setFormData(prev => ({
                    ...prev,
                    category_slug: slug,
                    category_id: selected ? selected.id : null
                  }));
                }}
              >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}

            </select>
          </div>

          <div className="mb-3">
            <label>Location</label>
            <select
              className="form-select"
              value={formData.location_slug}
              onChange={(e) => {
                const slug = e.target.value;
                const selected = locations.find(
                  city => city.city_slug === slug
                );

                setFormData(prev => ({
                  ...prev,
                  location_slug: slug,
                  location_id: selected ? selected.city_id : null
                }));
              }}
            >
              <option value="">-- Select Location --</option>
              {locations.map((city) => (
                <option key={city.city_id} value={city.city_slug}>
                  {city.city_name}
                </option>
              ))}

            </select>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <JoditEditor
              ref={editor}
              value={formData.description}
              onBlur={(c) =>
                setFormData({ ...formData, description: c })
              }
            />
          </div>

          <div className="mb-3">
            <label>Excerpt</label>
            <textarea
              className="form-control"
              name="post_excerpt"
              rows="2"
              value={formData.post_excerpt}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Status</label>
            <select
              className="form-select"
              name="post_status"
              value={formData.post_status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Featured Image</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>

          <div className="text-end">
            <button className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
