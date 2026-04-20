"use client";
import { useEffect, useState } from "react";
import styles from "../newdashboard.module.css";
import { LuEye, LuHeart, LuClock, LuTrendingUp } from "react-icons/lu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function DashboardView() {
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
      console.error("User fetch failed", err);
    }
  }

  const fname = user?.first_name || "User";

  return (
    <div className={styles.viewSection}>

      {/* --- Smart Dynamic-Feel Header --- */}
      <div className={styles.headerSmart}>
        <h2>Welcome back, {fname} 👋</h2>

        <p className={styles.smartLine}>
          Your account activity looks good today.
          Everything is running smoothly.
        </p>

        <div className={styles.smartTags}>
          <span>Profile: Active</span>
          <span>Recent Activity: Stable</span>
          <span>Account Status: Verified</span>
        </div>
      </div>

      {/* --- Smart Insights (Looks Dynamic) --- */}
      <div className={styles.smartInsights}>
        <p>• Your visibility is improving this week.</p>
        <p>• People are engaging with your listings normally.</p>
        <p>• No pending actions are required right now.</p>
      </div>
    </div>
  );
}
