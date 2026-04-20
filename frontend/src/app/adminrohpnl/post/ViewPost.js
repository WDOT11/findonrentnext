'use client';
import { useState, useEffect } from 'react';
import styles from './post.module.css';
import { getAuthToken } from '../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function ViewPost({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_ADMIN_BASE_URL}/post/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: postId }),
        });

        const data = await res.json();
        if (data.status && data.data) {
          setPost(data.data);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupBox}>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupBox}>
          <p>Post not found.</p>
          <button className="btn btn-light mt-3" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  /* ===========================
     SPLIT dynamic_slug
  =========================== */
  let category = '-';
  let location = '-';

  if (post.dynamic_slug) {
    const parts = post.dynamic_slug.split('/');
    category = parts[0] || '-';
    location = parts[1] || '-';
  }

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">{post.post_title}</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {post.post_image_url && (
          <div className="mb-3 text-center">
            <img
              src={WEB_BASE_URL + post.post_image_url}
              alt={post.post_title}
              className="rounded"
              style={{
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            />
          </div>
        )}

        {/* ===== DETAILS TABLE ===== */}
        <table className="table table-borderless">
          <tbody>
            <tr>
              <th style={{ width: '35%' }}>Slug:</th>
              <td>{post.post_slug}</td>
            </tr>

            <tr>
              <th>Status:</th>
              <td>
                <span
                  className={`badge ${
                    post.post_status === 'published'
                      ? 'bg-success'
                      : post.post_status === 'draft'
                      ? 'bg-secondary'
                      : 'bg-warning'
                  }`}
                >
                  {post.post_status}
                </span>
              </td>
            </tr>

            <tr>
              <th>Category:</th>
              <td className="text-capitalize">{category}</td>
            </tr>

            <tr>
              <th>Location:</th>
              <td className="text-capitalize">{location}</td>
            </tr>

            <tr>
              <th>Dynamic Slug:</th>
              <td>{post.dynamic_slug || '-'}</td>
            </tr>

            <tr>
              <th>Excerpt:</th>
              <td>{post.post_excerpt || '-'}</td>
            </tr>

            <tr>
              <th>Published:</th>
              <td>
                {new Date(post.add_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ===== DESCRIPTION ===== */}
        <div className="mb-4">
          <h5 className="fw-semibold mb-2">Description:</h5>
          <div
            className={styles.postDescription}
            dangerouslySetInnerHTML={{
              __html: decodeHtml(post.description || '')
            }}
          ></div>
        </div>

      </div>
    </div>
  );
}
