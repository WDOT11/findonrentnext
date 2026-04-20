'use client';
import { useState, useEffect } from 'react';
import styles from './seo.module.css';
import AddSeoForm from './AddSeoForm';
import EditSeoForm from './EditSeoForm';
import ViewSeo from './ViewSeo';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListSeoMetaPage() {
  const [seoPages, setSeoPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchSlug, setSearchSlug] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const limit = 10;

  const [showAddForm, setShowAddForm] = useState(false);
  const [viewSeoId, setViewSeoId] = useState(null);
  const [editSeoId, setEditSeoId] = useState(null);

  /**Fetch data */
  const fetchSeoPages = async (pageNum = 1, slug = '', status = '') => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const query = new URLSearchParams({
        page: String(pageNum),
        limit: String(limit),
        slug: slug,
        status: status,
      }).toString();

      const res = await fetch(`${API_ADMIN_BASE_URL}/seometa/list?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status && Array.isArray(data.data)) {
        setSeoPages(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setSeoPages([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching SEO Meta:', err);
      setSeoPages([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoPages(page, searchSlug, searchStatus);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSeoPages(1, searchSlug, searchStatus);
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchSeoPages(newPage, searchSlug, searchStatus);
    }
  };

  /** Loader */
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <img src="/infinity-loading.gif" alt="Loading..." width={100} height={80} />
      </div>
    );

  return (
    <section className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">All SEO Meta Pages</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          + Add New SEO Meta
        </button>
        {showAddForm && (
          <AddSeoForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => fetchSeoPages(page, searchSlug, searchStatus)}
          />
        )}
      </div>

      {/* Search Filters */}
      <form className="d-flex flex-wrap gap-2 mb-3" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by page slug..."
          value={searchSlug}
          onChange={(e) => setSearchSlug(e.target.value)}
          className="form-control"
          style={{ maxWidth: '300px' }}
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="form-select"
          style={{ maxWidth: '180px' }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-dark">Search</button>
      </form>

      {/* Table */}
      {seoPages.length === 0 ? (
        <p>No SEO Meta entries found.</p>
      ) : (
        <>
          <div className={`table-responsive ${styles.faqTableWrap}`}>
            <table className="table table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Page Slug</th>
                  <th>Page Title</th>
                  <th>Meta Description</th>
                  <th>Status</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seoPages.map((meta, i) => (
                  <tr key={meta.id}>
                    <td>{i + 1 + (page - 1) * limit}</td>
                    <td>{meta.page_slug}</td>
                    <td>{meta.page_title}</td>
                    <td className="text-truncate" style={{ maxWidth: 300 }}>{meta.meta_description}</td>
                    <td>
                      <span className={`badge ${meta.active ? 'bg-success' : 'bg-secondary'}`}>
                        {meta.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(meta.add_date).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setViewSeoId(meta.id)}>View</button>
                      {viewSeoId === meta.id && <ViewSeo seoId={meta.id} onClose={() => setViewSeoId(null)} />}
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditSeoId(meta.id)}>Edit</button>
                      {editSeoId === meta.id && (
                        <EditSeoForm
                          seoId={meta.id}
                          onClose={() => setEditSeoId(null)}
                          onSuccess={() => fetchSeoPages(page, searchSlug, searchStatus)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3 gap-2">
            <button className="btn btn-outline-dark btn-sm" disabled={page <= 1} onClick={() => changePage(page - 1)}>
              Prev
            </button>
            <span className="fw-medium align-self-center">
              Page {page} of {totalPages}
            </span>
            <button className="btn btn-outline-dark btn-sm" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
