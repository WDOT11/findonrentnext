const pool = require("../../../config/connection");

/** Add new state validation Coded by Vishnu July 04 2025 */
const ValidateaddnewState = async (req, res, next) => {
    const { state_name, state_slug } = req.body;

    /** Validate required fields */
    if (!state_name || !state_slug) {
        return GLOBAL_ERROR_RESPONSE("State Name and Slug are required", {}, res);
    }

    /** Check if state_slug already exists in the database */
    const checkQuery = `
        SELECT * FROM roh_states WHERE state_slug = ?
    `;
    
    try {
        const [result] = await pool.query(checkQuery, [state_slug]);

        if (result.length > 0) {
            return GLOBAL_ERROR_RESPONSE("State with this slug already exists", {}, res);
        }

        /** If everything is okay, proceed to the next middleware/controller */
        next();

    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Error checking state slug", err, res);
    }
};

/** Get all state validation Coded by Vishnu July 04 2025 */
const ValidategetallState = async (req, res, next) => {
    try {
        const page = parseInt(req.body.page);
        const limit = parseInt(req.body.limit);

        if (!page || page < 1) {
            return GLOBAL_ERROR_RESPONSE("Page number must be a positive integer", {}, res);
        }

        if (!limit || limit < 1) {
            return GLOBAL_ERROR_RESPONSE("Limit must be a positive integer", {}, res);
        }

        const connection = pool.promise ? pool.promise() : pool;
        const [result] = await connection.query(`SELECT 1 FROM roh_states WHERE active = 1 LIMIT 1`);

        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("No active states found", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error in ValidategetallState:", err);
        return GLOBAL_ERROR_RESPONSE("Error validating states", { error: err.message || err }, res);
    }
};

/** Edit state validation Coded by Vishnu July 04 2025 */
const ValidateeditState = async (req, res, next) => {
    /** Destructure the data from the request body */
    const { state_id, state_name, state_slug } = req.body;

    /** Validate that state_id, state_name, and state_slug are present */
    if (!state_id || !state_name || !state_slug) {
        return GLOBAL_ERROR_RESPONSE("State ID, Name, and Slug are required", {}, res);
    }

    /** If validation passes, proceed to the next middleware/controller */
    next();
};

/** Delete state validation Coded by Vishnu July 04 2025 */
const ValidateDeleteState = async (req, res, next) => {
    /** Destructure the state_id from the request body */
    const { state_id } = req.body;

    /** Validate if state_id is provided */
    if (!state_id) {
        return GLOBAL_ERROR_RESPONSE("State ID is required", {}, res);
    }

    /** If validation passes, call the next middleware/controller */
    next();
};

/** Get single state validation Coded by Vishnu July 22 2025 */
const ValidateSingleState = async (req, res, next) => {

    /** Destructure the state_id from the request body */
    const { state_id } = req.body;

    /** Validate if state_id is provided */
    if (!state_id) {
        return GLOBAL_ERROR_RESPONSE("State ID is required", {}, res);
    }

    /** If validation passes, call the next middleware/controller */
    next();
};

/** Get all Active state id & name validation Coded by Vishnu July 24 2025 */
const ValidateAllActiveState = async (req, res, next) => {

    /** If validation passes, call the next middleware/controller */
    next();
};

module.exports = { ValidateaddnewState, ValidategetallState, ValidateeditState, ValidateDeleteState, ValidateSingleState, ValidateAllActiveState };