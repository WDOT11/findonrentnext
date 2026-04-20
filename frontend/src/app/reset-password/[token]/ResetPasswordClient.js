"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./resetpw.module.css";
import { LuArrowLeft } from "react-icons/lu";

const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL;

export default function ResetPasswordClient() {
  const router = useRouter();
  const { token } = useParams();

  const [isValid, setIsValid] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function validateToken() {
      const res = await fetch(`${AUTH_API_BASE_URL}/check-reset-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setIsValid(data.valid);
      setErr(data.message || null);
    }

    validateToken();
  }, [token]);

  if (isValid === null) {
    return <div className={styles.rohurp_wrapper}>Checking link...</div>;
  }

  if (isValid === false) {
    return (
      <div className={styles.rohurp_wrapper}>
        <h2 className={styles.rohurp_title}>Invalid or Expired Link</h2>
        <p className={styles.rohurp_error}>{err}</p>
      </div>
    );
  }

  return (
    <div className={styles.rohurp_wrapper}>
      <div className={styles.rohurp_card}>
        <h2 className={styles.rohurp_title}>Set new password</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            setMsg(null);

            if (newPassword !== confirmPassword) {
              setErr("Passwords do not match");
              return;
            }

            setLoading(true);

            const res = await fetch(`${AUTH_API_BASE_URL}/reset-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
              setErr(data.message || "Failed to reset password");
            } else {
              setMsg("Password reset successfully!");
              setTimeout(() => router.push("/login"), 2000);
            }

            setLoading(false);
          }}
          className={styles.rohurp_form}
        >
          <label className={styles.rohurp_label}>New Password</label>
          <input
            type="password"
            required
            className={styles.rohurp_input}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className={styles.rohurp_label}>Confirm Password</label>
          <input
            type="password"
            required
            className={styles.rohurp_input}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button disabled={loading} className={styles.rohurp_button}>
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>

        <a href="/login" className={styles.roh_back2login_btn}>
          <LuArrowLeft size={16} /> Back to log in
        </a>

        {msg && <p className={styles.rohurp_success}>{msg}</p>}
        {err && <p className={styles.rohurp_error}>{err}</p>}
      </div>
    </div>
  );
}
