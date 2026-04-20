"use client";

import { useAlert } from "../globalComponents/alerts/AlertContext";

export default function TestAlerts() {
  const { showSuccess, showError, showConfirm } = useAlert();

  // Logout Confirmation
  const handleLogout = () => {
    showConfirm(
      "Are you sure you want to logout?",
      () => {
        showSuccess("Logged out successfully!");
      }
    );
  };

  // Delete Confirmation
  const handleDeleteItem = () => {
    showConfirm(
      "Delete this item permanently?",
      () => {
        showSuccess("Item deleted successfully!");
      }
    );
  };

  return (
    <div style={{ padding: "200px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* SUCCESS BUTTON */}
      <button style={{ padding: "12px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px" }} onClick={() => showSuccess("This is a success message!")}>
        Show Success Alert
      </button>

      {/* ERROR BUTTON */}
      <button style={{ padding: "12px 20px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px" }} onClick={() => showError("This is an error message!")}>
        Show Error Alert
      </button>

      {/* LOGOUT CONFIRMATION */}
      <button style={{ padding: "12px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px" }} onClick={handleLogout}>
        Ask Logout Confirmation
      </button>

      {/* DELETE CONFIRMATION */}
      <button style={{ padding: "12px 20px", background: "#d97706", color: "white", border: "none", borderRadius: "6px" }} onClick={handleDeleteItem}>
        Ask Delete Confirmation
      </button>
    </div>
  );
}
