'use client';
import { useEffect, useState, useRef } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";
import dynamic from "next/dynamic";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function AddCityForm({ onSuccess, onCancel }) {

  const [cityName, setCityName] = useState('');
  const [slug, setSlug] = useState('');
  const [cityDesc, setCityDesc] = useState(''); // ✅ city_desc state
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [stateId, setStateId] = useState('');
  const [states, setStates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const token = getAuthToken();
  const fetched = useRef(false);

  /* Fetch states */
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchStates = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/state/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status) setStates(data.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  /* Auto slug */
  useEffect(() => {
    if (!isSlugTouched) {
      setSlug(
        cityName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
      );
    }
  }, [cityName, isSlugTouched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!stateId) {
      setErrorMessage('Please select a state.');
      return;
    }

    const authUser = JSON.parse(getAuthUser());
    const authid = authUser.id;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/city/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_name: cityName,
          city_slug: slug,
          city_desc: cityDesc, // ✅ sending to backend
          state_id: Number(stateId),
          add_id: authid,
        }),
      });

      const data = await res.json();

      if (data.status) {
        alert('City added successfully!');
        onSuccess();
      } else {
        setErrorMessage(data.message || 'Failed to add city.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Try again.');
    }
  };

  return (
    <div 
      className="modal d-block" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }} 
      tabIndex="-1" 
      role="dialog"
      onClick={onCancel}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Add New City</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onCancel} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4" style={{ background: '#ffffff' }}>
            <form onSubmit={handleSubmit}>
              
              <div className="row g-3 mb-3">
                {/* State Selection */}
                <div className="col-md-12">
                  <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>State Selection</label>
                  <select
                    className="form-select form-select-lg shadow-sm rounded-3 bg-light text-dark fw-medium"
                    value={stateId}
                    onChange={(e) => setStateId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a State --</option>
                    {states.map((state) => (
                      <option key={state.state_id} value={state.state_id}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                {/* City Name */}
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>City Name</label>
                  <div className="input-group input-group-lg shadow-sm rounded-3">
                     <span className="input-group-text bg-light border-end-0">🏙️</span>
                     <input
                       type="text"
                       className="form-control border-start-0 ps-0 text-dark fw-medium"
                       value={cityName}
                       onChange={(e) => {
                         setCityName(e.target.value);
                         setIsSlugTouched(false);
                       }}
                       placeholder="e.g. Mumbai"
                       required
                       autoFocus
                     />
                  </div>
                </div>

                {/* Slug */}
                <div className="col-md-6">
                  <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>City Slug</label>
                  <div className="input-group shadow-sm rounded-3" style={{ height: 'calc(100% - 28px)' }}>
                     <span className="input-group-text bg-light border-end-0">🔗</span>
                     <input
                       type="text"
                       className="form-control border-start-0 ps-0 text-secondary font-monospace"
                       value={slug}
                       onChange={(e) => {
                         setSlug(e.target.value);
                         setIsSlugTouched(true);
                       }}
                       placeholder="e.g. mumbai"
                       required
                     />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Description</label>
                <div className="shadow-sm rounded-3 bg-white border" style={{ minHeight: '200px' }}>
                  <JoditEditor
                    value={cityDesc}
                    onBlur={(content) => setCityDesc(content)}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert">
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div style={{ fontSize: '0.9rem' }}>{errorMessage}</div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 fw-semibold border rounded-3" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success px-4 fw-bold shadow-sm rounded-3">
                  Add City
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
