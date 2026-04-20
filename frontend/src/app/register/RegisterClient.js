"use client";
// import { headers } from "next/headers";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./register.css";
import RohLogo from "../../../public/images/global-imgs/roh_logo.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { LuEyeOff, LuEye, LuArrowRight, LuBriefcase, LuStar, LuCar, LuCheck, LuShield, LuShieldCheck  } from "react-icons/lu";
import Image from "next/image";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL;

const LANGUAGE_MESSAGES = {
  en: {
    label: "English",
    textBefore: "If you are already registered on the website, please ",
    linkText: "Login",
    textAfter: "."
  },

  hi: {
    label: "हिन्दी",
    textBefore: "यदि आप पहले से वेबसाइट पर रजिस्टर हैं, तो कृपया ",
    linkText: "लॉगिन",
    textAfter: " करें।"
  },

  mr: {
    label: "मराठी",
    textBefore: "आपण आधीच वेबसाइटवर नोंदणीकृत असाल तर कृपया ",
    linkText: "लॉगिन",
    textAfter: " करा."
  },

  gu: {
    label: "ગુજરાતી",
    textBefore: "જો તમે પહેલેથી જ વેબસાઇટ પર નોંધાયેલા હો, તો કૃપા કરીને ",
    linkText: "લૉગિન",
    textAfter: " કરો."
  },

  bn: {
    label: "বাংলা",
    textBefore: "আপনি যদি ইতিমধ্যেই ওয়েবসাইটে নিবন্ধিত হয়ে থাকেন, তাহলে অনুগ্রহ করে ",
    linkText: "লগইন",
    textAfter: " করুন।"
  },

  ta: {
    label: "தமிழ்",
    textBefore: "நீங்கள் ஏற்கனவே இணையதளத்தில் பதிவு செய்திருந்தால், தயவுசெய்து ",
    linkText: "உள்நுழைய",
    textAfter: "வும்."
  },

  te: {
    label: "తెలుగు",
    textBefore: "మీరు ఇప్పటికే వెబ్‌సైట్‌లో నమోదు అయి ఉంటే, దయచేసి ",
    linkText: "లాగిన్",
    textAfter: " చేయండి."
  },

  kn: {
    label: "ಕನ್ನಡ",
    textBefore: "ನೀವು ಈಗಾಗಲೇ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನೋಂದಾಯಿತರಾಗಿದ್ದರೆ, ದಯವಿಟ್ಟು ",
    linkText: "ಲಾಗಿನ್",
    textAfter: " ಮಾಡಿ."
  },

  ml: {
    label: "മലയാളം",
    textBefore: "നിങ്ങൾ ഇതിനകം വെബ്‌സൈറ്റിൽ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെങ്കിൽ, ദയവായി ",
    linkText: "ലോഗിൻ",
    textAfter: " ചെയ്യുക."
  },

  pa: {
    label: "ਪੰਜਾਬੀ",
    textBefore: "ਜੇ ਤੁਸੀਂ ਪਹਿਲਾਂ ਹੀ ਵੈੱਬਸਾਈਟ ‘ਤੇ ਰਜਿਸਟਰ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ",
    linkText: "ਲਾਗਇਨ",
    textAfter: " ਕਰੋ।"
  },

  or: {
    label: "ଓଡ଼ିଆ",
    textBefore: "ଯଦି ଆପଣ ପୂର୍ବରୁ ୱେବସାଇଟରେ ପଞ୍ଜିକୃତ ଅଛନ୍ତି, ତେବେ ଦୟାକରି ",
    linkText: "ଲଗଇନ",
    textAfter: " କରନ୍ତୁ।"
  },

  as: {
    label: "অসমীয়া",
    textBefore: "আপুনি যদি ইতিমধ্যে ৱেবছাইটত পঞ্জীয়ন কৰিছে, তেন্তে অনুগ্ৰহ কৰি ",
    linkText: "লগইন",
    textAfter: " কৰক।"
  },

  ur: {
    label: "اردو",
    textBefore: "اگر آپ پہلے ہی ویب سائٹ پر رجسٹر ہیں تو براہ کرم ",
    linkText: "لاگ ان",
    textAfter: " کریں۔"
  }
};

