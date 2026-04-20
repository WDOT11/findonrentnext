"use client";
import { useState, useEffect } from "react";
import styles from './css/brand.module.css';
import { getAuthToken } from "../../../utils/utilities";
import AddBrandForm from "./addBrandForm";
import BrandUpdateForm from "./updateBrandForm";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListBrandPage() {
  const token = getAuthToken();

  /** List data */
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  /** Filters (used for API call) */
  const [filters, setFilters] = useState({
    brand_name: "",
    category_id: "",
    status: ""
  });

  /** Search form (used for typing only) */
  const [searchForm, setSearchForm] = useState({
    brand_name: "",
    category_id: "",
    status: ""
  });

  /** Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);

  /** Modals */
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  /** Fetch Categories for Search Filter */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_ADMIN_BASE_URL}/category/getAllActiveWithChildren`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if ( res.ok && data.status === true && Array.isArray(data.data.mainCats) && data.data.mainCats.length > 0 && Array.isArray(data.data.mainCats[0].subcategories)) {
          setCategories(data.data.mainCats[0].subcategories);
        }
      } catch (err) {
        console.error("Error fetching category filter:", err);
      }
    };

    fetchCategories();
  }, []);

  /** Fetch brand list */
  const fetchBrands = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_ADMIN_BASE_URL}/brand/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page: currentPage,
          limit,
          ...filters,
        }),
      });

      const data = await res.json();

      if (data.rcode == 0) {
        window.location.href = "/auth/admin";
        return;
      }

      if (res.ok && data.status === true) {
        setBrands(data.data.brands || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalRecords(data.data.total || data.data.brands?.length || 0);
      } else {
        console.error("Failed to fetch brands:", data);
        setBrands([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Trigger fetch when filters or page changes */
  useEffect(() => {
    fetchBrands();
  }, [currentPage, filters]);

  /** --- Search Handling --- */
  const handleSearchFormChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...searchForm });
    setCurrentPage(1);
  };

  const handleReset = (e) => {
    e.preventDefault();

    const cleared = {
      brand_name: "",
      category_id: "",
      status: ""
    };

    setSearchForm(cleared);
    setFilters({});
    setCurrentPage(1);
  };

  /** Pagination */
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  /** Refresh list after add/update */
  const handleActionSuccess = () => {
    setShowAddModal(false);
    setShowForm(false);
    setEditingBrand(null);
    fetchBrands();
  };

  /** Delete brand */
  const handleDeleteBrand = async (brandId) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/brand/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: brandId }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        alert("🗑️ Brand deleted successfully!");
        fetchBrands();
      } else {
        alert(data.message || "Error deleting brand.");
      }
    } catch (err) {
      console.error("Error deleting brand:", err);
      alert("Something went wrong.");
    }
  };

  /** Edit brand */
  const handleEditBrand = async (id) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/brand/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (res.ok && data.status === true) {
        setEditingBrand(data.data);
        setShowForm(true);
      } else {
        alert(data.message || "Failed to fetch brand details.");
      }
    } catch (err) {
      console.error("Error fetching brand details:", err);
      alert("Something went wrong.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  return (
    <div className="container-fluid py-4">

      {/* CARD */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Brand Management</h3>
          <button onClick={() => setShowAddModal(true)} className="btn btn-light btn-sm font-weight-bold">
            Add New Brand
          </button>
        </div>

        <div className="card-body">

          {/* SEARCH BOX */}
          <div className="mb-4 p-3 border rounded">
            <h5 className="card-title text-primary">🔍 Search Brands</h5>

            <form className="row g-3" onSubmit={handleSearch}>

              {/* BRAND NAME */}
              <div className="col-md-4">
                <label className="form-label">Brand Name</label>
                <input type="text" className="form-control" name="brand_name" value={searchForm.brand_name} onChange={handleSearchFormChange}/>
              </div>

              {/* CATEGORY FILTER */}
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select className="form-select" name="category_id" value={searchForm.category_id} onChange={handleSearchFormChange}>
                  <option value="">All</option>
                  {categories.map(cat => (
                    <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                  ))}
                </select>
              </div>

              {/* STATUS FILTER */}
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={searchForm.status} onChange={handleSearchFormChange}>
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="col-12 mt-2">
                <button type="submit" className="btn btn-primary me-2">
                  Search
                </button>
                <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
                  Clear Search
                </button>
              </div>
            </form>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center p-4">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Brand Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {brands.length > 0 ? (
                    brands.map((brand, index) => (
                      <tr key={brand.id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{brand.brand_name}</td>
                        <td>{brand.category_name || "-"}</td>
                        <td>
                          <span className={`badge ${brand.active == 1 ? "bg-success" : "bg-danger"}`}>
                            {brand.active == 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleEditBrand(brand.id)} className="btn btn-warning btn-sm me-1">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteBrand(brand.id)} className="btn btn-danger btn-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No brands found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
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

      {/* ADD BRAND MODAL */}
      {showAddModal && (
        <div className={`${styles.modalOverlay} modal d-block`}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Create New Brand</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <AddBrandForm onSuccess={handleActionSuccess} onClose={() => setShowAddModal(false)}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BRAND MODAL */}
      {showForm && editingBrand && (
        <div className={`${styles.modalOverlay} modal d-block`}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">
                  Edit Brand: {editingBrand.brand_name}
                </h5>
                <button className="btn-close" onClick={closeForm}></button>
              </div>
              <div className="modal-body">
                <BrandUpdateForm brandData={editingBrand} onSuccess={handleActionSuccess} onClose={closeForm}/>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}