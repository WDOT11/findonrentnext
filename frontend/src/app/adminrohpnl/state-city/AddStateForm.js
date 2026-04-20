import { useState } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddStateForm({ onClose, onStateAdded }) {
  const [stateName, setStateName] = useState('');
  const [stateSlug, setStateSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false); // new state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /** Getting the token and userdata from the cookies */
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleStateNameChange = (e) => {
    const name = e.target.value;
    setStateName(name);

    if (!slugManuallyEdited) {
      setStateSlug(generateSlug(name));
    }
  };

  const handleSlugChange = (e) => {
    setStateSlug(e.target.value);
    setSlugManuallyEdited(true); //mark as manually edited
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const authUser = JSON.parse(admindtl);
    const authid = authUser.id;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/state/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          state_name: stateName,
          state_slug: stateSlug,
          add_id: authid,
          edit_id: 0,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        setErrorMessage(data.message || 'Failed to add state');
        setLoading(false);
        return;
      }

      setErrorMessage('');
      setLoading(false);
      
      alert('State registered successfully!');
      onStateAdded();
      onClose();
    } catch (err) {
      setErrorMessage('Internal server error. Please try again.');
      setLoading(false);
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
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Add New State</h5>
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
                     onChange={handleStateNameChange}
                     placeholder="e.g. Maharashtra"
                     required
                     autoFocus
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
                     onChange={handleSlugChange}
                     placeholder="e.g. maharashtra"
                     required
                   />
                </div>
                <div className="form-text mt-2" style={{ fontSize: '0.8rem' }}>URL slug is auto-generated. You can modify it.</div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert">
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div style={{ fontSize: '0.9rem' }}>{errorMessage}</div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 fw-semibold border rounded-3" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success px-4 fw-bold shadow-sm rounded-3" disabled={loading}>
                  {loading ? 'Saving...' : 'Save State'}
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
      `}</style>
    </div>
  );
}
