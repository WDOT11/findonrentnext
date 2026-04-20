'use client';
import { useEffect, useRef, useState } from 'react';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditRoleForm({ roleId, onClose, onSuccess }) {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  /** Getting the token from the cookies */
  const token = getAuthToken();

  const hasFetched = useRef(false);
  
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRole = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/role/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role_id: roleId }),
        });
        const data = await res.json();

        if (!res.ok || !data.status) throw new Error(data.message || 'Failed to fetch role');

        setRoleName(data.data[0]?.name || '');
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    /** Getting the userdata from the cookies */
    const admindtl = getAuthUser();

    const authUser = JSON.parse(admindtl);
    const authid = authUser.id;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/role/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: roleId,
          name: roleName,
          edit_id: authid,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.status) throw new Error(data.message || 'Failed to update');

      // Show success alert after successful role update
      alert('Role Updated successfully!');

      onSuccess(); // close modal + refresh
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="editrole_roh_overlay">
        <div className="editrole_roh_modal">
          <p>Loading...</p>
        </div>
        <style jsx>{modalStyles}</style>
      </div>
    );
  }

  return (
    <div className="editrole_roh_overlay">
      <div className="editrole_roh_modal">
        <button className="editrole_roh_close" onClick={onClose}>×</button>
        <h2 className="editrole_roh_title">Edit Role</h2>

        <form onSubmit={handleSubmit}>
          <div className="editrole_roh_field">
            <label htmlFor="roleName">Role Name</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
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

// Modal styles (scoped)
const modalStyles = `
.editrole_roh_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.editrole_roh_modal {
  background: #fff;
  padding: 25px 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 95%;
  position: relative;
}

.editrole_roh_close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.editrole_roh_title {
  margin-top: 0;
  font-size: 20px;
  margin-bottom: 20px;
}

.editrole_roh_field {
  margin-bottom: 20px;
}

.editrole_roh_field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.editrole_roh_field input {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.editrole_roh_error {
  color: red;
  margin-bottom: 15px;
}

.editrole_roh_actions {
  display: flex;
  justify-content: space-between;
}

.editrole_roh_save {
  background-color: #0070f3;
  color: white;
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.editrole_roh_cancel {
  background-color: #999;
  color: white;
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
`;