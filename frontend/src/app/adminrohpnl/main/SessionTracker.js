'use client';

import { useEffect, useRef } from 'react';
import { getAuthToken } from "../../../utils/utilities";

export default function SessionTracker() {
  const lastRefreshTime = useRef(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      const now = Date.now();
      // Only refresh if 15 minutes (900000 ms) have passed since the last refresh
      if (now - lastRefreshTime.current > 900000) {
        lastRefreshTime.current = now;
        refreshToken();
      }
    };

    const refreshToken = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL}/refresh-admin-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (data.success && data.token) {
          // Update cookie with the new token extending by 3h
          document.cookie = `authToken=${data.token}; path=/`;
        }
      } catch (err) {
        // Silently handle refresh errors to avoid console pollution
      }
    };

    // Attach listeners to detect user activity
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('mousemove', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
    };
  }, []);

  return null;
}
