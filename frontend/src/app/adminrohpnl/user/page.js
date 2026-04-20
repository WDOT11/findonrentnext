'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import styles from '../admin.module.css';
import AddUserForm from './AddUserForm';
import EditUserForm from './EditUserForm';
import ViewUser from './ViewUser';
import { getAuthToken, setClientCookie, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListUserPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(100);
  const [editUser, setEditUser] = useState(null);
  const router = useRouter();

  const [page, setPage] = useState(1);


  const [filters, setFilters] = useState({
    user_name: '',
    user_role_id: '',
    active: '',
  });

  const [searchForm, setSearchForm] = useState({
    user_name: '',
    user_role_id: '',
    active: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  /** Getting the token from the cookies */
  const token = getAuthToken();

  const roleMap = roles.reduce((map, role) => {
    map[role.id] = role.name;
    return map;
  }, {});

  useEffect(() => {
    const fetchUsers = async () => {
      if (!initialLoad) setLoading(true);
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/user/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ page: currentPage, limit, ...filters }),
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        if (data.rcode == 0) window.location.href = "/auth/admin";
        setUsers(data.data.users || []);
        setPage(data.data.page);
        setTotalPages(data.data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };
    fetchUsers();
  }, [currentPage, filters]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/role/roles`);
        if (!res.ok) throw new Error('Failed to fetch roles');
        const data = await res.json();
        if (data.rcode == 0) window.location.href = "/auth/admin";
        setRoles(data.data || []);
      } catch (err) {
        console.error('Role fetch error:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleSearchFormChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(searchForm);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = async (user) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/user/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      const data = await res.json();
      if (data.rcode == 0)  window.location.href = "/auth/admin";
      setEditUser(data.data[0]);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUser(null);
  };

  const handleDeleteUser = async (user_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/user/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();
      if (data.rcode == 0) window.location.href = "/auth/admin";
      if (!res.ok) throw new Error('Failed to delete user');
      alert('User deleted successfully');
      setFilters({ ...filters }); // refresh
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting user.');
    }
  };

  const openViewModal = async (user) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/user/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      const data = await res.json();
      if (data.rcode == 0)  window.location.href = "/auth/admin";
      setViewUser(data.data[0]);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewUser(null);
  };

  const handleSwitchUser = async (user) => {
    const confirmSwitch = window.confirm(`Are you sure you want to switch to user: ${user.first_name} ${user.last_name}?`);
    if (!confirmSwitch) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/user/switch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      const data = await res.json();
      if (data.success) {
        // 1. Save current admin token & user data to temp cookies (using raw strings for compatibility)
        const currentAdminToken = getAuthToken();
        const currentAdminUser = getAuthUser();
        
        document.cookie = `adminAuthToken=${currentAdminToken}; path=/; max-age=86400`; // 1 day
        document.cookie = `adminAuthUser=${currentAdminUser}; path=/; max-age=86400`;

        // 2. Set new user token & user data (matching LoginClient.js raw cookie format)
        document.cookie = `authToken=${data.token}; path=/; max-age=1296000`; // 15 days
        document.cookie = `authUser=${JSON.stringify(data.user)}; path=/; max-age=1296000`;

        alert(`Switched to ${user.first_name}. Redirecting...`);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Failed to switch user");
      }
    } catch (err) {
      console.error('Switch error:', err);
      alert('Error switching user.');
    }
  };

  return (
    <div className="container-fluid py-4">
      {loading && initialLoad ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
      <div className="card shadow-sm border-0 rounded-4 bg-white">
        
        {/* Header & Controls Row */}
        <div className="card-header bg-white border-bottom-0 p-4 pb-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-0 gap-3">
            <h4 className="mb-0 fw-bolder text-dark" style={{ letterSpacing: '0.5px' }}>Users Directory</h4>
            <button
              onClick={openModal}
              className="btn btn-primary px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
              style={{ borderRadius: '8px' }}
            >
              + Add New User
            </button>
          </div>
        </div>

        <div className="card-body px-4 pb-4 pt-0">
          {/* Filter Card */}
          <div className="bg-light p-3 rounded-4 mb-4 border border-secondary border-opacity-10">
            <form onSubmit={handleSearch} className="row g-3 align-items-end">
              
              <div className="col-lg-4 col-md-6">
                <label className="form-label text-muted fw-semibold small mb-1">User Info</label>
                <input
                  type="text"
                  name="user_name"
                  className="form-control shadow-none rounded-3"
                  value={searchForm.user_name}
                  onChange={handleSearchFormChange}
                  placeholder="Search name, email, phone..."
                  autoComplete="off"
                />
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label text-muted fw-semibold small mb-1">User Role</label>
                <select
                  name="user_role_id"
                  className="form-select shadow-none rounded-3"
                  value={searchForm.user_role_id}
                  onChange={handleSearchFormChange}
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-lg-3 col-md-6">
                <label className="form-label text-muted fw-semibold small mb-1">Status Filter</label>
                <select
                  name="active"
                  className="form-select shadow-none rounded-3"
                  value={searchForm.active}
                  onChange={handleSearchFormChange}
                >
                  <option value="">All Status</option>
                  <option value="1">Active Only</option>
                  <option value="0">Inactive Only</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-6">
                <button type="submit" className="btn btn-success w-100 rounded-3 shadow-sm">Search</button>
              </div>

            </form>
          </div>

          {/* Table */}
          <div className="table-responsive rounded-3 border">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="ps-4 py-3">#</th>
                  <th scope="col" className="py-3">User ID</th>
                  <th scope="col" className="py-3">Full Name</th>
                  <th scope="col" className="py-3">Contact</th>
                  <th scope="col" className="py-3">Role</th>
                  <th scope="col" className="py-3">Added On</th>
                  <th scope="col" className="py-3">Status</th>
                  <th scope="col" className="text-center pe-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                { users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.user_id} className={user.active === 0 ? 'table-light text-muted' : ''}>
                      <td className="ps-4 fw-semibold text-secondary">{(page - 1) * limit + index + 1}</td>
                      <td className="fw-medium font-monospace">#{user.user_id}</td>
                      <td>
                        <div className="fw-bold text-dark">{user.first_name} {user.last_name}</div>
                      </td>
                      <td>
                        <div className="fw-medium">{user.phone_number}</div>
                        <div className="text-secondary small">{user.email}</div>
                      </td>
                      <td>
                        <span className="badge bg-secondary rounded-pill bg-opacity-10 text-dark border">
                          {roleMap[user.user_role_id] || 'Unknown'} {user.is_service_provider === 1 ? ' (Vendor)' : ''}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        {new Date(user.add_date).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${user.active === 1 ? 'bg-success' : 'bg-danger'}`} style={{ padding: '0.4em 0.8em' }}>
                          {user.active === 1 ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td className="text-center pe-4">
                        <div className="btn-group shadow-sm">
                          <button className="btn btn-sm btn-info text-white" onClick={() => openViewModal(user)} title="View User">View</button>
                          <button className="btn btn-sm btn-primary" onClick={() => openEditModal(user)} title="Edit User">Edit</button>
                          <button className="btn btn-sm btn-success" onClick={() => handleSwitchUser(user)} title="Switch User">Switch</button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(user.user_id)}
                            disabled={user.active === 0}
                            title={user.active === 0 ? "Cannot delete inactive" : "Delete user"}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>🧑‍🤝‍🧑</div>
                      <span className="fw-medium text-secondary">No users found. Adjust filters to try again.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Layer */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4 px-2">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1 || loading} 
                className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-bold"
              >
                ← Prev
              </button>
              <div className="text-center">
                <span className="text-muted fw-medium bg-light px-4 py-2 rounded-pill shadow-sm border">
                  Page <span className="text-dark fw-bolder">{currentPage}</span> of {totalPages}
                </span>
                {loading && !initialLoad && <div className="text-primary small mt-2 fw-semibold">Updating...</div>}
              </div>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages || loading} 
                className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-bold"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Modals outside document flow */}
        {isModalOpen && (
          <AddUserForm onClose={closeModal} onSuccess={() => setIsModalOpen(false)} />
        )}

        {isEditModalOpen && editUser && (
          <EditUserForm user={editUser} roles={roles} onClose={closeEditModal} onSuccess={() => { setFilters((prev) => ({ ...prev })); closeEditModal(); }} />
        )}

        {isViewModalOpen && viewUser && (
          <ViewUser user={viewUser} onClose={closeViewModal} />
        )}
      </div>
      )}
    </div>
  );
}
