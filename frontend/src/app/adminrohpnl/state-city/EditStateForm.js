'use client';
import { useState, useEffect, useRef } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditStateForm({ state_id, onClose, onStateUpdated, error }) {
  const [stateName, setStateName] = useState('');
  const [stateSlug, setStateSlug] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const hasFetched = useRef(false);
  /** Getting the token from the cookies */
  const token = getAuthToken();
  const authUser = getAuthUser();

  // Fetch state details
  useEffect(() => {
    if (!state_id || hasFetched.current) return;

    const fetchStateDetails = async () => {
      hasFetched.current = true;
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/state/getsingle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ state_id }),
        });

        if (!res.ok) throw new Error('Failed to fetch state details');
        const data = await res.json();

        if (data.status && data.data.length > 0) {
          const state = data.data[0];
          setStateName(state.state_name);
          setStateSlug(state.state_slug);
        } else {
          alert('State not found!');
        }
      } catch (error) {
        console.error('Error fetching state details:', error);
        alert('An error occurred while fetching state details.');
      }
    };

    fetchStateDetails();
  }, [state_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedUser = authUser ? JSON.parse(authUser) : null;
    const editId = parsedUser?.id || null;
    
    const updatedState = {
      state_name: stateName,
      state_slug: stateSlug,
      state_id: state_id,
      edit_id: editId,
    };

    setErrorMessage('');
    setIsErrorVisible(false);

    const result = await onStateUpdated(updatedState);

    if (result?.error) {
      setErrorMessage(result.error);
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 3000);
    }
  };

  return (
    <div 
      className="modal d-block" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }} 
      tabIndex="-1" 
      role="dialog"
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Edit State</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4" style={{ background: '#ffffff' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>State Name</label>
                <div className="input-group input-group-lg shadow-sm rounded-3">
                   <span className="input-group-text bg-light border-end-0">🌍</span>
                   <input
                     type="text"
                     className="form-control border-start-0 ps-0 text-dark fw-medium"
                     value={stateName}
                     onChange={(e) => setStateName(e.target.value)}
                     required
                   />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>State Slug</label>
                <div className="input-group shadow-sm rounded-3">
                   <span className="input-group-text bg-light border-end-0">🔗</span>
                   <input
                     type="text"
                     className="form-control border-start-0 ps-0 text-secondary font-monospace"
                     value={stateSlug}
                     onChange={(e) => setStateSlug(e.target.value)}
                     required
                   />
                </div>
              </div>

              {isErrorVisible && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert" style={{ animation: 'fadeOut 3s forwards' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div style={{ fontSize: '0.9rem' }}>{errorMessage}</div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 fw-semibold border rounded-3" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm rounded-3">
                  Update State
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}