const { pool } = require("../../../config/connection");

/** Validate get all active city - Coded by Vishnu Dec 15 2025 */
const ValidategetUserActivecity = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}


/** Validate get all active parent category - Coded by Vishnu August 19 2025 */
const ValidategetUserActivecategory = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

/** Validate get all active child category - Coded by Vishnu August 20 2025 */
const ValidategetUserActivechildcategory = async (req, res, next) => {
    try {
        const { parent_category_id } = req.body;

        if (!parent_category_id || isNaN(parent_category_id)) {
            return res.status(400).json({
                success: false,
                message: "No data found",
                error: "Valid parent_category_id is required"
            });
        }

        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active child category brands - Coded by Vishnu August 20 2025 */
const ValidategetUserActivechildcategorybrands = async (req, res, next) => {
    try {
        const { child_category_id } = req.body;
            if (!child_category_id || isNaN(child_category_id)) {
            return res.status(400).json({
                success: false,
                message: "No data found",
                error: "Valid Child category id is required"
            });
        }

        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** validate get all active child category brands model - Coded by Vishnu August 21 2025 */
const ValidategetUserActivechildcategorybrandsmodel = async (req, res, next) => {
    try {
        const { brand_id } = req.body;

        if (!brand_id || isNaN(brand_id)) {
            return res.status(400).json({
                success: false,
                message: "No data found",
                error: "Valid Brand id is required"
            });
        }

        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** validate main api for become a host for add new vehicle - Coded by Vishnu August 22 2025 */
const ValidateHostAddNewVehicle = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** validate main api for login service provider items - Coded by Vishnu August 23 2025 */
const ValidateLoginServiceProviderItems = async (req, res, next) => {
    try {
        const { service_provider_id } = req.body;
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

/** validate main api for login service provider view single items - Coded by Vishnu August 25 2025 */
const ValidateLoginServiceProviderSingleItems = async (req, res, next) => {
    try {
        const { id } = req.body;
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}
/** validate main api for login service provider update single items - Coded by Vishnu Nov 25 2025 */
const ValidateUpdateVehicleItem = async (req, res, next) => {
  try {
    const body = req.body;
    let errors = {};

    // REQUIRED: ID
    if (!body.id) errors.id = "ID is required";

    // Required text fields
    const requiredText = [
      "item_name",
      "vehicle_description",
      "registration_number",
      "address_1",
      "landmark",
      "item_state",
      "city",
      "booking_instructions"
    ];

    requiredText.forEach((key) => {
      if (!body[key] || body[key].toString().trim() === "") {
        errors[key] = `${key.replace(/_/g, " ")} is required`;
      }
    });

    // Required numeric fields
    const requiredNumbers = [
      "price_per_day",
      "price_per_week",
      "price_per_month",
      "security_deposit",
      "fleet_size",
      "fuel_consumption",
      "seating_capacity",
      "mileage"
    ];

    requiredNumbers.forEach((key) => {
      if (body[key] === "" || body[key] === null || body[key] === undefined) {
        errors[key] = `${key.replace(/_/g, " ")} is required`;
      } else if (isNaN(body[key])) {
        errors[key] = `${key.replace(/_/g, " ")} must be a valid number`;
      }
    });

    // PINCODE (EXACT 6 DIGITS)
    if (!body.pincode) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(body.pincode.toString())) {
      errors.pincode = "Pincode must be exactly 6 digits";
    }

    // If any errors → stop API
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors,
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Validation exception",
      error: err.message,
    });
  }
};

/** Validate delete service provider single item - Coded by Vishnu September 06 2025 */
const ValidateDeleteServiceProviderSingleItems = async (req, res, next) => {
    try {
        const { id } = req.body;
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

const ValidategetUserBusinessData = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

const ValidateBusinessCategories = async (req, res, next) => {
  try {
    const { user_id, category_id } = req.body;

    // Validate: user_id
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    if (isNaN(user_id) || Number(user_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // Validate: category_id
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "Please select the category.",
      });
    }

    if (isNaN(category_id) || Number(category_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please select the category.",
      });
    }

    // Passed all validations
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Validation error",
      error: err.message || err,
    });
  }
};

// Validate to get brands by category
const ValidateCategortyBrands = async (req, res, next) => {
    try {
        const { cat_id } = req.body;

        // Validate: cat_id
        if (!cat_id) {
            return res.status(400).json({
                success: false,
                message: "Please select the category.",
            });
        }

        if (isNaN(cat_id) || Number(cat_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please select the category.",
            });
        }

        // Passed all validations
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Validation error",
            error: err.message || err,
        });
    }
};

// Validate to get models by brands
const ValidateBrandModels = async (req, res, next) => {
    try {
        const { brand_id } = req.body;

        // Validate: cat_id
        if (!brand_id) {
            return res.status(400).json({
                success: false,
                message: "Please select the brand.",
            });
        }

        if (isNaN(brand_id) || Number(brand_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please select the brand.",
            });
        }

        // Passed all validations
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Validation error",
            error: err.message || err,
        });
    }
};

