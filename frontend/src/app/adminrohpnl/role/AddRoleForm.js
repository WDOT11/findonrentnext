'use client';
import { useState } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddRoleForm({ onClose, onSuccess }) {
  const [roleName, setRoleName] = useState('');
  const [status, setStatus] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleNameChange = (e) => setRoleName(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  /** Getting the token and userdata from the cookies */
  const token = getAuthToken();
  const admindtl = getAuthUser();

  const authUser = JSON.parse(admindtl);
  const authid = authUser.id;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/role/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: roleName,
          active: status,
          add_id: authid,
          edd_id: 0,
        }),
      });

      const data = await res.json();
      /** recode = 0 is used for the token error */
      if (data.rcode == 0) {
        window.location.href = "/auth/admin";
      }

      if (!res.ok || !data.status) {
        throw new Error(data.message || 'Failed to add role');
      }

      alert('Role registered successfully!');

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
          <h3 className="addrole_roh_heading">Add New Role</h3>

          <div className="addrole_roh_formField">
            <label htmlFor="roleName" className="addrole_roh_label">Role Name</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={handleRoleNameChange}
              required
              className="addrole_roh_input"
            />
          </div>

          <div className="addrole_roh_formField">
            <label htmlFor="status" className="addrole_roh_label">Status</label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="addrole_roh_select"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          {errorMessage && (
            <div className="addrole_roh_errorMessage">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="addrole_roh_formActions">
            <button type="submit" className="addrole_roh_button addrole_roh_saveButton">Save</button>
            <button type="button" onClick={onClose} className="addrole_roh_button addrole_roh_cancelButton">Cancel</button>
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