const REGION_TO_LANG = {
  /** https://en.wikipedia.org/wiki/List_of_states_and_union_territories_of_India */
  /** States */
  "andhra pradesh": "te",
  "arunachal pradesh": "en",
  "assam": "as",
  "bihar": "hi",
  "chhattisgarh": "hi",
  "goa": "en",
  "gujarat": "gu",
  "haryana": "hi",
  "himachal pradesh": "hi",
  "jharkhand": "hi",
  "karnataka": "kn",
  "kerala": "ml",
  "madhya pradesh": "hi",
  "maharashtra": "mr",
  "manipur": "en",
  "meghalaya": "en",
  "mizoram": "en",
  "nagaland": "en",
  "odisha": "or",
  "punjab": "pa",
  "rajasthan": "hi",
  "sikkim": "en",
  "tamil nadu": "ta",
  "telangana": "te",
  "tripura": "bn",
  "uttar pradesh": "hi",
  "uttarakhand": "hi",
  "west bengal": "bn",

  /** Union Territories */
  "andaman and nicobar islands": "en",
  "chandigarh": "hi",
  "dadra and nagar haveli and daman and diu": "gu",
  "delhi": "hi",
  "jammu and kashmir": "ur",
  "ladakh": "en",
  "lakshadweep": "ml",
  "puducherry": "ta"
};

/** Helper: safe fetch + JSON + easy header access */
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    ...options,
  });
  const ct = res.headers.get("content-type") || "";
  let data = null;
  try {
    data = ct.includes("application/json") ? await res.json() : await res.text();
  } catch {
    // ignore parse error
  }
  return { res, data };
}

