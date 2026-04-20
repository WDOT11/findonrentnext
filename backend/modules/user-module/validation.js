const { pool } = require("../../config/connection");

/** Validate user details - Coded by Vishnu August 15 2025 */
const ValidategetUserDtls = async (req, res, next) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return GLOBAL_ERROR_RESPONSE("User ID is required", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Validate user details edit - Coded by Vishnu August 15 2025 */
const ValidateEditUserDtls = async (req, res, next) => {
    try {
        const { user_id, first_name, last_name, phone_number, address_1, landmark, state, city, pincode } = req.body;

        if (!user_id) {
            return GLOBAL_ERROR_RESPONSE("User ID is required", {}, res);
        }
        if (!first_name) {
            return res.status(400).json({ message: 'Firtst name is required' });
        }
        if (!last_name) {
            return res.status(400).json({ message: 'Last name is required' });
        }
        if (!phone_number) {
            return res.status(400).json({ message: 'Phone number is required' });
        }
        if (phone_number.length !== 10) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' });
        }
        if (!pincode) {
            return res.status(400).json({ message: 'Pincode is required' });
        }
        // if (pincode.length !== 6) {
        //     return res.status(400).json({ message: 'Pincode must be 6 digits' });
        // }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

module.exports = {ValidategetUserDtls, ValidateEditUserDtls};