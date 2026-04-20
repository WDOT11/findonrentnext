"use client";
import { useState } from "react";
import styles from "./inquirie.module.css";
import { getAuthToken } from "../../../utils/utilities";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ViewEntry({ entryId }) {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError("");
    const token = getAuthToken();

    try {
      const response = await fetch(`${API_ADMIN_BASE_URL}/contact-us/viewsinglecontactusentry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: entryId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch entry");
      }

      setEntry(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-sm btn-info text-white fw-medium px-3" onClick={handleOpen}>
        View Details
      </button>

      {open && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}
          tabIndex="-1"
          role="dialog"
          onClick={() => setOpen(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg my-4" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>

              {/* Header Gradient */}
              <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px 24px', position: 'relative' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>📋 Inquiry Details</h5>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setOpen(false)} style={{ opacity: 0.9, padding: '10px' }}></button>
                </div>
              </div>

              <div className="modal-body p-4 p-md-5" style={{ background: '#ffffff' }}>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : entry ? (
                  <div className="d-flex flex-column gap-3">
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Name</div>
                      <div className="col-8 fw-medium text-dark">{entry.full_name}</div>
                    </div>
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Email</div>
                      <div className="col-8 text-primary fw-medium">{entry.email}</div>
                    </div>
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Phone</div>
                      <div className="col-8 fw-medium text-dark">{entry.phone}</div>
                    </div>
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Subject</div>
                      <div className="col-8 fw-medium text-dark">{entry.subject}</div>
                    </div>
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Message</div>
                      <div className="col-8 text-secondary">
                        <div className="bg-light p-3 rounded-3 border" style={{ maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                          {entry.message}
                        </div>
                      </div>
                    </div>
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Status</div>
                      <div className="col-8">
                        <span className={`badge rounded-pill ${entry.email_status === 'sent' ? 'bg-success' : 'bg-danger'}`} style={{ padding: '0.4em 0.8em' }}>
                          {entry.email_status === 'sent' ? '✓ Sent' : '✓ Replied'}
                        </span>
                      </div>
                    </div>
                    <div className="row border-bottom pb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">IP Address</div>
                      <div className="col-8 font-monospace text-secondary">{entry.ip_address || "—"}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 text-muted fw-semibold small text-uppercase">Timestamp</div>
                      <div className="col-8 text-secondary small text-uppercase">
                        {new Date(new Date(entry.created_at).getTime() + (9.5 * 60 * 60 * 1000)).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "medium" })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-danger text-center">No details found.</p>
                )}
              </div>
            </div>
          </div>
          <style>{`
            @keyframes scaleUp {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
