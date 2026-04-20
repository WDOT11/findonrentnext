"use client";

import { useState } from "react";
import { LuEyeOff, LuEye } from "react-icons/lu";
import "./register.css";

const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL;

export default function AgentRegisterVendorClient({data, setData, onNext})
{
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phone: data.phone || "",
    altPhone: data.altPhone || "",
    password: "",
    email: data.email || "",
    referralCode: data.referralCode || "",
  });

  /* ------------------ INPUT HANDLER ------------------ */
  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  /* ------------------ VALIDATION ------------------ */
  const validateForm = () => {
    const fe = {};
    const cleanedPhone = (form.phone || "").replace(/\D/g, "");
    // Clean the alt phone just like the main phone
    const cleanedAltPhone = (form.altPhone || "").replace(/\D/g, "");

    if (!form.firstName.trim())
      fe.firstName = "First name is required.";

    // Main Phone Validation
    if (!cleanedPhone)
      fe.phone = "Phone number is required.";
    else if (cleanedPhone.length !== 10)
      fe.phone = "Enter a valid 10-digit phone number.";

    // Alt Phone Validation (Optional but must be valid if entered)
    if (cleanedAltPhone.length > 0 && cleanedAltPhone.length !== 10) {
      fe.altPhone = "Enter a valid 10-digit alternate number.";
    }

    if (!form.password)
      fe.password = "Password is required.";
    else if (form.password.length < 8)
      fe.password = "Password must be at least 8 characters.";

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      fe.email = "Enter a valid email address.";
    }

    // Return cleanedAltPhone so we don't have to clean it again in handleSubmit
    return { fe, cleanedPhone, cleanedAltPhone };
  };

  /* ------------------ SUBMIT (STEP-1) ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    // 4. Destructure cleanedAltPhone here
    const { fe, cleanedPhone, cleanedAltPhone } = validateForm();
    
    if (Object.keys(fe).length) {
      setFieldErrors(fe);
      return;
    }

    setLoading(true);

    try {
      /* CHECK PHONE UNIQUENESS */
      const phoneRes = await fetch(`${AUTH_API_BASE_URL}/check-phone-availability`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: cleanedPhone, email: form.email ? form.email.trim() : "" }),
        }
      );

      const phoneData = await phoneRes.json();

      if (!phoneRes.ok || phoneData?.data?.taken?.phone || phoneData?.data?.taken?.email) {
        const errors = {};

        if (phoneData?.data?.taken?.phone) {
          errors.phone = "Phone number already exists";
        }

        if (phoneData?.data?.taken?.email) {
          errors.email = "Email already exists";
        }

        setFieldErrors(errors);
        setFormError(phoneData?.message || "Already exists");
        return;
      }

      // REMOVED: const cleanedAltPhone = ... (We already did this in validateForm)

      /* STORE DATA IN PARENT FORM STATE */
      setData((prev) => ({
        ...prev,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: cleanedPhone,
        altPhone: cleanedAltPhone, // 5. Use the cleaned value from validation
        password: form.password,
        email: form.email ? form.email.trim() : "",
        referralCode: form.referralCode ? form.referralCode.trim() : "",
      }));

      /* MOVE TO STEP-2 */
      onNext();
    } catch (err) {
      console.error("Phone check failed:", err);
      setFormError(
        "Unable to verify phone number. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="roh_register_content">
      <main className="rohuserres_shell">
        <section className="rohuserres_card">
          <h1 className="rohuserres_title">
            Register Vendor (Agent)
          </h1>

          {formError && (
            <p className="rohuserres_errorTop">{formError}</p>
          )}

          <form onSubmit={handleSubmit} className="rohuserres_form" noValidate>
            {/* First & Last Name */}
            <div className="rohuserres_grid2">
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label"> First Name * </label>
                <input className={`rohuserres_input ${fieldErrors.firstName ? "rohuserres_input--invalid" : ""}`} name="firstName" value={form.firstName} onChange={onChange} disabled={loading}/>
                {fieldErrors.firstName && (
                  <span className="rohuserres_error">
                    {fieldErrors.firstName}
                  </span>
                )}
              </div>

              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label"> Last Name </label>
                <input className={`rohuserres_input ${fieldErrors.lastName ? "rohuserres_input--invalid" : ""}`} name="lastName" value={form.lastName} onChange={onChange} disabled={loading}/>
                {fieldErrors.lastName && (
                  <span className="rohuserres_error"> {fieldErrors.lastName} </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="rohuserres_fieldCol">
              <label className="rohuserres_label"> Phone Number * </label>
              <input className={`rohuserres_input ${fieldErrors.phone ? "rohuserres_input--invalid" : ""}`} name="phone" value={form.phone}
                onChange={(e) => {
                  if (
                    /^\d*$/.test(e.target.value) &&
                    e.target.value.length <= 10
                  ) {
                    onChange(e);
                  }
                }}
                maxLength={10} disabled={loading}
              />
              {fieldErrors.phone && (
                <span className="rohuserres_error"> {fieldErrors.phone} </span>
              )}
            </div>

            {/* Alt Phone */}
            <div className="rohuserres_fieldCol">
              <label className="rohuserres_label"> Alternate Phone Number (Optional)</label>
              <input className={`rohuserres_input ${fieldErrors.altPhone ? "rohuserres_input--invalid" : ""}`} name="altPhone" value={form.altPhone}
                onChange={(e) => {
                  if (
                    /^\d*$/.test(e.target.value) &&
                    e.target.value.length <= 10
                  ) {
                    onChange(e);
                  }
                }}
                maxLength={10} disabled={loading}
              />
              {fieldErrors.altPhone && (
                <span className="rohuserres_error"> {fieldErrors.altPhone} </span>
              )}
            </div>

            {/* Email */}
            <div className="rohuserres_fieldCol">
              <label className="rohuserres_label"> Email (optional) </label>
              <input className={`rohuserres_input ${fieldErrors.email ? "rohuserres_input--invalid" : ""}`} name="email" value={form.email} onChange={onChange} disabled={loading}/>
              {fieldErrors.email && (
                <span className="rohuserres_error"> {fieldErrors.email} </span>
              )}
            </div>

            {/* Password */}
            <div className="rohuserres_fieldCol">
              <label className="rohuserres_label"> Password * </label>
              <div className="rohuserres_passwordWrapper">
                <input className={`rohuserres_input ${fieldErrors.password ? "rohuserres_input--invalid" : ""}`} type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={onChange} disabled={loading}/>
                <button type="button" className="rohuserres_eyeBtn" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}>
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="rohuserres_error"> {fieldErrors.password} </span>
              )}
            </div>

            {/* Referral Code */}
            <div className="rohuserres_fieldCol">
              <label className="rohuserres_label"> Referral Code (optional) </label>
              <input className="rohuserres_input" name="referralCode" value={form.referralCode} onChange={onChange} disabled={loading}/>
            </div>

            <button type="submit" className="rohuserres_btn" disabled={loading}>
              {loading ? "Checking..." : "Register & Continue"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}