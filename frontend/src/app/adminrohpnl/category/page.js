'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './css/category.module.css';
import AddCategoryForm from './addCategoryForm';
import ViewCategory from './viewCategory';
import EditCategoryForm from './EditCategoryForm';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function ListCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10); // Increased limit for better page visibility
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const token = getAuthToken();

  const [filters, setFilters] = useState({
    category_name: '',
  });

  const [searchForm, setSearchForm] = useState({
    category_name: '',
  });

  // Helper function to refresh the list
  const refetchCategories = () => {
    setFilters(prev => ({ ...prev }));
    setCurrentPage(1);
  }

  useEffect(() => {
    const token = getAuthToken();
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_ADMIN_BASE_URL}/category/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            page: currentPage,
            limit,
            ...filters,
          }),
        });

        const data = await response.json();
        if(data.rcode === 0){
          router.push("/auth/admin");
          return;
        }

        setCategories(data.data.category || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalRecords(data.data.total || data.data.category?.length || 0);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, filters]);

  /** Fetch categories to attach brand under a category */
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/category/getParent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.rcode == 0) {
          window.location.href = "/auth/admin";
          return;
        }

        if (res.ok && data.status === true && Array.isArray(data.data.categories)) {
          setParentCategories(data.data.categories);
        } else {
          console.error("Failed to fetch categories:", data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [token]);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    refetchCategories();
  }

  const viewCategoryData = async (cat_id) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/category/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ id: cat_id }),
      });
      if (!res.ok) throw new Error('Failed to fetch category details');
      const data = await res.json();

      if(data.rcode == 0){
        router.push("/auth/admin");
        return;
      }
      const categoryData = data.data;
      setViewCategory(categoryData);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error('Error fetching category details:', err);
    }
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    refetchCategories(); // Refresh list after successful edit
  }

  const openEditCategoryModal = async (cat_id) => {
    const token = getAuthToken();

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/category/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ id: cat_id }),
      });
      if (!res.ok) throw new Error('Failed to fetch category details');
      const data = await res.json();

      if(data.rcode == 0){
        router.push("/auth/admin");
        return;
      }
      const categoryData = data.data;
      setEditCategory(categoryData);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching category details:', err);
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

  const handleSearchFormChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...searchForm });
    setCurrentPage(1);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setSearchForm({ category_name: '' });
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid py-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          Error loading categories: {error}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0"> Category Management</h3>
            <button onClick={openAddModal} className="btn btn-light btn-sm font-weight-bold">
              Add New Category
            </button>
          </div>

          <div className="card-body">

            {/* Search Form */}
            <div className="mb-4 p-3 border rounded">
              <h5 className="card-title text-primary">🔍 Search Categories</h5>

              <form className="row g-3" onSubmit={handleSearch}>

                {/* Category Name */}
                <div className="col-md-4">
                  <label htmlFor="category_name_search" className="form-label">Category Name</label>
                  <input type="text" className="form-control" id="category_name_search" name="category_name" placeholder="Enter category name" value={searchForm.category_name} onChange={handleSearchFormChange}/>
                </div>

                {/* Status Dropdown */}
                <div className="col-md-4">
                  <label htmlFor="status_search" className="form-label">Status</label>
                  <select className="form-select" id="status_search" name="status" value={searchForm.status} onChange={handleSearchFormChange}>
                    <option value="">All</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                {/* Parent Category Dropdown */}
                <div className="col-md-4">
                  <label htmlFor="parent_category_search" className="form-label">Parent Category</label>
                  <select className="form-select" id="parent_category_search" name="parent_category_id" value={searchForm.parent_category_id} onChange={handleSearchFormChange}>
                    <option value="">All</option>

                    {parentCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Buttons */}
                <div className="col-12 d-flex justify-content-start mt-2">
                  <button type="submit" className="btn btn-primary me-2">Search</button>
                  <button type="button" onClick={handleCancel} className="btn btn-outline-secondary">Clear Search</button>
                </div>

              </form>
            </div>

            {/* Category Table */}
            <div className="table-responsive">
              {categories.length > 0 ? (
                <table className="table table-hover table-striped align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Parent Category</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, index) => (
                      <tr key={cat.id}>
                        <th scope="row">{(currentPage - 1) * limit + index + 1}</th>

                        <td>
                          <img src={cat.image_url ? `${WEB_BASE_URL}${cat.image_url}` : "/default_category.png"} alt={cat.name} width={60} height={60} onError={(e) => { e.target.src = "/default_category.png"; }}/>
                        </td>
                        <td>{cat.name}</td>
                        <td>{cat.parent_category_name || <span className="text-muted">—</span>}</td>
                        <td>
                          <span className={`badge ${cat.active == 1 ? 'bg-success' : 'bg-danger'}`} >
                            {cat.active == 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <button onClick={() => viewCategoryData(cat.id)} className="btn btn-info btn-sm me-1" title="View Details">
                              View
                            </button>
                            <button onClick={() => openEditCategoryModal(cat.id)} className="btn btn-warning btn-sm me-1" title="Edit Category">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info text-center" role="alert">
                  No categories found. Try adjusting your search criteria.
                </div>
              )}
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button onClick={handlePrevPage} disabled={currentPage == 1} className="btn btn-outline-primary">
                Previous
              </button>

              <span className="text-muted">
                Page {currentPage} of {totalPages} ({totalRecords} total)
              </span>

              <button onClick={handleNextPage} disabled={currentPage == totalPages} className="btn btn-outline-primary">
                Next
              </button>
            </div>
          )}

          </div>
        </div>
      )}

      {/* Add New Category Modal - Using custom CSS for positioning/backdrop */}
      {isAddModalOpen && (
        <div className={`${styles.modalOverlay} modal d-block`} tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Create New Category</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeAddModal}></button>
              </div>
              <div className="modal-body">
                <AddCategoryForm onClose={closeAddModal} onSuccess={closeAddModal}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {/* Ensure ViewCategory component is also updated to use category.module.css */}
      {isViewModalOpen && (
        <ViewCategory category={viewCategory} onClose={closeViewModal} />
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className={`${styles.modalOverlay} modal d-block`} tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Edit Category: {editCategory?.name}</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <EditCategoryForm category={editCategory} onClose={closeEditModal} onSuccess={closeEditModal}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}