'use client';

import { useState, useEffect } from 'react';
import AddStateForm from './AddStateForm';
import EditStateForm from './EditStateForm';
import CityList from './CityList';
import styles from '../admin.module.css';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function StateCityPage() {
  const [activeTab, setActiveTab] = useState('states');
  const [states, setStates] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddStateOpen, setIsAddStateOpen] = useState(false);
  const [isEditStateOpen, setIsEditStateOpen] = useState(false);
  const [stateIdToEdit, setStateIdToEdit] = useState(null);
  const [editStateError, setEditStateError] = useState(null);

  /** Getting the token from the cookies */
  const token = getAuthToken();

  const limit = 10;

  // Fetch States
  const fetchStates = async (page = currentPage) => {
    if (activeTab !== 'states') return;
    setLoading(true);
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/state/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page, limit, search: searchTerm, status: statusFilter }),
      });

      if (!res.ok) throw new Error('Failed to fetch states');

      const data = await res.json();
      if (data.status) {
        setStates(data.data || []);
        setTotalPages(data.totalPages || Math.ceil(data.totalCount / limit) || 1);
      } else {
        setStates([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, [currentPage, activeTab, searchTerm, statusFilter]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStateAdded = () => {
    setIsAddStateOpen(false);
    setCurrentPage(1);
    setSearchTerm('');
    setSearchInput('');
    setStatusFilter('all');
  };

  const handleEditState = async (state_id) => {
    setStateIdToEdit(state_id);
    setIsEditStateOpen(true);
  };

  const handleStateUpdated = async (updatedState) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/state/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedState),
      });

      if (!res.ok) throw new Error('Failed to update state');

      const data = await res.json();
      if (data.status) {
        alert('State updated successfully!');
        setIsEditStateOpen(false);
        setEditStateError(null);
        await fetchStates(currentPage);
        return { success: true };
      } else {
        return { error: data.message || 'Failed to update state' };
      }
    } catch (error) {
      console.error('Error updating state:', error);
      return { error: 'An error occurred while updating the state.' };
    }
  };

  const handleDeleteState = async (state_id) => {
    if (!window.confirm('Are you sure you want to delete this state?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/state/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state_id }),
      });

      if (!res.ok) throw new Error('Failed to delete state');

      const data = await res.json();

      if (data.status) {
        await fetchStates(currentPage);
      } else {
        alert(data.message || 'Failed to delete state');
      }
    } catch (error) {
      console.error('Error deleting state:', error);
      alert('An error occurred while deleting the state.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
      <div className="card shadow-sm border-0 rounded-4">
        
        {/* Sleek Tab Navigation */}
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
          <ul className="nav nav-tabs border-bottom-0 shadow-none d-flex gap-2">
            <li className="nav-item">
              <button
                onClick={() => handleTabClick('states')}
                className={`nav-link fw-bold border-0 rounded-top-3 px-4 ${activeTab === 'states' ? 'active bg-primary text-white shadow-sm' : 'text-muted bg-light hover-bg-gray'}`}
                style={{ transition: 'all 0.2s', cursor: 'pointer' }}
              >
                🌍 States
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={() => handleTabClick('cities')}
                className={`nav-link fw-bold border-0 rounded-top-3 px-4 ${activeTab === 'cities' ? 'active bg-primary text-white shadow-sm' : 'text-muted bg-light hover-bg-gray'}`}
                style={{ transition: 'all 0.2s', cursor: 'pointer' }}
              >
                🏙️ Cities
              </button>
            </li>
          </ul>
        </div>

        {/* === STATES TAB === */}
        {activeTab === 'states' && (
          <div className="card-body p-4 bg-white rounded-bottom-4 shadow-sm border-top">
            
            {/* Header & Controls Row */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <h4 className="mb-0 fw-bolder text-dark" style={{ letterSpacing: '0.5px' }}>States Directory</h4>
              <button
                onClick={() => setIsAddStateOpen(true)}
                className="btn btn-success px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
                style={{ borderRadius: '8px' }}
              >
                + Add New State
              </button>
            </div>

            {/* Filter Card */}
            <div className="bg-light p-3 rounded-4 mb-4 border border-secondary border-opacity-10">
              <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
                
                <div className="col-md-5">
                  <label className="form-label text-muted fw-semibold small mb-1">Search State</label>
                  <input
                    type="text"
                    className="form-control shadow-none rounded-3"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter state name..."
                  />
                </div>
                
                <div className="col-md-3">
                  <label className="form-label text-muted fw-semibold small mb-1">Status Filter</label>
                  <select className="form-select shadow-none rounded-3" value={statusFilter} onChange={handleStatusChange}>
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
                
                <div className="col-md-4 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4 rounded-3 flex-grow-1 shadow-sm">Search</button>
                  <button type="button" onClick={handleClearSearch} className="btn btn-outline-secondary px-4 rounded-3 flex-grow-1">Clear</button>
                </div>
                
              </form>
            </div>

            {/* Table */}
            <div className="table-responsive rounded-3 border">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="ps-4 py-3">ID</th>
                    <th scope="col" className="py-3">State Name</th>
                    <th scope="col" className="py-3">Slug Key</th>
                    <th scope="col" className="py-3">Status</th>
                    <th scope="col" className="text-center pe-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {states.length > 0 ? (
                    states.map((state) => (
                      <tr key={state.state_id} className={state.active !== 1 ? 'table-light text-muted' : ''}>
                        <td className="ps-4 fw-semibold">#{state.state_id}</td>
                        <td className="fw-bold text-dark">{state.state_name}</td>
                        <td><span className="bg-light px-2 py-1 rounded text-secondary font-monospace border" style={{ fontSize: '0.85em' }}>{state.state_slug}</span></td>
                        <td>
                          <span className={`badge rounded-pill ${state.active === 1 ? 'bg-success' : 'bg-danger'}`} style={{ padding: '0.4em 0.8em' }}>
                            {state.active === 1 ? '● Active' : '○ Inactive'}
                          </span>
                        </td>
                        <td className="text-center pe-4">
                          <div className="btn-group shadow-sm">
                            <button className="btn btn-sm btn-info text-white" onClick={() => handleEditState(state.state_id)}  title="Edit State">Edit</button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDeleteState(state.state_id)}
                              disabled={loading || state.active !== 1}
                              title={state.active !== 1 ? "Cannot delete inactive" : "Delete state"}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📂</div>
                        <span className="fw-medium text-secondary">No states found. Adjust filters to try again.</span>
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
                <span className="text-muted fw-medium bg-light px-4 py-2 rounded-pill shadow-sm border">
                  Page <span className="text-dark fw-bolder">{currentPage}</span> of {totalPages}
                </span>
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
        )}

        {/* === CITIES TAB === */}
        {activeTab === 'cities' && (
          <div className="card-body p-0 border-top bg-white">
            <CityList />
          </div>
        )}

        {/* Modals placed outside of content blocks for proper z-index */}
        {isAddStateOpen && <AddStateForm onClose={() => setIsAddStateOpen(false)} onStateAdded={handleStateAdded} />}
        {isEditStateOpen && (
          <EditStateForm
            key={stateIdToEdit}
            state_id={stateIdToEdit}
            onClose={() => { setIsEditStateOpen(false); setEditStateError(null); }}
            onStateUpdated={handleStateUpdated}
            error={editStateError}
          />
        )}
      </div>
      )}
    </div>
  );
}