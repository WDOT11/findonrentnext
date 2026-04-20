const { pool } = require("../../../config/connection");

/** Add new faqs validation - Coded by Vishnu Oct 14, 2025 */
const ValidateaddnewFaqs = async (req, res, next) => {
  try {
      const { title, description } = req.body;

      if (!title || !description) {
        return GLOBAL_ERROR_RESPONSE("Title and description are required", {}, res);
      }

      next();
    } catch (err) {
      console.error("Validation error:", err);
      return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

/** Get all faqs list validation - Coded by Vishnu Oct 14, 2025 */
const ValidateGetAllFaqs = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

/** single faq view validation - Coded by Vishnu Oct 14, 2025 */
const ValidateViewSingleFaq = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            return GLOBAL_ERROR_RESPONSE("Post ID is required", null, res);
        }
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}

/** update faq validation - Coded by Vishnu Oct 14, 2025 */
const ValidateUpdateFaq = async (req, res, next) => {
    try {
        const { id, title, description } = req.body;
        if (!id) {
            return GLOBAL_ERROR_RESPONSE("FAQs ID is required", null, res);
        }
        if (!title || !description) {
            return GLOBAL_ERROR_RESPONSE("Title and description are required", {}, res);
        }
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
}


module.exports = { ValidateaddnewFaqs, ValidateGetAllFaqs, ValidateViewSingleFaq, ValidateUpdateFaq };
