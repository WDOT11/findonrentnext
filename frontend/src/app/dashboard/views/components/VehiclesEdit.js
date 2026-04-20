"use client";
import { useState, useEffect } from "react";
import styles from "../../newdashboard.module.css";
import { LuX, LuCookingPot, LuUpload  } from "react-icons/lu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function VehiclesEdit({ isOpen, onClose, loading, item, onSave }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (item) {
      setForm({
        item_name: item.item_name || "",
        vehicle_description: item.vehicle_description || "",
        registration_number: item.registration_number || "",
        price_per_day: item.price_per_day || "",
        price_per_week: item.price_per_week || "",
        price_per_month: item.price_per_month || "",
        price_custom_day: item.price_custom_day || "",
        security_deposit: item.security_deposit || "",
        availability_status: item.availability_status || "",
        fleet_size: item.fleet_size || "",
        engine_type: item.engine_type || "",
        transmission_type: item.transmission_type || "",
        fuel_consumption: item.fuel_consumption || "",
        seating_capacity: item.seating_capacity || "5",
        color: item.color || "",
        mileage: item.mileage || "",
        address_1: item.address_1 || "",
        landmark: item.landmark || "",
        item_state: item.item_state || "",
        city: item.city || "",
        pincode: item.pincode || "",
        booking_instructions: item.booking_instructions || "",
        accessories: item.accessories || "",
      });

      setExistingImages(Array.isArray(item.media_gallery) ? item.media_gallery : []);
      setNewImages([]);
      setErrors({});
    }
  }, [item]);

  if (!isOpen) return null;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showError = (field) =>
    errors[field] ? <p className={styles.rohvhedit_error}>{errors[field]}</p> : null;

  const handleSubmit = async () => {
    if (!item?.id) {
      alert("Item ID missing!");
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("id", item.id);

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      formData.append(
        "existing_image_ids",
        JSON.stringify(existingImages.map((img) => img.id))
      );

      newImages.forEach((file) => {
        formData.append("image_ids", file);
      });

      const res = await fetch(`${API_BASE_URL}/updatesinglelisteditems`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok && data.errors) {
        setErrors(data.errors);
        return;
      }

      if (!res.ok) {
        alert(data.message || "Update failed!");
        return;
      }

      if (onSave) {
        onSave({
          ...item,
          ...form,
          media_gallery: existingImages,
        });
      }

      alert("Item updated successfully!");
      onClose();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.rohvhedit_overlay}>
      <div className={styles.rohvhedit_modalBox}>
        <button className={styles.rohvhedit_closeBtn} onClick={onClose}><LuX size={20} /></button>
        <h2 className={styles.rohvhedit_title}>Edit Vehicle</h2>

        {!loading ? (
          <>
            <div className={styles.rohvhedit_formGrid}>

              {/* ITEM NAME */}
              <div className={styles.rohvhedit_fullRow}>
                <label className={styles.rohvhedit_label}>Item Name</label>
                <input
                  className={styles.rohvhedit_input}
                  name="item_name"
                  value={form.item_name || ""}
                  onChange={onChange}
                />
                {showError("item_name")}
              </div>

              {/* DESCRIPTION */}
              <div className={styles.rohvhedit_fullRow}>
                <label className={styles.rohvhedit_label}>Description</label>
                <textarea
                  className={styles.rohvhedit_textarea}
                  name="vehicle_description"
                  value={form.vehicle_description || ""}
                  onChange={onChange}
                />
                {showError("vehicle_description")}
              </div>

              {/* REG NO */}
              <div>
                <label className={styles.rohvhedit_label}>Registration Number</label>
                <input
                  className={styles.rohvhedit_input}
                  name="registration_number"
                  value={form.registration_number || ""}
                  onChange={onChange}
                />
                {/* {showError("registration_number")} */}
              </div>

              {/* PRICING FIELDS */}
              <div>
                <label className={styles.rohvhedit_label}>Price Per Day</label>
                <input
                  type="number"
                  className={styles.rohvhedit_input}
                  name="price_per_day"
                  value={form.price_per_day || ""}
                  onChange={onChange}
                />
                {/* {showError("price_per_day")} */}
              </div>

              <div>
                <label className={styles.rohvhedit_label}>Price Per Week</label>
                <input
                  type="number"
                  className={styles.rohvhedit_input}
                  name="price_per_week"
                  value={form.price_per_week || ""}
                  onChange={onChange}
                />
                {/* {showError("price_per_week")} */}
              </div>

              <div>
                <label className={styles.rohvhedit_label}>Price Per Month</label>
                <input
                  type="number"
                  className={styles.rohvhedit_input}
                  name="price_per_month"
                  value={form.price_per_month || ""}
                  onChange={onChange}
                />
                {/* {showError("price_per_month")} */}
              </div>

              {/* SECURITY */}
              <div>
                <label className={styles.rohvhedit_label}>Security Deposit</label>
                <input
                  type="number"
                  className={styles.rohvhedit_input}
                  name="security_deposit"
                  value={form.security_deposit || ""}
                  onChange={onChange}
                />
                {/* {showError("security_deposit")} */}
              </div>

              {/* AVAILABILITY */}
              <div>
                <label className={styles.rohvhedit_label}>Availability</label>
                <select
                  className={styles.rohvhedit_select}
                  name="availability_status"
                  value={form.availability_status || ""}
                  onChange={onChange}
                >
                  <option value="">Select</option>
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
                {showError("availability_status")}
              </div>

              {/* ENGINE */}
              <div>
                <label className={styles.rohvhedit_label}>Engine Type</label>
                <select
                  className={styles.rohvhedit_select}
                  name="engine_type"
                  value={form.engine_type || ""}
                  onChange={onChange}
                >
                  <option value="">Select</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
                {showError("engine_type")}
              </div>

              {/* TRANSMISSION */}
              <div>
                <label className={styles.rohvhedit_label}>Transmission</label>
                <select
                  className={styles.rohvhedit_select}
                  name="transmission_type"
                  value={form.transmission_type || ""}
                  onChange={onChange}
                >
                  <option value="">Select</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                {showError("transmission_type")}
              </div>

              {/* FUEL */}
              <div>
                <label className={styles.rohvhedit_label}>Fuel Consumption (km/l)</label>
                <input
                  className={styles.rohvhedit_input}
                  name="fuel_consumption"
                  value={form.fuel_consumption || ""}
                  onChange={onChange}
                />
                {/* {showError("fuel_consumption")} */}
              </div>

              {/* FLEET */}
              <div>
                <label className={styles.rohvhedit_label}>Fleet Size</label>
                <input
                  className={styles.rohvhedit_input}
                  name="fleet_size"
                  value={form.fleet_size || ""}
                  onChange={onChange}
                />
                {showError("fleet_size")}
              </div>

              {/* SEATS */}
              <div>
                <label className={styles.rohvhedit_label}>Seating Capacity</label>
                <input
                  className={styles.rohvhedit_input}
                  name="seating_capacity"
                  value={form.seating_capacity || "5"}
                  onChange={onChange}
                />
                {/* {showError("seating_capacity")} */}
              </div>

              {/* COLOR */}
              <div>
                <label className={styles.rohvhedit_label}>Color</label>
                <input
                  className={styles.rohvhedit_input}
                  name="color"
                  value={form.color || ""}
                  onChange={onChange}
                />
                {/* {showError("color")} */}
              </div>

              {/* MILEAGE */}
              <div>
                <label className={styles.rohvhedit_label}>Mileage (km/l)</label>
                <input
                  className={styles.rohvhedit_input}
                  name="mileage"
                  value={form.mileage || ""}
                  onChange={onChange}
                />
                {/* {showError("mileage")} */}
              </div>

              {/* ADDRESS */}
              <div>
                <label className={styles.rohvhedit_label}>Address</label>
                <input
                  className={styles.rohvhedit_input}
                  name="address_1"
                  value={form.address_1 || ""}
                  onChange={onChange}
                />
                {showError("address_1")}
              </div>

              <div>
                <label className={styles.rohvhedit_label}>Landmark</label>
                <input
                  className={styles.rohvhedit_input}
                  name="landmark"
                  value={form.landmark || ""}
                  onChange={onChange}
                />
                {/* {showError("landmark")} */}
              </div>

              <div>
                <label className={styles.rohvhedit_label}>State</label>
                <input
                  className={styles.rohvhedit_input}
                  name="item_state"
                  value={form.item_state || ""}
                  onChange={onChange}
                />
                {showError("item_state")}
              </div>

              <div>
                <label className={styles.rohvhedit_label}>City</label>
                <input
                  className={styles.rohvhedit_input}
                  name="city"
                  value={form.city || ""}
                  onChange={onChange}
                />
                {showError("city")}
              </div>

              <div>
                <label className={styles.rohvhedit_label}>Pincode</label>
                <input
                  className={styles.rohvhedit_input}
                  name="pincode"
                  value={form.pincode || ""}
                  onChange={onChange}
                />
                {showError("pincode")}
              </div>

              {/* BOOKING INSTRUCTIONS */}
              <div className={styles.rohvhedit_fullRow}>
                <label className={styles.rohvhedit_label}>Booking Instructions</label>
                <textarea
                  className={styles.rohvhedit_textarea}
                  name="booking_instructions"
                  value={form.booking_instructions || ""}
                  onChange={onChange}
                />
                {/* {showError("booking_instructions")} */}
              </div>

              {/* ACCESSORIES */}
              <div className={styles.rohvhedit_fullRow}>
                <label className={styles.rohvhedit_label}>Accessories</label>
                <textarea
                  className={styles.rohvhedit_textarea}
                  name="accessories"
                  value={form.accessories || ""}
                  onChange={onChange}
                />
                {showError("accessories")}
              </div>

              {/* =======================
                    IMAGES SECTION
              ======================== */}

              <div className={styles.rohvhedit_fullRow}>
                <label className={styles.rohvhedit_label}>Images</label>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className={styles.rohvhedit_imagesWrap}>
                    {existingImages.map((img) => (
                      <div key={img.id} className={styles.rohvhedit_imageItem}>
                        <img
                          src={`${WEB_BASE_URL}${img.file_path}${img.file_name}`}
                          alt={img.file_name}
                          className={styles.rohvhedit_imageThumb}
                        />
                        <button
                          type="button"
                          className={styles.rohvhedit_imageRemove}
                          onClick={() => removeExistingImage(img.id)}
                        >
                          <LuCookingPot size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New images */}
                {newImages.length > 0 && (
                  <div className={styles.rohvhedit_imagesWrap}>
                    {newImages.map((file, index) => (
                      <div key={index} className={styles.rohvhedit_imageItem}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className={styles.rohvhedit_imageThumb}
                        />
                        <button
                          type="button"
                          className={styles.rohvhedit_imageRemove}
                          onClick={() => removeNewImage(index)}
                        >
                          <LuCookingPot size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload input */}
                <div className={styles.roh_additems_uploadImage}>
                  <label htmlFor="image-upload" className={`w-100 ${styles.cursor_pointer}`}>
                            <LuUpload size={32} stroke="#ff3600" className="mb-2" />
                            <p className="mb-1">Click to upload or drag and drop</p>
                            <p className="text-muted small">Supported: JPG, PNG</p>
                        </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  name="image_ids"
                  accept="image/*"
                  onChange={onImagesChange}
                  className={`${styles.rohvhedit_fileInput} d-none`}
                  />
                  </div>
                {showError("image_ids")}
              </div>
            </div>

            <div className={styles.rohvhedit_footer}>
              <button className={styles.rohvhedit_cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button
                className={styles.rohvhedit_saveBtn}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </div>
  );
}
