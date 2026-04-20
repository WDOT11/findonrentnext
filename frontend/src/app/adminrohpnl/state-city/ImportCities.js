import { useState, useEffect } from 'react';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ImportCityForm({ onSuccess, onCancel, stateMap }) {
  const [selectedState, setSelectedState] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = getAuthToken();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedState || !file) {
      alert("Please select a state and a file");
      return;
    }

    const formData = new FormData();
    formData.append('state_id', selectedState);
    formData.append('city_csv', file); // Ensure key matches backend expectation

    setUploading(true);
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/city/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Content-Type is NOT set manually for FormData
        },
        body: formData,
      });

      const data = await res.json();
      if (data.status) {
        alert("Cities imported successfully");
        onSuccess();
      } else {
        alert(data.message || "Import failed");
      }
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setUploading(false);
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
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>📥 Import Cities (CSV)</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onCancel} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4" style={{ background: '#ffffff' }}>
            <form onSubmit={handleSubmit}>
              
              <div className="mb-4">
                <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Target State</label>
                <select
                  className="form-select form-select-lg shadow-sm rounded-3 bg-light text-dark fw-medium"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                >
                  <option value="">-- Choose State --</option>
                  {Object.entries(stateMap).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold small text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Select CSV File</label>
                <div className="input-group shadow-sm rounded-3">
                  <span className="input-group-text bg-light border-end-0">📄</span>
                  <input
                    className="form-control border-start-0 ps-0 text-secondary"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="form-text mt-2" style={{ fontSize: '0.8rem' }}>Upload a properly formatted CSV containing city data.</div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 fw-semibold border rounded-3" onClick={onCancel} disabled={uploading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-info px-4 fw-bold shadow-sm rounded-3 text-white" disabled={uploading}>
                  {uploading ? 'Processing...' : 'Upload CSV'}
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