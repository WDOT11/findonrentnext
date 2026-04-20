'use client';
import { useState, useEffect } from 'react';
import styles from './seo.module.css';
import { getAuthToken } from '../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ViewSeo({ seoId, onClose }) {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Fetch Single SEO Meta */
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
          setSeoData(data.data);
        }
      } catch (err) {
        console.error('Error fetching SEO Meta:', err);
      } finally {
        setLoading(false);
      }
    };

    if (seoId) fetchSeoMeta();
  }, [seoId]);

  if (loading) {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupBox}>
          <p>Loading SEO Meta...</p>
        </div>
      </div>
    );
  }

  if (!seoData) {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupBox}>
          <p>SEO Meta not found.</p>
          <button className="btn btn-light mt-3" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.popupOverlay}>
      <div className={`${styles.popupBox} shadow-lg`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">{seoData.page_title}</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <table className="table table-borderless">
          <tbody>
            <tr>
              <th style={{ width: '35%' }}>Page Slug:</th>
              <td>{seoData.page_slug || '-'}</td>
            </tr>

            <tr>
              <th>Meta Description:</th>
              <td>{seoData.meta_description || '-'}</td>
            </tr>

            <tr>
              <th>Meta Keywords:</th>
              <td>{seoData.meta_keywords || '-'}</td>
            </tr>

            <tr>
              <th>OG Title:</th>
              <td>{seoData.og_title || '-'}</td>
            </tr>

            <tr>
              <th>OG Image:</th>
              <td>
                {seoData.og_image ? (
                  <a
                    href={seoData.og_image}
                    target="_blank"
                    rel="noopener"
                  >
                    {seoData.og_image}
                  </a>
                ) : (
                  '-'
                )}
              </td>
            </tr>

            <tr>
              <th>Canonical URL:</th>
              <td>
                {seoData.canonical_url ? (
                  <a
                    href={seoData.canonical_url}
                    target="_blank"
                    rel="noopener"
                  >
                    {seoData.canonical_url}
                  </a>
                ) : (
                  '-'
                )}
              </td>
            </tr>

            <tr>
              <th>No Index:</th>
              <td>
                <span
                  className={`badge ${
                    Number(seoData.noindex) === 1 ? 'bg-danger' : 'bg-success'
                  }`}
                >
                  {Number(seoData.noindex) === 1 ? 'Noindex' : 'Index'}
                </span>
              </td>
            </tr>

            <tr>
              <th>Status:</th>
              <td>
                <span
                  className={`badge ${
                    Number(seoData.active) === 1 ? 'bg-success' : 'bg-secondary'
                  }`}
                >
                  {Number(seoData.active) === 1 ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>

            <tr>
              <th>Added On:</th>
              <td>
                {seoData.add_date
                  ? new Date(seoData.add_date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-light border" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
