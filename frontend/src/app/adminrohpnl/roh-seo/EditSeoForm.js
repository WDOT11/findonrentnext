'use client';
import { useState, useEffect } from 'react';
import styles from './seo.module.css';
import { getAuthToken, getAuthUser } from '../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditSeoForm({ seoId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    page_slug: '',
    page_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_image: '',
    canonical_url: '',
    noindex: 0,
    active: 1,
    meta_schema: '',
  });

  const [loading, setLoading] = useState(false);

  /** Fetch existing SEO Meta data */
  useEffect(() => {
    const fetchSeoMeta = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_ADMIN_BASE_URL}/seometa/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: seoId }),
        });

        const data = await res.json();
        if (data.status && data.data) {
          setFormData({
            page_slug: data.data.page_slug || '',
            page_title: data.data.page_title || '',
            meta_description: data.data.meta_description || '',
            meta_keywords: data.data.meta_keywords || '',
            og_title: data.data.og_title || '',
            og_image: data.data.og_image || '',
            canonical_url: data.data.canonical_url || '',
            noindex: Number(data.data.noindex) || 0,
            active: Number(data.data.active) || 0,
            meta_schema: data.data.meta_schema || '',

          });
        }
      } catch (err) {
        console.error('Error loading SEO Meta:', err);
      }
    };
    fetchSeoMeta();
  }, [seoId]);

  /** Handle Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** Submit Update */
  const handleSubmit = async (e) => {

    e.preventDefault();
    
    /**  Validate schema JSON */
    if (formData.meta_schema) {
      try {
        JSON.parse(formData.meta_schema);
      } catch (err) {
        alert('Schema JSON is invalid. Please check formatting.');
        return;
      }
    }
    setLoading(true);

    try {
      const token = getAuthToken();
      const userDtl = JSON.parse(getAuthUser() || '{}');
      const edit_id = userDtl?.id || null;

      const payload = {
        ...formData,
        id: seoId,
        edit_id,
        noindex: Number(formData.noindex),
        active: Number(formData.active),
      };

      const res = await fetch(`${API_ADMIN_BASE_URL}/seometa/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status || data.success) {
        alert('SEO Meta updated successfully!');
        onSuccess?.();
        onClose?.();
      } else {
        alert(data.message || 'Failed to update SEO Meta');
      }
    } catch (err) {
      console.error('Error updating SEO Meta:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={`${styles.popupBox} shadow-lg`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Edit SEO Meta</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Page Slug */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Page Slug</label>
            <input
              type="text"
              className="form-control"
              name="page_slug"
              value={formData.page_slug}
              onChange={handleChange}
              required
            />
          </div>

          {/* Page Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Page Title</label>
            <input
              type="text"
              className="form-control"
              name="page_title"
              value={formData.page_title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Meta Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Meta Description</label>
            <textarea
              className="form-control"
              name="meta_description"
              rows="3"
              value={formData.meta_description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Meta Keywords */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Meta Keywords</label>
            <input
              type="text"
              className="form-control"
              name="meta_keywords"
              placeholder="Comma separated keywords"
              value={formData.meta_keywords}
              onChange={handleChange}
            />
          </div>

          {/* OG Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">OG Title</label>
            <input
              type="text"
              className="form-control"
              name="og_title"
              value={formData.og_title}
              onChange={handleChange}
            />
          </div>

          {/* OG Image */}
          <div className="mb-3">
            <label className="form-label fw-semibold">OG Image URL</label>
            <input
              type="text"
              className="form-control"
              name="og_image"
              value={formData.og_image}
              onChange={handleChange}
            />
          </div>

          {/* Canonical URL */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Canonical URL</label>
            <input
              type="text"
              className="form-control"
              name="canonical_url"
              value={formData.canonical_url}
              onChange={handleChange}
            />
          </div>

          {/* Meta Schema */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Schema (JSON-LD)
            </label>

            <textarea
              className="form-control font-monospace"
              name="meta_schema"
              rows="8"
              placeholder={`{
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Find Rentals Near You - Compare Local Vendors | Find On Rent",
                "url": "https://findonrent.com/"
              }`}
              value={formData.meta_schema}
              onChange={handleChange}
            ></textarea>

            <small className="text-muted">
              Paste valid JSON-LD only. This schema will be injected inside
              <code>{` <script type="application/ld+json">`}</code>
            </small>
          </div>


          {/* Noindex */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Index Status</label>
            <select
              className="form-select"
              name="noindex"
              value={String(formData.noindex)}
              onChange={(e) =>
                setFormData({ ...formData, noindex: Number(e.target.value) })
              }
            >
              <option value="0">Index (Visible to Search Engines)</option>
              <option value="1">No Index (Hide from Search Engines)</option>
            </select>
          </div>

          {/* Active/Inactive */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              name="active"
              value={String(formData.active)}
              onChange={(e) =>
                setFormData({ ...formData, active: Number(e.target.value) })
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
