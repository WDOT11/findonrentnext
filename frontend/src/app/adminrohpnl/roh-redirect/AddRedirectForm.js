'use client';
import { useState } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddRedirectForm({ onClose, onSuccess }) {
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [redirectType, setRedirectType] = useState(301);
  const [status, setStatus] = useState(1);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const token = getAuthToken();
  const authUser = JSON.parse(getAuthUser());
  const authid = authUser.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/redirect/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source_url: sourceUrl,
          target_url: targetUrl,
          redirect_type: redirectType,
          status: status,
          is_regex: 0,
          match_type: "exact",
          notes: notes,
          add_id: authid,
          edit_id: 0
        }),
      });

      const data = await res.json();

      /** token expired */
      if (data.rcode === 0) {
        window.location.href = "/auth/admin";
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add redirect");
      }

      alert("Redirect added successfully!");

      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="addrole_roh_modalOverlay">
      <div className="addrole_roh_modalContent">
        <button onClick={onClose} className="addrole_roh_closeButton">×</button>

        <form onSubmit={handleSubmit}>
          <h3 className="addrole_roh_heading">Add New Redirect</h3>

          {/* Source URL */}
          <div className="addrole_roh_formField">
            <label className="addrole_roh_label">Source URL</label>
            <input
              type="text"
              placeholder="/contact-us"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              required
              className="addrole_roh_input"
            />
          </div>

          {/* Target URL */}
          <div className="addrole_roh_formField">
            <label className="addrole_roh_label">Target URL</label>
            <input
              type="text"
              placeholder="/goa"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
              className="addrole_roh_input"
            />
          </div>

          {/* Redirect Type */}
          <div className="addrole_roh_formField">
            <label className="addrole_roh_label">Redirect Type</label>
            <select
              value={redirectType}
              onChange={(e) => setRedirectType(Number(e.target.value))}
              className="addrole_roh_select"
            >
              <option value={301}>301 – Permanent</option>
              <option value={302}>302 – Temporary</option>
              <option value={307}>307 – Temporary</option>
              <option value={308}>308 – Permanent New</option>
            </select>
          </div>

          {/* Status */}
          <div className="addrole_roh_formField">
            <label className="addrole_roh_label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="addrole_roh_select"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          {/* Notes */}
          <div className="addrole_roh_formField">
            <label className="addrole_roh_label">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="addrole_roh_input"
              rows="3"
            />
          </div>

          {errorMessage && (
            <div className="addrole_roh_errorMessage">
              {errorMessage}
            </div>
          )}

          <div className="addrole_roh_formActions">
            <button type="submit" className="addrole_roh_button addrole_roh_saveButton">
              Save
            </button>
            <button type="button" onClick={onClose} className="addrole_roh_button addrole_roh_cancelButton">
              Cancel
            </button>
          </div>
        </form>
      </div>
      <style jsx>
        {`
        .addrole_roh_modalOverlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .addrole_roh_modalContent {
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          width: 400px;
          position: relative;
          z-index: 10000;
          box-shadow: 0 0 15px rgba(0,0,0,0.3);
        }

        .addrole_roh_closeButton {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 20px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .addrole_roh_heading {
          margin-bottom: 20px;
          font-weight: bold;
          font-size: 18px;
        }

        .addrole_roh_formField {
          margin-bottom: 15px;
        }

        .addrole_roh_label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .addrole_roh_input,
        .addrole_roh_select {
          width: 100%;
          padding: 8px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .addrole_roh_errorMessage {
          color: red;
          margin-bottom: 10px;
        }

        .addrole_roh_formActions {
          display: flex;
          justify-content: space-between;
        }

        .addrole_roh_button {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          font-weight: 500;
          cursor: pointer;
        }

        .addrole_roh_saveButton {
          background-color: #4CAF50;
          color: white;
        }

        .addrole_roh_cancelButton {
          background-color: #f44336;
          color: white;
        }
      `}
      </style>
    </div>
  );
}
