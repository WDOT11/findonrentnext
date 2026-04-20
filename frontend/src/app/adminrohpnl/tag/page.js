"use client";
import { useState, useEffect } from "react";
import { getAuthToken } from "../../../utils/utilities";
import styles from '../brand/css/brand.module.css';
import AddTagForm from "./addTagForm";
import TagUpdateForm from "./updateTagForm";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function ListTagPage() {
  const token = getAuthToken();

  const [tags, setTags] = useState([]);

  /** Filters used for API */
  const [filters, setFilters] = useState({
    tag_name: "",
    category_id: "",
    status: "",
  });

  const [searchForm, setSearchForm] = useState({
    tag_name: "",
    category_id: "",
    status: "",
  });

  /** Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(false);

  /** Modals */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [categories, setCategories] = useState([]);

  /** Fetch tag list */
  const fetchTags = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_ADMIN_BASE_URL}/tag/list`, {
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
        setTags(data.data.tags || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalRecords(data.data.total || data.data.tags?.length || 0);
      } else {
        setTags([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch whenever page or filter changes */
  useEffect(() => {
    fetchTags();
  }, [currentPage, filters]);

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

  /** Search Handlers */
  const handleSearchFormChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...searchForm });
    setCurrentPage(1);
  };

  const handleReset = (e) => {
    e.preventDefault();

    const cleared = {
      tag_name: "",
      category_id: "",
      status: "",
    };

    setSearchForm(cleared);
    setFilters({});
    setCurrentPage(1);
  };


  /** Pagination Controls */
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  /** After add/update refresh list */
  const handleActionSuccess = () => {
    setShowAddModal(false);
    setShowForm(false);
    setEditingTag(null);
    fetchTags();
  };

  /** Edit Tag */
  const handleEditTag = async (id) => {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/tag/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok && data.status === true) {
        setEditingTag(data.data);
        setShowForm(true);
      } else {
        alert(data.message || "Failed to fetch tag details.");
      }
    } catch (err) {
      console.error("Error fetching tag details:", err);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTag(null);
  };

  /** Delete Tag */
  const handleDeleteTag = async (id) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/tag/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        alert("🗑️ Tag deleted successfully!");
        fetchTags();
      } else {
        alert(data.message || "Error deleting tag.");
      }
    } catch (err) {
      console.error("Delete tag error:", err);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* CARD */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Tag Management</h3>
          <button onClick={() => setShowAddModal(true)} className="btn btn-light btn-sm font-weight-bold">
            Add New Tag
          </button>
        </div>

        <div className="card-body">

          {/* SEARCH BOX */}
          <div className="mb-4 p-3 border rounded">
            <h5 className="card-title text-primary">🔍 Search Tags</h5>

            <form className="row g-3" onSubmit={handleSearch}>

              {/* TAG NAME */}
              <div className="col-md-4">
                <label className="form-label">Tag Name</label>
                <input type="text" name="tag_name" value={searchForm.tag_name} onChange={handleSearchFormChange} className="form-control" placeholder="Enter tag name"/>
              </div>

              {/* CATEGORY FILTER */}
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select name="category_id" value={searchForm.category_id} onChange={handleSearchFormChange} className="form-select">
                  <option value="">All</option>
                  {categories.map(cat => (
                    <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                  ))}
                </select>
              </div>

              {/* STATUS FILTER */}
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select name="status" value={searchForm.status} onChange={handleSearchFormChange} className="form-select">
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="col-12 d-flex justify-content-start mt-2">
                <button type="submit" className="btn btn-primary me-2">Search</button>
                <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
                  Clear Search
                </button>
              </div>
            </form>
          </div>


          {/* TAG TABLE */}
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
                    <th>Tag Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <tr key={tag.id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{tag.tag_name}</td>
                        <td>{tag.category_name || "-"}</td>
                        <td>
                          <span className={`badge ${tag.active == 1 ? "bg-success" : "bg-danger"}`}>
                            {tag.active == 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleEditTag(tag.id)} className="btn btn-warning btn-sm me-1">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTag(tag.id)} className="btn btn-danger btn-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No tags found.</td>
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

              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn btn-outline-primary" >
                Next
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ADD TAG MODAL */}
      {showAddModal && (
        <div className={`${styles.modalOverlay} modal d-block`}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Create New Tag</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <AddTagForm onSuccess={handleActionSuccess} onClose={() => setShowAddModal(false)}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TAG MODAL */}
      {showForm && editingTag && (
        <div className={`${styles.modalOverlay} modal d-block`}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Edit Tag: {editingTag.tag_name}</h5>
                <button className="btn-close" onClick={closeForm}></button>
              </div>
              <div className="modal-body">
                <TagUpdateForm tagData={editingTag} onSuccess={handleActionSuccess} onClose={closeForm}/>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}