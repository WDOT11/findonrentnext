const { pool } = require("../../../config/connection");

/** Add new settings validation - Coded by Vishnu Dec 23, 2025 */
const ValidateaddnewSettings = async (req, res, next) => {
  try {

    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
  }
}

/** Get settings validation - Coded by Vishnu Jan 03, 2026 */
const ValidateGetallSettings = async (req, res, next) => {
  try {

    next();
  } catch (err) {
    console.error("Validation error:", err);
    return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
  }
}



module.exports = { ValidateaddnewSettings, ValidateGetallSettings};
