// VehicleForm.js

"use client";

import { useState, useEffect } from "react";
import { LuUpload, LuX, LuBookmark, LuMinus, LuPlus } from "react-icons/lu";
import styles from "../additem.module.css";

export const VehicleForm = ({category, brands, activeSubCategory, currentItem, initializeSubCategory, removeSubCategoryIfEmpty, updateItemField, fetchModels, onSubmit, models = []}) => {

    const [alert, setAlert] = useState(null);
    const [formErrors, setFormErrors] = useState({}); // State to hold inline errors
    const [imagePreviews, setImagePreviews] = useState([]);

    const currentFleetSize = currentItem?.fleetSize ? Number(currentItem.fleetSize) : 0;
    const currentImageUrls = currentItem?.image || [];

    useEffect(() => {
        setImagePreviews(currentItem?.image || []);
    }, [currentItem?.image]);

    const handleInputChange = (field, value) => {
        if (!activeSubCategory) return;

        // 1. Update the parent state with the field's new value
        updateItemField(activeSubCategory.id, field, value);

        // 2. Clear inline error for the current field
        setFormErrors(prev => ({...prev, [field]: ''}));

        // 3. BRAND SELECT
        if (field == "brand_id") {
            if (value) {
                fetchModels(value);
            }
        }

        // 4. BRAND UNSELECT → remove subcategory if empty (Keep this existing logic)
        if (field == "brand_id" && value == null) {
            removeSubCategoryIfEmpty(activeSubCategory.id);
        }
    };

    // Multiple IMAGE UPLOAD Handler (Logic remains the same)
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0 || !activeSubCategory) return;

        e.target.value = null;

        const existingImageFiles = currentItem?.imageFiles || [];
        const existingPreviewUrls = currentImageUrls;

        const newImageFiles = [...existingImageFiles, ...files];
        updateItemField(activeSubCategory.id, "imageFiles", newImageFiles);
        setFormErrors(prev => ({...prev, imageFiles: ''}));

        const previewPromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previewPromises).then(newPreviewUrls => {
            const combinedPreviews = [...existingPreviewUrls, ...newPreviewUrls];
            updateItemField(activeSubCategory.id, "image", combinedPreviews);
            setImagePreviews(combinedPreviews);
        });
    };

    // Function to remove a specific image by its index (Logic remains the same)
    const handleImageRemove = (indexToRemove) => {
        const existingPreviewUrls = currentImageUrls;
        const existingImageFiles = currentItem?.imageFiles || [];

        const updatedPreviews = existingPreviewUrls.filter((_, index) => index !== indexToRemove);
        const updatedFiles = existingImageFiles.filter((_, index) => index !== indexToRemove);

        updateItemField(activeSubCategory.id, "image", updatedPreviews);
        updateItemField(activeSubCategory.id, "imageFiles", updatedFiles);

        setImagePreviews(updatedPreviews);
    };


    // Updated SUBMIT HANDLER (Logic remains the same)
    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        const getItemValue = (field) => currentItem?.[field];


        // Validation checks...
        if (!getItemValue("brand_id")) { errors.brand_id = "Please select a Brand."; }
        if (!getItemValue("model_id")) { errors.model_id = "Please select a Model."; }
        if (!getItemValue("fleetSize") || Number(getItemValue("fleetSize")) <= 0) { errors.fleetSize = "Fleet Size must be greater than 0."; }
        if (!getItemValue("title") || getItemValue("title").trim() === "") { errors.title = "Item Name is required."; }
        // if (!getItemValue("pricePerDay") || Number(getItemValue("pricePerDay")) <= 0) { errors.pricePerDay = "Price Per Day must be specified (> 0)."; }
        // if (!getItemValue("engineType") || getItemValue("engineType").trim() === "") { errors.engineType = "Engine Type is required."; }
        // if (!getItemValue("transmission") || getItemValue("transmission").trim() === "") { errors.transmission = "Transmission Type is required."; }
        // if (!getItemValue("registrationNumber") || getItemValue("registrationNumber").trim() === "") { errors.registrationNumber = "Registration Number is required."; }
        if (!getItemValue("condition") || getItemValue("condition").trim() === "") { errors.condition = "Vehicle Condition is required."; }
        // if (!currentItem?.imageFiles || currentItem.imageFiles.length === 0) { errors.imageFiles = "Please upload at least one Image."; }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            setAlert({
                type: "danger",
                message: `Please correct the ${Object.keys(errors).length} errors shown below.`,
            });
            return;
        }

        setAlert(null);
        onSubmit(activeSubCategory.id);
        setAlert({ type: "success", message: "Item added successfully!" });
    };

    const brandId = currentItem?.brand_id ?? null;
    const modelId = currentItem?.model_id ?? null;

    return (
        <form onSubmit={handleSubmit} className={` ${styles.roh_additemForm}`}>
            {/* Brand Selection */}
            <div className="mb-3">
                <label className="form-label fw-semibold"> Select Brand <span>*</span></label>
                <div className="d-flex flex-wrap gap-2">
                    {brands.map((brand) => (
                        <button type="button" key={brand.id} className={brandId == brand.id ? styles.roh_brandtab_active : styles.roh_brandtab} 
                            onClick={() => {
                                if (brandId == brand.id) {
                                    handleInputChange("brand_id", null);
                                } else {
                                    handleInputChange("brand_id", brand.id);
                                }
                                setFormErrors(prev => ({...prev, brand_id: ''})); // Clear error
                            }}
                        > {brand.brand_name} </button>
                    ))}
                </div>
                {formErrors.brand_id && <div className={styles.roh_error_message}>{formErrors.brand_id}</div>}
            </div>

            {/* Model Selection (No error validation needed here) */}
            {brandId && (
                <div className="mb-3">
                    <label className="form-label fw-semibold">Select Model <span>*</span></label>
                    <div className="d-flex flex-wrap gap-2">
                        {models.map((model) => (
                            <button type="button" key={model.id} className={modelId == model.id ? styles.roh_brandtab_active : styles.roh_brandtab}
                                onClick={() => {
                                    if (currentItem?.model_id == model.id) {
                                        updateItemField(activeSubCategory.id, "model_id", null);
                                        updateItemField(activeSubCategory.id, "description", "");
                                        updateItemField(activeSubCategory.id, "tag_id", null);
                                    } else {
                                        updateItemField(activeSubCategory.id, "model_id", model.id);
                                        updateItemField(activeSubCategory.id, "description", model.description || "");
                                        updateItemField(activeSubCategory.id, "tag_id", model.tag_id || null);
                                    }
                                }}
                            > {model.model_name} </button>
                        ))}
                    </div>
                    {formErrors.model_id && <div className={styles.roh_error_message}>{formErrors.model_id}</div>}
                </div>
            )}

            {/* Item Name */}
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <div className="m-0">
                        <label htmlFor="title" className="form-label fw-semibold"> Item Name <span>*</span> </label>
                        <input type="text" id="title" className={`form-control ${formErrors.title ? styles.is_invalid : ''}`} placeholder="Item Name" value={currentItem?.title ?? ""} onChange={(e) => handleInputChange("title", e.target.value)} required/>
                    </div>
                    {formErrors.title && <div className={styles.roh_error_message}>{formErrors.title}</div>}
                </div>

                {/* Fleet Size */}
                <div className="col-md-6">
                    <label htmlFor="fleetSize" className="form-label fw-semibold"> Fleet Size <span>*</span></label>
                    <div className={`d-flex align-items-center ${styles.roh_fleetInput_group}`}>

                        <button type="button" className="btn btn-outline-secondary" onClick={() => handleInputChange("fleetSize", Math.max(currentFleetSize - 1, 0))}><LuMinus size={20}/></button>

                        <input id="fleetSize" type="text" value={currentFleetSize} className={`form-control text-center fw-semibold ${formErrors.fleetSize ? styles.is_invalid : ''}`} style={{ fontSize: "18px", border: "none", background: "transparent" }}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");

                            if (val === "") {
                            handleInputChange("fleetSize", "");
                            return;
                            }

                            let num = Number(val);
                            if (num < 0) num = 0;
                            if (num > 1000) num = 1000;
                            handleInputChange("fleetSize", num);
                        }}
                        />

                        <button type="button" className="btn btn-outline-secondary" onClick={() => handleInputChange("fleetSize", currentFleetSize + 1)}><LuPlus size={20}/></button>

                    </div>
                    {formErrors.fleetSize && <div className={styles.roh_error_message}>{formErrors.fleetSize}</div>}
                </div>
            </div>

            {/* Description (No validation needed here) */}
            <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">
                    Vehicle Description
                </label>
                <textarea id="description" className="form-control" rows="3" placeholder="Vehicle Description" value={currentItem?.description ?? ""} onChange={(e) => updateItemField(activeSubCategory.id, "description", e.target.value)}></textarea>
            </div>

            {/* Image Upload Block */}
            <div className="mb-4">
                <label className="form-label fw-semibold">Add Image</label>
                <div className={styles.roh_additems_uploadImage}>

                    {currentImageUrls.length > 0 ? (
                        <>
                            {/* Image Gallery Loop */}
                            <div className={styles.roh_image_gallery}>
                                {currentImageUrls.map((src, index) => (
                                    <div key={index} className="position-relative d-inline-block m-2">
                                        <img src={src} alt={`Preview ${index + 1}`} className="img-fluid rounded" style={{ maxHeight: "100px", maxWidth: "100px", objectFit: "cover" }}/>
                                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" onClick={() => handleImageRemove(index)}>
                                            <LuX size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Upload More Link */}
                            <label htmlFor="image-upload" className={`w-100 ${styles.cursor_pointer} mt-3 text-center border-top pt-3`}>
                                <p className="mb-1 text-primary fw-semibold">Click to add more images</p>
                            </label>
                        </>
                    ) : (
                        // Initial Upload Box
                        <label htmlFor="image-upload" className={`w-100 ${styles.cursor_pointer} ${formErrors.imageFiles ? styles.is_invalid_upload : ''}`}>
                            <LuUpload size={32} stroke="#ff3600" className="mb-2" />
                            <p className="mb-1">Click to upload or drag and drop</p>
                            <p className="text-muted small">Supported: JPG, PNG</p>
                        </label>
                    )}

                    {/* ERROR DISPLAY for Images */}
                    {formErrors.imageFiles && <div className={styles.roh_error_message}>{formErrors.imageFiles}</div>}

                    {/* The Hidden File Input */}
                    <input id="image-upload" type="file" name="imageFile" multiple accept="image/jpeg,image/png" onChange={handleImageUpload} className="d-none" />
                </div>
            </div>

            {/* Pricing */}
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold"> Price Per Day{/* <span>*</span> */} </label>
                    <input type="number" className={`form-control ${formErrors.pricePerDay ? styles.is_invalid : ''}`} placeholder="Price Per Day" value={currentItem?.pricePerDay ?? ""} onChange={(e) => handleInputChange("pricePerDay", e.target.value)}/>
                    {formErrors.pricePerDay && <div className={styles.roh_error_message}>{formErrors.pricePerDay}</div>}
                </div>

                {/* <div className="col-md-6">
                    <label className="form-label fw-semibold">Price Per Week</label>
                    <input type="number" className="form-control" placeholder="Price Per Week" value={currentItem?.pricePerWeek ?? ""} onChange={(e) => handleInputChange("pricePerWeek", e.target.value)} />
                </div> */}

                {/* <div className="col-md-6">
                    <label className="form-label fw-semibold">Price Per Month</label>
                    <input type="number" className="form-control" placeholder="Price Per Month" value={currentItem?.pricePerMonth ?? ""} onChange={(e) => handleInputChange("pricePerMonth", e.target.value)}/>
                </div> */}

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Security Deposit</label>
                    <input type="number" className="form-control" placeholder="Security Deposit" value={currentItem?.securityDeposit ?? ""} onChange={(e) => handleInputChange("securityDeposit", e.target.value)}/>
                </div>
            </div>

            {/* Additional Fields */}
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Availability Status</label>
                    <select className="form-select" value={currentItem?.availability ?? ""} onChange={(e) => handleInputChange("availability", e.target.value)}>
                        <option value="" disabled> Select Availability </option>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Under Maintenance</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold"> Engine Type </label>
                    <select value={currentItem?.engineType ?? ""} className={`form-select ${formErrors.engineType ? styles.is_invalid : ''}`} onChange={(e) => handleInputChange("engineType", e.target.value)}>
                        <option value="" disabled> Select Engine Type </option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="CNG">CNG</option>
                    </select>
                    {formErrors.engineType && <div className={styles.roh_error_message}>{formErrors.engineType}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold"> Transmission Type </label>
                    <select value={currentItem?.transmission ?? ""} className={`form-select ${formErrors.transmission ? styles.is_invalid : ''}`} onChange={(e) => handleInputChange("transmission", e.target.value)}>
                        <option value="" disabled> Select Transmission Type </option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                    </select>
                    {formErrors.transmission && <div className={styles.roh_error_message}>{formErrors.transmission}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold"> Registration Number{/* <span>*</span> */}</label>
                    <input type="text" placeholder="Registration Number" value={currentItem?.registrationNumber ?? ""} className={`form-control ${formErrors.registrationNumber ? styles.is_invalid : null}`} onChange={(e) => handleInputChange("registrationNumber", e.target.value)}/>
                    {formErrors.registrationNumber && <div className={styles.roh_error_message}>{formErrors.registrationNumber}</div>}
                </div>
            </div>

            {/* Vehicle Condition */}
            <div className="mb-3">
                <label className="form-label fw-semibold"> Vehicle Condition <span>*</span></label>
                <select value={currentItem?.condition ?? ""} className={`form-select ${formErrors.condition ? styles.is_invalid : ''}`} onChange={(e) => handleInputChange("condition", e.target.value)}>
                    <option value="" disabled> Select Vehicle Condition </option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    {/* <option value="Refurbished">Refurbished</option> */}
                </select>
                {formErrors.condition && <div className={styles.roh_error_message}>{formErrors.condition}</div>}
            </div>

            {/* Booking Instructions */}
            <div className="mb-4">
                <label className="form-label fw-semibold">Booking Instructions</label>
                <textarea className="form-control" rows="3" placeholder="Booking Instructions" value={currentItem?.bookingInstructions ?? ""} onChange={(e) => handleInputChange("bookingInstructions", e.target.value)}></textarea>
            </div>

            {/* Submit */}
            <div className={styles.roh_additeamsaveBtn_wrapper}>
                <button type="submit" className={styles.roh_fromsaveBtn}>
                    <LuBookmark /> Save & Add More
                </button>
            </div>
        </form>
    );
};