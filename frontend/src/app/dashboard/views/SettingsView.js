"use client";
import styles from "../newdashboard.module.css";

export default function SettingsView() {
  return (
    <div className={styles.viewSection}>
      <h2 className={styles.pageTitle}>Settings</h2>

      <div className={styles.card}>
        <p className={styles.textMuted}>
          Account settings and preferences will be available here.
        </p>

        <div className={styles.buttonGroup}>
          <button className={`${styles.btn} ${styles.btnOutline}`}>Notifications</button>
          <button className={`${styles.btn} ${styles.btnOutline}`}>Privacy</button>
          <button className={`${styles.btn} ${styles.btnOutline}`}>Security</button>
        </div>
      </div>
    </div>
  );
}
