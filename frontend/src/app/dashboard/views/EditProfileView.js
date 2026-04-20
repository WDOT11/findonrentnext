"use client";
import { useEffect, useState } from "react";
import styles from "../newdashboard.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

/* helpers */
const toStr = (v) => (v == null ? "" : String(v).trim());
const toDigits = (v, len) => toStr(v).replace(/\D/g, "").slice(0, len);

export default function EditProfileView() {
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address_1: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  /** New states for image */
  const [profileImage, setProfileImage] = useState(null); // existing image
  const [newProfileImage, setNewProfileImage] = useState(null); // preview new upload
  const [profileFile, setProfileFile] = useState(null); // actual file

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const authUser = getCookie("authUser");
    if (!authUser) return;
    const parsed = JSON.parse(authUser);
    if (parsed?.id) {
      setUserId(parsed.id);
      fetchUserDetails(parsed.id);
    }
  }, []);

  async function fetchUserDetails(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/userdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id }),
      });

      const data = await res.json();

      setFormData({
        first_name: toStr(data.first_name),
        last_name: toStr(data.last_name),
        email: toStr(data.email),
        phone_number: toDigits(data.phone_number, 10),
        address_1: toStr(data.address_1),
        landmark: toStr(data.landmark),
        city: toStr(data.city),
        state: toStr(data.state),
        pincode: toDigits(data.pincode, 6),
      });

      // set old image path from backend
      if (data.profile_file_path) {
        setProfileImage(WEB_BASE_URL + data.profile_file_path + data.profile_file_name);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /** file change handler */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setNewProfileImage(URL.createObjectURL(file)); // preview
    }
  };

  /** input handler */
  const handleChange = (e) => {
    let { id, value } = e.target;

    if (id === "phone_number") value = toDigits(value, 10);
    else if (id === "pincode") value = toDigits(value, 6);

    setFormData((s) => ({ ...s, [id]: value }));
    setErrors((s) => ({ ...s, [id]: "" }));
  };

  /** validation */
  function validate() {
    const newErrors = {};
    if (!toStr(formData.first_name))
      newErrors.first_name = "First name is required.";

    const phone = toDigits(formData.phone_number, 10);
    if (phone.length !== 10)
      newErrors.phone_number = "Phone must be exactly 10 digits.";

    const pin = toDigits(formData.pincode, 6);
    if (pin.length !== 6)
      newErrors.pincode = "Pincode must be exactly 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /** submit handler */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const fd = new FormData();

      fd.append("user_id", userId);

      // append form data
      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });

      // append image file if uploaded
      if (profileFile) {
        fd.append("profile_picture_file", profileFile);
      }

      const res = await fetch(`${API_BASE_URL}/edituserdetails`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Profile Updated Successfully");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.viewSection}>
      <h2 className={styles.pageTitle}>Edit Profile</h2>

      <div className={styles.card}>
        <form className={styles.editForm} onSubmit={handleSubmit}>

          {/* IMAGE UPLOAD SECTION */}
          <div className={styles.formGroup}>
            <label>Profile Image</label>

            {/* OLD image */}
            {profileImage && !newProfileImage && (
              <img
                src={profileImage}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
            )}

            {/* NEW preview */}
            {newProfileImage && (
              <img
                src={newProfileImage}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
            )}

            <input className={`${styles.roh_dashboard_addImage}`} type="file" accept="image/*" onChange={handleImageChange} style={{width: "130px", height: "130px", borderRadius: "100px", textAlign: "center", alignItems: "center", alignContent: "center", padding: "10px", backgroundColor: "#0000009e"}} />
          </div>

          {/* FIRST & LAST NAME */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && (
                <p className={styles.errorText}>{errors.first_name}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && (
                <p className={styles.errorText}>{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* EMAIL & PHONE */}
          <div className={`${styles.formRow} ${styles.formRow4Mob}`}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input id="email" value={formData.email} readOnly />
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <p className={styles.errorText}>{errors.phone_number}</p>
              )}
            </div>
          </div>

          {/* CITY & STATE */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>City</label>
              <input id="city" value={formData.city} onChange={handleChange} />
              {errors.city && <p className={styles.errorText}>{errors.city}</p>}
            </div>

            <div className={styles.formGroup}>
              <label>State</label>
              <input id="state" value={formData.state} onChange={handleChange} />
              {errors.state && (
                <p className={styles.errorText}>{errors.state}</p>
              )}
            </div>
          </div>

          {/* ADDRESS + LANDMARK + PINCODE */}
          <div className={`${styles.formRow} ${styles.formRow4Mob}`}>
            <div className={styles.formGroup}>
              <label>Address</label>
              <input
                id="address_1"
                value={formData.address_1}
                onChange={handleChange}
              />
              {errors.address_1 && (
                <p className={styles.errorText}>{errors.address_1}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Landmark</label>
              <input
                id="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Pincode</label>
              <input
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
              {errors.pincode && (
                <p className={styles.errorText}>{errors.pincode}</p>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className={styles.formActions}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Save Changes
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => history.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
