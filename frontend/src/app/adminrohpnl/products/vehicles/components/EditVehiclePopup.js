'use client';
import { useEffect, useState } from 'react';
import styles from './editvehiclepopup.module.css';
import { getAuthToken } from '../../../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function EditVehiclePopup({ vehicleId, onClose, onUpdated }) {
  const token = getAuthToken();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vehicleId) fetchVehicle();
  }, [vehicleId]);

  async function fetchVehicle() {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/product/adminvehicleview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle_id: vehicleId })
      });

      const data = await res.json();

      if (data.success) {
        setForm(data.vehicle || {});
      }
      setLoading(false);

    } catch (err) {
      console.error("Fetch Vehicle Error:", err);
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function saveChanges() {
    setSaving(true);

    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/product/adminvehicleupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          ...form
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Vehicle Updated Successfully");
        onClose();
        onUpdated && onUpdated();
      } else {
        alert(data.message || "Update failed");
      }

    } catch (err) {
      console.error("Update Error:", err);
      alert("Error while updating");
    }

    setSaving(false);
  }

  if (!vehicleId) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>

        <div className={styles.header}>
          <h2>Edit Vehicle</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={saving}>×</button>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <div className={styles.rohadvh_content}>

            {/* BASIC DETAILS */}
            <div className={styles.rohadvh_section}>
              <h3 className={styles.rohadvh_sectionTitle}>Basic Details</h3>

              <div className={styles.rohadvh_grid2}>
                <div>
                  <label className={styles.rohadvh_label}>Name</label>
                  <input
                    className={styles.rohadvh_input}
                    name="item_name"
                    value={form.item_name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Description</label>
                  <textarea
                    className={styles.rohadvh_textarea}
                    name="vehicle_description"
                    value={form.vehicle_description || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className={styles.rohadvh_section}>
              <h3 className={styles.rohadvh_sectionTitle}>Pricing</h3>

              <div className={styles.rohadvh_grid3}>
                <div>
                  <label className={styles.rohadvh_label}>Price / Day</label>
                  <input
                    className={styles.rohadvh_input}
                    name="price_per_day"
                    value={form.price_per_day || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Price / Month</label>
                  <input
                    className={styles.rohadvh_input}
                    name="price_per_month"
                    value={form.price_per_month || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Security Deposit</label>
                  <input
                    className={styles.rohadvh_input}
                    name="security_deposit"
                    value={form.security_deposit || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Fleet size */}
                <div>
                  <label className={styles.rohadvh_label}>Fleet Size</label>
                  <input
                    className={styles.rohadvh_input}
                    name="fleet_size"
                    type='number'
                    value={form.fleet_size || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ATTRIBUTES */}
            <div className={styles.rohadvh_section}>
              <h3 className={styles.rohadvh_sectionTitle}>Vehicle Attributes</h3>

              <div className={styles.rohadvh_grid4}>

                <div>
                  <label className={styles.rohadvh_label}>Engine Type</label>
                  <select
                    className={styles.rohadvh_select}
                    name="engine_type"
                    value={form.engine_type || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Engine Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Transmission</label>
                  <select
                    className={styles.rohadvh_select}
                    name="transmission_type"
                    value={form.transmission_type || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Seats</label>
                  <input
                    className={styles.rohadvh_input}
                    name="seating_capacity"
                    value={form.seating_capacity || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Color</label>
                  <input
                    className={styles.rohadvh_input}
                    name="color"
                    value={form.color || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Fuel Consumption</label>
                  <input
                    className={styles.rohadvh_input}
                    name="fuel_consumption"
                    value={form.fuel_consumption || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Registration No.</label>
                  <input
                    className={styles.rohadvh_input}
                    name="registration_number"
                    value={form.registration_number || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Vehicle Type</label>
                  <select
                    className={styles.rohadvh_select}
                    name="vehicle_type"
                    value={form.vehicle_type || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Economy">Economy</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ADDRESS */}
            <div className={styles.rohadvh_section}>
              <h3 className={styles.rohadvh_sectionTitle}>Address</h3>

              <div className={styles.rohadvh_grid3}>
                <div>
                  <label className={styles.rohadvh_label}>Address</label>
                  <input
                    className={styles.rohadvh_input}
                    name="address_1"
                    value={form.address_1 || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Landmark</label>
                  <input
                    className={styles.rohadvh_input}
                    name="landmark"
                    value={form.landmark || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>City</label>
                  <input
                    className={styles.rohadvh_input}
                    name="city"
                    value={form.city || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>State</label>
                  <input
                    className={styles.rohadvh_input}
                    name="item_state"
                    value={form.item_state || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={styles.rohadvh_label}>Pincode</label>
                  <input
                    className={styles.rohadvh_input}
                    name="pincode"
                    value={form.pincode || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* BOOKING TERMS */}
            <div className={styles.rohadvh_section}>
              <h3 className={styles.rohadvh_sectionTitle}>Booking Terms</h3>
              <textarea
                className={styles.rohadvh_textareaLarge}
                name="booking_terms"
                value={form.booking_terms || ""}
                onChange={handleChange}
              />
            </div>

            {/* SAVE BUTTON */}
            <button
              className={styles.rohadvh_btnSave}
              onClick={saveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
