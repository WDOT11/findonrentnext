"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./css/languagepopup.css";
import { LuGlobe, LuSearch, LuArrowLeft, LuCircleCheckBig, LuShieldCheck, LuArrowRight } from "react-icons/lu";

const stateLanguageMap = {
  "Andhra Pradesh": "Telugu", "Arunachal Pradesh": "English", "Assam": "Assamese",
  "Bihar": "Hindi", "Chhattisgarh": "Hindi", "Goa": "Konkani", "Gujarat": "Gujarati",
  "Haryana": "Hindi", "Himachal Pradesh": "Hindi", "Jharkhand": "Hindi",
  "Karnataka": "Kannada", "Kerala": "Malayalam", "Madhya Pradesh": "Hindi",
  "Maharashtra": "Marathi", "Manipur": "Manipuri", "Meghalaya": "English",
  "Mizoram": "Mizo", "Nagaland": "English", "Odisha": "Odia", "Punjab": "Punjabi",
  "Rajasthan": "Hindi", "Sikkim": "Nepali", "Tamil Nadu": "Tamil",
  "Telangana": "Telugu", "Tripura": "Bengali", "Uttar Pradesh": "Hindi",
  "Uttarakhand": "Hindi", "West Bengal": "Bengali", "Andaman and Nicobar Islands": "Hindi",
  "Chandigarh": "Punjabi", "Dadra and Nagar Haveli and Daman and Diu": "Gujarati",
  "Delhi": "Hindi", "Jammu and Kashmir": "Kashmiri", "Ladakh": "Ladakhi",
  "Lakshadweep": "Malayalam", "Puducherry": "Tamil"
};

const indianLanguages = [
  "Marathi", "Hindi", "Tamil", "Telugu", "Bengali", "Kannada", "Malayalam",
  "Gujarati", "Punjabi", "Odia", "Assamese", "Bodo", "Dogri", "Kashmiri",
  "Konkani", "Maithili", "Manipuri", "Nepali", "Sanskrit", "Santali",
  "Sindhi", "Urdu"
];

const allLanguagesList = ["English", ...indianLanguages];

const googleLangCodes = {
  "English": "en", "Assamese": "as", "Bengali": "bn", "Bodo": "brx", "Dogri": "doi",
  "Gujarati": "gu", "Hindi": "hi", "Kannada": "kn", "Kashmiri": "ks", "Konkani": "gom",
  "Maithili": "mai", "Malayalam": "ml", "Manipuri": "mni-Mtei", "Marathi": "mr",
  "Nepali": "ne", "Odia": "or", "Punjabi": "pa", "Sanskrit": "sa", "Santali": "sat",
  "Sindhi": "sd", "Tamil": "ta", "Telugu": "te", "Urdu": "ur"
};

const langDisplayData = {
  "English": { char: "A", native: "English", brackets: "", pill: "Find vehicles on rent" },
  "Hindi": { char: "अ", native: "हिंदी", brackets: "(Hindi)", pill: "किराए पर वाहन खोजें" },
  "Marathi": { char: "म", native: "मराठी", brackets: "(Marathi)", pill: "भाड्याने वाहने शोधा" },
  "Telugu": { char: "అ", native: "తెలుగు", brackets: "(Telugu)", pill: "అద్దెకు వాహనాలను కనుగొనండి" },
  "Tamil": { char: "அ", native: "தமிழ்", brackets: "(Tamil)", pill: "வாடகைக்கு வாகனங்களைக் கண்டறியவும்" },
  "Kannada": { char: "ಅ", native: "ಕನ್ನಡ", brackets: "(Kannada)", pill: "ಬಾಡಿಗೆಗೆ ವಾಹನಗಳನ್ನು ಹುಡುಕಿ" },
  "Malayalam": { char: "അ", native: "മലയാളം", brackets: "(Malayalam)", pill: "വാടകയ്ക്ക് വാഹനങ്ങൾ" },
  "Gujarati": { char: "અ", native: "ગુજરાતી", brackets: "(Gujarati)", pill: "ભાડે વાહનો શોધો" },
  "Bengali": { char: "অ", native: "বাংলা", brackets: "(Bengali)", pill: "ভাড়ার জন্য গাড়ি খুঁজুন" },
  "Punjabi": { char: "ਪ", native: "ਪੰਜਾਬੀ", brackets: "(Punjabi)", pill: "ਕਿਰਾਏ 'ਤੇ ਵਾਹਨ" },
  "Odia": { char: "ଅ", native: "ଓଡ଼ିଆ", brackets: "(Odia)", pill: "ଭଡାରେ ଯାନବାହନ" },
  "Assamese": { char: "অ", native: "অসমীয়া", brackets: "(Assamese)", pill: "ভাড়াত বাহন বিচাৰক" }
};

