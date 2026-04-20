"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "./login.css";
import { LuEyeOff, LuEye } from "react-icons/lu";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;
const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_USER_URL;

const LANGUAGE_MESSAGES = {
  en: {
    label: "English",
    textBefore: "If this is your first time here, please ",
    linkText: "Register",
    textAfter: " to continue."
  },

  hi: {
    label: "हिन्दी",
    textBefore: "अगर आप यहाँ पहली बार आए हैं, तो कृपया ",
    linkText: "रजिस्टर",
    textAfter: " करें और आगे बढ़ें।"
  },

  mr: {
    label: "मराठी",
    textBefore: "तुम्ही येथे पहिल्यांदा आला असाल तर कृपया ",
    linkText: "नोंदणी",
    textAfter: " करा आणि पुढे जा."
  },

  gu: {
    label: "ગુજરાતી",
    textBefore: "જો તમે અહીં પ્રથમવાર આવ્યા છો તો કૃપા કરીને ",
    linkText: "નોંધણી",
    textAfter: " કરો."
  },

  bn: {
    label: "বাংলা",
    textBefore: "আপনি যদি এখানে প্রথমবার আসেন, অনুগ্রহ করে ",
    linkText: "রেজিস্টার",
    textAfter: " করুন।"
  },

  ta: {
    label: "தமிழ்",
    textBefore: "நீங்கள் இங்கே முதன்முறையாக வந்திருந்தால், ",
    linkText: "பதிவு",
    textAfter: " செய்து தொடரவும்."
  },

  te: {
    label: "తెలుగు",
    textBefore: "మీరు ఇక్కడ తొలిసారి వచ్చి ఉంటే, దయచేసి ",
    linkText: "నమోదు",
    textAfter: " చేసుకోండి."
  },

  kn: {
    label: "ಕನ್ನಡ",
    textBefore: "ನೀವು ಇಲ್ಲಿ ಮೊದಲ ಬಾರಿ ಬಂದಿದ್ದರೆ, ದಯವಿಟ್ಟು ",
    linkText: "ನೋಂದಣಿ",
    textAfter: " ಮಾಡಿ."
  },

  ml: {
    label: "മലയാളം",
    textBefore: "നിങ്ങൾ ഇവിടെ ആദ്യമായാണെങ്കിൽ, ദയവായി ",
    linkText: "രജിസ്റ്റർ",
    textAfter: " ചെയ്യുക."
  },

  pa: {
    label: "ਪੰਜਾਬੀ",
    textBefore: "ਜੇ ਤੁਸੀਂ ਇੱਥੇ ਪਹਿਲੀ ਵਾਰ ਆਏ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ",
    linkText: "ਰਜਿਸਟਰ",
    textAfter: " ਕਰੋ।"
  },

  or: {
    label: "ଓଡ଼ିଆ",
    textBefore: "ଆପଣ ପ୍ରଥମ ଥର ପାଇଁ ଆସିଥିଲେ, ଦୟାକରି ",
    linkText: "ପଞ୍ଜିକରଣ",
    textAfter: " କରନ୍ତୁ।"
  },

  as: {
    label: "অসমীয়া",
    textBefore: "আপুনি ইয়াত প্ৰথমবাৰৰ বাবে আহিলে, অনুগ্ৰহ কৰি ",
    linkText: "পঞ্জীয়ন",
    textAfter: " কৰক।"
  },

  ur: {
    label: "اردو",
    textBefore: "اگر آپ یہاں پہلی بار آئے ہیں تو براہ کرم ",
    linkText: "رجسٹر",
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

export default function LoginClient( { region } ) {
  // CHANGED: 'email' -> 'identifier' to support both types
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [userId, setUserId] = useState(null);

  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [resendLoading, setResendLoading] = useState(false);

  const regionKey = region?.toLowerCase() || "default";


  // resend cooldown (in seconds)
  const RESEND_COOLDOWN = 10;
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  // register url if the page have redirect url
  const registerUrl = redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : `/register`;

  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const [language, setLanguage] = useState(
    REGION_TO_LANG[regionKey] || "en"
  );

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    // CHANGED: Validation now checks identifier
    if (!form.identifier.trim() || !form.password.trim()) {
      setError("Please enter your email/phone and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${AUTH_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // CHANGED: Sending generic identifier.
        // Ensure your backend accepts { identifier: "...", password: "..." }
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.otpRequired) {
        setOtpStep(true);
        setUserId(data.userId ?? null);
        setInfo("OTP sent to your registered email.");
        startCooldown();
        return;
      }

      document.cookie = `authToken=${data.token}; path=/; max-age=1296000`;
      document.cookie = `authUser=${JSON.stringify(data.user)}; path=/; max-age=1296000`;

      window.location.href = redirectUrl || "/dashboard";

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const res = await fetch(`${AUTH_API_BASE_URL}/sign-in-verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      alert("OTP Verified Successfully. Please login again.");
      setOtpStep(false);
      // CHANGED: Reset identifier instead of email
      setForm({ identifier: "", password: "" });
      setOtp("");
      setInfo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const onResendOtp = async () => {
    setError(null);
    setInfo(null);

    // CHANGED: Check identifier instead of email
    const identifier = form.identifier.trim();
    if (!identifier) {
      setError("Enter your email or phone on the login screen first.");
      return;
    }
    if (cooldown > 0 || resendLoading) return;

    try {
      setResendLoading(true);
      const res = await fetch(`${AUTH_API_BASE_URL}/verify-resendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // CHANGED: Sending identifier in the body
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      setInfo("A new OTP has been sent.");
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };


  return (
    <>
      <section className="rohuserlogn_wrap">
        <div className="rohuserlogn_card">
          <h1 className="rohuserlogn_title">
            {otpStep ? "Verify OTP" : "Log in to your account"}
          </h1>
          <p className="rohuserlogn_subtitle text-center">
            {otpStep ? "Enter the 6-digit OTP sent to you" : "Welcome back — let’s get you signed in."}
          </p>

          {/* <div className="languageSwitcher">
            <label htmlFor="language" className="languageLabel">
              Language
            </label>

            <select
              id="language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem("preferredLanguage", e.target.value);
              }}
              className="languageSelect"
            >
              {Object.entries(LANGUAGE_MESSAGES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div> */}

          {!otpStep && (
            <div className="rohuserlogn_info text-center">
              {`If this is your first time here, please`}{" "}
              {/* <a href="/register" className="rohuserlogn_link fw-semibold"> */}
              <a href={registerUrl} className="rohuserlogn_link fw-semibold">
                {`Register`}
              </a>{" "}
              {`to continue.`}

              {/* State-wise language message */}
              {/* {language !== "en" && (
                <div className="mt-2 rohuserlogn_regionText">
                  {LANGUAGE_MESSAGES[language].textBefore}
                  <a href={registerUrl} className="rohuserlogn_link fw-semibold">
                    {LANGUAGE_MESSAGES[language].linkText}
                  </a>
                  {LANGUAGE_MESSAGES[language].textAfter}
                </div>
              )} */}

            </div>
          )}



          {error && <div className="rohuserlogn_alert">{error}</div>}
          {info && <div className="rohuserlogn_info">{info}</div>}

          {!otpStep ? (
            <form className="rohuserlogn_form" onSubmit={onSubmit} noValidate>
              <div className="rohuserlogn_field">
                <label htmlFor="identifier" className="rohuserlogn_label">Email Or Phone Number</label>
                {/* CHANGED: type="text" allows phone numbers. name="identifier" matches state. */}
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="you@example.com or +91-1234567890"
                  className="rohuserlogn_input"
                  value={form.identifier}
                  onChange={onChange}
                />
              </div>

              <div className="rohuserlogn_field">
                  <label htmlFor="password" className="rohuserlogn_label">Password</label>
                  <div className="rohuserlogn_passwordWrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="At least 8 characters"
                      className="rohuserlogn_input"
                      value={form.password}
                      onChange={onChange}
                    />
                    <button
                      type="button"
                      className="rohuserlogn_eyeBtn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </button>
                  </div>
                </div>


              <button type="submit" className="rohuserlogn_btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="rohuserlogn_fpRow">
                <a href="/forgot-password" className="rohuserlogn_fplink">
                  Forgot your password?
                </a>
              </div>

              <p className="rohuserlogn_footer mb-0">
                Don’t have an account?{" "}
                {/* <a href="/register" className="rohuserlogn_link">Create one</a> */}
                <a href={registerUrl} className="rohuserlogn_link">Create one</a>
              </p>
            </form>
          ) : (
            <form onSubmit={onOtpSubmit} className="rohuserlogn_form">
              <div className="rohuserlogn_field">
                <label className="rohuserlogn_label">Enter OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="rohuserlogn_input"
                  placeholder="6-digit OTP"
                />
              </div>

              <button type="submit" className="rohuserlogn_btn">Verify OTP</button>

              <div className="rohuserlogn_resendRow">
                <button
                  type="button"
                  className="rohuserlogn_linkbtn"
                  onClick={onResendOtp}
                  disabled={resendLoading || cooldown > 0}
                  aria-disabled={resendLoading || cooldown > 0}
                >
                  {resendLoading
                    ? "Sending..."
                    : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}