export default function RegisterClient( { region } ) {
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [info, setInfo] = useState("");
  const [debugOtp, setDebugOtp] = useState(""); // dev-only display
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPostRegisterPopup, setShowPostRegisterPopup] = useState(false);

  const regionKey = region?.toLowerCase() || "default";


  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  // login url if the page have redirect url
  const loginUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : `/login`;

  const [language, setLanguage] = useState(
    REGION_TO_LANG[regionKey] || "en"
  );

  const isBrowser = typeof window !== "undefined";

  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhoneNumber: "",
    password: "",
    referralCode: "",
    otp: "",
  });

  // const userNameRef = useRef(null);
  const otpRef = useRef(null);

    useEffect(() => {
    if (showPostRegisterPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    /** cleanup when component unmount */
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showPostRegisterPopup]);


  /** simple toast clear */
  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo(""), 4000);
    return () => clearTimeout(t);
  }, [info]);

  /** resend cooldown ticker */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" }));
    setFormError("");
    setInfo("");

    // If any core detail changes during Step-2, drop back to Step-1
    if (
      step === 2 &&
      ["email", "phone", "password", "firstName", "lastName"].includes(name)
    ) {
      setForm((f) => ({ ...f, otp: "" }));
      setDebugOtp("");
      setStep(1);
    }
  };

  const validateStep1 = () => {
    const fe = {};
    const cleanedPhone = (form.phone || "").replace(/\D/g, "");
    if (!form.firstName.trim()) fe.firstName = "First name is required.";
    // if (!form.lastName.trim()) fe.lastName = "Last name is required.";
    if (!form.email.trim()) fe.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) fe.email = "Enter a valid email.";
    if (!cleanedPhone) fe.phone = "Phone number is required.";
    else if (cleanedPhone.length !== 10) fe.phone = "Enter 10-digit number.";
    if (!form.password) fe.password = "Password is required.";
    else if (form.password.length < 8) fe.password = "Password must be at least 8 characters.";
    return { fe, cleanedPhone };
  };

  /** Step-1 submit: availability → signup (backend sets active=0 & authorize_code=OTP) */
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setFormError("");
    setInfo("");
    setFieldErrors({});

    const { fe, cleanedPhone } = validateStep1();
    if (Object.keys(fe).length) {
      setFieldErrors(fe);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      // 1) Check availability
      {
        const { res, data } = await fetchJSON(`${AUTH_API_BASE_URL}/checkavailability`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });

        if (!res.ok || data?.status === false) {
          const taken = data?.data?.taken || {};
          const newFE = {};
          if (taken.email) newFE.email = "Email already exists.";
          if (Object.keys(newFE).length) {
            setFieldErrors(newFE);
            // userNameRef.current?.focus();
            setFormError("Some details already exist. Please update and try again.");
            return;
          }
          throw new Error(data?.message || "Could not check availability");
        }
      }

      // 2) Signup
      {
        const normalizedReferralCode =
          form.referralCode && form.referralCode.trim() !== ""
            ? form.referralCode.trim().toUpperCase()
            : null;

        const cleanedAltPhoneNumber = (form.altPhoneNumber || "").replace(/\D/g, "");

        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: cleanedPhone,
          altPhoneNumber: cleanedAltPhoneNumber,
          password: form.password,
          referralCode: normalizedReferralCode,
        };

        const { res, data } = await fetchJSON(`${AUTH_API_BASE_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok || data?.status === false) {
          const msg = data?.message || "Signup failed";

          if (/email.*exist|duplicate.*email/i.test(msg)) {
            setFieldErrors({ email: "Email already exists." });
          } else {
            setFormError(msg);
          }
          return;
        }

        // Save cleaned phone into form state (don’t mutate earlier)
        setForm((f) => ({ ...f, phone: payload.phone }));

        // Dev-only: show OTP if backend returns it
        const otpFromServer =
          data?.data?.otp ?? data?.otp ?? data?.data?.authorize_code ?? data?.authorize_code;
        if (otpFromServer) setDebugOtp(String(otpFromServer));

        setStep(2);
        setTimeout(() => otpRef.current?.focus(), 0);
      }
    } catch (err) {
      setFormError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /** Step-2 submit: verify OTP */
  const handleVerifyAndCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setInfo("");
    setFieldErrors((fe) => ({ ...fe, otp: "" }));

    if (!form.otp.trim()) {
      setFieldErrors((fe) => ({ ...fe, otp: "OTP is required." }));
      if (typeof window !== "undefined") {
        otpRef.current?.focus();
      }

      return;
    }

    setLoading(true);
    try {
      const { res, data } = await fetchJSON(`${AUTH_API_BASE_URL}/sign-up-verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email, // verifying by email
          otp: form.otp,
        }),
      });

      if (!res.ok || data?.status === false) {
        const msg = (data && data.message) || "Invalid OTP";
        setFieldErrors((fe) => ({ ...fe, otp: "Invalid OTP." }));
        setFormError(msg);
        otpRef.current?.focus();
        return;
      }

      //  Success: directly navigate and STOP (no setState after this).
      alert("Account verified successfully.");

      if(redirectUrl){
        document.cookie = `authToken=${data.data.token}; path=/`;
        document.cookie = `authUser=${JSON.stringify(data.data.user)}; path=/`;
        window.location.href = redirectUrl || "/become-a-host";
      }
      else if (isBrowser) {
        document.cookie = `authToken=${data.data.token}; path=/`;
        document.cookie = `authUser=${JSON.stringify(data.data.user)}; path=/`;

        // window.location.href = "/become-a-host";
        setShowPostRegisterPopup(true);
      }

      return;

    } catch (err) {
      setFormError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /** Resend OTP → backend updates authorize_code with new OTP */
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setFormError("");
    setInfo("");
    setLoading(true);
    try {
      const { res, data } = await fetchJSON(`${AUTH_API_BASE_URL}/verify-resendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      if (!res.ok || data?.status === false) {
        throw new Error((data && data.message) || "Failed to resend OTP");
      }

      // Try every reasonable place for an OTP value if backend ever adds it
      const headerOtp = res.headers.get("X-Dev-OTP"); // if you add header in dev
      const newOtp =
        headerOtp ||
        data?.data?.otp ||
        data?.otp ||
        data?.data?.authorize_code ||
        data?.authorize_code;

      if (newOtp) {
        setDebugOtp(String(newOtp)); // show new OTP in dev note (when available)
        setInfo("New OTP received.");
      } else {
        // Backend returned no OTP (current prod-safe behavior)
        setInfo("OTP resent successfully.");
      }

      setResendCooldown(30); // 30s cooldown
    } catch (err) {
      setFormError(err?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="roh_register_content">
      <div className="rohuserres_shell">
        <div className="rohuserres_card">
          <h1 className="rohuserres_title">Create Account – It’s FREE</h1>
          {/* Language switcher */}
          {/* <div className="languageSwitcher">
            <label htmlFor="language" className="languageLabel">
              Language
            </label>

            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="languageSelect"
            >
              {Object.entries(LANGUAGE_MESSAGES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div> */}

          <p className="rohuserres_sub text-center">
            Please create an account if you are not registered on the site.
          </p>

          {/* Language-specific message */}
          {/* {step === 1 && language !== "en" && (
            <div className="rohuserres_infoTop text-center">
              {LANGUAGE_MESSAGES[language].textBefore}
              <a href={loginUrl} className="rohuserlogn_link fw-semibold">
                {LANGUAGE_MESSAGES[language].linkText}
              </a>
              {LANGUAGE_MESSAGES[language].textAfter}
            </div>
          )} */}

          <div className="rohuserres_steps">
            <span className={step === 1 ? "active" : ""}></span>
            <span className={step === 2 ? "active" : ""}></span>
          </div>

          {formError ? <p className="rohuserres_errorTop">{formError}</p> : null}
          {info ? <p className="rohuserres_infoTop">{info}</p> : null}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="rohuserres_form" noValidate>

              {/* First & Last name */}
              <div className="rohuserres_grid2">
                <div className="rohuserres_fieldCol">
                  <label className="rohuserres_label">First Name *</label>
                  <input
                    className={`rohuserres_input ${fieldErrors.firstName ? "rohuserres_input--invalid" : ""}`}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={onChange}
                    required
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby="err-firstName"
                    disabled={loading}
                  />
                  {fieldErrors.firstName && (
                    <span id="err-firstName" className="rohuserres_error">{fieldErrors.firstName}</span>
                  )}
                </div>
                <div className="rohuserres_fieldCol">
                  <label className="rohuserres_label">Last Name</label>
                  <input
                    className={`rohuserres_input ${fieldErrors.lastName ? "rohuserres_input--invalid" : ""}`}
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={onChange}
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby="err-lastName"
                    disabled={loading}
                  />
                  {fieldErrors.lastName && (
                    <span id="err-lastName" className="rohuserres_error">{fieldErrors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label">Email</label>
                <input
                  className={`rohuserres_input ${fieldErrors.email ? "rohuserres_input--invalid" : ""}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby="err-email"
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <span id="err-email" className="rohuserres_error">{fieldErrors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label">Phone Number</label>
                <input
                  className={`rohuserres_input ${fieldErrors.phone ? "rohuserres_input--invalid" : ""}`}
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      onChange(e);
                    }
                  }}
                  required
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby="err-phone"
                  disabled={loading}
                  maxLength={10}
                  inputMode="numeric"
                />
                {fieldErrors.phone && (
                  <span id="err-phone" className="rohuserres_error">{fieldErrors.phone}</span>
                )}
              </div>

              {/* Alternate Phone Number */}
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label"> Alternate Phone Number (Optional)</label>
                <input
                  className={`rohuserres_input ${fieldErrors.altPhoneNumber ? "rohuserres_input--invalid" : ""}`}
                  type="tel"
                  name="altPhoneNumber"
                  placeholder="9876543210"
                  value={form.altPhoneNumber}
                  onChange={(e) => {
                    if (
                      /^\d*$/.test(e.target.value) &&
                      e.target.value.length <=              10
                    ) {
                      onChange(e);
                    }
                  }}
                  required
                  aria-invalid={!!fieldErrors.altPhoneNumber}
                  disabled={loading}
                  maxLength={10}
                  inputMode="numeric"
                />
                {fieldErrors.altPhoneNumber && (
                  <span id="err-altPhoneNumber" className="rohuserres_error">{fieldErrors.altPhoneNumber}</span>
                )}
              </div>

              {/* Password */}
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label">Password</label>
                <div className="rohuserres_passwordWrapper">
                  <input
                    className={`rohuserres_input ${fieldErrors.password ? "rohuserres_input--invalid" : ""}`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={onChange}
                    required
                    minLength={8}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby="err-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="rohuserres_eyeBtn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span id="err-password" className="rohuserres_error">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              {/* REFERRAL CODE (Optional) */}
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label">
                  Referral Code <span style={{ fontWeight: "400", opacity: 0.7 }}>(optional)</span>
                </label>

                <input className={`rohuserres_input ${fieldErrors.referralCode ? "rohuserres_input--invalid" : ""}`}
                  type="text"
                  name="referralCode"
                  placeholder="Enter referral code"
                  value={form.referralCode}
                  onChange={onChange}
                  aria-invalid={!!fieldErrors.referralCode}
                  aria-describedby="err-referralCode"
                  disabled={loading}
                />

                {fieldErrors.referralCode && (
                  <span id="err-referralCode" className="rohuserres_error">
                    {fieldErrors.referralCode}
                  </span>
                )}
              </div>

              <button type="submit" className="rohuserres_btn" disabled={loading}>
                {loading ? "Please wait..." : "Create Account"}
              </button>

              <span className="rohuserres_loginlink">
                Already have an account? <a className="text-decoration-none fw-semibold" href={loginUrl}>Login</a>
                {/* Already have an account? <a className="text-decoration-none fw-semibold" href="/login">Login</a> */}
              </span>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCreate} className="rohuserres_form" noValidate>
              {/* Summary */}
              <div className="rohuserres_summary">
                <p>
                  <strong>We've sent an OTP to your email. Please enter it to verify your account.</strong>
                  {/* (+91 {`XXXXX X${form.phone?.slice(-4)}`}) */}
                  (Email Address: {`${form.email?.split('@')[0].slice(0,4)}${'*'.repeat(Math.max(7, form.email?.split('@')[0].length - 4))}@${form.email?.split('@')[1]}`})
                </p>
              </div>

              {/* OTP Field */}
              <div className="rohuserres_fieldCol">
                <label className="rohuserres_label">Enter OTP</label>
                <input
                  ref={otpRef}
                  className={`rohuserres_input ${fieldErrors.otp ? "rohuserres_input--invalid" : ""}`}
                  type="text"
                  name="otp"
                  placeholder="6-digit OTP"
                  value={form.otp}
                  onChange={onChange}
                  required
                  aria-invalid={!!fieldErrors.otp}
                  aria-describedby="err-otp"
                  disabled={loading}
                  inputMode="numeric"
                />
                {fieldErrors.otp && (
                  <span id="err-otp" className="rohuserres_error">{fieldErrors.otp}</span>
                )}
              </div>

              {/* Dev-only helper */}
              {/* {debugOtp ? (
                <p className="rohuserres_note">
                  <em>Dev note:</em> OTP from server: <strong>{debugOtp}</strong>
                </p>
              ) : null} */}

              <div className="rohuserres_actionsRow">
                <button
                  type="button"
                  className="rohuserres_btn rohuserres_btn--ghost"
                  onClick={handleResendOtp}
                  disabled={loading || resendCooldown > 0}
                  title={resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
                <button type="submit" className="rohuserres_btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Create"}
                </button>
              </div>

              <span className="rohuserres_loginlink roh_create_ac_log">
                Already verified? <a href={loginUrl} className="text-decoration-none fw-semibold">Login</a>
              </span>
            </form>
          )}
        </div>
      </div>

      {showPostRegisterPopup && (
        <div className="roh_popup_overlay">
          <div className="roh_popup_box">
              <div className="roh_container">
                <div className="roh_popup_header d-flex align-items-center justify-content-between py-3 w-100">
                  <a href={`${WEB_BASE_DOMAIN_URL}/`} aria-label="Find On Rent Home"> <RohLogo aria-hidden="true" style={{ width: "100px", height: "auto" }}/></a>
                  <a className="roh_popup_skip_btn d-flex align-items-center" href={`${WEB_BASE_DOMAIN_URL}/`} onClick={() => setShowPostRegisterPopup(false)} >Skip for now <LuArrowRight size={16} aria-hidden="true" /> </a>                  
                </div>

                <div className="roh_popup_innerWarp">
                  {/* Hero Section */}
                  <div className="roh_hero_section">
                    <div className="welcome-badge">Welcome to FindOnRent 🎉</div>
                    <h1 className="hero-title">
                      Hi {form.firstName || "there"}, let's get you started
                    </h1>
                    <p className="hero-subtitle">Choose how you want to use FindOnRent</p>
                  </div>
                  <div className="roh_cards_grid">
                      <div className="roh_action_card roh_card_dominant">
                        <div className="recommended-badge">
                          <div>
                          <LuStar size={16} />
                          </div>
                          Most users start here
                        </div>

                        <div className="card-image-wrapper">
                          <Image className="card-image" src="/images/assets/find-vehicles.webp" alt="Roh Car" width={428} height={240} />                          
                        </div>

                        <div className="card-header-flex">
                          <div className="title-icon">
                            <div>
                              <LuCar size={20} />
                            </div>
                          </div>
                          <h2 className="card-title">Find Vehicles</h2>
                        </div>
                        
                        <p className="card-desc">Browse cars, bikes &amp; scooters near you. Compare options and contact vendors instantly.</p>
                        
                        <ul className="benefits-list">
                          <li className="benefit-item">
                            <div className="benefit-icon">
                              <div>
                                <LuCheck size={12} />
                              </div>
                            </div>
                            No booking fees
                          </li>
                          <li className="benefit-item">
                            <div className="benefit-icon">
                              <div>
                                <LuCheck size={12} />
                              </div>
                            </div>
                            Direct contact with owners
                          </li>
                          <li className="benefit-item">
                            <div className="benefit-icon">
                              <div>
                                <LuCheck size={12} />
                              </div>
                            </div>
                            Multiple vehicle options nearby
                          </li>
                        </ul>

                        <div className="spacer"></div>

                        <a className="roh_btn roh_btnOrange" href="/" onClick={() => (window.location.href = "/")}>Explore Vehicles</a>
                      </div>

                      <div className="roh_action_card roh_card_muted">
                        <div className="card-image-wrapper">
                           <Image className="card-image" src="/images/assets/list-your-vehicle.webp" alt="Roh Car" width={428} height={240} />   
                        </div>

                        <div className="card-header-flex">
                          <div className="title-icon">
                            <div>
                              <LuBriefcase size={20} />
                            </div>
                          </div>
                          <h2 className="card-title">List Your Vehicle</h2>
                        </div>

                        <p className="card-desc">Start earning by listing your vehicle. Connect with customers and grow your rental business.</p>
                        
                        <ul className="benefits-list">
                          <li className="benefit-item">
                            <div className="benefit-icon">
                              <div>
                                <LuCheck size={12} />
                              </div>
                            </div>
                            Free listing
                          </li>
                          <li className="benefit-item">
                            <div className="benefit-icon">
                              <div>
                                <LuCheck size={12} />
                              </div>
                            </div>
                            Get direct leads
                          </li>
                          <li className="benefit-item">
                            <div className="benefit-icon">
                              <div>
                                <LuCheck size={12} />
                              </div>
                            </div>
                            Manage inquiries easily
                          </li>
                        </ul>

                        <div className="spacer"></div>
                    
                        <a className="roh_btn roh_btnBlack" href="/become-a-host" onClick={() => (window.location.href = "/become-a-host")}>List Your Vehicle</a>
                      </div>
                   </div>
                   <div className="trust-line">
                      <div><LuShieldCheck size={16} aria-hidden="true" color="#ff3600"/></div>Join thousands of users renting smarter every day
                  </div>
                   
                </div>
              </div>
          </div>
        </div>
      )}
    </section>
    </>
  );
}