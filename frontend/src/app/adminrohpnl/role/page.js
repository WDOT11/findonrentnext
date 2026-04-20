'use client';
import { useState, useEffect } from 'react';
import AddRoleForm from './AddRoleForm';
import EditRoleForm from './EditRoleForm';
import styles from '../admin.module.css';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function RoleListPage() {
  const [role_roles, setRoleRoles] = useState([]);
  const [role_loading, setRoleLoading] = useState(true);
  const [role_error, setRoleError] = useState(null);
  const [role_limit] = useState(10);

  const [role_isAddModalOpen, setRoleIsAddModalOpen] = useState(false);
  const [role_isEditModalOpen, setRoleIsEditModalOpen] = useState(false);
  const [role_selectedRoleId, setRoleSelectedRoleId] = useState(null);
  const [authId, setAuthId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  /** Get localStorage values only on client (browser) */
  useEffect(() => {

    if (typeof window !== 'undefined') {

      /** Getting the token and userdata from the cookies */
      const token = getAuthToken();
      const admindtl = getAuthUser();

      if (admindtl && token) {
        try {
          const parsedUser = JSON.parse(admindtl);
          setAuthId(parsedUser?.id);
          setAuthToken(token);
        } catch (err) {
          console.error('Failed to parse authUser:', err);
        }
      }
    }
  }, []);

  const role_fetchRoles = async () => {
    if (!authToken) return;

    setRoleLoading(true);

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/role/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          page: 1,
          limit: role_limit,
        }),
      });

      const data = await res.json();
      setRoleRoles(data.data || []);
    } catch (err) {
      setRoleError(err.message);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      role_fetchRoles();
    }
  }, [role_limit, authToken]);

  const role_openAddModal = () => setRoleIsAddModalOpen(true);
  const role_closeAddModal = () => setRoleIsAddModalOpen(false);

  const role_openEditModal = (roleId) => {
    setRoleSelectedRoleId(roleId);
    setRoleIsEditModalOpen(true);
  };
  const role_closeEditModal = () => {
    setRoleIsEditModalOpen(false);
    setRoleSelectedRoleId(null);
  };

  const role_handleDelete = async (roleId) => {
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (!confirmDelete || !authToken || !authId) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/role/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          role_id: roleId,
          edit_id: authId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        alert(data.message || 'Failed to delete role');
        return;
      }

      alert('Role deleted successfully');
      role_fetchRoles();
    } catch (err) {
      alert('Error deleting role: ' + err.message);
    }
  };

  return (
    <div>
       {role_loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <img src="/infinity-loading.gif" alt="Loading..." width="80" />
        </div>
      ) : (
        <div style={{ padding: '30px' }}>
          <button onClick={role_openAddModal} style={{ padding: '8px 16px', marginBottom: '20px' }}>
            Add Role
          </button>

          <h2>Roles List</h2>

          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Role ID</th>
                <th>Role Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {role_roles.length > 0 ? (
                role_roles.map((role) => {
                  return (
                    <tr
                      key={role.id}
                      className={role.active !== 1 ? styles.rohadminpnroledeltr : 'activeRoleRow'}
                    >
                      <td>{role.id}</td>
                      <td>{role.name}</td>
                      <td>{role.active === 1 ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button onClick={() => role_openEditModal(role.id)}>Edit</button>
                        {' | '}
                        <button
                          onClick={() => role_handleDelete(role.id)}
                          disabled={role.active !== 1}
                          className={role.active !== 1 ? 'rohadminpnlroledel_' : ''}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No roles available.</td>
                </tr>
              )}
            </tbody>

          </table>

          {role_error && <p style={{ color: 'red' }}>Error: {role_error}</p>}

          {role_isAddModalOpen && (
            <AddRoleForm
              onClose={role_closeAddModal}
              onSuccess={() => {
                role_closeAddModal();
                role_fetchRoles();
              }}
            />
          )}

          {role_isEditModalOpen && role_selectedRoleId && (
            <EditRoleForm
              roleId={role_selectedRoleId}
              onClose={role_closeEditModal}
              onSuccess={() => {
                role_closeEditModal();
                role_fetchRoles();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}