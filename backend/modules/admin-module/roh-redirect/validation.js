const { pool } = require("../../../config/connection");

/** add new role validation - Coded by Raj - July 07 2025 */
const validateAddRedirect = (req, res, next) => {
    const { old_url, new_url } = req.body;

    /** Validate required fields */
    // if (!old_url || !new_url) {
    //     return GLOBAL_ERROR_RESPONSE("All fields are required.", {}, res);
    // }

    next();
};



module.exports = { validateAddRedirect};
