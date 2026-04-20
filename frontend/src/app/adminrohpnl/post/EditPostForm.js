'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from "next/dynamic";
import 'jodit/es5/jodit.min.css';
import styles from './post.module.css';
import { getAuthUser, getAuthToken } from '../../../utils/utilities';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function EditPostForm({ postId, onClose, onSuccess }) {
  const editorRef = useRef(null);

const [formData, setFormData] = useState({
  post_title: "",
  post_slug: "",
  description: "",
  post_excerpt: "",
  post_status: "draft",
  category_slug: "",
  category_id: null,     
  location_slug: "",
  location_id: null      
});


  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===========================
     HELPERS
  =========================== */
  const isCategorySlug = (slug) =>
    categories.some(c => c.slug === slug);

  const isLocationSlug = (slug) =>
    locations.some(l => l.city_slug === slug);

  /* ===========================
     FETCH CATEGORIES & LOCATIONS
  =========================== */
  useEffect(() => {
    const token = getAuthToken();

    const fetchCategories = async () => {
      const res = await fetch(
        `${API_ADMIN_BASE_URL}/category/admingetallactivecate`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.status && data.data?.categories) {
        setCategories(data.data.categories);
      }
    };

    const fetchLocations = async () => {
      const res = await fetch(
        `${API_ADMIN_BASE_URL}/city/admingetallactivecity`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.status && Array.isArray(data.data)) {
        setLocations(data.data);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  /* ===========================
     FETCH POST (AFTER META)
  =========================== */
  useEffect(() => {
    if (!categories.length || !locations.length) return;

    const token = getAuthToken();

    const fetchPost = async () => {
      const res = await fetch(`${API_ADMIN_BASE_URL}/post/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: postId }),
      });

      const data = await res.json();

      if (data.status && data.data) {
        let category_slug = "";
        let location_slug = "";

        if (data.data.dynamic_slug) {
          const slug = data.data.dynamic_slug.trim();
          const parts = slug.split("/");

          // CASE 1: cars/goa
          if (parts.length === 2) {
            category_slug = parts[0];
            location_slug = parts[1];
          }

          // CASE 2: cars OR goa
          if (parts.length === 1) {
            const single = parts[0];

            if (isCategorySlug(single)) {
              category_slug = single;
            }

            if (isLocationSlug(single)) {
              location_slug = single;
            }
          }
        }

        let category_id = null;
        let location_id = null;

        if (category_slug) {
          const cat = categories.find(c => c.slug === category_slug);
          category_id = cat ? cat.id : null;
        }

        if (location_slug) {
          const loc = locations.find(l => l.city_slug === location_slug);
          location_id = loc ? loc.city_id : null;
        }


        setFormData({
          post_title: data.data.post_title || "",
          post_slug: data.data.post_slug || "",
          description: data.data.description || "",
          post_excerpt: data.data.post_excerpt || "",
          post_status: data.data.post_status || "draft",
          category_slug,
          category_id,
          location_slug,
          location_id
        });


        if (data.data.post_image_url) {
          setPreview(WEB_BASE_URL + data.data.post_image_url);
        }
      }
    };

    fetchPost();
  }, [categories, locations, postId]);

  /* ===========================
     TITLE → SLUG
  =========================== */
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  /* ===========================
     SUBMIT
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const user = JSON.parse(getAuthUser() || "{}");

      let dynamic_slug = "";
      if (formData.category_slug && formData.location_slug) {
        dynamic_slug = `${formData.category_slug}/${formData.location_slug}`;
      } else if (formData.category_slug) {
        dynamic_slug = formData.category_slug;
      } else if (formData.location_slug) {
        dynamic_slug = formData.location_slug;
      }

      const fd = new FormData();
      fd.append("id", postId);
      fd.append("post_title", formData.post_title);
      fd.append("post_slug", formData.post_slug);
      fd.append("description", formData.description);
      fd.append("post_excerpt", formData.post_excerpt);
      fd.append("post_status", formData.post_status);
      fd.append("dynamic_slug", dynamic_slug);
      fd.append("edit_id", user?.id || null);
      fd.append("dynamic_cat_id", formData.category_id || "");
      fd.append("dynamic_loc_id", formData.location_id || "");


      if (imageFile) fd.append("post_picture_file", imageFile);

      const res = await fetch(`${API_ADMIN_BASE_URL}/post/edit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (data.status || data.success) {
        alert("Post updated successfully!");
        onSuccess?.();
        onClose?.();
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>

        <div className="d-flex justify-content-between mb-3">
          <h4>Edit Post</h4>
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
            <label>Slug</label>
            <input
              className="form-control"
              name="post_slug"
              value={formData.post_slug}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Category</label>
            <select
              className="form-select"
              value={formData.category_slug || ""}
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
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}

            </select>
          </div>

          <div className="mb-3">
            <label>Location</label>
            <select
              className="form-select"
              value={formData.location_slug || ""}
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
              {locations.map(city => (
                <option key={city.city_id} value={city.city_slug}>
                  {city.city_name}
                </option>
              ))}

            </select>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <JoditEditor
              ref={editorRef}
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
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="mb-4">
            <label>Featured Image</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
            {preview && (
              <img
                src={preview}
                width={100}
                height={80}
                className="mt-2 rounded border"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
