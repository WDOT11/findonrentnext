const { pool } = require("../../../config/connection");

/** Validate to get all contact us entries - Coded by Vishnu Oct 14 2025 */
const ValidateGetAllContactUsEntries = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }

};

/** Validate to view single contact us entry - Coded by Vishnu Oct 14 2025 */
const ValidateViewSingleContactUsEntry = async (req, res, next) => {
    try {
        const { id } = req.body;
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate to reply single contact us entry - Coded by Vishnu Feb 20 2026 */
const ValidateViewSingleContactUsreply = async (req, res, next) => {
    try {
        // const { id } = req.body;
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate to delete single contact us entry - Coded by Vishnu April 18 2026 */
const ValidateDeleteContactUsEntry = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required",
            });
        }
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { ValidateGetAllContactUsEntries, ValidateViewSingleContactUsEntry, ValidateViewSingleContactUsreply, ValidateDeleteContactUsEntry };
