"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { CategoryTabs } from "./components/CategoryTabs";
import { VehicleForm } from "./components/VehicleForm";
import { ItemSummaryCard } from "./components/ItemSummaryCard";
import { PreviewScreen } from "./components/PreviewScreen";
import styles from "../add-item/additem.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function AddItemClient() {
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    const alertRef = useRef(null);

    const [alert, setAlert] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [userId, setUserId] = useState(null);

    // Safe cookie getter
    const getCookie = (name) => {
        if (typeof document === "undefined") return null; // SSR SAFE
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    // Read cookie only on client
    useEffect(() => {
        const cookie = getCookie("authUser");
        try {
            const parsed = cookie ? JSON.parse(cookie) : null;
            setUserId(parsed?.id || false); // false = not logged in
        } catch {
            setUserId(false);
        }
    }, []);

    // Prevent SSR break & avoid early rendering
    if (userId === null) {
        return <p>Loading...</p>;
    }

    if (userId === false) {
        return <p>User not authenticated. Please log in.</p>;
    }


    // formData
    const [formData, setFormData] = useState({
        business_id: "",
        service_provider_id: userId,
        cat_id: 1,
        sub_categories: []
    });

    // initializeSubCategory()
    const initializeSubCategory = (sub_cat_id, brand_id) => {
        setFormData((prev) => {
            const exists = prev.sub_categories.some(
                (sc) => sc.sub_cat_id === sub_cat_id
            );
            if (exists) return prev;

            return {
                ...prev,
                sub_categories: [
                    ...prev.sub_categories,
                    {
                        sub_cat_id,
                        items: [
                            {
                                brand_id,
                                model_id: null,
                                tag_id: null,
                                title: "",
                                description: "",
                                pricePerDay: "",
                                pricePerWeek: "",
                                pricePerMonth: "",
                                securityDeposit: "",
                                availability: "",
                                engineType: "",
                                registrationNumber: "",
                                transmission: "",
                                condition: "",
                                bookingInstructions: "",
                                image: [], // ARRAY for preview URLs
                                fleetSize: 0,
                                imageFiles: [], // ARRAY for File objects
                            }
                        ]
                    }
                ]
            };
        });
    };

    // updateItemField()
    const updateItemField = (sub_cat_id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            sub_categories: prev.sub_categories.map((sc) => {
                if (sc.sub_cat_id !== sub_cat_id) return sc;

                const existingItem =
                    sc.items[0] ||
                    {
                        brand_id: null,
                        model_id: null,
                        tag_id: null,
                        title: "",
                        description: "",
                        pricePerDay: "",
                        pricePerWeek: "",
                        pricePerMonth: "",
                        securityDeposit: "",
                        availability: "",
                        engineType: "",
                        registrationNumber: "",
                        transmission: "",
                        condition: "",
                        bookingInstructions: "",
                        image: [], // ARRAY for preview URLs
                        fleetSize: 0,
                        imageFiles: [], // ARRAY for File objects
                    };

                const updatedItem = { ...existingItem, [field]: value };

                return { ...sc, items: [updatedItem] };
            })
        }));
    };

    // removeSubCategoryIfEmpty()
    const removeSubCategoryIfEmpty = (sub_cat_id) => {
        setFormData((prev) => {
            const sc = prev.sub_categories.find((x) => x.sub_cat_id === sub_cat_id);

            if (!sc) return prev;
            if (sc.items.length > 0) return prev;

            return {
                ...prev,
                sub_categories: prev.sub_categories.filter(
                    (x) => x.sub_cat_id !== sub_cat_id
                )
            };
        });
    };

    // Fetch Sub Categories
    useEffect(() => {
        const abort = new AbortController();

        (async () => {
            try {
                setLoadingCategories(true);

                const res = await fetch(`${API_BASE_URL}/businessCategories`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: abort.signal,
                    body: JSON.stringify({
                        user_id: userId,
                        category_id: 1,
                    }),
                });

                const data = await res.json();

                const subs = data?.sub_categories || [];
                setSubCategories(subs);

                // UPDATE: Capture business_id and update formData
                const businessId = data?.business_id;
                if (businessId) {
                    setFormData(prev => ({
                        ...prev,
                        business_id: businessId,
                    }));
                }

                if (subs.length > 0) {
                    setActiveSubCategory(subs[0]);
                }
            } catch (err) {
                if (err?.name !== "AbortError") {
                    setAlert({
                        type: "danger",
                        message: "Failed to load categories",
                    });
                }
            } finally {
                setLoadingCategories(false);
            }
        })();

        return () => abort.abort();
    }, []);

    useEffect(() => {
        if (activeSubCategory) {
            fetchBrands(activeSubCategory.id);
            setModels([]);
        }
    }, [activeSubCategory]);

    useEffect(() => {
        if (alert && alertRef.current) {
            const scrollContainer = alertRef.current.closest(".alert-dismissible");

            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: alertRef.current.offsetTop - 50,
                    behavior: "smooth"
                });
            } else {
                // fallback for non-scroll-container case
                alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [alert]);

    // fetchBrands()
    const fetchBrands = async (subCategoryId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/brandsByCategory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cat_id: subCategoryId }),
            });
            const data = await res.json();
            setBrands(data.brands || []);
        } catch (err) {
            setBrands([]);
        }
    };

    // fetchModels()
    const fetchModels = async (brandId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/modelsByBrand`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brand_id: brandId }),
            });

            const data = await res.json();
            setModels(data.models || []);
        } catch (err) {
            setModels([]);
        }
    };

    // --- Core API Call Helpers ---

    const saveItemToDatabase = async (payload) => {
        try {
            const formDataToSend = new FormData();

            // 1. Iterate through payload
            for (const key in payload) {
                // Check for the array of files (imageFiles)
                if (key === 'imageFiles' && Array.isArray(payload[key])) {
                    // Loop through the array of File objects and append each one
                    payload[key].forEach((file) => {
                        if (file instanceof File) {
                            formDataToSend.append('image', file);
                        }
                    });
                } else if (payload[key] !== null && payload[key] !== undefined) {
                    // For all other fields (text, IDs, numbers), append the value as a string
                    formDataToSend.append(key, payload[key]);
                }
            }

            const res = await fetch(`${API_BASE_URL}/addVehicleItem`, {
                method: "POST",
                headers: {}, // Remove Content-Type for FormData
                body: formDataToSend,
            });

            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error saving item:", err);
            return { success: false, message: "Network error occurred." };
        }
    };

    const submitAllItemsToDatabase = async (finalPayload) => {
        try {
            const res = await fetch(`${API_BASE_URL}/submitAllItems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                 return { success: false, message: data.message || "Server responded with an error." };
            }
            return data;
        } catch (err) {
            console.error("Error in JSON batch submission:", err);
            return { success: false, message: "Network error occurred during JSON batch submission." };
        }
    };

    // NEW: API helper for deleting a single item
    const deleteItemFromDB = async (itemId) => {
        setAlert({ type: "info", message: `Deleting item ID ${itemId} from server...` });

        try {
            // Payload uses 'id' key to match backend validation/controller logic
            const payload = { id: itemId, service_provider_id: userId };

            const res = await fetch(`${API_BASE_URL}/singleItemDeleteOnBoarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || data.success === false) {
                return { success: false, message: data.message || "Failed to delete item on server." };
            }
            return { success: true, message: data.message || "Item deleted successfully." };
        } catch (err) {
            console.error("Error deleting item:", err);
            return { success: false, message: "Network error during deletion. ❌" };
        }
    };

    // --- Handlers ---

    // ADD ITEM HANDLER
    const handleAddItem = async (sub_cat_id) => {
        const sc = formData.sub_categories.find(x => x.sub_cat_id === sub_cat_id);

        if (!sc || sc.items.length === 0) {
            return setAlert({
                type: "danger",
                message: "Please complete the item before saving.",
            });
        }

        const item = sc.items[0];

        // --- BASIC VALIDATION CHECK ---
        if (!item.title || !item.pricePerDay || !item.brand_id) {
            return setAlert({
                type: "danger",
                message: "Title, Brand, and Price Per Day are required.",
            });
        }

        // NEW VALIDATION: Check if at least one image is uploaded
        // if (!item.imageFiles || item.imageFiles.length === 0) {
        //      return setAlert({
        //         type: "danger",
        //         message: "Please upload at least one image.",
        //     });
        // }


        // Prepare payload for API
        const payload = {
            service_provider_id: userId,
            business_id: formData.business_id,
            category_id: formData.cat_id,
            sub_category_id: sub_cat_id,
            brand_id: item.brand_id,
            model_id: item.model_id,
            tag_id: item.tag_id,
            title: item.title,
            description: item.description,
            price_per_day: item.pricePerDay,
            price_per_week: item.pricePerWeek,
            price_per_month: item.pricePerMonth,
            security_deposit: item.securityDeposit,
            availability: item.availability,
            engine_type: item.engineType,
            registration_number: item.registrationNumber,
            transmission: item.transmission,
            condition: item.condition,
            booking_instructions: item.bookingInstructions,
            imageFiles: item.imageFiles, // Array of files for multi-upload
            fleet_size: item.fleetSize,
        };

        // SAVE IN DATABASE
        const response = await saveItemToDatabase(payload);

        if (!response.success) {
            return setAlert({
                type: "danger",
                message: response.message || "Failed to save item. Please try again."
            });
        }

        // 1. ADD TO SUMMARY CARDS (UI update)
        setItems((prev) => [
            ...prev,
            {
                id: response.inserted_id || Date.now(),
                sub_cat_id,
                ...item
            }
        ]);

        // 2. REMOVE THE SAVED ITEM from the current form state
        setFormData((prev) => ({
            ...prev,
            sub_categories: prev.sub_categories.map((x) => {
                if (x.sub_cat_id !== sub_cat_id) return x;

                return {
                    ...x,
                    // Set items array to empty to clear the form visually
                    items: [],
                };
            })
        }));

        // 3. RE-INITIALIZE A BLANK FORM
        const currentBrandId = item.brand_id;
        initializeSubCategory(sub_cat_id, currentBrandId);

        // Clear models so the next model selection fetches fresh data
        setModels([]);
        setAlert({ type: "success", message: "Item added successfully! Ready to add the next item." });

        if (alert && alertRef.current) {
            const scrollContainer = alertRef.current.closest(".roh_addItems_formWrapper");

            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: alertRef.current.offsetTop - 50,
                    behavior: "smooth"
                });
            } else {
                alertRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    // NEW: Handler function to delete item and update state
    const handleDeleteItem = async (itemId) => {
        // 1. Server se delete karein
        const response = await deleteItemFromDB(itemId);

        if (response.success) {
            // 2. Agar server par delete ho gaya, toh frontend state se bhi hatayein
            setItems((prev) => prev.filter((item) => item.id !== itemId));
            setAlert({ type: "success", message: response.message });
        } else {
            // 3. Error message dikhayein
            setAlert({ type: "danger", message: response.message });
        }
    };

    // FINAL SUBMISSION HANDLER
    const handleFinalSubmission = async () => {
        // 1. --- Collect ALL Items (Saved + Current Unsaved) ---
        let allItemsToSubmit = [...items];
        let currentUnsavedItem = null;

        // Find the currently active item
        formData.sub_categories.forEach((subCat) => {
            if (subCat.items && subCat.items.length > 0) {
                const item = subCat.items[0];

                // Check if it's unsaved (no ID) and has content (e.g., title)
                if (!item.id && item.title && item.title.trim() !== "") {
                    allItemsToSubmit.push(item); // Add unsaved item
                    currentUnsavedItem = item;
                }
            }
        });

        // --- Validation Checks ---
        if (!termsAccepted) {
            setAlert({ type: "warning", message: "Please accept the terms and conditions to submit all items." });
            return;
        }

        if (allItemsToSubmit.length === 0) {
            setAlert({ type: "danger", message: "No items found to submit. Please fill and save at least one item." });
            return;
        }

        // 2. Determine Payload Type and Prepare Core Data
        const payloadContainsFile = currentUnsavedItem && Array.isArray(currentUnsavedItem.imageFiles) && currentUnsavedItem.imageFiles.length > 0;

        const finalPayloadCore = {
            business_id: formData.business_id,
            service_provider_id: userId,
            category_id: formData.cat_id,
            items: allItemsToSubmit,
            terms_accepted: termsAccepted,
        };

        // 3. Send Request (FormData if file exists, otherwise JSON)
        let response;

        if (payloadContainsFile) {
            // --- MULTIPART/FORM-DATA SUBMISSION ---

            const formDataToSend = new FormData();

            // Append core data array as a string field
            formDataToSend.append('submission_data', JSON.stringify(finalPayloadCore));

            // Append ALL files from the array
            currentUnsavedItem.imageFiles.forEach(file => {
                 if (file instanceof File) {
                     formDataToSend.append('image', file);
                 }
            });

            try {
                const res = await fetch(`${API_BASE_URL}/submitAllItems`, {
                    method: "POST",
                    headers: {}, // Do NOT set Content-Type for FormData
                    body: formDataToSend,
                });
                response = await res.json();
            } catch (err) {
                response = { success: false, message: "Network error during file upload." };
            }
        } else {
            // --- STANDARD JSON SUBMISSION (No file) ---
            response = await submitAllItemsToDatabase(finalPayloadCore);
        }

        // 4. Handle Final Response
        if (response.success) {
            setAlert({ type: "success", message: "All items successfully submitted and posted! Redirecting..." });

            // 🎯 REDIRECTION
            router.push("/dashboard?view=items");
        } else {
            setAlert({
                type: "danger",
                message: response.message || "Final submission failed. Please check the items."
            });
        }
    };

    // Compute currentItem for VehicleForm
    const currentItem = formData.sub_categories.find(
        (sc) => sc.sub_cat_id === activeSubCategory?.id
    )?.items?.[0] ?? null;

    // PREVIEW SCREEN
    if (showPreview) {
        return (
            <PreviewScreen items={items} onBack={() => setShowPreview(false)} onSubmit={() => {}} />
        );
    }

    // MAIN UI
    return (
        <div className="min-vh-100">

            <div className={styles.container} style={{ maxWidth: "1200px", margin: "0 auto 20px auto" }}>
                <a className={styles.roh_backtoHomebtn} href="/">
                    Back to Home
                </a>
            </div>

            <div className={styles.container} style={{ maxWidth: "1200px" }}>
                <div className={`card shadow-sm ${styles.roh_hostingForm_body}`}>
                    <div className="card-body px-0">
                        <div className="text-center mb-3">
                            <h1 className="h2 fw-bold mb-2">
                                Add New Item to Your Business
                            </h1>
                            <p className="text-muted mb-0">
                                Fill in the details below to add vehicles to your rental inventory
                            </p>
                        </div>
                        {loadingCategories && (
                            <p className="text-center my-4 text-muted">
                                Loading categories...
                            </p>
                        )}

                        {!loadingCategories && subCategories.length > 0 && (
                            <CategoryTabs categories={subCategories} onSelect={(cat) => setActiveSubCategory(cat)}>
                                {(category) => (
                                    <div className="card border-0">
                                        <div className={`card-body ${styles.roh_addItems_formWrapper}`}>

                                            {/* SUMMARY CARDS */}
                                            {items.filter((i) => i.sub_cat_id === category.id).length > 0 && (
                                                <div className={styles.roh_addedItem_wrapper}>
                                                    <h3 className="h6 fw-semibold d-flex align-items-center gap-2 mb-3">
                                                        Added Items{" "}
                                                        <span className="text-muted fw-normal">
                                                            ({items.filter((i) => i.sub_cat_id === category.id).length})
                                                        </span>
                                                    </h3>

                                                    <div className={styles.roh_summerycard_grid}>
                                                        {items
                                                            .filter((i) => i.sub_cat_id === category.id)
                                                            .map((item) => (
                                                                <ItemSummaryCard key={item.id} item={item}
                                                                    // 🎯 DELETE HANDLER LINKED HERE
                                                                    onDelete={() => handleDeleteItem(item.id)}
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* VEHICLE FORM */}

                                            {alert && (
                                                <div ref={alertRef} className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                                                    {alert.message}
                                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlert(null)}></button>
                                                </div>
                                            )}

                                            <h3 className="h6 fw-semibold mb-3">Add New Item</h3>

                                            <VehicleForm
                                                category={category}
                                                brands={brands}
                                                models={models}
                                                currentItem={currentItem}
                                                activeSubCategory={activeSubCategory}
                                                initializeSubCategory={initializeSubCategory}
                                                removeSubCategoryIfEmpty={removeSubCategoryIfEmpty}
                                                updateItemField={updateItemField}
                                                fetchModels={fetchModels}
                                                onSubmit={handleAddItem}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CategoryTabs>
                        )}
                    </div>
                </div>

                {/* FINAL SUBMISSION BUTTONS */}
                {items.length > 0 && (
                    <div className={`${styles.roh_additem_formFooter}`}>
                        <div className={`d-flex flex-wrap justify-content-between ${styles.roh_additem_formFooter_inner}`}>
                            <div className="d-flex flex-nowrap items-center align-content-center align-items-center gap-2">
                                <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 accent-red-600 cursor-pointer" />
                                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none">
                                    I agree to the{" "}
                                    <a href="#" className="text-red-600 hover:underline">
                                        terms and conditions
                                    </a>{" "}
                                    and confirm that all information provided is accurate.
                                </label>
                            </div>

                            <button type="button" onClick={handleFinalSubmission} disabled={!termsAccepted} className={`d-inline-flex align-items-center ${styles.roh_fromBtn}`}>
                                Submit All Items <i className="bi bi-check-circle" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}