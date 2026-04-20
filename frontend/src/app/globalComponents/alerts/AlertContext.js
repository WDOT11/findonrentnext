"use client";

import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  // SUCCESS
  const showSuccess = (message, duration = 3000) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), duration);
  };

  // ERROR
  const showError = (message, duration = 3000) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), duration);
  };

  // CONFIRM
  const showConfirm = (message, onConfirm, onCancel) => {
    setConfirmData({ message, onConfirm, onCancel });
  };

  const hideConfirm = () => setConfirmData(null);

  return (
    <AlertContext.Provider
      value={{
        successMessage,
        errorMessage,
        showSuccess,
        showError,
        confirmData,
        showConfirm,
        hideConfirm
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);