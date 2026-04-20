import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditRouteForm({ route, routeGroup, onClose, onSuccess }) {

  const [formData, setFormData] = useState({
    route_name: "",
    access_type: "",
    route_type: "",
    group_name: "",
  });

  const [errorMessage, setErrorMessage] = useState('');
  
  /** Getting the token from the cookies */
  const token = getAuthToken();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (route) {
      setFormData({
        route_name: route.route_name || '',
        access_type: route.access_type || '',
        route_type: route.route_type || '',
        group_name: route.group_name || '',
      });
    }
  }, [route, routeGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRoute = {
      ...route,
      route_id: route.id,
      route_name: formData.route_name,
      access_type: formData.access_type,
      route_type: formData.route_type,
      group_name: formData.group_name,
    };

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/route/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRoute),
      });

      const data = await res.json();

      if (data.rcode === 0) {
        window.location.href = "/auth/admin";
      }

      if (!res.ok || data.status === false) {
        setErrorMessage(data.message || 'Failed to update route');
      } else {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
        alert('Route updated successfully');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  if (!route) return null;

  return (
    <>
      <h2 className="admin-cat-title">Update Route</h2>
      <form className={styles.admin_cat_form}>
        <div className={styles.admin_cat_group}>
          <label htmlFor="route_name">Route Name <span className={styles.admin_cat_required}>*</span></label>
          <input type="text" id="route_name" name="route_name" value={formData.route_name} onChange={handleChange} />
        </div>

        <div className={styles.admin_cat_group}>
          <label htmlFor="route_type">Route Type</label>
          <select id="route_type" name="route_type" value={formData.route_type} onChange={handleChange}>
            <option value="">Select route type</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
            <option value="3">Public</option>
          </select>
        </div>

        <div className={styles.admin_cat_group}>
          <label htmlFor="access_type">Access Type</label>
          <select id="access_type" name="access_type" value={formData.access_type} onChange={handleChange}>
            <option value="">Select access type</option>
            <option value="1">View</option>
            <option value="2">All</option>
          </select>
        </div>

        <div className={styles.admin_cat_group}>
          <label htmlFor="group_name">Route Group</label>
          <select id="group_name" name="group_name" value={formData.group_name} onChange={handleChange}>
            <option value="">Select Route Group</option>
            {routeGroup && routeGroup.map((group) => (
              <option key={group.id} value={group.id}>
                {group.groupName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.admin_cat_actions}>
          <button type="submit" className={`${styles['admin-cat-btn']} ${styles['admin-cat-btn-primary']}`} onClick={handleSubmit}> Update </button>
          <button type="button" className={`${styles['admin-cat-btn']} ${styles['admin-cat-btn-secondary']}`} onClick={onClose}> Cancel</button>
        </div>
      </form>
    </>
  );
}
