"use client";
import { useEffect } from "react";

export default function ScrollToFleet() {
  useEffect(() => {
    const el = document.getElementById("fleet-heading");

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); /** Delay in milliseconds */
    }
  }, []);

  return null;
}