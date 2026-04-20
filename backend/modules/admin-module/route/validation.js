const pool = require("../../../config/connection");

/** Add New route validation Coded by Vishnu July 07 2025 */
const ValidateaddnewRoute = async (req, res, next) => {
    try {
        const { route_name, access_type, route_type, group_name } = req.body;

        /** Validate required fields */
        if (!route_name) {
            return GLOBAL_ERROR_RESPONSE("Route name is required", {}, res);
        }

        if (!access_type) {
            return GLOBAL_ERROR_RESPONSE("Access type is required", {}, res);
        }

        if (!route_type) {
            return GLOBAL_ERROR_RESPONSE("Route type is required", {}, res);
        }

        if (!group_name) {
            return GLOBAL_ERROR_RESPONSE("Group name is required", {}, res);
        }

        /** Setup pool promise connection */
        const connection = pool.promise ? pool.promise() : pool;

        /** Check for duplicate route_name */
        const [existing] = await connection.execute(
            "SELECT id FROM roh_routes WHERE route_name = ? AND active = 1 LIMIT 1",
            [route_name]
        );

        if (existing.length > 0) {
            return GLOBAL_ERROR_RESPONSE("Route already exists", {}, res);
        }

        /** All good */
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Get all routes validation Coded by Vishnu July 07 2025 */
const ValidateGetAllRoutes = async (req, res, next) => {
    try {
        const { page, limit } = req.body;

        if (!page || !limit) {
            return GLOBAL_ERROR_RESPONSE("Page number and limit must be provided", {}, res);
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
            return GLOBAL_ERROR_RESPONSE("Page number and limit must be positive integers", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};


/** Edit route validation Coded by Vishnu July 07 2025 */
const ValidateEditRoute = async (req, res, next) => {
    try {
        const { route_id, route_name, access_type, route_type, group_name } = req.body;

        if (!route_id) return GLOBAL_ERROR_RESPONSE("Route ID is required", {}, res);
        if (!route_name) return GLOBAL_ERROR_RESPONSE("Route name is required", {}, res);
        if (!access_type) return GLOBAL_ERROR_RESPONSE("Access type is required", {}, res);
        if (!route_type) return GLOBAL_ERROR_RESPONSE("Route type is required", {}, res);
        if (!group_name) return GLOBAL_ERROR_RESPONSE("Group name is required", {}, res);

        const connection = pool.promise ? pool.promise() : pool;

        const [rows] = await connection.execute(
            `SELECT 
                (SELECT COUNT(*) FROM roh_routes WHERE id = ?) AS route_exists,
                (SELECT COUNT(*) FROM roh_routes WHERE route_name = ? AND id != ? AND active = 1) AS duplicate_route
            `,
            [route_id, route_name, route_id]
        );

        const { route_exists, duplicate_route } = rows[0];

        if (route_exists === 0) {
            return GLOBAL_ERROR_RESPONSE("Route not found", {}, res);
        }

        if (duplicate_route > 0) {
            return GLOBAL_ERROR_RESPONSE("Route already exists", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Delete route validation Coded by Vishnu July 07 2025 */
const ValidateDeleteRoute = async (req, res, next) => {
    try {
        const { route_id } = req.body;

        if (!route_id) {
            return GLOBAL_ERROR_RESPONSE("Route ID is required", {}, res);
        }

        const connection = pool.promise ? pool.promise() : pool;

        const [result] = await connection.execute(
            `SELECT id, active FROM roh_routes WHERE id = ? LIMIT 1`,
            [route_id]
        );

        if (result.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Route not found", {}, res);
        }

        if (result[0].active === 0) {
            return GLOBAL_ERROR_RESPONSE("Route is already deleted", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** View route validation Coded by Vishnu July 07 2025 */
const ValidateViewRoute = async (req, res, next) => {
    try {
        const { route_id } = req.body;

        if (!route_id) {
            return GLOBAL_ERROR_RESPONSE("Route ID is required", {}, res);
        }

        next();
    } catch (err) {
        console.error("Validation error:", err);
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

/** Export all validation functions */
module.exports = { ValidateaddnewRoute, ValidateGetAllRoutes, ValidateEditRoute, ValidateDeleteRoute, ValidateViewRoute};