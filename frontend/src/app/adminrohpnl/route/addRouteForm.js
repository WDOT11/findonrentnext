'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { getAuthToken } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function AddRouteForm({routeGroup, onSuccess, onClose }) {

    /** Getting the token from the cookies */
    const token = getAuthToken();
    const initialFormState = {
        route_name: "",
        access_type: "",
        route_type: "",
        group_name: "",
    };
    const [form, setForm] = useState(initialFormState);

    /* Handle change */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            route_name: form.route_name,
            access_type: form.access_type,
            route_type: form.route_type,
            group_name: form.group_name,
            add_id: 1,
            edit_id: 1
        };
    
        try {
          const res = await fetch(`${API_ADMIN_BASE_URL}/route/create`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
    
          const data = await res.json();
    
          if (!res.ok || data.status === false) {
            return;
          }
    
          setForm(initialFormState);
          if (onSuccess) onSuccess();
          if (onClose) onClose();
          alert("Route created successfully.");
        } catch (err) {
          alert('Something went wrong.');
        }
      };

    return (
        <>
        <h2 className="admin-cat-title">Add New Route</h2>
        <form className={styles.admin_cat_form}>
            <div className={styles.admin_cat_group}>
                <label htmlFor="route_name">Route Name <span className={styles.admin_cat_required}>*</span></label>
                <input type="text" id="route_name" name="route_name" value={form.route_name} onChange={handleChange}/>
            </div>

            <div className={styles.admin_cat_group}>
                <label htmlFor="route_type">Route Type</label>
                <select id="route_type" name="route_type" value={form.route_type} onChange={handleChange}>
                    <option value="">Select route type</option>
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                    <option value="3">Public</option>
                </select>
            </div>

            <div className={styles.admin_cat_group}>
                <label htmlFor="access_type">Access Type</label>
                <select id="access_type" name="access_type" value={form.access_type} onChange={handleChange}>
                    <option value="">Select access type</option>
                    <option value="1">View</option>
                    <option value="2">All</option>
                </select>
            </div>

            <div className={styles.admin_cat_group}>
                <label htmlFor="group_name">Route Group</label>
                <select id="group_name" name="group_name" value={form.group_name} onChange={handleChange}>
                    <option value="">Select Route Group</option>
                    {routeGroup.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.groupName}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.admin_cat_actions}>
                <button type="submit" className={`${styles['admin-cat-btn']} ${styles['admin-cat-btn-primary']}`} onClick={handleSubmit}> Save </button>
                <button type="button" className={`${styles['admin-cat-btn']} ${styles['admin-cat-btn-secondary']}`} onClick={onClose}> Cancel</button>
            </div>
        </form>
        </>      
    );
}