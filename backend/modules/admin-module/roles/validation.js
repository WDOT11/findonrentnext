const { pool } = require("../../../config/connection");

/** add new role validation - Coded by Raj - July 07 2025 */
const validateAddRole = (req, res, next) => {
    const { name } = req.body;

    /** Validate required fields */
    if (!name) {
        return GLOBAL_ERROR_RESPONSE("Role name can't be empty.", {}, res);
    }

    /** SQL query to check if the role with the same name already exists */
    const checkQuery = `SELECT * FROM roh_roles WHERE name = ? AND active = 1 LIMIT 1`;

    /** Execute the query to check for duplicate role name */
    pool.query(checkQuery, [name], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking for duplicate role name.", err, res);
        }

        /** If a role exists, return an error */
        if (result.length > 0) {
            return GLOBAL_ERROR_RESPONSE("Role name already exists.", {}, res);
        }

        /** If validation passes, proceed to the next middleware/controller */
        next();
    });
};

/** Get all cities validation - Coded by Raj - July 07 2025 */
const validateGetRole = (req, res, next) => {
    /** Get page and limit from query parameters */
    const page = parseInt(req.body.page); /** Parse the page as an integer */
    const limit = parseInt(req.body.limit); /** Parse the limit as an integer */

    /** Validate if both page and limit are provided and are positive integers */
    if (!page || page < 1 || !limit || limit < 1) {
        return GLOBAL_ERROR_RESPONSE("Page number and limit must be positive integers", {}, res);
    }

    /** If validation passes, call the next middleware/controller */
    next();
};


/** Edit role validation - Coded by Raj - July 07 2025 */
const validateUpdateRole = (req, res, next) => {
    const { id, name, edit_id } = req.body;

    /** Validate required fields */
    if (!name || !edit_id) {
        return GLOBAL_ERROR_RESPONSE("Role name and edit ID can't be empty.", {}, res);
    }

    /** SQL query to check if the role exists in the roh_roles table */
    // const roleCheckQuery = `SELECT id FROM roh_roles WHERE id = ? AND active = 1`;
    const roleCheckQuery = `SELECT id FROM roh_roles`;

    /** Step 1: Check if the role exists */
    pool.query(roleCheckQuery, [id], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking role ID.", err, res);
        }

        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Invalid Role. The role does not exist or is inactive.", {}, res);
        }

        /** Step 2: Check if another role with the same name exists */
        const duplicateCheckQuery = `SELECT id FROM roh_roles WHERE name = ? AND id != ? AND active = 1`;

        pool.query(duplicateCheckQuery, [name, id], (err2, result2) => {
            if (err2) {
                return GLOBAL_ERROR_RESPONSE("Error checking for duplicate role name.", err2, res);
            }

            if (result2.length > 0) {
                return GLOBAL_ERROR_RESPONSE("Role name already exists.", {}, res);
            }

            /** All validations passed */
            next();
        });
    });
};

/** Delete city validation - Coded by Raj - July 07 2025 */
const validateDeleteRole = (req, res, next) => {
    const { role_id } = req.body;

    /** Validate required fields */
    if (!role_id) {
        return GLOBAL_ERROR_RESPONSE("Role ID is required", {}, res);
    }

    /** SQL query to check if the id exists in the roh_roles table */
    const roleCheckQuery = `SELECT id FROM roh_roles WHERE id = ? AND active = 1`;

    /** Proceed with checking if the id exists and is active in roh_roles */
    pool.query(roleCheckQuery, [role_id], (err, result) => {
        if (err) {
            return GLOBAL_ERROR_RESPONSE("Error checking role ID", err, res);
        }

        /** If no matching role is found, return an error */
        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Invalid role ID. The role ID does not exist or is inactive.", {}, res);
        }

        /** If all validations pass, proceed to the next middleware/controller */
        next();
    });
};

/** Get all roles and IDs validation - Coded by Vishnu - July 12 2025 */
const validateGetRoles = (req, res, next) => {
    /** If validation passes, proceed to the next middleware/controller */
    next();
};

/** View role details validation - Coded by Vishnu - July 17 2025 */
const validateViewRole = (req, res, next) => {
    /** If validation passes, proceed to the next middleware/controller */
    next();
};


module.exports = { validateAddRole, validateGetRole, validateUpdateRole, validateDeleteRole, validateGetRoles, validateViewRole};
