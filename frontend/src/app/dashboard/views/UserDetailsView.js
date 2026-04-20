"use client";
import { useEffect, useState } from "react";
import styles from "../newdashboard.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function UserDetailsView() {
  const [user, setUser] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const authUser = getCookie("authUser");
    if (!authUser) return;

    const parsed = JSON.parse(authUser);
    if (parsed?.id) fetchUserDetails(parsed.id);
  }, []);

  async function fetchUserDetails(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/userdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("User details error:", err);
    }
  }

  // FINAL IMAGE URL
  const profileImage =
    user?.profile_file_path && user?.profile_file_name
      ? WEB_BASE_URL + user.profile_file_path + user.profile_file_name
      : null;

  return (
    <div className={styles.viewSection}>
      <h2 className={styles.pageTitle}>User Details</h2>

      <div className={styles.card}>

        {/* PROFILE IMAGE */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ddd",
              }}
            />
          ) : (
            <div
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                background: "#FFF8F6",
                border: "3px solid #ddd",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#888",
                fontSize: "14px",
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* USER DETAILS */}
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Name:</span>
          <span className={styles.detailValue}>
            {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Email:</span>
          <span className={styles.detailValue}>
            {user ? user.email : "Loading..."}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Phone:</span>
          <span className={styles.detailValue}>
            {user ? user.phone_number || "-" : "Loading..."}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Address:</span>
          <span className={styles.detailValue}>
            {user ? user.address_1 || "-" : "Loading..."}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>City:</span>
          <span className={styles.detailValue}>
            {user ? user.city || "-" : "Loading..."}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>State:</span>
          <span className={styles.detailValue}>
            {user ? user.state || "-" : "Loading..."}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Pincode:</span>
          <span className={styles.detailValue}>
            {user ? user.pincode || "-" : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}
