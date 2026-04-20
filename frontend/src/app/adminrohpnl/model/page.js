"use client";
import { useState, useEffect } from "react";
import { getAuthToken } from "../../../utils/utilities";
import styles from "../admin.module.css";
import AddModelForm from "./addModel";
import UpdateModelForm from "./updateModel";
import ViewModel from "./ViewModel";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListModelPage() {
  const [models, setModels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [viewModel, setViewModel] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);

  const token = getAuthToken();
  const limit = 10;

  const [filters, setFilters] = useState({
    model_name: "",
    brand_id: "",
    tag_id: "",
    category_id: "",
    status: ""
  });

  const [searchForm, setSearchForm] = useState({
    model_name: "",
    brand_id: "",
    tag_id: "",
    category_id: "",
    status: ""
  });

  /** Fetch models list */
  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ADMIN_BASE_URL}/model/list`, {
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

      if (data.rcode === 0) {
        window.location.href = "/auth/admin";
        return;
      }

      if (res.ok && data.status === true) {
        setModels(data.data.models || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalRecords(data.data.total || data.data.models?.length || 0);
      } else {
        setModels([]);
        setTotalPages(1);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [currentPage, filters]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch(`${API_ADMIN_BASE_URL}/category/getAllActiveWithChildren`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const catData = await catRes.json();
        if ( catRes.ok && catData.status === true && Array.isArray(catData.data.mainCats) && catData.data.mainCats.length > 0 && Array.isArray(catData.data.mainCats[0].subcategories)) {
          setCategories(catData.data.mainCats[0].subcategories);
        }

        // Fetch tags dropdown
        const tagRes = await fetch(`${API_ADMIN_BASE_URL}/tag/dropdownAll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const tagData = await tagRes.json();
        if (tagRes.ok && tagData.status) {
          setTags(tagData.data.tags || []);
        }

        // Fetch brands dropdown
        const brandRes = await fetch(`${API_ADMIN_BASE_URL}/brand/dropdownAll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const brandData = await brandRes.json();
        if (brandRes.ok && brandData.status) {
          setBrands(brandData.data.brands || []);
        }

      } catch (err) {
        console.error("Filter dropdown fetch error:", err);
      }
    };

    fetchFiltersData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...searchForm });
    setCurrentPage(1);
  };

  const handleReset = (e) => {
    e.preventDefault();

    const cleared = {
      model_name: "",
      brand_id: "",
      tag_id: "",
      category_id: "",
      status: ""
    };

    setSearchForm(cleared);
    setFilters(cleared);
    setCurrentPage(1);
  };

  const closeViewModelModal = () => {
    setIsViewModalOpen(false);
    setViewModel(null);
  };

  /** Edit model (fetch details by ID) */
  const handleEditModel = async (id) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/model/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok && data.status === true) {
        setEditingModel(data.data);
        setShowEditModal(true);
      } else {
        alert(data.message || "Failed to fetch model details.");
      }
    } catch (err) {
      console.error("Error fetching model details:", err);
      alert("Something went wrong while fetching model details.");
    }
  };

  /** Close modals */
  const closeAddModal = () => setShowAddModal(false);
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingModel(null);
  };

  /** Refresh list after add or update */
  const handleActionSuccess = () => {
    closeAddModal();
    closeEditModal();
    fetchModels();
  };

  const handleSearchFormChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  const viewModelData = async (model_id) => {
    const token = getAuthToken();

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/model/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: model_id }),
      });

      const data = await res.json();

      if (data.rcode === 0) {
        router.push("/auth/admin");
        return;
      }

      if (data.status && data.data) {
        setViewModel(data.data);
        setIsViewModalOpen(true);
      } else {
        console.error("Failed to fetch model details:", data);
      }
    } catch (err) {
      console.error("Error fetching model details:", err);
    }
  };


  return (
    <div className="container-fluid py-4">

      {/* CARD */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Model Management</h3>
          <button onClick={() => setShowAddModal(true)} className="btn btn-light btn-sm font-weight-bold">
            Add New Model
          </button>
        </div>

        <div className="card-body">

          {/* SEARCH BOX */}
          <div className="mb-4 p-3 border rounded">
            <h5 className="card-title text-primary">Search Models</h5>

            <form className="row g-3" onSubmit={handleSearch}>

              {/* Model Name */}
              <div className="col-md-2">
                <label htmlFor="model_name" className="form-label">Model Name</label>
                <input type="text" className="form-control" id="model_name" name="model_name" placeholder="Enter model name" value={searchForm.model_name} onChange={handleSearchFormChange}/>
              </div>

              <div className="col-md-2">
                <label className="form-label">Brand</label>
                <select name="brand_id" value={searchForm.brand_id} onChange={handleSearchFormChange} className="form-select">
                  <option value="">All</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.brand_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Tag</label>
                <select name="tag_id" value={searchForm.tag_id} onChange={handleSearchFormChange} className="form-select">
                  <option value="">All</option>
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>{t.tag_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Category</label>
                <select name="category_id" value={searchForm.category_id} onChange={handleSearchFormChange} className="form-select">
                  <option value="">All</option>
                  {categories.map(cat => (
                    <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select name="status" value={searchForm.status} onChange={handleSearchFormChange} className="form-select">
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="col-md-6 d-flex align-items-end">
                <button type="submit" className="btn btn-primary me-2"> Search </button>
                <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
                  Clear Search
                </button>
              </div>
            </form>
          </div>

          {/* MODEL TABLE */}
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
                    <th>Model Name</th>
                    <th>Model Label</th>
                    <th>Model slug</th>
                    <th>Model old slug</th>
                    <th>Brand</th>
                    <th>Tag</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {models.length > 0 ? (
                    models.map((model, index) => (
                      <tr key={model.id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{model.model_name}</td>
                        <td>{model.model_label}</td>
                        <td>{model.model_slug}</td>
                        <td>{model.model_old_slug}</td>
                        <td>{model.brand_name || "-"}</td>
                        <td>{model.tag_name || "-"}</td>
                        <td>{model.category_name || "-"}</td>
                        <td>
                          <span className={`badge ${model.active == 1 ? "bg-success" : "bg-danger"}`}>
                            {model.active == 1 ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="text-center">
                          <button onClick={() => viewModelData(model.id)} className="btn btn-info btn-sm me-1" title="View Model"> View </button>
                          <button onClick={() => handleEditModel(model.id)} className="btn btn-warning btn-sm me-1"> Edit </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No models found.
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
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-outline-primary">
                Previous
              </button>

              <span className="text-muted">
                Page {currentPage} of {totalPages} ({totalRecords} total)
              </span>

              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-outline-primary">
                Next
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ADD MODEL MODAL */}
      {showAddModal && (
        <div className={`${styles.modalOverlay} modal d-block`} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Create New Model</h5>
                <button className="btn-close btn-close-white" onClick={closeAddModal}></button>
              </div>
              <div className="modal-body">
                <AddModelForm onClose={closeAddModal} onSuccess={handleActionSuccess} />
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <ViewModel model={viewModel} onClose={closeViewModelModal}/>
      )}


      {/* EDIT MODEL MODAL */}
      {showEditModal && editingModel && (
        <div className={`${styles.modalOverlay} modal d-block`} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Edit Model: {editingModel.model_name}</h5>
                <button className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <UpdateModelForm modelData={editingModel} onClose={closeEditModal} onSuccess={handleActionSuccess}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
