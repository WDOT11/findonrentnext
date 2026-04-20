"use client";

import { useState } from "react"; // 1. Import useState
import { LuBuilding2, LuMapPin, LuPackageCheck } from "react-icons/lu";
import styles from "./become.module.css";

export default function BusinessPreviewStep({ data, onBack, onConfirm }) {
  // 2. Add state to track submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    address = {},
    subCategoryDetails = [],
    itemsBySubCategory = {},
    firstName = "",
    lastName = "",
    phone = "",
    altPhone = "",
  } = data;

  const fullName = `${firstName} ${lastName}`.trim() || "-";

  // 3. Wrapper function to handle the click
  const handleSubmit = async () => {
    setIsSubmitting(true); // Disable the button immediately

    try {
      await onConfirm(); // Wait for parent logic (API call/Navigation)
    } catch (error) {
      // Optional: If submission fails, re-enable the button so they can try again
      console.error("Submission failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="roh_register_content">
      <main className="rohuserres_shell">
        <section className="rohuserres_card">
          <h1 className="rohuserres_title text-center mb-4">Review Your Details</h1>
          <p className="text-muted text-center mb-5">
            Please verify all the details before final submission.
          </p>

          {/* ---------------- BUSINESS DETAILS ---------------- */}
          <div className="roh_review_block mb-4">
            <div className="roh_review_header d-flex align-items-center gap-2 mb-3">
              <LuBuilding2 size={24} className="text-primary" />
              <h4 className="m-0">Business Details</h4>
            </div>
            <ul className="list-group list-group-flush border rounded p-2">
              <li className="list-group-item"><strong>Business Name:</strong> {data.businessName || "-"}</li>
              <li className="list-group-item"><strong>Contact Person:</strong> {fullName}</li>
              <li className="list-group-item"><strong>Phone:</strong> {phone || "-"}</li>
              <li className="list-group-item"><strong>Alternate Phone Number:</strong> {altPhone || "-"}</li>
              <li className="list-group-item"><strong>GST Number:</strong> {data.gstNumber || "N/A"}</li>
              <li className="list-group-item"><strong>Business Description:</strong> {data.businessDesc || "N/A"}</li>
            </ul>
          </div>

          {/* ---------------- ADDRESS ---------------- */}
          <div className="roh_review_block mb-4">
            <div className="roh_review_header d-flex align-items-center gap-2 mb-3">
              <LuMapPin size={24} className="text-primary" />
              <h4 className="m-0">Business Address</h4>
            </div>
            <ul className="list-group list-group-flush border rounded p-2">
              <li className="list-group-item"><strong>Address:</strong> {address.streetAddress || "-"}</li>
              <li className="list-group-item"><strong>City:</strong> {address.city_name || "-"}</li>
              <li className="list-group-item"><strong>State:</strong> {address.state_name || "-"}</li>
              <li className="list-group-item"><strong>Pincode:</strong> {address.pinCode || "-"}</li>
            </ul>
          </div>

          {/* ---------------- SERVICE DETAILS ---------------- */}
          <div className="roh_review_block mb-4">
            <div className="roh_review_header d-flex align-items-center gap-2 mb-3">
              <LuPackageCheck size={24} className="text-primary" />
              <h4 className="m-0">Service & Vehicle Details</h4>
            </div>

            {subCategoryDetails.length > 0 ? (
              <div className="roh_review_services">
                {subCategoryDetails.map((sub) => {
                  const items = itemsBySubCategory[sub.id] || [];

                  // 1. Convert name to lowercase for safe comparison
                  const subName = sub.name.toLowerCase();

                  // 2. Exact logic: Must include 'car' but NOT include 'driver'
                  const isSelfDriveCar = subName.includes("driver");
                  const isScooter = subName.includes("scooter");
                  const isAircraft = subName.includes("aircraft");

                  return (
                    <div key={sub.id} className="mb-4 border rounded p-3 bg-light">
                      <h5 className="text-dark border-bottom pb-2 mb-3">{sub.name}</h5>

                      {items.length > 0 ? (
                        <div className="row g-3">
                          {items.map((item, idx) => (
                            <div key={idx} className="col-md-6">
                              <div className="bg-white p-3 rounded border h-100 shadow-sm">
                                <h6 className="text-primary mb-2">Item #{idx + 1}</h6>
                                <ul className="list-unstyled mb-0" style={{ fontSize: "14px" }}>
                                  <li><strong>Brand:</strong> {item.brand_name || "-"}</li>
                                  <li><strong>Model:</strong> {item.model_name || "-"}</li>
                                  <li><strong>Name:</strong> {item.title || "-"}</li>
                                  {!isScooter && !isAircraft && (
                                    <li><strong>Transmission:</strong> {item.transmission || "-"}</li>
                                  )}
                                  {!isAircraft && (
                                    <li><strong>Engine:</strong> {item.engine || "-"}</li>
                                  )}
                                  {isSelfDriveCar && !isAircraft && (
                                    <li><strong>Rate Per KM:</strong> {item.ratePerKM ? `₹${item.ratePerKM}/km` : "-"}</li>
                                  )}
                                  <li><strong>Price:</strong> {item.pricePerDay ? `₹${item.pricePerDay}/day` : "-"}</li>
                                  {!isAircraft && (
                                    <li><strong>Deposit:</strong> {item.securityDeposit ? `₹${item.securityDeposit}` : "-"}</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small">No items added for this category.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted">No services selected.</p>
            )}
          </div>

          {/* ---------------- ACTIONS ---------------- */}
          <div className="d-flex justify-content-between mt-5 pt-3 border-top">
            {/* Disable Back button during submission to prevent navigation issues */}
            <button
              className="btn btn-light px-4"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Back to Edit
            </button>

            {/* 4. Updated Confirm Button */}
            <button
              className="btn btn-primary px-4"
              onClick={handleSubmit}
              disabled={isSubmitting} // Standard HTML attribute to disable clicks
              style={{ minWidth: "160px" }} // Optional: prevents width jump when text changes
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}