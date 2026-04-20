"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlobalPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("site_popup_closed="));

    if (!cookie) {
      setOpen(true);

      // ⭐ force page scroll top
      window.scrollTo(0, 0);

      // ⭐ freeze ALL scrolling (important)
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
  }, []);

  const closePopup = () => {
    const d = new Date();
    d.setTime(d.getTime() + 180 * 24 * 60 * 60 * 1000);

    document.cookie =
      "site_popup_closed=true; expires=" +
      d.toUTCString() +
      "; path=/";

    // ⭐ restore scroll
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";

    setOpen(false);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      onClick={closePopup}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          position: "relative",
          animation: "popupScale .25s ease",
        }}
      >
        <button
          onClick={closePopup}
          style={{
            position: "absolute",
            right: 12,
            top: 10,
            border: "none",
            background: "transparent",
            fontSize: 20,
            cursor: "pointer",
            color: "#888",
          }}
        >
          ✕
        </button>

        <h2 style={{ textAlign: "center", marginBottom: 6 }}>
          Welcome 👋
        </h2>

        <p style={{ textAlign: "center", color: "#666", fontSize: 14 }}>
          Please select how you want to continue
        </p>

        <div style={{ marginTop: 20 }}>
          <label
            style={{
              display: "flex",
              gap: 10,
              border: "1px solid #ddd",
              padding: 14,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            <input type="radio" name="choice" />
            <div>
              <div style={{ fontWeight: 600 }}>Rent Vehicle</div>
              <div style={{ fontSize: 12, color: "#777" }}>
                Find and book rental vehicles
              </div>
            </div>
          </label>

          <label
            style={{
              display: "flex",
              gap: 10,
              border: "1px solid #ddd",
              padding: 14,
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <input type="radio" name="choice" />
            <div>
              <div style={{ fontWeight: 600 }}>List Your Vehicle</div>
              <div style={{ fontSize: 12, color: "#777" }}>
                Earn by listing your vehicles
              </div>
            </div>
          </label>
        </div>

        <button
          onClick={closePopup}
          style={{
            marginTop: 22,
            width: "100%",
            background: "#000",
            color: "#fff",
            padding: 14,
            borderRadius: 12,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>

      <style>
        {`
          @keyframes popupScale {
            from {opacity:0; transform:scale(.92)}
            to {opacity:1; transform:scale(1)}
          }
        `}
      </style>
    </div>,
    document.body
  );
}