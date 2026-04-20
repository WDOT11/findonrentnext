'use client';
import { useEffect, useState, useRef } from 'react';
import AddCityForm from './AddCityForm';
import EditCityForm from './EditCityForm';
import ImportCityForm from './ImportCities';
import styles from '../admin.module.css';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function CityList() {
  const [cities, setCities] = useState([]);
  const [stateMap, setStateMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editCityId, setEditCityId] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  /** Getting the token from the cookies */
  const token = getAuthToken();

  const didFetch = useRef(false);

  /* Fetch States (only once on initial render) */
  const fetchStates = async () => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/state/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status) {
        const map = {};
        data.data.forEach((state) => {
          map[state.state_id] = state.state_name;
        });
        setStateMap(map);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  /* Fetch Cities (getall) based on page, search, and status */
  const fetchCities = async (page = currentPage, searchTerm = search, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/city/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page,
          limit,
          search: searchTerm,
          status,
        }),
      });

      const data = await res.json();

      if (data.status) {
        setCities(data.data.data || []);
        setTotalPages(data.data.totalPages || 1);
        setCurrentPage(data.data.currentPage || 1);
      } else {
        setCities([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  /* Fetch City Details (getsingle) when editing a city */
  const fetchCityDetails = async (cityId) => {
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

      if (data.status && Array.isArray(data.data) && data.data.length > 0) {
        const city = data.data[0];
        setEditCityId(cityId); /* Set the city ID for the edit modal */
        setIsEditModalOpen(true);
      } else {
        console.error('City not found');
      }
    } catch (error) {
      console.error('Error fetching city details:', error);
    }
  };

  /* Handle Delete */
  const handleDelete = async (cityId, isActive) => {
    if (isActive === 0) {
      alert("Inactive city cannot be deleted");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this city?");
    if (confirmDelete) {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/city/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            city_id: cityId,
          }),
        });

        const data = await res.json();

        if (data.status) {
          alert("City deleted successfully");
          fetchCities();
        } else {
          alert("Failed to delete city");
        }
      } catch (error) {
        console.error('Error deleting city:', error);
        alert("Error deleting city");
      }
    }
  };

  /* useEffect to fetch states and cities only when needed */
  useEffect(() => {
    if (!didFetch.current) {
      fetchStates();
      fetchCities();
      didFetch.current = true;
    }
  }, []);

  /* Handle search form submission */
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setSearch(trimmed);
    setCurrentPage(1);
    fetchCities(1, trimmed, statusFilter);
  };

  /* Handle clear search input */
  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
    fetchCities(1, '', statusFilter);
  };

  /* Handle status filter change */
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    setCurrentPage(1);
    fetchCities(1, search, newStatus);
  };

  /* Handle pagination for next page */
  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCities(nextPage, search, statusFilter);
    }
  };

  /* Handle pagination for previous page */
  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchCities(prevPage, search, statusFilter);
    }
  };

  /* Handle edit city action */
  const handleEdit = (cityId) => {
    fetchCityDetails(cityId);
  };

  return (
    <div className="p-4 rounded-bottom-4 bg-white">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
      <div>
        
        {/* Header & Controls Row */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <h4 className="mb-0 fw-bolder text-dark" style={{ letterSpacing: '0.5px' }}>Cities Directory</h4>
          <div className="d-flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-success px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
              style={{ borderRadius: '8px' }}
            >
              + Add New City
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn btn-info text-white px-4 fw-semibold shadow-sm"
              style={{ borderRadius: '8px' }}
            >
              📥 Import CSV
            </button>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-light p-3 rounded-4 mb-4 border border-secondary border-opacity-10">
          <form onSubmit={handleSearch} className="row g-3 align-items-end">
            
            <div className="col-md-5">
              <label className="form-label text-muted fw-semibold small mb-1">Search City</label>
              <input
                type="text"
                className="form-control shadow-none rounded-3"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter city name..."
              />
            </div>
            
            <div className="col-md-3">
              <label className="form-label text-muted fw-semibold small mb-1">Status Filter</label>
              <select className="form-select shadow-none rounded-3" value={statusFilter} onChange={handleStatusChange}>
                <option value="all">All Status</option>
                <option value="1">Active Only</option>
                <option value="0">Inactive Only</option>
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
                <th scope="col" className="py-3">City Name</th>
                <th scope="col" className="py-3">Slug Key</th>
                <th scope="col" className="py-3">State</th>
                <th scope="col" className="py-3">Status</th>
                <th scope="col" className="text-center pe-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>🏙️</div>
                    <span className="fw-medium text-secondary">No cities found. Adjust filters to try again.</span>
                  </td>
                </tr>
              ) : (
                cities.map((city) => (
                  <tr key={city.city_id} className={city.active !== 1 ? 'table-light text-muted' : ''}>
                    <td className="ps-4 fw-semibold">#{city.city_id}</td>
                    <td className="fw-bold text-dark">{city.city_name}</td>
                    <td><span className="bg-light px-2 py-1 rounded text-secondary font-monospace border" style={{ fontSize: '0.85em' }}>{city.city_slug}</span></td>
                    <td className="fw-medium text-secondary">{stateMap[city.state_id] || city.state_id}</td>
                    <td>
                      <span className={`badge rounded-pill ${city.active === 1 ? 'bg-success' : 'bg-danger'}`} style={{ padding: '0.4em 0.8em' }}>
                        {city.active === 1 ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td className="text-center pe-4">
                      <div className="btn-group shadow-sm">
                        <button className="btn btn-sm btn-info text-white" onClick={() => handleEdit(city.city_id)} title="Edit City">Edit</button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(city.city_id, city.active)}
                          disabled={city.active === 0}
                          title={city.active === 0 ? "Cannot delete inactive" : "Delete city"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Layer */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 px-2">
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1 || loading} 
              className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-bold"
            >
              ← Prev
            </button>
            <span className="text-muted fw-medium bg-light px-4 py-2 rounded-pill shadow-sm border">
              Page <span className="text-dark fw-bolder">{currentPage}</span> of {totalPages}
            </span>
            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages || loading} 
              className="btn btn-outline-primary rounded-pill px-4 shadow-sm fw-bold"
            >
              Next →
            </button>
          </div>
        )}

      {/* Modals */}
      {isModalOpen && (
        <AddCityForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCities();
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}

      {isEditModalOpen && (
        <EditCityForm
          cityId={editCityId}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchCities();
          }}
          onCancel={() => {
            setIsEditModalOpen(false);
          }}
        />
      )}

      {isImportModalOpen && (
        <ImportCityForm
          stateMap={stateMap}
          onSuccess={() => {
            setIsImportModalOpen(false);
            fetchCities();
          }}
          onCancel={() => setIsImportModalOpen(false)}
        />
      )}

      </div>
      )}
    </div>
  );
}