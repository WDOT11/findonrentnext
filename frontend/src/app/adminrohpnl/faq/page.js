'use client';

import { useState, useEffect } from 'react';
import styles from './faq.module.css';
import AddFaqForm from './AddFaqForm';
import EditFaqForm from './EditFaqForm';
import ViewFaq from './ViewFaq';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTitle, setSearchTitle] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [viewFaqId, setViewFaqId] = useState(null);
  const [editFaqId, setEditFaqId] = useState(null);

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
        console.error("Error fetching categories:", err);
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
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  /* ============================
     FETCH FAQ LIST
  ============================ */
  const fetchFaqs = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();

      let dynamic_slug = '';
      if (searchCategory && searchCity) {
        dynamic_slug = `${searchCategory}/${searchCity}`;
      } else if (searchCategory) {
        dynamic_slug = searchCategory;
      } else if (searchCity) {
        dynamic_slug = searchCity;
      }

      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        title: searchTitle,
        status: searchStatus,
        dynamic_slug,
      }).toString();

      const res = await fetch(
        `${API_ADMIN_BASE_URL}/faqs/list?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        setFaqs(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs(page);
  }, [page]);

  /* ============================
     SEARCH
  ============================ */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFaqs(1);
  };

  /* ============================
     LOADER
  ============================ */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <img src="/infinity-loading.gif" alt="Loading..." width={100} />
      </div>
    );
  }

  return (
    <section className="container mt-4">
      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">All FAQs</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          + Add New FAQ
        </button>
      </div>

      {/* Add FAQ */}
      {showAddForm && (
        <AddFaqForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => fetchFaqs(page)}
        />
      )}

      {/* ===== Filters ===== */}
      <form className="d-flex flex-wrap gap-2 mb-3" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="form-control"
          style={{ maxWidth: 220 }}
        />

        <select
          className="form-select"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          style={{ maxWidth: 160 }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="form-select"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city.city_slug} value={city.city_slug}>
              {city.city_name}
            </option>
          ))}
        </select>

        <button className="btn btn-dark">Search</button>
      </form>

      {/* ===== Table ===== */}
      {faqs.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq, index) => (
                  <tr key={faq.id}>
                    <td>{index + 1}</td>
                    <td>{faq.title}</td>
                    <td className="text-truncate" style={{ maxWidth: 300 }}>
                      {faq.description}
                    </td>
                    <td>{faq.dynamic_slug}</td>
                    <td>
                      <span className={`badge ${faq.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {faq.status}
                      </span>
                    </td>
                    <td>
                      {new Date(faq.add_date).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditFaqId(null);
                          setViewFaqId(faq.id);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setViewFaqId(null);
                          setEditFaqId(faq.id);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button
              className="btn btn-outline-dark btn-sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="btn btn-outline-dark btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ===== View Modal ===== */}
      {viewFaqId && (
        <ViewFaq
          faqId={viewFaqId}
          onClose={() => setViewFaqId(null)}
        />
      )}

      {/* ===== Edit Modal ===== */}
      {editFaqId && (
        <EditFaqForm
          faqId={editFaqId}
          onClose={() => setEditFaqId(null)}
          onSuccess={() => fetchFaqs(page)}
        />
      )}
    </section>
  );
}
