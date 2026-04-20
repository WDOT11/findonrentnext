"use client";
import { useState } from "react";
import styles from "./forgotpw.module.css";
import { LuArrowLeft } from "react-icons/lu";

const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL;

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${AUTH_API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccessMsg("A password reset link has been sent to your email.");
    } catch {
      setErrorMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.rohfp_container}>
      <div className={styles.rohfp_card}>
        <h2 className={styles.rohfp_title}>Forgot Password?</h2>
        <p className={styles.rohfp_subtitle}>
          No worries, we'll send you reset instructions to your email.
        </p>

        <form onSubmit={handleSubmit} className={styles.rohfp_form}>
          <label className={styles.rohfp_label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className={styles.rohfp_input}
          />

          <button
            type="submit"
            className={styles.rohfp_button}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <a className={styles.roh_back2login_btn} href="/login">
          <LuArrowLeft size={16} /> Back to log in
        </a>

        {errorMsg && <p className={styles.rohfp_error}>{errorMsg}</p>}
        {successMsg && <p className={styles.rohfp_success}>{successMsg}</p>}
      </div>
    </div>
  );
}
