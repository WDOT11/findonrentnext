const { pool } = require("../../../config/connection");

/** User registration validation - Coded by Raj - July 08 2025 */
const validateUserSignUp = (req, res, next) => {

    // const { userName, firstName, email, phone, password } = req.body;
    const { firstName, email, phone, password } = req.body;
    /** Validate required fields */
    // if (!userName) {
    //     return GLOBAL_ERROR_RESPONSE("User name can't be empty.", {}, res);
    // }
    if (!firstName) {
        return GLOBAL_ERROR_RESPONSE("First name can't be empty.", {}, res);
    }
    if (!email) {
        return GLOBAL_ERROR_RESPONSE("Email can't be empty.", {}, res);
    }
    if (!phone) {
        return GLOBAL_ERROR_RESPONSE("Phone can't be empty.", {}, res);
    }
    if (!password) {
        return GLOBAL_ERROR_RESPONSE("Password can't be empty.", {}, res);
    }


    /** Check if user name exists */
    // const checkUsernameQuery = `SELECT * FROM roh_users WHERE user_name = ? AND active = 1 LIMIT 1`;
    // pool.query(checkUsernameQuery, [userName], (err, usernameResult) => {
        // if (err) {
        //     return GLOBAL_ERROR_RESPONSE("Error checking for duplicate user name.", err, res);
        // }

        // if (usernameResult.length > 0) {
        //     return GLOBAL_ERROR_RESPONSE("User name already exists.", {}, res);
        // }

        /** Check if email exists */
        const checkEmailQuery = `SELECT * FROM roh_users WHERE email = ? AND active = 1 LIMIT 1`;

        pool.query(checkEmailQuery, [email], (err, emailResult) => {
            if (err) {
                return GLOBAL_ERROR_RESPONSE("Error checking for duplicate email.", err, res);
            }

            if (emailResult.length > 0) {
                return GLOBAL_ERROR_RESPONSE("Email already exists.", {}, res);
            }

            /** If both checks pass, continue */
            next();
        });
//     });
};

/** service provider registration validation - Coded by Raj - July 08 2025 */
const validateServiceProviderRegister = (req, res, next) => {

    const { userName, firstName, email, phone, password, address_1, landmark, city, state, pincode } = req.body;
    /** Validate required fields */
    if (!userName) {
        return GLOBAL_ERROR_RESPONSE("User name can't be empty.", {}, res);
    }
    if (!firstName) {
        return GLOBAL_ERROR_RESPONSE("First name can't be empty.", {}, res);
    }
    if (!email) {
        return GLOBAL_ERROR_RESPONSE("Email can't be empty.", {}, res);
    }
    if (!phone) {
        return GLOBAL_ERROR_RESPONSE("Phone can't be empty.", {}, res);
    }
    if (!password) {
        return GLOBAL_ERROR_RESPONSE("Password can't be empty.", {}, res);
    }
    if (!address_1) {
        return GLOBAL_ERROR_RESPONSE("Address 1 can't be empty.", {}, res);
    }
    if (!city) {
        return GLOBAL_ERROR_RESPONSE("City name can't be empty.", {}, res);
    }
    if (!state) {
        return GLOBAL_ERROR_RESPONSE("State name can't be empty.", {}, res);
    }
    if (!pincode) {
        return GLOBAL_ERROR_RESPONSE("Pincode can't be empty.", {}, res);
    }

    /** Check if user name exists */
    const checkUsernameQuery = `SELECT * FROM roh_users WHERE user_name = ? AND active = 1 LIMIT 1`;
    pool.query(checkUsernameQuery, [userName], (err, usernameResult) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking for duplicate user name.", err, res);
        }

        if (usernameResult.length > 0) {
            return GLOBAL_ERROR_RESPONSE("User name already exists.", {}, res);
        }

        /** Check if email exists */
        const checkEmailQuery = `SELECT * FROM roh_users WHERE email = ? AND active = 1 LIMIT 1`;

        pool.query(checkEmailQuery, [email], (err, emailResult) => {
            if (err) {
                return GLOBAL_ERROR_RESPONSE("Error checking for duplicate email.", err, res);
            }

            if (emailResult.length > 0) {
                return GLOBAL_ERROR_RESPONSE("Email already exists.", {}, res);
            }

            /** If both checks pass, continue */
            next();
        });
    });
};

/** User login validation - Fixed by Raj - March 11 2026 */
const validateUserLogin = (req, res, next) => {

    // Accept identifier (phone/email) or email fallback
    const { identifier, email, password } = req.body;

    const loginValue = identifier || email;

    // Validate email/phone
    if (!loginValue || !loginValue.trim()) {
        return res.status(400).json({
            message: "Email or Phone Number can't be empty."
        });
    }

    // Validate password
    if (!password || !password.trim()) {
        return res.status(400).json({
            message: "Password can't be empty."
        });
    }

    // If validation passes → continue
    next();
};

/** Admin login validation - Coded/Fixed by Raj - March 11 2026 */
const validateAdminUserLogin = (req, res, next) => {

    const { email, password } = req.body;

    /** Validate email */
    if (!email || !email.trim()) {
        return GLOBAL_ERROR_RESPONSE("Email can't be empty.", {}, res);
    }

    /** Validate password */
    if (!password || !password.trim()) {
        return GLOBAL_ERROR_RESPONSE("Password can't be empty.", {}, res);
    }

    /** If validation passes */
    next();
};

/** Availability check validation - Coded by Vishnu Aug 11 2025 */
const validateAvailabilityCheck = (req, res, next) => {
    // const { userName, email } = req.body;
    const { email } = req.body;
    /** Validate required fields */
    // if (!userName) {
    //     return GLOBAL_ERROR_RESPONSE("User name can't be empty.", {}, res);
    // }
    if (!email) {
        return GLOBAL_ERROR_RESPONSE("Email can't be empty.", {}, res);
    }
    // if (!phone) {
    //     return GLOBAL_ERROR_RESPONSE("Phone number can't be empty.", {}, res);
    // }

    next();
};

/** OTP Verification - Coded by Vishnu Aug 12 2025 */
const signUpvalidateOTP = (req, res, next) => {
    const { otp } = req.body;
    /** Validate required fields */
    if (!otp) {
        return GLOBAL_ERROR_RESPONSE("OTP can't be empty.", {}, res);
    }

    next();
};

/** Resend OTP - Coded by Vishnu Aug 12 2025 */
const validateResendOTP = (req, res, next) => {
    const { email } = req.body;
    /** Validate required fields */
    if (!email) {
        return GLOBAL_ERROR_RESPONSE("User name can't be empty.", {}, res);
    }

    next();
};

/** user login signInverifyOtp - Coded by Vishnu Aug 13 2025 */
const signInverifyOtp = (req, res, next) => {
    const { userId, otp } = req.body;
    /** Validate required fields */
    if (!userId) {
        return GLOBAL_ERROR_RESPONSE("User Id can't be empty.", {}, res);
    }
    if (!otp) {
        return GLOBAL_ERROR_RESPONSE("OTP can't be empty.", {}, res);
    }

    next();
};

/* Validate to get service provider details - Coded by Vishnu August 31 2025 */
const ValidateGetServiceProviderinfo = async (req, res, next) => {
    try {
        const { service_provider_id } = req.body;
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

module.exports = {validateUserSignUp, validateServiceProviderRegister, validateUserLogin, validateAdminUserLogin, validateAvailabilityCheck, signUpvalidateOTP, validateResendOTP, signInverifyOtp, ValidateGetServiceProviderinfo};