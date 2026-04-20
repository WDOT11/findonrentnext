"use client";
import { useState, useEffect } from "react";
import ViewEntry from "./ViewEntry";
import styles from "./inquirie.module.css";
import { getAuthToken } from "../../../utils/utilities";
import QuickReplyModal from "./QuickReplyModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ContactEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // actual query sent to API

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);


  useEffect(() => {
    fetchContactEntries(page, searchQuery);
  }, [page, searchQuery]);

  const fetchContactEntries = async (pageNum = 1, query = "") => {
    try {
      const token = getAuthToken();
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_ADMIN_BASE_URL}/contact-us/getallcontactusentries?page=${pageNum}&limit=50&search=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch contact entries");

      const data = await response.json();
      setEntries(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Form submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // reset to first page
    setSearchQuery(search.trim());
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry? This action cannot be undone.")) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_ADMIN_BASE_URL}/contact-us/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete entry");

      const data = await response.json();
      if (data.success) {
        alert("Entry deleted successfully!");
        fetchContactEntries(page, searchQuery);
      } else {
        throw new Error(data.message || "Failed to delete entry");
      }
    } catch (err) {
      alert(err.message || "Something went wrong while deleting");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container-fluid py-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 bg-white">

          {/* Header & Controls Row */}
          <div className="card-header bg-white border-bottom-0 p-4 pb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-0 gap-3">
              <h4 className="mb-0 fw-bolder text-dark" style={{ letterSpacing: '0.5px' }}>📩 Inquiries / Contact Entries</h4>
            </div>
          </div>

          <div className="card-body px-4 pb-4 pt-0">
            {/* Filter Card */}
            <div className="bg-light p-3 rounded-4 mb-4 border border-secondary border-opacity-10">
              <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">

                <div className="col-lg-6 col-md-8">
                  <label className="form-label text-muted fw-semibold small mb-1">Search Identifier</label>
                  <div className="input-group shadow-sm rounded-3">
                    <span className="input-group-text bg-white border-end-0">🔍</span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0 shadow-none text-dark"
                      placeholder="Search by email or phone number..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-lg-2 col-md-4">
                  <button type="submit" className="btn btn-primary w-100 rounded-3 shadow-sm fw-semibold">Search</button>
                </div>
              </form>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert">
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <div style={{ fontSize: '0.9rem' }}>{error}</div>
              </div>
            )}

            {!loading && entries.length === 0 && (
              <div className="text-center py-5 border rounded-3 bg-light">
                <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📭</div>
                <span className="fw-medium text-secondary">No contact entries found.</span>
              </div>
            )}

            {/* Table */}
            {!loading && entries.length > 0 && (
              <>
                <div className="table-responsive rounded-3 border">
                  <table className="table table-hover table-striped align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col" className="ps-4 py-3">ID</th>
                        <th scope="col" className="py-3">Sender Details</th>
                        <th scope="col" className="py-3" style={{ maxWidth: '250px' }}>Subject</th>
                        <th scope="col" className="py-3 text-center">Reply Status</th>
                        <th scope="col" className="py-3 text-center">Timestamp</th>
                        <th scope="col" className="text-center pe-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((item) => (
                        <tr key={item.id} className="bg-white">
                          <td className="ps-4 fw-medium text-secondary">#{item.id}</td>
                          <td>
                            <div className="fw-bold text-dark">{item.full_name}</div>
                            <div className="small text-muted">{item.email}</div>
                            <div className="small text-success fw-medium">{item.phone}</div>
                          </td>
                          <td className="text-secondary small text-truncate" style={{ maxWidth: '250px' }} title={item.subject}>
                            {item.subject}
                          </td>
                          <td className="text-center">
                            <span className={`badge rounded-pill ${item.email_status === 'sent' ? 'bg-success' : 'bg-danger'}`} style={{ padding: '0.4em 0.8em' }}>
                              {item.email_status === 'sent' ? '✓ Sent' : '✓ Replied'}
                            </span>
                          </td>
                          <td className="text-center text-secondary small">
                            {new Date(new Date(item.created_at).getTime() + (9.5 * 60 * 60 * 1000)).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </td>
                          <td className="text-center pe-4">
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <span className="d-inline-block">
                                <ViewEntry entryId={item.id} />
                              </span>
                              <button
                                className="btn btn-sm btn-outline-primary fw-medium px-3"
                                onClick={() => {
                                  setSelectedEntry(item);
                                  setShowReplyModal(true);
                                }}
                              >
                                Quick Reply
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger fw-medium px-3"
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <QuickReplyModal
                  isOpen={showReplyModal}
                  entry={selectedEntry}
                  onClose={() => {
                    setShowReplyModal(false);
                    setSelectedEntry(null);
                  }}
                />

                {/* Pagination Layer */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4 px-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-bold"
                    >
                      ← Prev
                    </button>
                    <div className="text-center">
                      <span className="text-muted fw-medium bg-light px-4 py-2 rounded-pill shadow-sm border">
                        Page <span className="text-dark fw-bolder">{page}</span> of {totalPages}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-bold"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
