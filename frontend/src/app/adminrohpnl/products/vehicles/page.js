'use client';
import { useEffect, useState } from 'react';
import styles from './vehicleslist.module.css';
import { getAuthUser, getAuthToken } from '../../../../utils/utilities';
import ViewVehiclePopup from '../vehicles/components/ViewVehiclePopup'; // <-- ADD THIS IMPORT
import EditVehiclePopup from '../vehicles/components/EditVehiclePopup'; // <-- ADD THIS IMPORT

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function AllVehiclesAdminSideList() {
  const token = getAuthToken();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    keyword: "",
    service_provider_id: "",
    admin_item_status: "",
    item_status: "",
    sub_cat_id: ""
  });

  const [providers, setProviders] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [error, setError] = useState("");

  /* VIEW POPUP STATE */
  const [viewVehicleId, setViewVehicleId] = useState(null);

  /** EDIT POPUP STATE */
  const [editVehicleId, setEditVehicleId] = useState(null);



  /* Load filters */
  useEffect(() => {
    fetchSubCategories();
    fetchProviders();
  }, []);

  /* Load sub categories */
  async function fetchSubCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_category_id: 1 })
      });

      const data = await res.json();
      if (Array.isArray(data)) setSubCategories(data);
    } catch {}
  }

  /* Load all service providers */
  async function fetchProviders() {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/user/allserprovid`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.providers)) {
        setProviders(data.providers);
      }
    } catch {}
  }

  /* Load vehicle list */
  useEffect(() => {
    fetchVehiclesList();
  }, [page]);

  async function fetchVehiclesList() {
    try {
      setLoading(true);

      const res = await fetch(`${API_ADMIN_BASE_URL}/product/vehiclesadlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...filters, page, limit })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setProducts(data.products);
      setTotal(data.total);
      setLoading(false);

    } catch (err) {
      setLoading(false);
    }
  }

  /** vhicle admin approval/rejection */
  async function updateStatus(vehicleId, newStatus) {

    /** If user is unapproving → ask confirmation */
    if (newStatus === 0) {
      const ok = confirm("Are you sure you want to unapprove this vehicle?");
      if (!ok) return;
    }

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/product/adminvehiclestatusupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          status: newStatus
        })
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchVehiclesList();  // Refresh table
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    }
  }



  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function applyFilters(e) {
    e.preventDefault();
    setPage(1);
    fetchVehiclesList();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>All Vehicles</h2>

      {/* FILTER BAR */}
      <form className={styles.filterBox} onSubmit={applyFilters}>
        <div className={styles.filterRow}>

          <input
            className={styles.input}
            name="keyword"
            placeholder="Search item..."
            value={filters.keyword}
            onChange={handleFilterChange}
          />

          <select
            className={styles.select}
            name="service_provider_id"
            value={filters.service_provider_id}
            onChange={handleFilterChange}
          >
            <option value="">Service Provider</option>
            {providers.map(sp => (
              <option key={sp.user_id} value={sp.user_id}>
                {sp.first_name} {sp.last_name}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            name="admin_item_status"
            value={filters.admin_item_status}
            onChange={handleFilterChange}
          >
            <option value="">Admin Status</option>
            <option value="1">Approved</option>
            <option value="0">Unapprove</option>
          </select>

          <select
            className={styles.select}
            name="item_status"
            value={filters.item_status}
            onChange={handleFilterChange}
          >
            <option value="">Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>

          <select
            className={styles.select}
            name="sub_cat_id"
            value={filters.sub_cat_id}
            onChange={handleFilterChange}
          >
            <option value="">Sub Category</option>
            {subCategories.map(sc => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>

          <button type="submit" className={styles.btnPrimary}>
            Search
          </button>
        </div>
      </form>


      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Item Name</th>
              <th>Business</th>
              <th>Provider</th>
              {/* <th>Category</th> */}
              <th>Sub Cat</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Price/Day</th>
              <th>Status</th>
              <th>Admin</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  {/* <td>{p.id}</td> */}
                  <td>{p.item_name}</td>
                  <td><a href={`/rental-service-provider/${p.business_slug}`} target="_blank" rel="noopener">{p.business_name}</a></td>
                  <td>{p.sp_first_name} {p.sp_last_name}</td>
                  {/* <td>{p.category_name}</td> */}
                  <td>{p.sub_category_name}</td>
                  <td>{p.brand_name || "-"}</td>
                  <td>{p.model_name || "-"}</td>
                  <td>₹{p.price_per_day}</td>

                  <td className={p.item_status === 1 ? styles.green : styles.red}>
                    {p.item_status === 1 ? "Active" : "Inactive"}
                  </td>

                  <td className={
                    p.admin_item_status === 1 ? styles.green :
                    p.admin_item_status === 0 ? styles.red :
                    styles.orange
                  }>
                    {p.admin_item_status === 1 ? "Approved" : p.admin_item_status === 0 ? "Unapproved" : "Unapproved"}
                  </td>

                  <td className={styles.actionCol}>

                    {/* VIEW */}
                    <button
                      className={styles.btnView}
                      onClick={() => setViewVehicleId(p.id)}
                    >
                      View
                    </button>

                    {/* EDIT */}
                    <button
                      className={styles.btnEdit}
                      onClick={() => setEditVehicleId(p.id)}
                    >
                      Edit
                    </button>

                    {/* APPROVE / UNAPPROVE */}
                    <button
                      className={
                        p.admin_item_status === 1
                          ? styles.btnUnapprove  // Already approved → show Unapprove
                          : styles.btnApprove    // Pending/Rejected → show Approve
                      }
                      onClick={() => updateStatus(p.id, p.admin_item_status === 1 ? 0 : 1)}
                    >
                      {p.admin_item_status === 1 ? "Unapprove" : "Approve"}
                    </button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className={styles.noData}>No vehicles found</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className={styles.pageBtn}>
          Prev
        </button>

        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>

        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={styles.pageBtn}>
          Next
        </button>
      </div>


      {/* VIEW POPUP */}
      {viewVehicleId && (
        <ViewVehiclePopup
          vehicleId={viewVehicleId}
          onClose={() => setViewVehicleId(null)}
        />
      )}

      {/* EDIT POPUP */}
      {editVehicleId && (
        <EditVehiclePopup
          vehicleId={editVehicleId}
          onClose={() => setEditVehicleId(null)}
          onUpdated={() => fetchVehiclesList()} // list refresh
        />
      )}

    </div>
  );
}
