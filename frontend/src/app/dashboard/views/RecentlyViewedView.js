"use client";
import { useEffect, useState } from "react";
import styles from "../newdashboard.module.css";
import Viewproductspop from "../../products/components/Viewproductspop";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function RecentlyViewedView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Undo State
  const [lastRemoved, setLastRemoved] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // Popup State
  const [selectedId, setSelectedId] = useState(null);

  /* ---------- Shareable Deep Link Logic ---------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const rohKey = Array.from(searchParams.keys()).find(k => k.startsWith("roh_"));
      if (rohKey) {
        try {
          const decoded = atob(rohKey.replace("roh_", ""));
          const match = decoded.match(/^item-(\d+)$/);
          if (match && match[1]) setSelectedId(parseInt(match[1], 10));
        } catch (err) {}
      }
    }
  }, []);
  /* ----------------------------------------------- */

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const fetchRecentlyViewed = async () => {
    setLoading(true);

    let session_id = null;
    try {
      session_id = JSON.parse(localStorage.getItem("roh_session") || "{}")?.id;
    } catch {}

    let user_id = null;
    try {
      const raw = document.cookie.split("; ").find((row) => row.startsWith("authUser="));
      if (raw) {
        user_id = JSON.parse(decodeURIComponent(raw.split("=")[1]))?.id || null;
      }
    } catch {}

    const res = await fetch(`${API_BASE_URL}/getrecentlyvieweditems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, user_id }),
    });

    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  // Remove (Soft Clear)
  const handleRemove = async (item) => {
    // Ask confirmation before removing
    const confirmRemove = window.confirm(
      `Are you sure you want to remove "${item.item_name}" from your recently viewed list?`
    );
    if (!confirmRemove) return;

    setLastRemoved(item);
    setShowUndo(true);

    // Hide undo after 5 sec
    setTimeout(() => setShowUndo(false), 5000);

    let session_id = JSON.parse(localStorage.getItem("roh_session") || "{}")?.id;
    let user_id = JSON.parse(getCookie("authUser") || "{}")?.id;

    await fetch(`${API_BASE_URL}/removerecentlyviewed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: item.item_id, session_id, user_id }),
    });

    setItems((prev) => prev.filter((i) => i.item_id !== item.item_id));
  };

  // Undo
  const handleUndo = async () => {
    if (!lastRemoved) return;

    let session_id = JSON.parse(localStorage.getItem("roh_session") || "{}")?.id;
    let user_id = JSON.parse(getCookie("authUser") || "{}")?.id;

    await fetch(`${API_BASE_URL}/restoreviewitem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: lastRemoved.item_id, session_id, user_id }),
    });

    setShowUndo(false);

    // Reload list so sorting (by last_viewed_at) stays correct
    fetchRecentlyViewed();
  };

  return (
    <div className={styles.viewSection}>
      <h2 className={styles.pageTitle}>Recently Viewed</h2>

      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-muted">No recently viewed items found.</p>
      )}

      <div className={styles.itemsGrid}>
        {items.map((item) => {
          const imgUrl = item.image_url ? `${WEB_BASE_URL}${item.image_url}` : "/iteams-deafault-img.webp";
          return (
            <div key={item.item_id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div className={styles.imageWrapper}>
                  
                  <img
                    src={imgUrl}
                    alt={item.item_name} className={styles.itemThumb} loading="lazy"
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{item.item_name}</h3>
                  <p className={styles.itemPrice}>₹{item.price_per_day}/day</p>
                  <p className={styles.itemLocation}>{item.availability_status}</p>
                </div>
              </div>

              <div className={styles.itemActions}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => setSelectedId(item.item_id)}
                >
                  View
                </button>

                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => handleRemove(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Undo Snackbar */}
      {showUndo && (
        <div className={styles.undoToast}>
          Removed
          <button onClick={handleUndo} className={styles.undoBtn}>
            Undo
          </button>
        </div>
      )}

      {/* Viewproductspop Popup */}
      {selectedId && (
        <Viewproductspop
          triggerId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
