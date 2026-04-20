const { pool } = require("../../../config/connection");

/** Add new Seo meta validation - Coded by Vishnu Oct 21, 2025 */
const ValidateaddnewSEO = async (req, res, next) => {
  try {
    const { page_slug, page_title, meta_description } = req.body;

    if (!page_slug || !page_title || !meta_description) {
      return GLOBAL_ERROR_RESPONSE("Page slug, title and description are required", {}, res);
    }

    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
  }
}

/** Validation for get all Seo meta - Coded by Vishnu Oct 21, 2025 */
const ValidateGetAllSeoMeta = async (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
  }
}

/** Validation for view single Seo meta - Coded by Vishnu Oct 21, 2025 */
const ValidateViewSingleSeoMeta = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return GLOBAL_ERROR_RESPONSE("Page ID is required", null, res);
    }
    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
  }
}

/** Validation for update Seo meta - Coded by Vishnu Oct 21, 2025 */
const ValidateUpdateSeoMeta = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return GLOBAL_ERROR_RESPONSE("Page ID is required", null, res);
    }
    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
  }
}


module.exports = { ValidateaddnewSEO, ValidateGetAllSeoMeta, ValidateViewSingleSeoMeta, ValidateUpdateSeoMeta};
