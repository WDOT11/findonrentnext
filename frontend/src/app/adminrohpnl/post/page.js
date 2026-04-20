'use client';
import { useState, useEffect } from 'react';
import styles from './post.module.css';
import AddPostForm from './AddPostForm';
import EditPostForm from './EditPostForm';
import ViewPost from './ViewPost';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function ListPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTitle, setSearchTitle] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [viewPostId, setViewPostId] = useState(null);
  const [editPostId, setEditPostId] = useState(null);

  /* ===========================
     FETCH POSTS
  =========================== */
  const fetchPosts = async (
    pageNo = 1,
    title = '',
    status = '',
    category = '',
    location = ''
  ) => {
    setLoading(true);
    try {
      const token = getAuthToken();

      const queryParams = new URLSearchParams({
        page: pageNo,
        limit: 10,
        title,
        status,
        category_slug: category,
        location_slug: location
      }).toString();

      const res = await fetch(
        `${API_ADMIN_BASE_URL}/post/list?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        setPosts(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     FETCH CATEGORY + LOCATION
  =========================== */
  useEffect(() => {
    const token = getAuthToken();

    const fetchCategories = async () => {
      const res = await fetch(
        `${API_ADMIN_BASE_URL}/category/admingetallactivecate`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.status && data.data?.categories) {
        setCategories(data.data.categories);
      }
    };

    const fetchLocations = async () => {
      const res = await fetch(
        `${API_ADMIN_BASE_URL}/city/admingetallactivecity`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.status && Array.isArray(data.data)) {
        setLocations(data.data);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  /* ===========================
     INITIAL LOAD + PAGINATION
  =========================== */
  useEffect(() => {
    fetchPosts(
      page,
      searchTitle,
      searchStatus,
      filterCategory,
      filterLocation
    );
  }, [page]);

  /* ===========================
     SEARCH
  =========================== */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(
      1,
      searchTitle,
      searchStatus,
      filterCategory,
      filterLocation
    );
  };

  /* ===========================
     LOADER
  =========================== */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <img src="/infinity-loading.gif" alt="Loading..." width={100} />
      </div>
    );
  }

  return (
    <section className="mt-4">

      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">All Posts</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          + Add New Post
        </button>
      </div>

      {/* ===== SEARCH & FILTERS ===== */}
      <form className="d-flex gap-2 mb-3 flex-wrap" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="form-control"
          style={{ maxWidth: '220px' }}
        />

        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="form-select"
          style={{ maxWidth: '160px' }}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-select"
          style={{ maxWidth: '180px' }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="form-select"
          style={{ maxWidth: '180px' }}
        >
          <option value="">All Locations</option>
          {locations.map((city, i) => (
            <option key={i} value={city.city_slug}>
              {city.city_name}
            </option>
          ))}
        </select>

        <button className="btn btn-dark">Search</button>
      </form>

      {/* ===== TABLE ===== */}
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <>
          <div className={`table-responsive ${styles.postTableWrap}`}>
            <table className="table table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Dynamic Slug</th>
                  <th>Publish</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id}>
                    <td>{index + 1 + (page - 1) * 10}</td>

                    <td>
                      {post.post_image_url ? (
                        <img
                          src={WEB_BASE_URL + post.post_image_url}
                          alt={post.post_title}
                          width={60}
                          height={50}
                          style={{ objectFit: 'cover', borderRadius: 5 }}
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td>{post.post_title}</td>
                    <td>{post.post_slug}</td>

                    <td>
                      <span className={`badge ${
                        post.post_status === 'published'
                          ? 'bg-success'
                          : post.post_status === 'draft'
                          ? 'bg-secondary'
                          : 'bg-warning'
                      }`}>
                        {post.post_status}
                      </span>
                    </td>

                    <td>{post.dynamic_slug || '-'}</td>

                    <td>
                      {new Date(post.add_date).toLocaleDateString('en-IN')}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setViewPostId(post.id)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setEditPostId(post.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== PAGINATION ===== */}
          <div className="d-flex justify-content-center mt-3 gap-2">
            <button
              className="btn btn-outline-dark btn-sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="fw-medium align-self-center">
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn-outline-dark btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* ===== GLOBAL MODALS (IMPORTANT FIX) ===== */}
      {showAddForm && (
        <AddPostForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => fetchPosts(page)}
        />
      )}

      {viewPostId && (
        <ViewPost
          postId={viewPostId}
          onClose={() => setViewPostId(null)}
        />
      )}

      {editPostId && (
        <EditPostForm
          postId={editPostId}
          onClose={() => setEditPostId(null)}
          onSuccess={() => fetchPosts(page)}
        />
      )}

    </section>
  );
}
