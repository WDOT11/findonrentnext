'use client';

import { useState, useEffect } from 'react';
import styles from './faq.module.css';
import { getAuthToken, getAuthUser } from '../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditFaqForm({ faqId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cate_slug: '',
    cate_id: null,
    city_slug: '',
    city_id: null,
    active: 1,
  });


  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [rawSlug, setRawSlug] = useState('');
  const [loading, setLoading] = useState(false);

  /* ============================
     FETCH FAQ
  ============================ */
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_ADMIN_BASE_URL}/faq/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: faqId }),
        });

        const data = await res.json();

        if (data.status && data.data) {
          setRawSlug(data.data.dynamic_slug || '');

          setFormData((prev) => ({
            ...prev,
            title: data.data.title || '',
            description: data.data.description || '',
            cate_id: data.data.dynamic_cat_id || null,
            city_id: data.data.dynamic_loc_id || null,
            active: Number(data.data.active) || 0,
          }));
        }
      } catch (err) {
        console.error('Error loading FAQ:', err);
      }
    };

    if (faqId) fetchFaq();
  }, [faqId]);

  /* ============================
     FETCH CATEGORIES
  ============================ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${API_ADMIN_BASE_URL}/category/admingetallactivecate`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.status && data.data?.categories) {
          setCategories(data.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  /* ============================
     FETCH CITIES
  ============================ */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${API_ADMIN_BASE_URL}/city/admingetallactivecity`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setCities(data.data);
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    fetchCities();
  }, []);

  /* ============================
     RESOLVE SLUG → CATEGORY / CITY
  ============================ */
  useEffect(() => {
    if (!rawSlug || !categories.length || !cities.length) return;

    const parts = rawSlug.split('/');

    if (parts.length === 2) {
      const cat = categories.find(c => c.slug === parts[0]);
      const city = cities.find(c => c.city_slug === parts[1]);

      setFormData((prev) => ({
        ...prev,
        cate_slug: parts[0],
        cate_id: cat ? cat.id : null,
        city_slug: parts[1],
        city_id: city ? city.city_id : null,
      }));
      return;
    }

    const single = parts[0];

    const cat = categories.find(c => c.slug === single);
    const city = cities.find(c => c.city_slug === single);

    setFormData((prev) => ({
      ...prev,
      cate_slug: cat ? single : '',
      cate_id: cat ? cat.id : null,
      city_slug: city ? single : '',
      city_id: city ? city.city_id : null,
    }));
  }, [rawSlug, categories, cities]);


  /* ============================
     HANDLE CHANGE
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================
     SUBMIT
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      const admindtl = getAuthUser();
      const authUser = JSON.parse(admindtl || '{}');
      const edit_id = authUser?.id || null;

      // build dynamic_slug
      let dynamic_slug = '';
      if (formData.cate_slug && formData.city_slug) {
        dynamic_slug = `${formData.cate_slug}/${formData.city_slug}`;
      } else if (formData.cate_slug) {
        dynamic_slug = formData.cate_slug;
      } else if (formData.city_slug) {
        dynamic_slug = formData.city_slug;
      }

      const payload = {
        id: faqId,
        title: formData.title,
        description: formData.description,
        dynamic_slug,
        dynamic_cat_id: formData.cate_id,
        dynamic_loc_id: formData.city_id,
        active: Number(formData.active),
        edit_id,
      };


      const res = await fetch(`${API_ADMIN_BASE_URL}/faq/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status || data.success) {
        alert('FAQ updated successfully!');
        onSuccess?.();
        onClose?.();
      } else {
        alert(data.message || 'Failed to update FAQ');
      }
    } catch (err) {
      console.error('Error updating FAQ:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     RENDER
  ============================ */
  return (
    <div className={styles.popupOverlay}>
      <div className={`${styles.popupBox} shadow-lg`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Edit FAQ</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Question / Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Answer / Description
            </label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Category (optional)
            </label>
            <select
              className="form-select"
              value={formData.cate_slug}
              onChange={(e) => {
                const selected = categories.find(
                  (cat) => cat.slug === e.target.value
                );

                setFormData((prev) => ({
                  ...prev,
                  cate_slug: e.target.value,
                  cate_id: selected ? selected.id : null,
                }));
              }}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

          </div>

          {/* City */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              City (optional)
            </label>
            <select
              className="form-select"
              value={formData.city_slug}
              onChange={(e) => {
                const selected = cities.find(
                  (city) => city.city_slug === e.target.value
                );

                setFormData((prev) => ({
                  ...prev,
                  city_slug: e.target.value,
                  city_id: selected ? selected.city_id : null,
                }));
              }}
            >
              <option value="">-- Select City --</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_slug}>
                  {city.city_name}
                </option>
              ))}
            </select>

          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              name="active"
              value={String(formData.active)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  active: Number(e.target.value),
                })
              }
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
