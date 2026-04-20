"use client";

import { useState, Suspense } from "react";

import AgentRegisterVendorClient from "./AgentRegisterVendorClient";
import BusinessDetailsStep from "./VendorBusinessDetailsClient";
import BusinessPreviewStep from "./PreviewVendorDetails";

export default function AgentRegisterVendors() {
  const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    /* ---------- USER ---------- */
    firstName: "",
    lastName: "",
    phone: "",
    altPhone: "",
    password: "",
    email: "",
    referralCode: "",

    /* ---------- BUSINESS ---------- */
    businessName: "",
    gstNumber: "",

    /* ---------- ADDRESS ---------- */
    address: {
      streetAddress: "",
      landmark: "",
      state_id: "",
      state_name: "",
      state_slug: "",
      city_id: "",
      state_name: "",
      city_slug: "",
      pinCode: "",
    },

    /* ---------- CATEGORY SELECTION ---------- */
    categories: [],
    subCategoryDetails: [],

    /* ---------- ITEM DATA ---------- */
    itemsBySubCategory: {},
  });

  /* ---------- INSIDE AgentRegisterVendors.js ---------- */
  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      /* ---------------- 1. VALIDATION ---------------- */
      let validationError = null;

      // We will use this array to store validated items before adding them to FormData
      const validatedItems = [];

      for (const sub of formData.subCategoryDetails) {
        const subCatItems = formData.itemsBySubCategory[sub.id] || [];

        if (subCatItems.length === 0) {
          validationError = `Please add at least one item for ${sub.name}.`;
          break;
        }

        for (let i = 0; i < subCatItems.length; i++) {
          const item = subCatItems[i];
          const itemName = `${sub.name} #${i + 1}`;

          if (!item.brand_id) {
            validationError = `Brand is missing for ${itemName}.`;
            break;
          }
          if (!item.model_id) {
            validationError = `Model is missing for ${itemName}.`;
            break;
          }
          if (!item.title || !item.title.trim()) {
            validationError = `Car Name (Title) is missing for ${itemName}.`;
            break;
          }

          // Push to temporary array to ensure we only process valid items
          validatedItems.push({
            ...item,
            sub_category_id: sub.id, // Track which category this belongs to
          });
        }
        if (validationError) break;
      }

      if (validationError) {
        alert(validationError);
        setLoading(false);
        return;
      }

      /* ---------------- 2. CONSTRUCT FORMDATA PAYLOAD ---------------- */
      // NOTE: We use FormData because we are now sending FILES (Images)
      const payload = new FormData();

      // --- User Details ---
      payload.append("user[first_name]", formData.firstName);
      payload.append("user[last_name]", formData.lastName);
      payload.append("user[phone_number]", formData.phone);
      payload.append("user[alt_phone_number]", formData.altPhone);
      payload.append("user[password]", formData.password);
      payload.append("user[role]", "3");
      if (formData.email) payload.append("user[email]", formData.email);
      if (formData.referralCode) payload.append("user[referral_code]", formData.referralCode);

      // --- Business Details ---
      payload.append("business[business_name]", formData.businessName);
      payload.append("business[business_desc]", formData.businessDesc || "");
      if (formData.gstNumber) payload.append("business[gst_number]", formData.gstNumber);

      // --- Address ---
      payload.append("business[address][street_address]", formData.address.streetAddress);
      payload.append("business[address][landmark]", formData.address.landmark || "");
      payload.append("business[address][state_id]", formData.address.state_id);
      payload.append("business[address][state_slug]", formData.address.state_slug);
      payload.append("business[address][city_id]", formData.address.city_id);
      payload.append("business[address][city_slug]", formData.address.city_slug);
      payload.append("business[address][pin_code]", formData.address.pinCode);

      // --- Categories (Arrays) ---
      formData.categories.forEach((catId, index) => {
        payload.append(`categories[${index}]`, catId);
      });

      formData.subCategoryDetails.forEach((sub, index) => {
        payload.append(`sub_categories[${index}]`, sub.id);
      });

      // --- Items & Images ---
      validatedItems.forEach((item, index) => {
        // Basic Fields
        payload.append(`items[${index}][sub_category_id]`, item.sub_category_id);
        payload.append(`items[${index}][brand_id]`, item.brand_id);
        payload.append(`items[${index}][brand_name]`, item.brand_name || "");
        payload.append(`items[${index}][model_id]`, item.model_id);
        payload.append(`items[${index}][model_name]`, item.model_name || "");
        payload.append(`items[${index}][title]`, item.title.trim());
        payload.append(`items[${index}][transmission]`, item.transmission || "");
        payload.append(`items[${index}][engine]`, item.engine || "");
        payload.append(`items[${index}][description]`, item.description || "");

        // Numeric Fields
        payload.append(`items[${index}][price_per_day]`, item.pricePerDay || 0);
        payload.append(`items[${index}][rate_per_km]`, item.ratePerKM || 0);
        payload.append(`items[${index}][security_deposit]`, item.securityDeposit || 0);

        // IMAGE UPLOAD LOGIC
        // We loop through the 'images' array we created in CarForm
        if (item.images && item.images.length > 0) {
          item.images.forEach((imgObj) => {
            // imgObj.file contains the actual File object from the input
            // 'images[]' notation allows sending multiple files under one key
            payload.append(`items[${index}][images][]`, imgObj.file);
          });
        }
      });

      /* ---------------- 3. API CALL ---------------- */
      const res = await fetch(`${AUTH_API_BASE_URL}/agent/register-vendor`, {
        method: "POST",
        // IMPORTANT: Do NOT set 'Content-Type': 'application/json' here.
        // The browser automatically sets Content-Type to multipart/form-data with the boundary.
        body: payload,
      });

      const response = await res.json();

      if (!res.ok || response?.status === false) {
        throw new Error(response?.message || "Vendor registration failed");
      }

      alert("Vendor registered successfully!");
      window.location.href = "/agents/register-vendors";

    } catch (err) {
      console.error("Final submit error:", err);
      alert(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading registration…</div>}>
      {/* STEP 1: REGISTRATION */}
      {step === 1 && (
        <AgentRegisterVendorClient
          data={formData}
          setData={setFormData}
          onNext={() => setStep(2)}
        />
      )}

      {/* STEP 2: BUSINESS DETAILS */}
      {step === 2 && (
        <BusinessDetailsStep
          data={formData}
          setData={setFormData}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {/* STEP 3: PREVIEW */}
      {step === 3 && (
        <BusinessPreviewStep
          data={formData}
          onBack={() => setStep(2)}
          onConfirm={handleFinalSubmit}
          loading={loading}
        />
      )}
    </Suspense>
  );
}
