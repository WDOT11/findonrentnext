const pool = require("../../../config/connection");

/** Add new user validation Coded by Vishnu July 07 2025 */
const ValidateaddnewUser = async (req, res, next) => {
    try {
        const { user_name, email, password_hash, phone_number, address_1, pincode } = req.body;

        if (!user_name) {
            return GLOBAL_ERROR_RESPONSE("User Name is required", {}, res);
        }

        if (!email) {
            return GLOBAL_ERROR_RESPONSE("Email is required", {}, res);
        }

        if (!password_hash) {
            return GLOBAL_ERROR_RESPONSE("Password is required", {}, res);
        }

        if (password_hash.length < 8) {
            return GLOBAL_ERROR_RESPONSE("Password must be at least 8 characters", {}, res);
        }

        if (!phone_number) {
            return GLOBAL_ERROR_RESPONSE("Phone Number is required", {}, res);
        }

        if (phone_number.length !== 10) {
            return GLOBAL_ERROR_RESPONSE("Phone Number must be 10 digits", {}, res);
        }

        if (password_hash.length < 8) {
            return GLOBAL_ERROR_RESPONSE("Password must be at least 8 characters", {}, res);
        }

        if (!address_1) {
            return GLOBAL_ERROR_RESPONSE("Address is required", {}, res);
        }

        if (!pincode) {
            return GLOBAL_ERROR_RESPONSE("Pincode is required", {}, res);
        }

        const connection = pool.promise ? pool.promise() : pool;

        const [result] = await connection.execute(
            `
            SELECT user_name, email 
            FROM roh_users 
            WHERE user_name = ? OR email = ? 
            LIMIT 1
            `,
            [user_name, email]
        );

        if (result.length > 0) {
            const existing = result[0];
            if (existing.email === email) {
                return GLOBAL_ERROR_RESPONSE("Email already registered", {}, res);
            }
            if (existing.user_name === user_name) {
                return GLOBAL_ERROR_RESPONSE("Username already taken", {}, res);
            }
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Get all users validation Coded by Vishnu July 07 2025 */
const ValidateGetAllUsers = async (req, res, next) => {
    try {
        const { page, limit } = req.body;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (!pageNum || !limitNum || pageNum <= 0 || limitNum <= 0) {
            return GLOBAL_ERROR_RESPONSE("Page number and limit must be positive integers", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};


/** Edit user validation Coded by Vishnu July 07 2025 */
const ValidateEditUser = async (req, res, next) => {
    try {
        const { user_id, email, password_hash } = req.body;

        if (!user_id) {
            return GLOBAL_ERROR_RESPONSE("User ID is required", {}, res);
        }

        if (!email) {
            return GLOBAL_ERROR_RESPONSE("Email is required", {}, res);
        }
        // if (!password_hash) {
        //     return GLOBAL_ERROR_RESPONSE("Password is required", {}, res);
        // }

        const connection = pool.promise ? pool.promise() : pool;

        /** Single query that: */
        /** 1. Checks if the user_id exists */
        /** 2. Checks if the email is used by someone else */
        const [result] = await connection.execute(
            `
            SELECT 
                MAX(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS user_exists,
                MAX(CASE WHEN email = ? AND user_id != ? THEN 1 ELSE 0 END) AS email_conflict
            FROM roh_users
            `,
            [user_id, email, user_id]
        );

        const { user_exists, email_conflict } = result[0];

        if (!user_exists) {
            return GLOBAL_ERROR_RESPONSE("User not found", {}, res);
        }

        if (email_conflict) {
            return GLOBAL_ERROR_RESPONSE("Email already registered with another user", {}, res);
        }

        next(); /** All good */
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Delete user validation Coded by Vishnu July 07 2025 */
const ValidateDeleteUser = async (req, res, next) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return GLOBAL_ERROR_RESPONSE("User ID is required", {}, res);
        }

        const connection = pool.promise ? pool.promise() : pool;

        const [result] = await connection.execute(
            `SELECT user_id, active FROM roh_users WHERE user_id = ? LIMIT 1`,
            [user_id]
        );

        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("User not found", {}, res);
        }

        if (result[0].active === 0) {
            return GLOBAL_ERROR_RESPONSE("User is already deleted", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** View User details validation Coded by Vishnu July 07 2025 */
const ValidateViewUser = async (req, res, next) => {
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


/** Switch User validation Coded by Vishnu April 14 2026 */
const ValidateSwitchUser = async (req, res, next) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return GLOBAL_ERROR_RESPONSE("User ID is required for switching", {}, res);
        }

        const connection = pool.promise ? pool.promise() : pool;

        const [result] = await connection.execute(
            `SELECT user_id, active FROM roh_users WHERE user_id = ? LIMIT 1`,
            [user_id]
        );

        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("User not found", {}, res);
        }

        if (result[0].active === 0) {
            return GLOBAL_ERROR_RESPONSE("Cannot switch to an inactive user", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

module.exports = { ValidateaddnewUser, ValidateGetAllUsers, ValidateEditUser, ValidateDeleteUser, ValidateViewUser, ValidateSwitchUser };