export default function LanguagePopUp() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [regionalLang, setRegionalLang] = useState("Marathi");
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic to show popup based on cookies
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const hasLangCookie = cookies.find((row) => row.startsWith("roh_pop_lang_pop="));

    if (!hasLangCookie) {
      const locationCookieRow = cookies.find((row) => row.startsWith("user_location="));
      if (locationCookieRow) {
        try {
          const locData = JSON.parse(decodeURIComponent(locationCookieRow.split("=")[1]));
          if (locData && locData.region) {
            const lang = stateLanguageMap[locData.region];
            if (lang && lang !== "English") {
              setRegionalLang(lang);
            }
          }
        } catch (e) {
          console.error("Error parsing user_location cookie:", e);
        }
      }

      let isMounted = true;
      let interactionOccurred = false;

      const checkIpAndShow = async () => {
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          const blockedPrefixes = ["47.15.", "66.249."]; /** Google bots and custom blocked IPs */
          const isBlocked = blockedPrefixes.some(prefix => data.ip.startsWith(prefix));

          if (isMounted && !isBlocked) {
            /** Wait for 3 seconds after interaction before showing */
            setTimeout(() => { if (isMounted) setShow(true); }, 2500);
          }
        } catch (error) {
          if (isMounted) {
            setTimeout(() => { if (isMounted) setShow(true); }, 2500);
          }
        }
      };

      // Trigger only on user interaction or after a long idle period (5s)
      const onUserInteraction = () => {
        if (!interactionOccurred) {
          interactionOccurred = true;
          checkIpAndShow();
          cleanupListeners();
        }
      };

      const cleanupListeners = () => {
        window.removeEventListener("scroll", onUserInteraction);
        window.removeEventListener("click", onUserInteraction);
        window.removeEventListener("touchstart", onUserInteraction);
      };

      window.addEventListener("scroll", onUserInteraction, { passive: true });
      window.addEventListener("click", onUserInteraction);
      window.addEventListener("touchstart", onUserInteraction, { passive: true });

      // Fallback: If no interaction, show after 6 seconds anyway
      const fallbackTimer = setTimeout(onUserInteraction, 6000);

      return () => {
        isMounted = false;
        clearTimeout(fallbackTimer);
        cleanupListeners();
      };
    }
  }, []);

  // Logic to lock body scroll when popup is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to restore scroll if the component unmounts unexpectedly
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const setCookieAndClose = (val) => {
    const days = 180;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();

    document.cookie = `roh_pop_lang_pop=${val || "skipped"}; ${expires}; path=/`;

    if (val && val !== "skipped") {
      const gCode = googleLangCodes[val] || "en";
      document.cookie = `googtrans=/en/${gCode}; ${expires}; path=/`;
      const domain = window.location.hostname.replace("www.", "");
      document.cookie = `googtrans=/en/${gCode}; ${expires}; domain=.${domain}; path=/`;
    }

    setShow(false); // This triggers the useEffect to re-enable body scroll

    if (val && val !== "skipped" && val !== "English") {
      window.location.reload();
    } else if (val === "English") {
      document.cookie = `googtrans=/en/en; ${expires}; path=/`;
      window.location.reload();
    }
  };

  if (!show) return null;
  if (pathname && (pathname.startsWith("/auth/admin") || pathname.startsWith("/adminrohpnl"))) return null;

  const regionalData = langDisplayData[regionalLang] || {
    char: regionalLang.charAt(0),
    native: regionalLang,
    pill: "Find vehicles on rent"
  };

  const filteredLangs = allLanguagesList.filter(l =>
    l.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (langDisplayData[l] && langDisplayData[l].native.includes(searchQuery))
  );

  return (
    <div className="overlay" id="lang-popup-backdrop">
      <div className="roh_container" onClick={(e) => e.stopPropagation()}>

        {!showAllLangs ? (
          <>
            <div className="header">
              <h1>Get the best experience in your language 🌐</h1>
              <p className="subtitle">We've selected {regionalLang} based on your location.</p>
              <p className="trust-badge">
                <LuShieldCheck size={18} color="#FF5600" style={{ marginRight: '6px', verticalAlign: 'text-bottom', flexShrink: 0 }} />
                Used by thousands of users across India
              </p>
            </div>

            <div className="cards-wrapper">

              <div
                className={`lang-card ${selectedLang === "English" ? "selected" : ""}`}
                onClick={() => { setSelectedLang("English"); setCookieAndClose("English"); }}
              >
                <div className="card-top">
                  <div className="icon-circle icon-gray">A</div>
                  {selectedLang === "English" && (
                    <div className="check-icon">
                      <LuCircleCheckBig size={24} color="#FF5600" />
                    </div>
                  )}
                </div>
                <h3 className="lang-title">English</h3>
                <div className="pill">"Find vehicles on rent"</div>
                <p className="lang-desc">Default platform language</p>
              </div>

              <div
                className={`lang-card ${selectedLang === regionalLang ? "selected" : ""}`}
                onClick={() => { setSelectedLang(regionalLang); setCookieAndClose(regionalLang); }}
              >
                <div className="recommended-badge">RECOMMENDED</div>
                <div className="card-top">
                  <div className="icon-circle icon-orange">{regionalData.char}</div>
                  {selectedLang === regionalLang && (
                    <div className="check-icon">
                      <LuCircleCheckBig size={24} color="#FF5600" />
                    </div>
                  )}
                </div>
                <h3 className="lang-title">{regionalData.native}</h3>
                <div className="pill">"{regionalData.pill}"</div>
                <p className="lang-desc">Based on your location</p>
              </div>

              <div className="lang-card" onClick={() => setShowAllLangs(true)}>
                <div className="card-top">
                  <div className="icon-circle icon-gray">
                    <LuGlobe size={20} color="#4A5568" />

                  </div>
                </div>
                <h3 className="lang-title">Browse all languages</h3>
                <p className="lang-desc" style={{ marginTop: '12px' }}>Select from Hindi, Tamil, Telugu & more</p>
              </div>

            </div>

            <div className="footer">
              <button className="skip-btn" onClick={() => setCookieAndClose("skipped")}>
                Skip for now <LuArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="all-langs-modal">

            <div className="modal-header-row">
              <button className="back-arrow" onClick={() => setShowAllLangs(false)}>
                <LuArrowLeft size={20} color="#111827" />
              </button>
              <h2>Select your language</h2>
            </div>

            <div className="search-box">
              <LuSearch size={18} color="#94A3B8" className="search-icon" />
              <input
                type="text"
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="langs-list-container">
              {filteredLangs.map((lang) => {
                const isSelected = selectedLang === lang;
                const data = langDisplayData[lang] || {
                  native: lang,
                  brackets: `(${lang})`,
                  pill: "Find vehicles on rent"
                };

                return (
                  <div
                    key={lang}
                    className={`list-item ${isSelected ? "selected-item" : ""}`}
                    onClick={() => { setSelectedLang(lang); setCookieAndClose(lang); }}
                  >
                    <div className="list-item-content">
                      <div className="list-item-title">
                        {data.native} {data.brackets && <span className="bracket-text">{data.brackets}</span>}
                      </div>
                      <div className="list-item-pill">"{data.pill}"</div>
                    </div>
                    {isSelected && (
                      <div className="list-item-check">
                        <LuCircleCheckBig size={22} color="#FF5600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>


    </div>
  );
}