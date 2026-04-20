"use client";

import { useAlert } from "./AlertContext";
import styles from "./alert.module.css";

export default function AlertUI() {
  const { successMessage, errorMessage, confirmData, hideConfirm } = useAlert();

  return (
    <>
      {/* SUCCESS ALERT */}
      {successMessage && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBoxSuccess}>
            {successMessage}
          </div>
        </div>
      )}

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBoxError}>
            {errorMessage}
          </div>
        </div>
      )}

      {/* CONFIRM POPUP */}
      {confirmData && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p className={styles.confirmMessage}>{confirmData.message}</p>

            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmYes}
                onClick={() => {
                  confirmData.onConfirm && confirmData.onConfirm();
                  hideConfirm();
                }}
              >
                Yes
              </button>

              <button
                className={styles.confirmNo}
                onClick={() => {
                  confirmData.onCancel && confirmData.onCancel();
                  hideConfirm();
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
