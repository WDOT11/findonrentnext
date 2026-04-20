'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import styles from '../admin.module.css';
import AddRouteForm from './addRouteForm';
import ViewRoute from './viewRoute';
import EditRouteForm from './editRouteForm';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListRoutePage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewRoute, setViewRoute] = useState(null);
  const [editRoute, setEditRoute] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /** Getting the token from the cookies */
  const token = getAuthToken();

  const routeGroups = [
    { id: 1, role_type: 1, groupName: 'Admin Dashboard', accessTypes: ['View', 'All'] },
    { id: 2, role_type: 1, groupName: 'Admin Roles', accessTypes: ['View', 'All'] },
    { id: 3, role_type: 1, groupName: 'Admin Routes', accessTypes: ['View', 'All'] },
  ];

  useEffect(() => {
    fetchRoutes();
  }, [currentPage]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch(`${API_ADMIN_BASE_URL}/route/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page: currentPage,
          limit
        }),
      });

      const data = await response.json();

      if (data.rcode == 0) {
        window.location.href = "/auth/admin";
      }

      setRoutes(data.data.routes || []);
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /** Function to open the add model */
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setCurrentPage(1);
  }

  /** Function to close the add model */
  const closeAddModal = () => setIsAddModalOpen(false);

  /** Function to open the route view model */
  const viewRouteData = async (id) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/route/view`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ route_id: id }),
      });
      if (!res.ok) throw new Error('Failed to fetch route details.');
      const data = await res.json();

      /** recode = 0 is used for the token error */
      if(data.rcode == 0){
        window.location.href = "/auth/admin";
      }
      const routeData = data.data;
      setViewRoute(routeData);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error('Error fetching route details:', err);
    }
  };

  /** Function to delete the route */
  const handleDeleteRoute = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete the route?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/route/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ route_id: id }),
      });

      const data = await res.json();

      /** recode = 0 is used for the token error */
      if(data.rcode == 0){
        window.location.href = "/auth/admin";
      }

      if (!res.ok) throw new Error('Failed to delete route.');

      setCurrentPage(1);
      alert('Route deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the route.');
    }
  };

  /** Function to close the view and update model */
  const closeViewModal = () => setIsViewModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);

  /** Function to open the edit model for the route */
  const openEditRouteModal = async (id) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/route/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ route_id: id }),
      });
      if (!res.ok) throw new Error('Failed to fetch route details');
      const data = await res.json();
      /** recode = 0 is used for the token error */
      if(data.rcode == 0){
        window.location.href = "/auth/admin";
      }
      const routeData = data.data;
      setEditRoute(routeData);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching route details:', err);
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchRoutes();
  };

  const handleEditSuccess = () => {
    setIsAddModalOpen(false);
    fetchRoutes();
  }

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <img src="/infinity-loading.gif" alt="Loading..." width="80" />
        </div>
      ) : (
        <div>
          <h2>Routes</h2>

          <button onClick={openAddModal}>Add Route</button>

          {/* Routes Table */}
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Access Type</th>
                <th>Route Type</th>
                <th>Group Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {routes.length > 0 ? (
              routes.map((route, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * limit + index + 1}</td>
                  <td>{route.route_name}</td>
                  <td>{route.access_type == 1 ? 'View' : route.access_type == 2 ? 'All' : ''}</td>
                  <td> { route.route_type == 1 ? 'Admin' : route.route_type == 2 ? 'User' : route.route_type == 3 ? 'Public' : '' }</td>
                  {/* <td>{route.group_name}</td> */}
                  <td>{ routeGroups.find((group) => group.id == route.group_name)?.groupName || 'Unknown' }</td>
                  <td>
                      <button onClick={() => viewRouteData(route.id)}>View</button>
                      <button onClick={() => openEditRouteModal(route.id)}>Edit</button>
                      <button onClick={() => handleDeleteRoute(route.id)}>Delete</button>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No Route Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Section */}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}

      {/* Add New route Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className={styles.modalContent}>
            <button className={styles.modalCloseButton} onClick={closeAddModal}> × </button>
            <AddRouteForm onClose={closeAddModal} routeGroup={routeGroups} onSuccess={handleAddSuccess} />
          </div>
        </div>
      )}

      {/* View Route Modal */}
      {isViewModalOpen && (
        <ViewRoute routeGroup={routeGroups} route={viewRoute} onClose={closeViewModal} />
      )}

      {/* Edit Route Modal */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className={styles.modalContent}>
            <button className={styles.modalCloseButton} onClick={closeEditModal}> × </button>
            <EditRouteForm route={editRoute} routeGroup={routeGroups} onClose={closeEditModal} onSuccess={handleEditSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}