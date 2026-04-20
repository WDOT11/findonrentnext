"use client";
import styles from "./become.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LuMinus, LuPlus, LuBookmark, LuBuilding2, LuMapPin, LuPackageCheck} from "react-icons/lu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function BecomeAHostPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [itemErrors, setItemErrors] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vendorData, setVendorData] = useState({
    service_provider_id: "",
    businessName: "",
    contactPerson: "",
    PhoneNumber: "",
    gstNumber: "",
    address: {
      streetAddress: "",
      landmark: "",
      city: "",
      state: "",
      pinCode: "",
    },
    categories: [],
    subCategories: [],
    add_id: "",
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Fleet Table Start
  const [fleet, setFleet] = useState([
    // { id: 1, category: "Bikes", qty: 0 },
    // { id: 2, category: "Cars", qty: 0 },
    // { id: 3, category: "Commercial Vehicles", qty: 0 },
    // { id: 4, category: "Scooters", qty: 0 },
    // { id: 5, category: "Recreational Vehicles", qty: 0 },
  ]);

  const increase = (id) => {
    setFleet((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrease = (id) => {
    setFleet((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };
  const totalFleet = fleet.reduce((sum, item) => sum + item.qty, 0);
  // Fleet Table END

  useEffect(() => {
    setMounted(true);
    const authUserData = getCookie("authUser");
    let parsedAuthUserData = null;

    try {
      parsedAuthUserData = authUserData ? JSON.parse(authUserData) : null;
    } catch (e) {
      console.error("Invalid cookie JSON:", e);
    }

    if (parsedAuthUserData?.id) {
      const userId = parsedAuthUserData.id;

      setVendorData((prev) => ({
        ...prev,
        add_id: userId,
      }));

      const fetchUserData = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/userdetails`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
          });

          if (!res.ok) throw new Error("Failed to fetch user data");
          const freshUserData = await res.json();
          setAuthUser(freshUserData);

          const firstName = freshUserData?.first_name || "";
          const lastName = freshUserData?.last_name || "";
          const safeFullName = `${firstName} ${lastName}`;
          const safePhone = freshUserData?.phone_number || freshUserData?.phoneNumber || "";

          setVendorData((prev) => ({
            ...prev,
            service_provider_id: freshUserData?.user_id || "",
            contactPerson: safeFullName,
            PhoneNumber: safePhone,
          }));
        } catch (err) {
          console.error("Error fetching user from API:", err);
        }
      };
      fetchUserData();
    } else {
      console.warn("No user data found in cookies");
    }
  }, []);

  useEffect(() => {
    let abort = new AbortController();
    (async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch(`${API_BASE_URL}/getallactivecategory`, {signal: abort.signal});
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Error fetching categories:", err);
          setCategories([]);
        }
      } finally {
        setLoadingCategories(false);
      }
    })();
    return () => abort.abort();
  }, []);

  useEffect(() => {
    if (!loadingCategories && categories.length === 1) {
      const singleCategoryId = categories[0].id;
      setVendorData((prev) => ({
        ...prev,
        categories: [singleCategoryId],
      }));
      handleCategorySelect([singleCategoryId]);
    }
  }, [loadingCategories, categories]);

  /* ------------------------------------------------
    FETCH STATES
  ------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/getallactivestates`);
        const json = await res.json();
        setStates(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* ------------------------------------------------
    FETCH CITIES BY STATE
  ------------------------------------------------ */
  const fetchCities = async (stateId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/getcitiesbystate/${stateId}`);
      const json = await res.json();
      setCities(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      setCities([]);
    }
  };

  /* ------------------------------------------------
    HANDLERS
  ------------------------------------------------ */
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    const selectedState = states.find((s) => String(s.state_id) === String(stateId));

    setVendorData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state_id: stateId,
        state: selectedState?.state_name || "", // We save the name for review step
        state_slug: selectedState?.state_slug || "",
        city_id: "",
        city: "",
        city_slug: "",
      },
    }));

    if (stateId) {
      fetchCities(stateId);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const selectedCity = cities.find((c) => String(c.city_id) === String(cityId));

    setVendorData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city_id: cityId,
        city: selectedCity?.city_name || "", // We save the name for review step
        city_slug: selectedCity?.city_slug || "",
      },
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const { businessName, contactPerson, PhoneNumber } = vendorData;
      let newErrors = {};

      if (!businessName) newErrors.businessName = "Please enter Business Name";
      if (!contactPerson) newErrors.contactPerson = "Please enter Owner/Contact Person Name";
      if (!PhoneNumber) newErrors.PhoneNumber = "Please enter Contact Number";
      if (PhoneNumber && PhoneNumber.length !== 10) newErrors.PhoneNumber = "Please enter a valid 10-digit number";

      if (Object.keys(newErrors).length > 0) {
        setItemErrors(newErrors);
        return;
      }

      setItemErrors({});
      goToStep(currentStep + 1);
    }

    if (currentStep === 2) {
      const { address } = vendorData;
      const { streetAddress, city, state, pinCode } = address;
      let newErrors = {};

      if (!streetAddress) newErrors.streetAddress = "Please enter the Street Address";
      if (!city) newErrors.city = "Please enter the City";
      if (!state) newErrors.state = "Please select the State";
      if (!pinCode) newErrors.pinCode = "Please enter the Pincode";
      else if (pinCode.length !== 6) newErrors.pinCode = "Please enter a valid 6-digit Pincode";

      if (Object.keys(newErrors).length > 0) {
        setItemErrors(newErrors);
        return;
      }

      setItemErrors({});
      goToStep(currentStep + 1);
    }

    if (currentStep === 3) {
      const { categories, subCategories } = vendorData;
      let newErrors = {};

      if (!categories || categories.length === 0) newErrors.categories = "Please select at least one category.";
      if (!subCategories || subCategories.length === 0) newErrors.subCategories = "Please select at least one subcategory.";

      if (Object.keys(newErrors).length > 0) {
        setItemErrors(newErrors);
        return;
      }

      setItemErrors({});
      goToStep(currentStep + 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 4) setCurrentStep(step);
  };

  const handleCategorySelect = async (selectedCategoryIds) => {
    try {
      setVendorData((prev) => ({
        ...prev,
        categories: selectedCategoryIds,
        subCategories: [],
      }));

      const res = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_category_id: selectedCategoryIds }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSubCategories(data);

      setItemErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.categories;
        delete updatedErrors.subCategories;
        return updatedErrors;
      });
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    let fieldValue = type === "checkbox" ? (checked ? "1" : "0") : value;

    // ---- Add your limit logic here ----
    if (name === "PhoneNumber") {
      fieldValue = fieldValue.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "Pincode") {
      fieldValue = fieldValue.replace(/\D/g, "").slice(0, 6);
    }

    setVendorData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: fieldValue,
          },
        };
      }
      return { ...prev, [name]: fieldValue };
    });
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setVendorData((prev) => {
      const selected = prev.subCategories || [];

      // Check if already selected
      const isSelected = selected.includes(subCategoryId);
      const updatedSubCategories = isSelected ? selected.filter((id) => id !== subCategoryId) : [...selected, subCategoryId];
      return { ...prev, subCategories: updatedSubCategories };
    });

    // ---- Sync Fleet With Selected Subcategories ----
    setFleet((prevFleet) => {
      const isAlreadyInFleet = prevFleet.some((f) => f.subId === subCategoryId);

      // If user is selecting -> add fleet row
      if (!isAlreadyInFleet) {
        const sub = subCategories.find((s) => s.id === subCategoryId);
        if (!sub) return prevFleet;

        return [
          ...prevFleet,
          {
            id: Date.now(),
            subId: sub.id,
            category: sub.name,
            qty: 0,
          },
        ];
      }

      // If user deselects -> remove fleet row
      return prevFleet.filter((f) => f.subId !== subCategoryId);
    });
  };

  const handleSubmit = async (actionType = "skip") => {

    if (loading) return;

    try {

      setLoading(true);

      const {
        businessName,
        contactPerson,
        address,
        categories,
        subCategories,
      } = vendorData;
      let newErrors = {};

      if (!businessName) newErrors.businessName = "Please enter Business Name";
      if (!contactPerson) newErrors.contactPerson = "Please enter Contact Person Name";
      if (!address.streetAddress) newErrors.streetAddress = "Please enter the Street Address";
      if (!address.city) newErrors.city = "Please enter the City";
      if (!address.state) newErrors.state = "Please select the State";
      if (!address.pinCode || address.pinCode.length !== 6) newErrors.pinCode = "Please enter a valid 6-digit Pincode";
      if (!categories?.length) newErrors.categories = "Please select at least one category.";
      if (!subCategories?.length) newErrors.subCategories = "Please select at least one subcategory.";

      if (Object.keys(newErrors).length > 0) {
        setItemErrors(newErrors);
        return;
      }

      // Fleet data per selected subcategory
      const selectedFleetData = fleet.filter((item) => vendorData.subCategories.includes(item.subId))
        .map((item) => ({
          sub_category_id: item.subId,
          fleet_size: item.qty,
        }));

      // Existing category mapping
      const mappedCategories = vendorData.categories.map((catId) => ({
        category_id: catId,
        sub_categories: vendorData.subCategories,
      }));


      // const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      // await delay(5000);

      const payload = {
        service_provider_id: vendorData.service_provider_id,
        businessName: vendorData.businessName,
        contactPerson: vendorData.contactPerson,
        PhoneNumber: vendorData.PhoneNumber,
        gstNumber: vendorData.gstNumber,
        address: vendorData.address,
        category_mapping: mappedCategories,
        fleet_mapping: selectedFleetData,
        add_id: vendorData.add_id,
      };

      const response = await fetch(`${API_BASE_URL}/becomehost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Somthing went wrong, Please try again later.");

      alert("Vendor Created Successfully!");

      const authUserData = getCookie("authUser");
      if (authUserData) {
        try {
          const parsed = JSON.parse(authUserData);
          if (parsed.is_service_provider === 0) {
            parsed.is_service_provider = 1;
            setCookie("authUser", JSON.stringify(parsed), 7);
          }
        } catch (err) {
          console.error("Error updating cookie:", err);
        }
      }

      if (actionType === "skip") router.push("/dashboard");
      else router.push("/add-item");
    } catch (error) {
      console.error("Submission Failed:", error);
      alert(error.message || "Error submitting vendor data");
    }
    finally {
      setLoading(false);
    }
  };

  const setCookie = (name, value, days = 7) => {
    if (typeof document === "undefined") return;
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  };

  return (
    <>
      <head>
        <title>Become a Host</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Book Reliable Rentals From Locals - Fast, Easy"/>
      </head>

      <div className="p-6">
        <div className={styles.form_section_main}>
          <div id="header"></div>
          <section className={`${styles.form_section_main}`}>
            <div className={styles.container}>
              <div className={styles.row}>
                <div className={`w-100 ${styles.col12}`}>
                  <div className={`${styles.border} ${styles.roh_rowwhite}`}>
                    <div className={`${styles.px4} ${styles.pxmd5}`}>
                      <div>
                        <h2 className={`${styles.mb3} ${styles.textCenter} ${styles.roh_onboardin_heading} fw-bold`}>
                          List Your Business. Get More Rentals.
                        </h2>
                        <div className={`${styles.titleSepertor} mb-5`}></div>

                        {/* Loader while setting up the steps */}
                        {loadingCategories && (
                          <div className={styles.loaderWrap}>
                            <div className={styles.spinner}></div>
                            <p className={styles.loaderText}> Loading your listing setup… </p>
                          </div>
                        )}

                        <h4 className={`my-4 step_btn_fr mb-2 text-muted ${styles.main_steps}`}> Step {currentStep}: Tell Us About Your Business </h4>

                        <div className={`${styles.progress} ${styles.mb4}`}>
                          <div className={styles.progressBar} role="progressbar" style={{ width: `${(currentStep / 4) * 100}%` }}>
                            Step {currentStep} of 4
                          </div>
                        </div>

                        {/* Step 1 */}
                        {currentStep === 1 && (
                          <div id="step1" className="step">
                            <form id="providerForm">
                              <div className={`${styles.row} ${styles.roh_fields}`}>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>
                                    Business Name <span style={{color: "red"}}>*</span>
                                  </label>
                                  <input type="text" name="businessName" className={`${styles.formControl} ${styles.reFormF}`} value={vendorData.businessName} onChange={handleChange} required/>
                                  <small className={`${styles.formText} ${styles.textMuted}`}>
                                    Enter the name as it appears on official documents.
                                  </small>
                                  {itemErrors.businessName && (
                                    <div style={{color: "red", marginTop: "4px", fontSize: "14px"}}>
                                      {itemErrors.businessName}
                                    </div>
                                  )}
                                </div>

                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>
                                    Owner/Contact Person
                                  </label>
                                  <input type="text" name="contactPerson" className={`${styles.formControl} ${styles.reFormF}`}
                                    value={
                                      vendorData.contactPerson ||
                                      (authUser
                                        ? `${authUser.first_name || ""} ${
                                            authUser.last_name || ""
                                          }`
                                        : "")
                                    }
                                    onChange={handleChange}
                                  />
                                  <small className={`${styles.formText} ${styles.textMuted}`}>
                                    Who should we get in touch with?
                                  </small>
                                  {itemErrors.contactPerson && (
                                    <div style={{color: "red", marginTop: "4px", fontSize: "14px"}}>
                                      {itemErrors.contactPerson}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className={`${styles.row} ${styles.roh_fields}`}>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>
                                    Contact Number
                                  </label>
                                  <input type="tel" name="PhoneNumber" className={`${styles.formControl} ${styles.reFormF}`} placeholder="+91-" value={vendorData.PhoneNumber ?? ""} onChange={handleChange}/>
                                  <small className={`${styles.formText} ${styles.textMuted}`}>
                                    Number for customer communication.
                                  </small>
                                  {itemErrors.PhoneNumber && (
                                    <div style={{color: "red", marginTop: "4px", fontSize: "14px"}}>
                                      {itemErrors.PhoneNumber}
                                    </div>
                                  )}
                                </div>

                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>
                                    GST Number (if applicable)
                                  </label>
                                  <input type="text" name="gstNumber" className={`${styles.formControl} ${styles.reFormF}`} value={vendorData.gstNumber} onChange={handleChange}/>
                                  <small className={`${styles.formText} ${styles.textMuted}`}>
                                    Leave blank if you're not GST registered.
                                  </small>
                                </div>
                              </div>

                              <div className={`${styles.footerSepertor} mt-3 ${styles.mb4}`}></div>
                              <div className="text-end">
                                <button type="button" className={`${styles.btn} btn-primary ${styles.nextStep}`} onClick={handleNextStep}>
                                  Next
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Step 2: Address Details */}
                        {currentStep === 2 && (
                          <div id="step2" className="step">
                            <div className={`${styles.row} ${styles.roh_fields}`}>
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>Street Address</label>
                                <input type="text" className={`${styles.formControl} ${styles.reFormF}`} name="address.streetAddress" value={vendorData.address.streetAddress} onChange={handleChange} required />
                                <small className={`${styles.formText} ${styles.textMuted}`}>Your building number, shop name, or street name.</small>
                                {itemErrors.streetAddress && <div style={{ color: "red", marginTop: "4px", fontSize: "14px"}}>{itemErrors.streetAddress}</div>}
                              </div>

                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}> Landmark </label>
                                <input type="text" className={`${styles.formControl} ${styles.reFormF}`} name="address.landmark" value={vendorData.address.landmark} onChange={handleChange}/>
                              </div>
                            </div>

                            <div className={`${styles.row} ${styles.roh_fields}`}>
                              {/* STATE SELECT */}
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}> State </label>
                                <select
                                  name="address.state"
                                  required
                                  className={`${styles.formControl} ${styles.reFormF}`}
                                  value={vendorData.address.state_id || ""}
                                  onChange={handleStateChange}
                                >
                                  <option value="">Select State</option>
                                  {states.map((s) => (
                                    <option key={s.state_id} value={s.state_id}>
                                      {s.state_name}
                                    </option>
                                  ))}
                                </select>
                                {itemErrors.state && <div style={{ color: "red", marginTop: "4px", fontSize: "14px"}}>{itemErrors.state}</div>}
                              </div>

                              {/* CITY SELECT */}
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>City</label>
                                <select
                                  name="address.city"
                                  required
                                  className={`${styles.formControl} ${styles.reFormF}`}
                                  value={vendorData.address.city_id || ""}
                                  onChange={handleCityChange}
                                  disabled={!vendorData.address.state_id}
                                >
                                  <option value="">Select City</option>
                                  {cities.map((c) => (
                                    <option key={c.city_id} value={c.city_id}>
                                      {c.city_name}
                                    </option>
                                  ))}
                                </select>
                                {itemErrors.city && <div style={{color: "red", marginTop: "4px", fontSize: "14px"}}> {itemErrors.city} </div>}
                              </div>
                            </div>

                            <div className={`${styles.row} ${styles.roh_fields}`} >
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`} >
                                <label className={styles.formLabel}> Pin Code </label>
                                <input type="text" name="address.pinCode" className={`${styles.formControl} ${styles.reFormF}`} value={vendorData.address.pinCode} maxLength={6} onChange={handleChange} required />
                                {itemErrors.pinCode && <div style={{ color: "red", marginTop: "4px", fontSize: "14px"}}> {itemErrors.pinCode} </div>}
                              </div>
                            </div>

                            <div className={`${styles.footerSepertor} mt-3 ${styles.mb4}`}></div>
                            <div className={`${styles.dFlex} justify-content-between ${styles.gap2}`}>
                              <button type="button" className={`${styles.btn} ${styles.prevStep}`} onClick={() => goToStep(1)}>Back</button>
                              <button type="button" className={`${styles.btn} ${styles.nextStep}`} onClick={handleNextStep}>Next Step</button>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Categories & Subcategories */}
                        {currentStep === 3 && (
                          <div id="step3" className="step">
                            {/* Loader / Empty State */}
                            {loadingCategories ? (
                              <p className="text-muted">Loading categories…</p>
                            ) : categories.length === 0 ? (
                              <p className="text-muted">No categories found.</p>
                            ) : (
                              <>
                                <div className={`${styles.card} ${styles.mb4} ${styles.repeaterItem} p-3 bgTransparent positionRelative`}>
                                  <div>
                                    <h4 className={styles.mb3}> {" "}Select Categories{" "} </h4>
                                    <small> {" "}Choose one or multiple categories{" "}</small>
                                  </div>

                                  {/* CATEGORY SELECTION */}
                                  {categories.length > 1 && (
                                    <div className="mb-3">
                                      <label className={styles.formLabel}> Select Category </label>
                                      <small> {" "}(Choose one or multiple categories){" "}</small>

                                      <div className={`${styles.dFlex} flex-wrap ${styles.gap2} ${styles.categoryWrap}`}>
                                        {categories.map((cat) => (
                                          <div key={cat.id}>
                                            <input type="checkbox" className={styles.btnCheck} id={`cat_${cat.id}`} value={cat.id} checked={vendorData.categories.includes(
                                                cat.id
                                              )}
                                              onChange={() =>
                                                handleCategorySelect(
                                                  vendorData.categories.includes(
                                                    cat.id
                                                  )
                                                    ? vendorData.categories.filter(
                                                        (c) => c !== cat.id
                                                      )
                                                    : [
                                                        ...vendorData.categories,
                                                        cat.id,
                                                      ]
                                                )
                                              }
                                            />
                                            <label htmlFor={`cat_${cat.id}`} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-2 px-3 text-start`}>
                                              <span>{cat.name}</span>
                                            </label>
                                          </div>
                                        ))}
                                      </div>

                                      {itemErrors.categories && (
                                        <small style={{color: "red", marginTop: "4px", fontSize: "14px", display: "block",}}>
                                          {itemErrors.categories}
                                        </small>
                                      )}
                                    </div>
                                  )}

                                  {/* SUBCATEGORY SELECTION */}
                                  <div className="sub-categories mb-2">
                                    {subCategories && subCategories.length > 0 ? (
                                      <>
                                        {/* <label className={styles.formLabel}>
                                          Select Subcategories
                                        </label> */}
                                        {/* <small>
                                          {" "}
                                          (Choose one or multiple categories){" "}
                                        </small> */}
                                        <div className={`${styles.dFlex} flex-wrap ${styles.gap2} ${styles.subCategoryWrap}`} >
                                          {subCategories.map((sub) => (
                                            <div key={sub.id}>
                                              <input type="checkbox" className={styles.btnCheck} id={`sub_${sub.id}`} value={sub.id}
                                                checked={vendorData.subCategories.includes(sub.id)} onChange={() => handleSubCategoryChange(sub.id)}/>
                                              <label htmlFor={`sub_${sub.id}`} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-2 px-3 text-start`}>
                                                <span>{sub.name}</span>
                                              </label>
                                            </div>
                                          ))}
                                        </div>

                                        {itemErrors.subCategories && (
                                          <small style={{color: "red", marginTop: "4px", fontSize: "14px", display: "block"}}>
                                            {itemErrors.subCategories}
                                          </small>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-muted mt-2">
                                        Subcategories will appear after selecting a category.
                                      </p>
                                    )}
                                  </div>

                                  {/* Fleet Table Start  */}
                                  {vendorData.subCategories.length > 0 && (
                                    <div className={styles.roh_fleet_table_wrapper}>
                                      <h5 className={styles.formLabel}> Fleet Size </h5>
                                      <div className={styles.roh_fleet_table}>
                                        <table className="table">
                                          <thead className="table-light" style={{ borderTop: "transparent" }}>
                                            <tr>
                                              <th>Sr. No</th>
                                              <th>Category Name</th>
                                              <th style={{ textAlign: "end" }}> Fleet Size </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {fleet.filter((item) => vendorData.subCategories.includes(item.subId))
                                              .map((item, index) => (
                                                <tr key={item.id}>
                                                  <td>{index + 1}</td>
                                                  <td className="fw-medium"> {item.category} </td>
                                                  <td>
                                                    <div className="input-group">
                                                      <button className="btn btn-outline-secondary" onClick={() => decrease(item.id)}>
                                                        <LuMinus size={24} />
                                                      </button>
                                                      <input type="text" className="form-control text-center" value={item.qty} readOnly/>
                                                      <button className="btn btn-outline-secondary" onClick={() => increase(item.id)}>
                                                        <LuPlus size={24} />
                                                      </button>
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}

                                            {/* TOTAL ROW (only if at least one fleet row exists) */}
                                            {fleet.filter((it) => vendorData.subCategories.includes(it.subId)
                                            ).length > 0 && (
                                              <tr className="table-light">
                                                <td colSpan="2" className="fw-semibold">
                                                  Total
                                                </td>
                                                <td className="text-end fw-bold" style={{color: "#ff3600", fontSize: "20px"}}>
                                                  {totalFleet}
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {/* Fleet Table END  */}
                                </div>

                                {/* FOOTER BUTTONS */}
                                <div className={`${styles.dFlex} justify-content-between ${styles.gap2}`}>
                                  <button type="button" className={`${styles.btn} ${styles.prevStep}`} onClick={() => goToStep(2)}>
                                    Back
                                  </button>

                                  <button type="button" className={`${styles.btn} ${styles.nextStep}`} onClick={handleNextStep}>
                                    Next Step
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Step 4: Review & Confirm */}
                        {currentStep === 4 && (
                          <div id="step4" className="step">
                            <div className={`${styles.card} ${styles.mb4} ${styles.repeaterItem} ${styles.roh_summery_wrapper} p-3 bgTransparent positionRelative`}>
                              <div className={styles.roh_review_heading_content}>
                                <h4 className={styles.mb3}> Review Your Details </h4>
                                <p> Please verify all the details before submitting your listing. </p>
                              </div>

                              {/* Step 1: Vendor Info */}
                              <div className={`${styles.roh_info_reviewSection}`}>
                                <div className={`${styles.roh_reviewSection}`}>
                                  <div className={styles.roh_reviewSection_header}>
                                    <div className="d-flex gap-2 align-items-center">
                                      <span className="d-flex justify-content-center align-items-center align-middle" style={{padding: "8px", color: "#ff5724", background: "#ff57241a", borderRadius: "8px"}}>
                                        <LuBuilding2 size={20} />
                                      </span>

                                      <h5 className="fw-bold mb-0">
                                        Business Details
                                      </h5>
                                    </div>
                                  </div>
                                  <div className={styles.roh_reviewSection_innercontent}>
                                    <ul className={styles.reviewList}>
                                      <li>
                                        <strong>Business Name:</strong>{" "}{vendorData.businessName || "-"}
                                      </li>
                                      <li>
                                        <strong>Contact Person:</strong>{" "}{vendorData.contactPerson || "-"}
                                      </li>
                                      <li>
                                        <strong>Phone:</strong>{" "}{vendorData.PhoneNumber || "-"}
                                      </li>
                                      <li>
                                        <strong>GST Number:</strong>{" "}{vendorData.gstNumber || "N/A"}
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {/* Step 2: Address */}
                                <div className={`${styles.roh_reviewaddressSection}`} >
                                  <div className={ styles.roh_reviewaddressSection_header }>
                                    <div className="d-flex gap-2 align-items-center">
                                      <span className="d-flex justify-content-center align-items-center align-middle" style={{padding: "8px", color: "#3b82f6", background: "#2463eb1a", borderRadius: "8px"}}>
                                        <LuMapPin size={20}/>
                                      </span>
                                      <h5 className="fw-bold mb-0">Address</h5>
                                    </div>
                                  </div>

                                  <div className={styles.roh_reviewaddressSection_innercontent}>
                                    <ul className={styles.reviewList}>
                                      <li>
                                        <strong>Street:</strong>{" "}{vendorData.address.streetAddress || "-"}
                                      </li>
                                      <li>
                                        <strong>Landmark:</strong>{" "}{vendorData.address.landmark || "-"}
                                      </li>
                                      <li>
                                        <strong>City:</strong>{" "}{vendorData.address.city || "-"}
                                      </li>
                                      <li>
                                        <strong>State:</strong>{" "}{vendorData.address.state || "-"}
                                      </li>
                                      <li>
                                        <strong>Pin Code:</strong>{" "}{vendorData.address.pinCode || "-"}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Step 3: Subcategories (Main Category Hidden) */}
                              <div className={styles.roh_reviewslectedservicesSection}>
                                <div className={styles.roh_reviewslectedservicesSection_header}>
                                  <div className="d-flex gap-2 align-items-center">
                                      <span className="d-flex justify-content-center align-items-center align-middle" style={{padding: "8px", color: "#21c45d", background: "#21c45d1a", borderRadius: "8px"}}>
                                        <LuPackageCheck  size={20} />
                                      </span>

                                      <h5 className="fw-bold mb-0"> Your Selected Services </h5>
                                    </div>
                                </div>
                                 <div className={styles.roh_reviewslectedservicesSection_innercontent}>

                                {vendorData.subCategories.length > 0 ? (
                                  <ul className={styles.reviewList}>
                                    {subCategories
                                      .filter((sub) => vendorData.subCategories.includes(sub.id))
                                      .map((sub) => {const fleetItem = fleet.find((f) => f.subId === sub.id);

                                        return (
                                          <li key={sub.id}>
                                            {sub.name}:
                                            {fleetItem && (
                                              <span style={{color: "#000", fontWeight: "600", marginLeft: "8px" }}>
                                                 Fleet Size: {fleetItem.qty}
                                              </span>
                                            )}
                                          </li>
                                        );
                                      })}
                                  </ul>
                                ) : (
                                  <p className="text-muted"> No subcategories selected. </p>
                                )}
                                </div>
                              </div>

                              {/* Footer Buttons */}
                              <div className={`${styles.footerSepertor} mt-3 ${styles.mb4}`}></div>
                              <div className={`${styles.roh_reviewaddressfooter} justify-content-between ${styles.gap3} flex-wrap`}>
                                {/* Back Button */}
                                <button type="button" className={`${styles.btn} ${styles.prevStep}`} onClick={() => goToStep(3)}>
                                  Back
                                </button>

                                {/* <div className={`${styles.roh_reviewaddressfooter} flex-wrap justify-content-end`}>
                                  <button type="button" className={`${styles.btn} ${styles.btnOutlinePrimary}`} onClick={() => handleSubmit("skip")}> {" "}<LuBookmark /> Save & Add Item Later{" "}
                                  </button>

                                  <button type="button" className={`${styles.btn} ${styles.nextStep}`} onClick={() => handleSubmit("add_now")}>
                                    <LuPlus /> Add Your Item Now
                                  </button>
                                </div> */}
                                <div className={`${styles.roh_reviewaddressfooter} flex-wrap justify-content-end`}>

                                  {loading ? (
                                    <button className={`${styles.btn} ${styles.nextStep}`} disabled> Processing... </button>
                                  ) : (
                                    <>
                                      {/* Save & Skip Button */}
                                      <button type="button" className={`${styles.btn} ${styles.btnOutlinePrimary}`} onClick={() => handleSubmit("skip")}>
                                        <LuBookmark /> Save & Add Item Later
                                      </button>

                                      {/* Save & Add Items Now Button */}
                                      <button type="button" className={`${styles.btn} ${styles.nextStep}`} onClick={() => handleSubmit("add_now")}>
                                        <LuPlus /> Add Your Item Now
                                      </button>
                                    </>
                                  )}

                                </div>

                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div id="footer"></div>
        </div>
      </div>
    </>
  );
}