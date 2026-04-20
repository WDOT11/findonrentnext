const { pool } = require("../../../config/connection");

/** Validate get all active vehicles cars - Coded by Vishnu August 29 2025 */
const ValidateGetAllActivevehiclesCars = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active vehicles cars with drivers - Coded by Vishnu Dec 12 2025 */
const ValidateGetAllActivevehiclesCarsWithDrivers = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active vehicles bikes - Coded by Vishnu Oct 01 2025 */
const ValidateGetAllActivevehiclesBikes = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};


/** Validate get all active vehicles scooters - Coded by Vishnu Oct 16 2025 */
const ValidateGetAllActivevehiclesScooters = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active Recreational Vehicles - Coded by Vishnu Oct 31 2025 */
const ValidateGetAllActiveRecreationalVehicles = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active Luxury Vehicles - Coded by Vishnu Oct 31 2025 */
const ValidateGetAllActiveLuxuryVehicles = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active Commercial Vehicles - Coded by Vishnu Oct 31 2025 */
const ValidateGetAllActiveCommercialVehicles = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate view single product - Coded by Vishnu August 29 2025 */
const ValidateViewSingleProduct = async (req, res, next) => {
    try {
        // const { id } = req.body;
        const { id } = req.params;
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate to get single category recent 4 post/blogs- Coded by Vishnu Oct 13 2025 */
const ValidateGetSingleCategoryRecentPosts = async (req, res, next) => {
    try {
    const { category_slug } = req.body;

    /** Check if category_slug missing or invalid */
    if (!category_slug) {
      return res.status(400).json({
        status: false,
        message: "Valid category_slug is required.",
      });
    }

    /** All good, continue to controller */
    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE(
      "Validation error",
      { error: err.message || err },
      res
    );
  }
};


/** Validate to get single category recent 3 FAQs- Coded by Vishnu Oct 14 2025 */
const ValidateGetSingleCategoryRecentFaqs = async (req, res, next) => {
    const { cate_id } = req.body;

    if (!cate_id) {
        return res.status(400).json({
        status: false,
        message: "cate_id is required",
        });
    }

    next();
};


/** Validate to create a new contact us entry - Coded by Vishnu Oct 14 2025 */
const ValidateCreateContactUsEntry = async (req, res, next) => {
    try {
        const { full_name, email, phone, subject, message } = req.body;
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate get all active blogs - Coded by Vishnu Oct 17 2025 */
const ValidateGetAllActiveBlogs = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate to get single blog - Coded by Vishnu Oct 18 2025 */
const ValidateViewSingleBlog = async (req, res, next) => {
  try {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ message: "Slug required" });
    next();
  } catch (err) {
    console.error("Validation error:", err);
    return res.status(500).json({ message: "Validation error" });
  }
};

/** Validate to get Seo Meta Data - Coded by Vishnu Oct 21 2025 */
const ValidateGetSeoMetaData = async (req, res, next) => {
  try {
    const { slug } = req.body;
    if (!slug) {
      return res.status(400).json({
        status: false,
        message: "Slug is required",
      });
    }
    next();
  } catch (err) {
    console.error("Validation error:", err);
    return res.status(500).json({
      status: false,
      message: "Validation error",
      error: err.message || err,
    });
  }
};

/** Validate get all active available city - Coded by Vishnu Jan 02 2026 */
const ValidategetUserAvailableActivecity = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

module.exports = {ValidateGetAllActivevehiclesCars, ValidateGetAllActivevehiclesCarsWithDrivers, ValidateGetAllActivevehiclesBikes, ValidateGetAllActivevehiclesScooters, ValidateGetAllActiveRecreationalVehicles, ValidateGetAllActiveLuxuryVehicles, ValidateGetAllActiveCommercialVehicles, ValidateViewSingleProduct, ValidateGetSingleCategoryRecentPosts, ValidateGetSingleCategoryRecentFaqs, ValidateCreateContactUsEntry, ValidateGetAllActiveBlogs, ValidateViewSingleBlog, ValidateGetSeoMetaData, ValidategetUserAvailableActivecity};