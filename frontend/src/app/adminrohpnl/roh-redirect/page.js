'use client';
import { useState, useEffect } from 'react';
import AddRedirectForm from './AddRedirectForm';
import EditRedirectForm from './EditRedirectForm';
import styles from '../admin.module.css';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function RedirectListPage() {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRedirectId, setSelectedRedirectId] = useState(null);

  const [authId, setAuthId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  /* ================= GET AUTH ================= */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      const admindtl = getAuthUser();

      if (admindtl && token) {
        try {
          const parsedUser = JSON.parse(admindtl);
          setAuthId(parsedUser?.id);
          setAuthToken(token);
        } catch (err) {
          console.error('Failed to parse authUser:', err);
        }
      }
    }
  }, []);

  /* ================= FETCH REDIRECT LIST ================= */
  const fetchRedirects = async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/redirect/list`, {
        method: 'POST', // same pattern as roles
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          page: 1,
          limit,
        }),
      });

      const data = await res.json();
      setRedirects(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchRedirects();
  }, [limit, authToken]);

  /* ================= MODALS ================= */
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (id) => {
    setSelectedRedirectId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRedirectId(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this redirect?')) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/redirect/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          redirect_id: id,
          edit_id: authId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to delete redirect');
        return;
      }

      alert('Redirect deleted successfully');
      fetchRedirects();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <img src="/infinity-loading.gif" alt="Loading..." width={100} />
      </div>
    );
  }

  return (
    <div style={{ padding: '30px' }}>
      <div className={styles.pageWrapper}>
        <div className={styles.pageHeader}>
          <h2>Redirect Manager</h2>
          <button className={styles.addBtn} onClick={openAddModal}>
            + Add Redirect
          </button>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Source URL</th>
                <th>Target URL</th>
                <th>Type</th>
                <th>Hits</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {redirects.length ? (
                redirects.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td className={styles.mono}>{r.source_url}</td>
                    <td className={styles.mono}>{r.target_url}</td>
                    <td>
                      <span className={styles.badge}>{r.redirect_type}</span>
                    </td>
                    <td>{r.hit_count}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEditModal(r.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    No redirects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isAddModalOpen && (
        <AddRedirectForm
          onClose={closeAddModal}
          onSuccess={() => {
            closeAddModal();
            fetchRedirects();
          }}
        />
      )}

      {isEditModalOpen && selectedRedirectId && (
        <EditRedirectForm
          redirectId={selectedRedirectId}
          onClose={closeEditModal}
          onSuccess={() => {
            closeEditModal();
            fetchRedirects();
          }}
        />
      )}
    </div>
  );
}
