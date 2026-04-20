"use client";
import { useEffect, useState } from "react";
import styles from "../newdashboard.module.css";
import VehiclesView from "./components/VehiclesView";
import VehiclesEdit from "./components/VehiclesEdit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

/* ---------------- Cookie Utils ---------------- */
const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  } catch {
    return null;
  }
};

/* --------------- ImageSlider --------------- */
const ImageSlider = ({ images = [] }) => {
  const validImages = Array.isArray(images) ? images : [];
  const [current, setCurrent] = useState(0);

  const nextImage = () => setCurrent((p) => (p + 1) % validImages.length);
  const prevImage = () => setCurrent((p) => (p === 0 ? validImages.length - 1 : p - 1));
  const img = validImages[current] || {};
  const hasValidImage = img.file_path && img.file_name;
  const src = hasValidImage ? `${WEB_BASE_URL}${img.file_path}${img.file_name}` : "/iteams-deafault-img.webp";

  return (
    <div className={styles.sliderWrapper}>
      <img src={src} alt={img.file_name || "image"} className={styles.sliderImage} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/iteams-deafault-img.webp";
        }}/>

      {validImages.length > 1 && (
        <div className={styles.sliderControls}>
          <button onClick={prevImage} aria-label="Previous"> &lt; </button>
          <button onClick={nextImage} aria-label="Next"> &gt; </button>
        </div>
      )}
    </div>
  );
};


