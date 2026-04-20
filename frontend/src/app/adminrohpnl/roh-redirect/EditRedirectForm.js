'use client';
import { useEffect, useRef, useState } from 'react';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditRedirectForm({ redirectId, onClose, onSuccess }) {

  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [redirectType, setRedirectType] = useState('301');
  const [matchType, setMatchType] = useState('exact');
  const [status, setStatus] = useState('active');   // ENUM
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const token = getAuthToken();
  const hasFetched = useRef(false);

  /* ================= FETCH REDIRECT ================= */
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRedirect = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/redirect/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ redirect_id: redirectId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch redirect');
        }

        const r = data.data;

        setSourceUrl(r.source_url || '');
        setTargetUrl(r.target_url || '');
        setRedirectType(r.redirect_type || '301');
        setMatchType(r.match_type || 'exact');
        setStatus(r.status || 'active');
        setNotes(r.notes || '');

      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRedirect();
  }, [redirectId, token]);

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/redirect/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: redirectId,
          source_url: sourceUrl,
          target_url: targetUrl,
          redirect_type: redirectType,
          match_type: matchType,
          status: status,       // ENUM
          notes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update redirect');
      }

      alert('Redirect updated successfully');
      onSuccess();

    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="editrole_roh_overlay">
        <div className="editrole_roh_modal">
          <p>Loading redirect...</p>
        </div>
        <style jsx>{modalStyles}</style>
      </div>
    );
  }

  return (
    <div className="editrole_roh_overlay">
      <div className="editrole_roh_modal">

        <button className="editrole_roh_close" onClick={onClose}>×</button>
        <h2 className="editrole_roh_title">Edit Redirect</h2>

        <form onSubmit={handleSubmit}>

          <div className="formGrid">
            <div className="editrole_roh_field">
              <label>Source URL</label>
              <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} required />
            </div>

            <div className="editrole_roh_field">
              <label>Target URL</label>
              <input value={targetUrl} onChange={e => setTargetUrl(e.target.value)} required />
            </div>

            <div className="editrole_roh_field">
              <label>Redirect Type</label>
              <select value={redirectType} onChange={e => setRedirectType(e.target.value)}>
                <option value="301">301 – Permanent</option>
                <option value="302">302 – Temporary</option>
                <option value="307">307 – Temporary</option>
                <option value="308">308 – Permanent New</option>
              </select>
            </div>

            <div className="editrole_roh_field">
              <label>Match Type</label>
              <select value={matchType} onChange={e => setMatchType(e.target.value)}>
                <option value="exact">Exact</option>
                <option value="prefix">Prefix</option>
              </select>
            </div>
          </div>

          {/* STATUS TOGGLE */}
          <div className="toggleRow">
            <label className="toggleLabel">Status</label>

            <label className="switch">
              <input
                type="checkbox"
                checked={status === 'active'}
                onChange={e => setStatus(e.target.checked ? 'active' : 'inactive')}
              />
              <span className="slider"></span>
            </label>

            <span className={status === 'active' ? 'activeTxt' : 'inactiveTxt'}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="editrole_roh_field">
            <label>Notes</label>
            <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {errorMessage && <p className="editrole_roh_error">{errorMessage}</p>}

          <div className="editrole_roh_actions">
            <button type="submit" className="editrole_roh_save">Update</button>
            <button type="button" className="editrole_roh_cancel" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>

      <style jsx>{modalStyles}</style>
    </div>
  );
}

/* ================= MODAL STYLES ================= */
const modalStyles = `
.editrole_roh_overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.editrole_roh_modal {
  background: #fff;
  padding: 26px 30px;
  border-radius: 10px;
  width: 520px;
  max-width: 95%;
  position: relative;
}

.editrole_roh_close {
  position: absolute;
  top: 12px;
  right: 16px;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
}

.editrole_roh_title {
  margin: 0 0 20px;
  font-size: 22px;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.editrole_roh_field {
  margin-bottom: 15px;
}

.editrole_roh_field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.editrole_roh_field input,
.editrole_roh_field select,
.editrole_roh_field textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.toggleRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.toggleLabel {
  min-width: 100px;
  font-weight: 600;
}

/* Switch */
.switch {
  position: relative;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background: #ccc;
  border-radius: 24px;
  cursor: pointer;
  transition: 0.3s;
}

.slider:before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background: #22c55e;
}

.switch input:checked + .slider:before {
  transform: translateX(22px);
}

.activeTxt {
  color: #16a34a;
  font-weight: 600;
}

.inactiveTxt {
  color: #dc2626;
  font-weight: 600;
}

.editrole_roh_actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.editrole_roh_save {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.editrole_roh_cancel {
  background: #9ca3af;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.editrole_roh_error {
  color: red;
  margin-top: 10px;
}
`;