// Validate to add the items
const ValidateAddVehicleItem = async (req, res, next) => {
    try {
        // the keys we intend to validate
        const {
            brand_id,
            condition,
            engine_type,
            model_id,
            price_per_day,
            registration_number,
            title,
            transmission,
        } = req.body;

        // Helper function for checking required IDs
        const validateId = (value, fieldName) => {
            if (!value) {
                return { success: false, message: `The ${fieldName} is required.` };
            }
            // Check if it's a number and greater than 0
            if (isNaN(value) || Number(value) <= 0) {
                return { success: false, message: `Please select a valid ${fieldName}.` };
            }
            return { success: true };
        };

        // Helper function for checking required text fields
        const validateText = (value, fieldName) => {
            if (!value || typeof value !== 'string' || value.trim().length === 0) {
                return { success: false, message: `The ${fieldName} field is required.` };
            }
            return { success: true };
        };

        // Helper function for checking price fields (required, positive number)
        // const validatePrice = (value, fieldName) => {
        //     if (!value) {
        //         return { success: false, message: `The ${fieldName} is required.` };
        //     }
        //     if (isNaN(value) || Number(value) < 0) {
        //         return { success: false, message: `Please enter a valid, positive ${fieldName}.` };
        //     }
        //     return { success: true };
        // };

        let validation;

        // Brand ID (Required)
        validation = validateId(brand_id, "Brand");
        if (!validation.success) return res.status(400).json(validation);

        // If it exists, validate it as an ID, otherwise let it pass as null/0
        if (model_id && (isNaN(model_id) || Number(model_id) < 0)) {
            return res.status(400).json({ success: false, message: "Please select a valid Model." });
        }

        // Title (Required)
        validation = validateText(title, "Title");
        if (!validation.success) return res.status(400).json(validation);

        // Engine Type (Required)
        // validation = validateText(engine_type, "Engine Type");
        // if (!validation.success) return res.status(400).json(validation);

        // Transmission (Required)
        // validation = validateText(transmission, "Transmission");
        // if (!validation.success) return res.status(400).json(validation);

        // Condition (Required)
        validation = validateText(condition, "Condition");
        if (!validation.success) return res.status(400).json(validation);

        // Registration Number (Required)
        // validation = validateText(registration_number, "Registration Number");
        // if (!validation.success) return res.status(400).json(validation);

        // Price Per Day (Required)
        // validation = validatePrice(price_per_day, "Price Per Day");
        // if (!validation.success) return res.status(400).json(validation);

        // Passed all validations
        next();
    } catch (err) {
        // This catches unexpected errors in the validation logic itself
        return res.status(500).json({
            success: false,
            message: "Internal Validation error",
            error: err.message || err,
        });
    }
};

// Validate to add the items (ValidatesubmitAllItems)
const ValidatesubmitAllItems = async (req, res, next) => {
    try {
        // --- STEP 1: Safely access and parse the stringified JSON data ---
        const submissionDataString = req.body.submission_data;

        if (!submissionDataString) {
            // This happens if the frontend sends pure JSON without a file,
            // or if the submission_data field is missing from FormData.
            // If it's pure JSON, the data is already in req.body.
            // We'll prioritize the FormData structure check here.

            // If the request doesn't contain submission_data,
            // we assume it's the pure JSON path (no file) and the data is already in req.body.
            // We use req.body directly for validation in this case.
            const { service_provider_id } = req.body;

            if (!service_provider_id) {
                return res.status(400).json({
                    success: false,
                    message: "Submission data is missing from the request body.",
                });
            }
            // If service_provider_id is found directly, skip to validation below.

            var parsedData = req.body;

        } else {
            // Data received via FormData path (file was present)
            try {
                var parsedData = JSON.parse(submissionDataString);

                // 🎯 CRITICAL: Overwrite req.body with the parsed object for the controller
                req.body = parsedData;

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid JSON format in submission_data field.",
                });
            }
        }

        // --- STEP 2: Perform Validation on the parsedData object ---
        const { service_provider_id } = parsedData;

        // Validate: user_id
        if (!service_provider_id) {
            return res.status(400).json({
                success: false,
                message: "Service Provider ID not found in submission data.",
            });
        }

        if (isNaN(service_provider_id) || Number(service_provider_id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID.",
            });
        }

        // ... (Continue with other validations like business_id, terms_accepted, etc. here) ...

        // Passed all validations
        next();
    } catch (err) {
        // This catches unexpected errors
        return res.status(500).json({
            success: false,
            message: "Internal Validation error",
            error: err.message || err,
        });
    }
};

// Validate to delete the single item data
const Validatedeleteitem = async (req, res, next) => {
    try {
        // Destructure the required fields.
        // Frontend is sending 'id' and 'service_provider_id'.
        const { id, service_provider_id } = req.body;

        // Helper function to validate ID presence and format (Number > 0)
        const validateNumericId = (value, fieldName) => {
            if (!value) {
                return { success: false, message: `Missing required field: ${fieldName}.` };
            }
            // Check if it's a valid positive number
            if (isNaN(value) || Number(value) <= 0) {
                return { success: false, message: `Invalid ${fieldName} provided.` };
            }
            return { success: true };
        };

        let validationResult;

        // 1. Validate Item ID ('id')
        validationResult = validateNumericId(id, "Item ID");
        if (!validationResult.success) {
            return res.status(400).json(validationResult);
        }

        // 2. Validate Service Provider ID ('service_provider_id')
        validationResult = validateNumericId(service_provider_id, "Service Provider ID");
        if (!validationResult.success) {
            return res.status(400).json(validationResult);
        }

        // Passed all validations
        next();
    } catch (err) {
        console.error("Delete Validation Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal validation error occurred.",
            error: err.message || "Unknown error",
        });
    }
};

module.exports = {
    ValidategetUserActivecity,
    ValidategetUserActivecategory,
    ValidategetUserActivechildcategory,
    ValidategetUserActivechildcategorybrands,
    ValidategetUserActivechildcategorybrandsmodel,
    ValidateHostAddNewVehicle,
    ValidateLoginServiceProviderItems,
    ValidateLoginServiceProviderSingleItems,
    ValidateUpdateVehicleItem,
    ValidateDeleteServiceProviderSingleItems,
    ValidategetUserBusinessData,
    ValidateBusinessCategories,
    ValidateCategortyBrands,
    ValidateBrandModels,
    ValidateAddVehicleItem,
    ValidatesubmitAllItems,
    Validatedeleteitem
};