"use client";
import Script from "next/script";
import styles from "./become.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import VehicleDetailsForm from "./components/VehicleDetailsForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function BecomeAHostPage() {

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [shouldJumpToStep3, setShouldJumpToStep3] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [itemErrors, setItemErrors] = useState([]);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    /* Step 1 */
    service_provider_id: "",
    businessName: "",
    contactPerson: "",
    whatsappNumber: "",
    gstNumber: "",
    deliveryAvailable: "",

    /* Step 2 */
    streetAddress: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",

    /* Step 3 */
    items: [
      { category: "", subCategory: "", brand: "", model: "", tag: "", details: "" }
    ],

    /* Step 4 */
    TermsAndConditionsAgree: 0
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    setMounted(true);

    const authUserData = getCookie("authUser");
    const parsedAuthUserData = authUserData ? JSON.parse(authUserData) : null;

    if (parsedAuthUserData?.id) {
      const userId = parsedAuthUserData.id;

      // Fetch fresh user data from API using the ID
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

          // Set form data from API response
          setFormData((prev) => ({
            ...prev,
            service_provider_id: freshUserData.user_id,
            contactPerson: `${freshUserData.first_name} ${freshUserData.last_name}` || '',
            whatsappNumber: freshUserData.phone_number || '',
          }));

          // Step logic based on real-time status
          if (freshUserData.is_service_provider === 1) {
            setShouldJumpToStep3(true);
          } else {
            setShouldJumpToStep3(false);
          }
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
        const res = await fetch(`${API_BASE_URL}/getallactivecategory`, { signal: abort.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Error fetching categories:", err);
          setCategories([]); // fail-safe
        }
      } finally {
        setLoadingCategories(false);
      }
    })();
    return () => abort.abort();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (shouldJumpToStep3 && !loadingCategories) {
      setCurrentStep(3);
    }
  }, [mounted, shouldJumpToStep3, loadingCategories]);

  /** On click of the next button */
  const handleNextStep = () => {
    /* Step 1 validation */
    if (currentStep === 1) {

      const { businessName, contactPerson, whatsappNumber, deliveryAvailable } = formData;
      let newErrors = {};

      if (!businessName.trim()) {
        newErrors.businessName = "Please enter Business Name";
      }
      if (!contactPerson.trim()) {
        newErrors.contactPerson = "Please enter Owner/Contact Person Name";
      }
      if (!whatsappNumber.trim()) {
        newErrors.whatsappNumber = "Please enter Contact Number";
      }
      if (!deliveryAvailable) {
        newErrors.deliveryAvailable = "Please select Delivery Availability";
      }

      // agar errors hai to set kardo and return
      if (Object.keys(newErrors).length > 0) {
        setItemErrors(newErrors);
        return;
      }

      // errors clear kardo
      setItemErrors({});
      goToStep(currentStep + 1);
    }

    if (currentStep === 2) {
      const { streetAddress, city, state, pinCode } = formData;
      let newErrors = {};

      if (!streetAddress.trim()) {
        newErrors.streetAddress = "Please enter the Street address";
      }
      if (!city.trim()) {
        newErrors.city = "Please enter the City name";
      }
      if (!state.trim()) {
        newErrors.state = "Please select the State";
      }
      if (!pinCode) {
        newErrors.pinCode = "Please enter the Pincode";
      } else if (pinCode.length !== 6) {
        newErrors.pinCode = "Please enter a valid 6-digit Pincode";
      }

      if (Object.keys(newErrors).length > 0) {
        setItemErrors(newErrors);
        return;
      }

      setItemErrors({});
      goToStep(currentStep + 1);
    }

    if (currentStep === 3) {
      const { items } = formData;

      let errors = [];

      items.forEach((item, index) => {
        let error = {};

        if (!item.category) {
          error.category = "Please select a category.";
        }

        if (!item.subCategory) {
          error.subCategory = "Please select a subcategory.";
        }

        if (!item.brand) {
          error.brand = "Please select a brand.";
        }

        if (!item.model) {
          error.model = "Please select a model.";
        }

        // 👇 Example child form validations
        if (item.category === 1 && item.subCategory) {
          if (!item.details?.item_name?.trim()) {
            error.item_name = "Please enter item name.";
          }
          // if (!item.image_ids || item.image_ids.length == 0) {
          //   error.image_ids = "Please upload at least one image.";
          // }
          if (!item.details?.price_per_day) {
            error.price_per_day = "Please enter price per day.";
          }
          if (!item.details?.availability_status) {
            error.availability_status = "Please select availability.";
          }
          if (!item.details?.registration_number) {
            error.registration_number = "Please enter the registration number.";
          }
          // if (!item.details?.vehicle_type) {
          //   error.vehicle_type = "Please select the vehicle type.";
          // }
          // if (!item.details?.address_1) {
          //   error.address_1 = "Please enter the street address.";
          // }
          // if (!item.details?.item_state) {
          //   error.item_state = "Please enter the status.";
          // }
          // if (!item.details?.city) {
          //   error.city = "Please enter the city.";
          // }
          // if (!item.details?.pincode) {
          //   error.pincode = "Please enter the pincode.";
          // } else if(item.details?.pincode.length !== 6){
          //   error.pincode = "Please enter a valid 6-digit Pincode.";
          // }
        }

        errors[index] = error;
      });

      const hasErrors = errors.some(err => Object.keys(err).length > 0);

      if (hasErrors) {
        setItemErrors(errors);
        return;
      }

      setItemErrors([]);
      goToStep(currentStep + 1);
    }
  };

  /* TO change the step */
  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  /** getting the sub-categories by selecting the categories */
  const handleCategorySelect = async (index, cat) => {
    try {
      // Step 1: update category in formData (subCategory reset karna)
      setFormData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[index] = {
          ...updatedItems[index],
          category: cat.id,
          subCategory: "" // reset
        };
        return { ...prev, items: updatedItems };
      });

      setItemErrors((prevErrors) => {
        // agar array nahi hai to empty array le lo
        const safePrev = Array.isArray(prevErrors) ? prevErrors : [];
        const updatedErrors = [...safePrev];

        if (updatedErrors[index]) {
          delete updatedErrors[index].category;
          delete updatedErrors[index].subCategory;
        }
        return updatedErrors;
      });


      // Step 2: API call for subcategories
      const res = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_category_id: cat.id }),
      });

      const data = await res.json();

      // Step 3: save subcategories separately by index
      setSubCategories((prev) => ({
        ...prev,
        [index]: data,
      }));
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  /** handeling the sub organization seletion */
  const handleSubCategorySelect = async (index, sub) => {
    try {
      // 1. Update formData
      setFormData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[index] = {
          ...updatedItems[index],
          subCategory: sub.id,
          // Reset brand if you store it in items[index]
          brand: ""
        };
        return { ...prev, items: updatedItems };
      });

      setModels((prev) => {
        const updated = [...prev];
        updated[index] = []; // clear models for this item
        return updated;
      });

      // 2. Fetch brands for the selected subcategory
      const response = await fetch(`${API_BASE_URL}/getallchildcategorybrands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ child_category_id: sub.id }),
      });

      const data = await response.json();

      // 3. Set brands — assuming you're tracking brands per index
      setBrands((prev) => {
        const updated = [...prev];
        updated[index] = data;
        return updated;
      });

      setItemErrors((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[index] = {
          ...updatedErrors[index], // retain other errors at the index
          subCategory: '',
          brand: '',
          model: '',
        };
        return updatedErrors;
      });
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  /** Handling the brand selection */
  const handleBrandSelect = async (index, brandId) => {
    try {
      // 1. Update selected brand in formData
      setFormData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[index] = {
          ...updatedItems[index],
          brand: brandId // assuming `brand` field is for brand_id
        };
        return { ...prev, items: updatedItems };
      });

      // 2. Fetch models for selected brand
      const response = await fetch(`${API_BASE_URL}/getallchildcategorybrandsmodel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_id: brandId }),
      });

      const data = await response.json();

      // 3. Save models in state — assuming you're storing models per index
      setModels((prev) => {
        const updated = [...prev];
        updated[index] = data;
        return updated;
      });

      setItemErrors((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[index] = {
          brand: '',
          model: '',
        };
        return updatedErrors;
      });
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  /** handeling the model selection */
  const handleModelSelect = (index, modelId) => {
    // Find the selected model object from models[index]
    const selectedModel = models[index]?.find(model => model.id === modelId);

    if (!selectedModel) {
      return;
    }

    const { tag_id } = selectedModel;

    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        model: modelId,
        tag: tag_id ?? "" // Default to empty string if tag_id is undefined
      };
      return { ...prev, items: updatedItems };
    });

    setItemErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = {
        ...updatedErrors[index], // retain other errors at the index
        model: '',
      };
      return updatedErrors;
    });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? '1' : '0') : value // or use true/false instead of '1'/'0'
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        details: {
          ...updatedItems[index].details,
          [field]: value,
        },
      };
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    const { TermsAndConditionsAgree } = formData;

    if (TermsAndConditionsAgree !== "1") {
      newErrors.TermsAndConditionsAgree = "Please accept terms and conditions.";
    }

    // Agar error hai to state me set kardo aur return
    if (Object.keys(newErrors).length > 0) {
      setItemErrors(newErrors);
      return;
    }

    // errors clear
    setItemErrors({});

    try {
      const fd = new FormData();

      // Business Info
      fd.append("service_provider_id", formData.service_provider_id || "");
      fd.append("businessName", formData.businessName || "");
      fd.append("contactPerson", formData.contactPerson || "");
      fd.append("whatsappNumber", formData.whatsappNumber || "");
      fd.append("gstNumber", formData.gstNumber || "");
      fd.append("deliveryAvailable", formData.deliveryAvailable || "");
      fd.append("streetAddress", formData.streetAddress || "");
      fd.append("landmark", formData.landmark || "");
      fd.append("city", formData.city || "");
      fd.append("state", formData.state || "");
      fd.append("pinCode", formData.pinCode || "");

      // Append images
      if (formData.image_ids && Array.isArray(formData.image_ids)) {
        formData.image_ids.forEach((file, index) => {
          fd.append(`image_ids`, file);
        });
      }

      // Items (agar multiple vehicles hai to loop)
      if (formData.items && Array.isArray(formData.items)) {
        formData.items.forEach((item, index) => {
          fd.append(`items[${index}][category]`, item.category || "");
          fd.append(`items[${index}][subCategory]`, item.subCategory || "");
          fd.append(`items[${index}][brand]`, item.brand || "");
          fd.append(`items[${index}][model]`, item.model || "");
          fd.append(`items[${index}][tag]`, item.tag || "");
          fd.append(`items[${index}][details][item_name]`, item.details?.item_name || "");
          fd.append(`items[${index}][details][vehicle_description]`, item.details?.vehicle_description || "");
          fd.append(`items[${index}][details][price_per_day]`, item.details?.price_per_day || "");
          fd.append(`items[${index}][details][price_per_week]`, item.details?.price_per_week || "");
          fd.append(`items[${index}][details][price_per_month]`, item.details?.price_per_month || "");
          fd.append(`items[${index}][details][price_custom_day]`, item.details?.price_custom_day || "");
          fd.append(`items[${index}][details][security_deposit]`, item.details?.security_deposit || "");
          fd.append(`items[${index}][details][booking_terms]`, item.details?.booking_terms || "");
          fd.append(`items[${index}][details][availability_status]`, item.details?.availability_status || "");
          fd.append(`items[${index}][details][engine_type]`, item.details?.engine_type || "");
          fd.append(`items[${index}][details][transmission_type]`, item.details?.transmission_type || "");
          fd.append(`items[${index}][details][fuel_consumption]`, item.details?.fuel_consumption || "");
          fd.append(`items[${index}][details][seating_capacity]`, item.details?.seating_capacity || "");
          fd.append(`items[${index}][details][color]`, item.details?.color || "");
          fd.append(`items[${index}][details][vehicle_age]`, item.details?.vehicle_age || "");
          fd.append(`items[${index}][details][mileage]`, item.details?.mileage || "");
          fd.append(`items[${index}][details][registration_number]`, item.details?.registration_number || "");
          fd.append(`items[${index}][details][insurance_validity]`, item.details?.insurance_validity || "");
          fd.append(`items[${index}][details][vehicle_type]`, item.details?.vehicle_type || "");
          fd.append(`items[${index}][details][rental_period]`, item.details?.rental_period || "");
          fd.append(`items[${index}][details][vehicle_condition]`, item.details?.vehicle_condition || "");
          fd.append(`items[${index}][details][accessories]`, item.details?.accessories || "");
          fd.append(`items[${index}][details][other_location]`, item.details?.other_location || "");
          fd.append(`items[${index}][details][address_1]`, item.details?.address_1 || "");
          fd.append(`items[${index}][details][landmark]`, item.details?.landmark || "");
          fd.append(`items[${index}][details][city]`, item.details?.city || "");
          fd.append(`items[${index}][details][item_state]`, item.details?.item_state || "");
          fd.append(`items[${index}][details][pincode]`, item.details?.pincode || "");
          fd.append(`items[${index}][details][booking_instructions]`, item.details?.booking_instructions || "");
        });
      }

      // API Call
      const response = await fetch(`${API_BASE_URL}/becomehostaddnewvehicle`,
        {
          method: "POST",
          body: fd,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "API Error");
      alert("Vehicle Added Successfully!");


      const authUserData = getCookie("authUser");
      const parsedAuthUserData = authUserData ? JSON.parse(authUserData) : null;

      if (parsedAuthUserData?.is_service_provider == 0) {
        // Update key
        parsedAuthUserData.is_service_provider = 1;

        // Set cookie again
        setCookie("authUser", JSON.stringify(parsedAuthUserData), 7);
      }

      // Redirect
      window.location.href = "/hosting";
    } catch (error) {
      console.error("Submission Failed:", error);
      alert("Error submitting vehicle data");
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

    // ⚠️ No encodeURIComponent here → raw JSON will be saved
    document.cookie = `${name}=${value}${expires}; path=/`;
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { category: "", subCategory: "", details: "" }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <head>
        <title>Become a Host</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Book Reliable Rentals From Locals - Fast, Easy" />
      </head>
      <div className="p-6">
        <div className={styles.form_section_main}>
          <div id="header"></div>
          <section className={`${styles.form_section_main}`}>
            <div className={styles.container}>
              <div className={styles.row}>
                <div className={`w-100 {styles.col12}`}>
                  <div className={`${styles.border} ${styles.roh_rowwhite}`}>
                    <div className={`${styles.px4} ${styles.pxmd5}`}>
                      <div>
                        <h2 className={`${styles.mb3} ${styles.textCenter} fw-bold`}>List Your Business. Get More Rentals.</h2>
                        <div className={`${styles.titleSepertor} mb-5`}></div>

                        {/* Showing the laoder while setting up the steps */}
                        {shouldJumpToStep3 && loadingCategories && (
                          <div className={styles.loaderWrap}>
                            <div className={styles.spinner}></div>
                            <p className={styles.loaderText}>Loading your listing setup…</p>
                          </div>
                        )}

                        <h4 className={`my-4 step_btn_fr mb-2 ${styles.main_steps}`}> Step {currentStep}: Tell Us About Your Business</h4>
                        <div className={`${styles.progress} ${styles.mb4}`}>
                          <div className={styles.progressBar} role="progressbar" style={{ width: `${(currentStep / 4) * 100}%`, }}> Step {currentStep} of 4 </div>
                        </div>

                        {/* Step 1 */}
                        {currentStep === 1 && !shouldJumpToStep3 && (
                          <div id="step1" className="step">
                            <form id="providerForm">
                              <div className={`${styles.row} ${styles.roh_fields}`}>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>Business Name</label>
                                  <input type="text" name="businessName" className={`${styles.formControl} ${styles.reFormF}`} value={formData.businessName} onChange={handleChange} required />
                                  <small className={`${styles.formText} ${styles.textMuted}`}> Enter the name as it appears on official documents. </small>
                                  {itemErrors.businessName && (
                                    <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.businessName} </div>
                                  )}
                                </div>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>Owner/Contact Person</label>
                                  <input type="text" name="contactPerson" className={`${styles.formControl} ${styles.reFormF}`} value={formData.contactPerson || (authUser ? `${authUser.firstName} ${authUser.lastName}` : "")} onChange={handleChange} />
                                  <small className={`${styles.formText} ${styles.textMuted}`}> Who should we get in touch with? </small>
                                  {itemErrors.contactPerson && (
                                    <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.contactPerson} </div>
                                  )}
                                </div>
                              </div>
                              <div className={`${styles.row} ${styles.roh_fields}`}>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>Contact Number</label>
                                  <input type="tel" name="whatsappNumber" className={`${styles.formControl} ${styles.reFormF}`} placeholder="+91-" value={formData.whatsappNumber || authUser?.phoneNumber || ""} onChange={handleChange} />
                                  <small className={`${styles.formText} ${styles.textMuted}`}> Number for customer communication. </small>
                                  {itemErrors.whatsappNumber && (
                                    <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.whatsappNumber} </div>
                                  )}
                                </div>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>GST Number (if applicable)</label>
                                  <input type="text" name="gstNumber" className={`${styles.formControl} ${styles.reFormF}`} value={formData.gstNumber} onChange={handleChange} />
                                  <small className={`${styles.formText} ${styles.textMuted}`}> Leave blank if you're not GST registered. </small>
                                </div>
                              </div>

                              <div className={`${styles.row} ${styles.roh_fields}`}>
                                <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                  <label className={styles.formLabel}>Is Delivery Available?</label>
                                  <div className={`${styles.dFlex} flex-wrap ${styles.gap2} category-wrap`}>
                                    {["Yes", "No", "Paid Delivery"].map((option) => (
                                      <div key={option}>
                                        <input type="radio" name="deliveryAvailable" value={option} className={styles.btnCheck} id={`da_${option.replace(/\s/g, "").toLowerCase()}`} checked={formData.deliveryAvailable === option} onChange={handleRadioChange} />
                                        <label htmlFor={`da_${option.replace(/\s/g, "").toLowerCase()}`} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-1 px-3 text-start`} > {option} </label>
                                      </div>
                                    ))}
                                  </div>
                                  {itemErrors.deliveryAvailable && (
                                    <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.deliveryAvailable} </div>
                                  )}
                                </div>
                              </div>

                              <div className={`${styles.footerSepertor} mt-3 ${styles.mb4}`}></div>
                              <div className="text-end">
                                <button type="button" className={`${styles.btn} btn-primary ${styles.nextStep}`} onClick={handleNextStep}> Next </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Step 2: Verify Phone Number */}
                        {currentStep === 2 && (
                          <div id="step2" className="step">
                            <div className={`${styles.row} ${styles.roh_fields}`}>
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>Street Address</label>
                                <input type="text" className={`${styles.formControl} ${styles.reFormF}`} name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
                                <small className={`${styles.formText} ${styles.textMuted}`}>Your building number, shop name, or street name.</small>
                                {itemErrors.streetAddress && (
                                  <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.streetAddress} </div>
                                )}
                              </div>
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>Landmark</label>
                                <input type="text" className={`${styles.formControl} ${styles.reFormF}`} name="landmark" value={formData.landmark} onChange={handleChange} />
                                <small className={`${styles.formText} ${styles.textMuted}`}>Nearby point of reference to help locate your address.</small>
                              </div>
                            </div>
                            <div className={`${styles.row} ${styles.roh_fields}`}>
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>City</label>
                                <input type="text" className={`${styles.formControl} ${styles.reFormF}`} name="city" value={formData.city} onChange={handleChange} required />
                                <small className={`${styles.formText} ${styles.textMuted}`}>Your city of operation.</small>
                                {itemErrors.city && (
                                  <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.city} </div>
                                )}
                              </div>
                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>State</label>
                                <select id="state" name="state" required className={`${styles.formControl} ${styles.reFormF}`} value={formData.state} onChange={handleChange}>
                                  <option value="">Select State</option>
                                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                  <option value="Assam">Assam</option>
                                  <option value="Bihar">Bihar</option>
                                  <option value="Chhattisgarh">Chhattisgarh</option>
                                  <option value="Goa">Goa</option>
                                  <option value="Gujarat">Gujarat</option>
                                  <option value="Haryana">Haryana</option>
                                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                                  <option value="Jharkhand">Jharkhand</option>
                                  <option value="Karnataka">Karnataka</option>
                                  <option value="Kerala">Kerala</option>
                                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                                  <option value="Maharashtra">Maharashtra</option>
                                  <option value="Manipur">Manipur</option>
                                  <option value="Meghalaya">Meghalaya</option>
                                  <option value="Mizoram">Mizoram</option>
                                  <option value="Nagaland">Nagaland</option>
                                  <option value="Odisha">Odisha</option>
                                  <option value="Punjab">Punjab</option>
                                  <option value="Rajasthan">Rajasthan</option>
                                  <option value="Sikkim">Sikkim</option>
                                  <option value="Tamil Nadu">Tamil Nadu</option>
                                  <option value="Telangana">Telangana</option>
                                  <option value="Tripura">Tripura</option>
                                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                                  <option value="Uttarakhand">Uttarakhand</option>
                                  <option value="West Bengal">West Bengal</option>
                                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                  <option value="Chandigarh">Chandigarh</option>
                                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                  <option value="Delhi">Delhi</option>
                                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                  <option value="Ladakh">Ladakh</option>
                                  <option value="Lakshadweep">Lakshadweep</option>
                                  <option value="Puducherry">Puducherry</option>
                                </select>
                                <small className={`${styles.formText} ${styles.textMuted}`}>Select from the dropdown.</small>
                                {itemErrors.state && (
                                  <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.state} </div>
                                )}
                              </div>
                            </div>
                            <div className={`${styles.row} ${styles.roh_fields}`}>

                              <div className={`${styles.mb3} ${styles.roh_inoputField}`}>
                                <label className={styles.formLabel}>Pin Code</label>
                                <input type="number" name="pinCode" className={`${styles.formControl} ${styles.reFormF}`} value={formData.pinCode} onChange={handleChange} pattern="[0-9]{6}" maxLength={6} inputMode="numeric" required />
                                <small className={`${styles.formText} ${styles.textMuted}`}>Enter your 6-digit postal code.</small>
                                {itemErrors.pinCode && (
                                  <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.pinCode} </div>
                                )}
                              </div>
                            </div>
                            <div className={`${styles.footerSepertor} mt-3 ${styles.mb4}`}></div>
                            <div className={`${styles.dFlex} justify-content-between ${styles.gap2}`}>
                              <button type="button" className={`${styles.btn} ${styles.prevStep}`} onClick={() => goToStep(1)}>Back</button>
                              <button type="button" className={`${styles.btn} ${styles.nextStep}`} onClick={handleNextStep}>Next Step</button>
                            </div>
                          </div>
                        )}

                        {/* Step 3: List Your Items */}
                        {currentStep === 3 && (
                          <div id="step3" className="step">
                            {/* Loader / Empty State */}
                            {loadingCategories ? (
                              <p className="text-muted">Loading categories…</p>
                            ) : categories.length === 0 ? (
                              <p className="text-muted">No categories found.</p>
                            ) : (
                              <>
                                {formData.items.map((item, index) => (
                                  <div key={index} className={`${styles.card} ${styles.mb4} p-3 ${styles.repeaterItem} bgTransparent positionRelative`}>
                                    {/* REMOVE BUTTON */}
                                    {formData.items.length > 1 && (
                                      <button type="button" className={`${styles.btnClose} ${styles.btn} position-absolute m-2`} onClick={() => removeItem(index)}> Remove </button>
                                    )}
                                    <h4 className={styles.mb3}>What Are You Renting?</h4>
                                    <p> Let us know what type of item you are listing, along with its key details and documents. You can add multiple items.</p>

                                    <div className={`${styles.roh_vehicleDform_heighlight}`}>
                                      {/* CATEGORY SELECTION */}
                                      <div className="mb-2">
                                        <label className={styles.formLabel}>Select a Category</label>
                                        <small>(Choose the type of item you are listing)</small>
                                        <div className={`${styles.dFlex} flex-wrap ${styles.gap2} ${styles.categoryWrap}`}>
                                          {categories.map((cat) => {
                                            const inputId = `cat_${cat.id}_${index}`;
                                            return (
                                              <div key={cat.id}>
                                                <input type="radio" className={styles.btnCheck} name={`category_${index}`} id={inputId} value={cat.id} checked={item.category === cat.id} onChange={() => handleCategorySelect(index, cat)} />
                                                <label htmlFor={inputId} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-2 px-3 text-start`}>
                                                  <span>{cat.name}</span>
                                                </label>
                                              </div>
                                            );
                                          })}
                                          {itemErrors[index]?.category && (<small className={styles.text_danger}>{itemErrors[index].category}</small>)}
                                        </div>
                                      </div>

                                      {/* SUBCATEGORY SELECTION */}
                                      <div className="sub-categories mb-2">
                                        {item.category ? (
                                          <>
                                            {subCategories ? (
                                              <>
                                                <label className={styles.formLabel}>Select a Sub Category</label>
                                                <div className={`${styles.dFlex} flex-wrap ${styles.gap2} ${styles.subCategoryWrap}`}>
                                                  {Array.isArray(subCategories?.[index?.toString()]) && subCategories[index.toString()].map((sub, subIndex) => {
                                                    const subId = `sub_${index}_${sub.id}`;
                                                    return (
                                                      <div key={sub.id}>
                                                        <input type="radio" className={styles.btnCheck} name={`subCategory_${index}`} id={subId} value={sub.id} checked={item.subCategory === sub.id} onChange={() => handleSubCategorySelect(index, sub)} />
                                                        <label htmlFor={subId} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-2 px-3 text-start`}>
                                                          <span>{sub.name}</span>
                                                        </label>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                                {itemErrors[index]?.subCategory && (
                                                  <small className={styles.text_danger}>{itemErrors[index].subCategory}</small>
                                                )}
                                              </>
                                            ) : (
                                              <p className="text-muted mt-2"><b>{item.category}</b> sub-categories are coming soon 🚀 </p>
                                            )}
                                          </>
                                        ) : null}
                                      </div>

                                      {/* BRAND SELECTION */}
                                      {brands[index]?.length > 0 && (
                                        <div className="sub-categories mb-2">
                                          <label className={styles.formLabel}>Select a Brand</label>
                                          <div className={`${styles.dFlex} flex-wrap ${styles.gap2} ${styles.subCategoryWrap}`}>
                                            {brands[index].map((brand) => (
                                              <div key={brand.id}>
                                                <input type="radio" className={styles.btnCheck} name={`brand_${index}`} id={`brand_${index}_${brand.id}`} value={brand.id} checked={item.brand === brand.id} onChange={() => handleBrandSelect(index, brand.id)} />
                                                <label htmlFor={`brand_${index}_${brand.id}`} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-2 px-3 text-start`}>
                                                  {brand.brand_name}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                          {itemErrors[index]?.brand && (
                                            <small className={styles.text_danger}>{itemErrors[index].brand}</small>
                                          )}
                                        </div>
                                      )}


                                      {/* MODEL SELECTION */}
                                      {models[index]?.length > 0 && (
                                        <div className="sub-categories mb-2">
                                          <label className={styles.formLabel}>Select a Model</label>
                                          <div className={`${styles.dFlex} flex-wrap ${styles.gap2} ${styles.subCategoryWrap}`}>
                                            {models[index].map((model) => (
                                              <div key={model.id}>
                                                <input type="radio" className={styles.btnCheck} name={`model_${index}`} id={`model_${index}_${model.id}`} value={model.id} checked={item.model === model.id} onChange={() => handleModelSelect(index, model.id)} />
                                                <label htmlFor={`model_${index}_${model.id}`} className={`${styles.btn} btn-outline-secondary ${styles.wmax} ${styles.radioBtns} rounded-3 py-2 px-3 text-start`}>
                                                  {model.model_name}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                          {itemErrors[index]?.model && (
                                            <small className={styles.text_danger}>{itemErrors[index].model}</small>
                                          )}
                                        </div>

                                      )}
                                    </div>

                                    {currentStep === 3 &&
                                      formData.items.map((item, index) => {
                                        if (item.category == 1 && item.subCategory && item.brand && item.model) {
                                          return (
                                            <VehicleDetailsForm
                                              key={item.id ?? index}
                                              index={index}
                                              item={item}
                                              formData={formData}
                                              setFormData={setFormData}
                                              handleDetailsChange={handleDetailsChange}
                                              errors={itemErrors[index] || {}}
                                            />
                                          );
                                        }
                                        return null;
                                      })}
                                  </div>
                                ))}

                                {/* FOOTER BTNS */}
                                <div className={`${styles.dFlex} justify-content-between ${styles.gap2}`}>

                                  {!shouldJumpToStep3 && (
                                    <button type="button" className={`${styles.btn} ${styles.prevStep}`} onClick={() => goToStep(2)}> Back </button>
                                  )}

                                  <button type="button" className={`${styles.btn} ${styles.nextStep}`} onClick={handleNextStep}> Next Step </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Step 4: Review & Submit */}
                        {currentStep === 4 && (
                          <div id="step5" className="step">
                            <div id="summary">
                              <p> Please review your business and rental item details below. If everything looks good, hit Submit to publish your listing. </p>

                              {/* Rental Items */}
                              {formData.items?.map((item, idx) => {
                                // Category name
                                const categoryName = categories.find((cat) => cat.id === item.category)?.name || "N/A";

                                // SubCategory name
                                const subCategoryName = subCategories[idx]?.find((sub) => sub.id === item.subCategory)?.name || "N/A";

                                return (
                                  <div key={idx} className={`${styles.mb3} ${styles.roh_step4Content} bg-transparent`}>
                                    <div className="row">
                                      <div className="col-md-5 col-12">
                                        <div className={`${styles.roh_priceRight_wrap}`}>
                                          <div className={`${styles.roh_priceRight_inner}`}>
                                            <div className={`${styles.roh_sidebar_pricing}`}>
                                              <h5><sup><span>Starting from </span> </sup>₹{item.details?.price_per_day || "N/A"}<span>/Per Day</span></h5>
                                              <div className={`${styles.roh_productPrice}`}>
                                                <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                                  <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                                    <span>Per/Week:</span>
                                                  </div>
                                                  <span className="text-dark fw-medium">₹{item.details?.price_per_week || "N/A"}</span>
                                                </div>
                                                <div className={`d-flex justify-content-between text-dark  ${styles.roh_content_layer}`}>
                                                  <div className={`d-flex align-items-center gap-1 ${styles.roh_feets_data_list}`}>
                                                    <span>Per/Month:</span>
                                                  </div>
                                                  <span className="text-dark fw-medium">₹{item.details?.price_per_month || "N/A"}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-7 col-12">
                                        <h3 style={{ marginBottom: "10px" }}>{item.details?.item_name || "N/A"}</h3>
                                        {/* Image section */}
                                        {formData.image_ids && formData.image_ids.length > 0 ? (
                                          <div className={styles.imageWrap}>
                                            {formData.image_ids.map((file, index) => (
                                              <img key={index} src={URL.createObjectURL(file)} alt={`Uploaded Image ${index + 1}`} width={280} height={180} className={styles.itemImg} />
                                            ))}
                                          </div>
                                        ) : (
                                          <p>No images available</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-12 col-12">
                                        <div className={`${styles.roh_step4Other_info}`}>
                                          <h4>Other Info</h4>
                                          <ul className={`${styles.roh_check_list}`}>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-engine.svg" alt="Door" width={28} height={28} />
                                                <h6>Category: <span>{categoryName}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-engine.svg" alt="Door" width={28} height={28} />
                                                <h6>Sub Category: <span>{subCategoryName}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-engine.svg" alt="Door" width={28} height={28} />
                                                <h6>Description: <span>{item.details?.vehicle_description || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-security-deposit.svg" alt="Door" width={28} height={28} />
                                                <h6>Security Deposit: <span>₹{item.details?.security_deposit || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-security-deposit.svg" alt="Door" width={28} height={28} />
                                                <h6>Availability: <span>{" "} {item.details?.availability_status || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-engine.svg" alt="Door" width={28} height={28} />
                                                <h6>Engine Type: <span>{" "}
                                                  {item.details?.engine_type || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-transmission.svg" alt="Transmission" width={28} height={28} />
                                                <h6>Transmission: <span>{" "}
                                                  {item.details?.transmission_type || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-seats.svg" alt="Age" width={28} height={28} />
                                                <h6>Fuel Consumption: <span>{" "}
                                                  {item.details?.fuel_consumption || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-color.svg" alt="Luggage" width={28} height={28} />
                                                <h6>Registration No: <span>{" "}
                                                  {item.details?.registration_number || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-condition.svg" alt="Air Condition" width={28} height={28} />
                                                <h6>Condition: <span>{" "}
                                                  {item.details?.vehicle_condition || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                            <li>
                                              <div className={`${styles.roh_featureList}`}>
                                                <Image src="/images/product-popup/car-condition.svg" alt="Air Condition" width={28} height={28} />
                                                <h6>Booking Instructions: <span>{" "}
                                                  {item.details?.booking_instructions || "N/A"}</span></h6>
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    {item.details?.other_location && (
                                      <div className={`${styles.roh_step4th_form}`}>
                                        <strong>Pickup Address: </strong>
                                        {item.details?.address_1 || "N/A"},
                                        {item.details?.landmark || "N/A"},
                                        {item.details?.city || "N/A"},
                                        {item.details?.item_state || "N/A"} -
                                        {item.details?.pincode || "N/A"}
                                      </div>
                                    )}

                                    <div className="card-body d-none">
                                      <p className="card-text">
                                        <strong>Category:</strong> {categoryName}<br />
                                        <strong>Sub Category:</strong> {subCategoryName}<br />
                                        <strong>Description:</strong>{" "}
                                        {item.details?.vehicle_description || "N/A"}<br />
                                        <strong>Price/Day:</strong> ₹ {item.details?.price_per_day || "N/A"}<br />
                                        <strong>Price/Week:</strong> ₹ {item.details?.price_per_week || "N/A"}<br />
                                        <strong>Price/Month:</strong> ₹ {item.details?.price_per_month || "N/A"}<br />
                                        {/* <strong>Custom Day Price:</strong> ₹ {item.details?.price_custom_day || "N/A"}<br/> */}
                                        <strong>Security Deposit:</strong> ₹ {item.details?.security_deposit || "N/A"}<br />
                                        {/* <strong>Booking Terms:</strong>{" "}
                                              {item.details?.booking_terms || "N/A"}<br/> */}
                                        <strong>Availability:</strong>{" "}
                                        {item.details?.availability_status || "N/A"}<br />
                                        <strong>Engine Type:</strong>{" "}
                                        {item.details?.engine_type || "N/A"}<br />
                                        <strong>Transmission:</strong>{" "}
                                        {item.details?.transmission_type || "N/A"}<br />
                                        <strong>Fuel Consumption:</strong>{" "}
                                        {item.details?.fuel_consumption || "N/A"}<br />
                                        {/* <strong>Seating Capacity:</strong>{" "}
                                              {item.details?.seating_capacity || "N/A"}<br/> */}
                                        {/* <strong>Color:</strong> {item.details?.color || "N/A"}<br/> */}
                                        {/* <strong>Vehicle Age:</strong>{" "}
                                              {item.details?.vehicle_age || "N/A"}<br/> */}
                                        {/* <strong>Mileage:</strong> {item.details?.mileage || "N/A"}<br/> */}
                                        <strong>Registration No:</strong>{" "}
                                        {item.details?.registration_number || "N/A"}<br />
                                        {/* <strong>Insurance Validity:</strong>{" "}
                                              {item.details?.insurance_validity || "N/A"}<br/> */}
                                        {/* <strong>Vehicle Type:</strong>{" "}
                                              {item.details?.vehicle_type || "N/A"}<br/> */}
                                        {/* <strong>Rental Period:</strong>{" "}
                                              {item.details?.rental_period || "N/A"}<br/> */}
                                        <strong>Condition:</strong>{" "}
                                        {item.details?.vehicle_condition || "N/A"}<br />
                                        {/* <strong>Accessories:</strong>{" "}
                                              {item.details?.accessories || "N/A"}<br/> */}
                                        {/* <strong>Pickup Address:</strong>{" "}
                                              {item.details?.address_1 || "N/A"},{" "}
                                              {item.details?.landmark || "N/A"},{" "}
                                              {item.details?.city || "N/A"},{" "}
                                              {item.details?.item_state || "N/A"} -{" "}
                                              {item.details?.pincode || "N/A"}<br /> */}
                                        <strong>Booking Instructions:</strong>{" "}
                                        {item.details?.booking_instructions || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Terms */}
                              <div className="form-check my-3">
                                {/* <input className={styles.formCheckInput} type="checkbox" id="termsCheck"/> */}
                                <input className={styles.formCheckInput} type="checkbox" id="termsCheck" name="TermsAndConditionsAgree" checked={formData.TermsAndConditionsAgree === '1'} onChange={handleChange} />

                                <label className={styles.formCheckLabel} htmlFor="termsCheck">
                                  I confirm that all the information provided is accurate and I agree to the
                                  <a href="#" className={`${styles.roh_aLink}`}> Terms of Listing</a>
                                </label>
                                {itemErrors.TermsAndConditionsAgree && (
                                  <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}> {itemErrors.TermsAndConditionsAgree} </div>
                                )}
                              </div>

                              <div className={`${styles.footerSepertor} mt-3 ${styles.mb4}`}></div>
                              <div className={`${styles.dFlex} justify-content-between ${styles.gap2}`}>
                                <button type="button" className={`${styles.btn} ${styles.prevStep}`} onClick={() => goToStep(3)}>
                                  Back
                                </button>
                                <button type="submit" className={`${styles.btn} ${styles.submitBtn}`} id="submitForm" onClick={handleSubmit}>
                                  Publish Listing
                                </button>
                              </div>
                            </div>
                          </div>
                        )}


                        {/* Success Message */}
                        {/* <div id="successMessage" className="alert alert-success d-none mt-4">
                                    Your listing has been submitted. We will review and publish it within 24 hours.
                                </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Left Image Side */}
                {/* Form Side */}
              </div>
            </div>
          </section>
          <div id="footer"></div>
        </div>
      </div>
    </>
  );
}