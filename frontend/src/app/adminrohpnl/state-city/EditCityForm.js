'use client';
import { useEffect, useState, useRef } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";
import dynamic from "next/dynamic";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function EditCityForm({ cityId, onSuccess, onCancel }) {

  const [formData, setFormData] = useState({
    city_name: '',
    city_slug: '',
    city_desc: '', // ✅ added
    state_id: '',
  });

  const token = getAuthToken();
  const authUser = JSON.parse(getAuthUser());
  const authid = authUser.id;

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const didFetchStates = useRef(false);
  const didFetchCity = useRef(false);

  /* Fetch all states */
  useEffect(() => {
    if (didFetchStates.current) return;

    const fetchStates = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/state/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status) setStates(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStates();
    didFetchStates.current = true;
  }, []);

  /* Fetch city details */
  useEffect(() => {
    if (!cityId || didFetchCity.current) return;

    const fetchCityDetails = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/city/getsingle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ city_id: cityId }),
        });

        const data = await res.json();
        if (data.status && data.data?.length) {
          const city = data.data[0];
          setFormData({
            city_name: city.city_name || '',
            city_slug: city.city_slug || '',
            city_desc: city.city_desc || '', // ✅ set desc
            state_id: city.state_id || '',
          });
        }
      } catch (err) {
        console.error('Error fetching city:', err);
      }
    };

    fetchCityDetails();
    didFetchCity.current = true;
  }, [cityId]);

  /* Handle normal input */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* Submit updated city */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/city/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_id: cityId,
          edit_id: authid,
          ...formData, // ✅ includes city_desc
        }),
      });

      const data = await res.json();

      if (data.status) {
        alert('City updated successfully!');
        onSuccess();
      } else {
        setErrorMessage(data.message || 'Failed to update city');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong.');
    } finally {
      setLoading(false);
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
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Edit City</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onCancel} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4" style={{ background: '#ffffff' }}>
            <form onSubmit={handleUpdate}>
              
              <div className="row g-3 mb-3">
                {/* State Selection */}
                <div className="col-md-12">
                  <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>State Selection</label>
                  <select
                    name="state_id"
                    className="form-select form-select-lg shadow-sm rounded-3 bg-light text-dark fw-medium"
                    value={formData.state_id}
                    onChange={handleChange}
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
                       name="city_name"
                       className="form-control border-start-0 ps-0 text-dark fw-medium"
                       value={formData.city_name}
                       onChange={handleChange}
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
                       name="city_slug"
                       className="form-control border-start-0 ps-0 text-secondary font-monospace"
                       value={formData.city_slug}
                       onChange={handleChange}
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
                    value={formData.city_desc}
                    onBlur={(content) =>
                      setFormData(prev => ({ ...prev, city_desc: content }))
                    }
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
                <button type="button" className="btn btn-light px-4 fw-semibold border rounded-3" onClick={onCancel} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm rounded-3" disabled={loading}>
                  {loading ? 'Updating...' : 'Update City'}
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
