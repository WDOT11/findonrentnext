'use client';
import { useEffect, useState } from "react";
import styles from "./css/category.module.css";
import { getAuthToken } from "../../../utils/utilities";
import { useRouter } from 'next/navigation';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function ViewCategory({ category, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();
  const router = useRouter();

  useEffect(() => {
    if (!category || !category.id) {
        setLoading(false);
        return;
    }

    const fetchCategoryDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/category/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: category.id }),
        });

        const data = await res.json();

        // Handle token error
        if(data.rcode == 0) {
          router.push("/auth/admin");
          return;
        }

        if (data.status && data.data) {
          setDetails(data.data);
        } else {
          console.error("Failed to fetch category details:", data);
        }
      } catch (err) {
        console.error("Error fetching category details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [category, token, router]);

  if (!category) return null;

  return (
    <div 
      className={`${styles.modalOverlay} modal d-block`} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }} 
      tabIndex="-1" 
      role="dialog" 
      aria-modal="true" 
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', padding: '24px 24px 64px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>View Category</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body px-4 pb-4" style={{ marginTop: '-48px', position: 'relative', background: '#ffffff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', minHeight: '300px' }}>
            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {!loading && details && (
              <div className="d-flex flex-column align-items-center">
                
                {/* Overlapping Image Section */}
                <div className="mb-3 bg-white p-1 rounded-circle" style={{ zIndex: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: '-20px' }}>
                  {details.image_url ? (
                    <img
                      src={`${WEB_BASE_URL}${details.image_url}`}
                      alt={details.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #f8fafc' }}
                    />
                  ) : (
                    <div className="bg-light text-muted d-flex align-items-center justify-content-center rounded-circle border border-3 border-white" style={{ width: '100px', height: '100px', fontSize: '32px' }}>
                      <span role="img" aria-label="No Image">📂</span>
                    </div>
                  )}
                </div>

                {/* Main Title & Status Pill */}
                <h3 className="fw-bolder text-dark mb-1 text-center" style={{ color: '#0f172a' }}>{details.name}</h3>
                <span className={`badge rounded-pill mb-4 px-3 py-2 ${details.active == 1 ? 'bg-success text-white' : 'bg-danger text-light'}`} style={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.8px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                  {details.active == 1 ? '● ACTIVE' : '○ INACTIVE'}
                </span>

                {/* Details Grid Array */}
                <div className="w-100 bg-light p-4" style={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  
                  <div className="d-flex justify-content-between mb-3 border-bottom pb-3" style={{ borderColor: '#cbd5e1 !important' }}>
                    <div className="text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Slug Key</div>
                    <div className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>{details.slug}</div>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3 border-bottom pb-3" style={{ borderColor: '#cbd5e1 !important' }}>
                    <div className="text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Singular Name</div>
                    <div className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>{details.cat_singular_name || details.sinName || "—"}</div>
                  </div>

                  <div className="d-flex justify-content-between mb-3 border-bottom pb-3" style={{ borderColor: '#cbd5e1 !important' }}>
                    <div className="text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parent</div>
                    <div className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>
                      {details.parent_category_name ? (
                        <span className="badge bg-secondary rounded-2 px-2 py-1">{details.parent_category_name}</span>
                      ) : (
                        <span className="text-muted fst-italic">None (Root)</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-1">
                    <div className="text-muted fw-semibold mb-2" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</div>
                    <div className="p-3 bg-white border" style={{ borderRadius: '12px', fontSize: '0.95rem', minHeight: '80px', color: '#334155', lineHeight: '1.6' }}>
                      {details.description || <span className="opacity-50 fst-italic">No additional description available.</span>}
                    </div>
                  </div>

                </div>
              </div>
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
  );
}