/* --------------- Main Component --------------- */
export default function Hostingitemslist() {
  const [items, setItems] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  const [detailLoading, setDetailLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** EDIT STATES */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  /* Lock scroll when modal open */
  useEffect(() => {
    if (!isModalOpen && !isEditOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [isModalOpen, isEditOpen]);

  /* Fetch All Items */
  useEffect(() => {
    const authUser = getCookie("authUser");
    const parsed = authUser ? JSON.parse(authUser) : null;

    if (parsed?.id) {
      setPageLoading(true);

      fetch(`${API_BASE_URL}/getalllisteditems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_provider_id: parsed.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          const normalized = list.map((it) => {
            let gallery = it.media_gallery;
            if (typeof gallery === "string") {
              try {
                gallery = JSON.parse(gallery);
              } catch {
                gallery = [];
              }
            }
            return {
              ...it,
              media_gallery: Array.isArray(gallery) ? gallery : [],
            };
          });

          setItems(normalized);
        })
        .finally(() => setPageLoading(false));
    }
  }, []);

  /* ==========================
        VIEW ITEM DETAILS
  ========================== */
  const handleViewClick = async (itemId) => {
    setSelectedItem(null);
    setIsModalOpen(true);
    setDetailLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/getallsinglelisteditems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
      });

      const data = await res.json();

      let gallery = data.media_gallery;
      if (typeof gallery === "string") {
        try {
          gallery = JSON.parse(gallery);
        } catch {
          gallery = [];
        }
      }

      setSelectedItem({
        ...data,
        media_gallery: Array.isArray(gallery) ? gallery : [],
      });
    } finally {
      setDetailLoading(false);
    }
  };

  /* ==========================
        EDIT ITEM DETAILS
  ========================== */
  const handleEditClick = async (itemId) => {
    setEditItem(null);
    setIsEditOpen(true);
    setDetailLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/getallsinglelisteditems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
      });

      const data = await res.json();

      let gallery = data.media_gallery;
      if (typeof gallery === "string") {
        try {
          gallery = JSON.parse(gallery);
        } catch {
          gallery = [];
        }
      }

      setEditItem({
        ...data,
        media_gallery: Array.isArray(gallery) ? gallery : [],
      });

    } catch (e) {
      console.error("Edit load error:", e);
    } finally {
      setDetailLoading(false);
    }
  };

  /* DELETE ITEM */
  const handleDeleteClick = async (itemId) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    try {
      setBusyId(itemId);

      const res = await fetch(`${API_BASE_URL}/deletesinglelisteditems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, action: "delete" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to delete the item.");
        return;
      }

      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, item_status: 0 } : it
        )
      );
    } finally {
      setBusyId(null);
    }
  };

  /* RE-ACTIVATE ITEM */
  const handleReactivateClick = async (itemId) => {
    try {
      setBusyId(itemId);

      const res = await fetch(`${API_BASE_URL}/deletesinglelisteditems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, action: "reactivate" }),
      });

      await res.json();

      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId ? { ...it, item_status: 1 } : it
        )
      );
    } finally {
      setBusyId(null);
    }
  };

  /* Close modal */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  /* Close Edit modal */
  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditItem(null);
  };

  /* ---------------- render ---------------- */
  return (
    <>
      <div className={styles.viewSection}>
        <h2 className={styles.pageTitle}>Listing Details</h2>

        <div className={styles.rohhostinglist_container}>
          {pageLoading ? (
            <p>Loading...</p>
          ) : items.length > 0 ? (
            items.map((item) => {
              const itemStatus = Number(item.item_status ?? 0);
              const adminStatus = Number(item.admin_item_status ?? 0);

              const isInactive = itemStatus === 0;
              const isAdminApproved = adminStatus === 1;

              return (
                <div key={item.id} className={styles.rohhostinglist_card}>
                  <div>
                    <div className={styles.rohhostinglist_image}>
                      <ImageSlider images={item.media_gallery} />
                    </div>

                    <h3 className={styles.rohhostinglist_title}>
                      {item.item_name}
                    </h3>

                    <p className={styles.rohhostinglist_category}>
                      <strong>Category: </strong> {item.name}
                    </p>

                    <p className={styles.rohhostinglist_reg}>
                      <strong>Reg. No: </strong>
                      {item.registration_number || "N/A"}
                    </p>

                    {/* Status badges */}
                    <div className={styles.rohhostinglist_badges}>
                      {isInactive && (
                        <p className={styles.badgeMuted}>
                          <strong>Status:</strong>{" "}
                          <span className="text-danger">Inactive</span>
                        </p>
                      )}

                      {!isAdminApproved && (
                        <span className={styles.badgeWarn}>
                          Awaiting Admin Approval
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className={styles.rohhostinglist_actions}>
                    <button
                      className={styles.rohhostinglist_view}
                      onClick={() => handleViewClick(item.id)}
                    >
                      View
                    </button>

                    <button
                      className={styles.rohhostinglist_edit}
                      onClick={() => handleEditClick(item.id)}
                    >
                      Edit
                    </button>

                    {adminStatus === 0 ? (
                      <span className={styles.badgeWarn}></span>
                    ) : itemStatus === 1 ? (
                      <button
                        className={styles.rohhostinglist_delete}
                        onClick={() => handleDeleteClick(item.id)}
                        disabled={busyId === item.id}
                      >
                        {busyId === item.id ? "Processing..." : "Delete"}
                      </button>
                    ) : (
                      <button
                        className={styles.rohhostinglist_reactivate}
                        onClick={() => handleReactivateClick(item.id)}
                        disabled={busyId === item.id}
                      >
                        {busyId === item.id ? "Processing..." : "Re-Activate"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No items found.</p>
          )}
        </div>

        {/* VIEW MODAL */}
        <VehiclesView
          isOpen={isModalOpen}
          onClose={closeModal}
          loading={detailLoading}
          item={selectedItem}
        />

        {/* EDIT MODAL */}
        <VehiclesEdit
          isOpen={isEditOpen}
          onClose={closeEditModal}
          loading={detailLoading}
          item={editItem}
          onSave={(updatedData) => {
            setItems((prev) =>
              prev.map((it) =>
                it.id === editItem?.id ? { ...it, ...updatedData } : it
              )
            );
          }}
        />
      </div>
    </>
  );
}
