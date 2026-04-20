const { pool } = require('../../../config/connection');  /** Import the pool */

function RoutesApi() {
    /** Add new Route in roh_routes table Coded by Vishnu July 07 2025 */
    this.AddNewAdminRoute = async (req, res) => {
        try {
            const {
                route_name,
                access_type,
                route_type,
                group_name,
                add_id = 1,
                edit_id = 1
            } = req.body;

            /** SQL insert query for roh_routes */
            const query = `
                INSERT INTO roh_routes (
                    route_name,
                    access_type,
                    route_type,
                    group_name,
                    add_id,
                    edit_id,
                    active
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            /** Execute the query */
            pool.execute(
                query,
                [route_name, access_type, route_type, group_name, add_id, edit_id, 1],
                (err, result) => {
                    if (err) {
                        return GLOBAL_ERROR_RESPONSE("Error saving route", err, res);
                    }

                    return GLOBAL_SUCCESS_RESPONSE("Route added successfully", { id: result.insertId }, res);
                }
            );

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get all routes from roh_routes table Coded by Vishnu July 07 2025 */
    this.GetAllRoutes = async (req, res) => {
        try {
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const offset = (page - 1) * limit;

            const sql = `SELECT * FROM roh_routes WHERE active = 1`;

            pool.query(sql, (error, results) => {
                if (error) {
                    return GLOBAL_ERROR_RESPONSE("Internal server error", error, res);
                }

                const total = results.length;
                const totalPages = Math.ceil(total / limit);

                if (total === 0 || page > totalPages) {
                    return GLOBAL_SUCCESS_RESPONSE("No routes found.", {
                        routesList: [],
                        page,
                        limit,
                        total,
                        totalPages
                    }, res);
                }

                const paginatedRoutes = results.slice(offset, offset + limit);

                return GLOBAL_SUCCESS_RESPONSE("Routes fetched successfully", {
                    routes: paginatedRoutes,
                    page,
                    limit,
                    total,
                    totalPages,
                }, res);
            });
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Edit route in roh_routes table Coded by Vishnu July 07 2025 */
    this.EditRoute = async (req, res) => {
        try {
            const { route_id, route_name, access_type, route_type, group_name, edit_id } = req.body;

            const query = `
                UPDATE roh_routes
                SET route_name = ?, access_type = ?, route_type = ?, group_name = ?, edit_id = ?
                WHERE id = ?
            `;

            const connection = pool.promise ? pool.promise() : pool;
            const [result] = await connection.execute(query, [
                route_name, access_type, route_type, group_name,edit_id, route_id
            ]);

            if (result.affectedRows === 0) {
                return GLOBAL_ERROR_RESPONSE("Route not found", {}, res);
            }

            return GLOBAL_SUCCESS_RESPONSE("Route updated successfully", {}, res);
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

     /** Delete route in roh_routes table Coded by Vishnu July 07 2025 */
    this.DeleteRoute = async (req, res) => {
        try {
            const { route_id } = req.body;

            const query = `UPDATE roh_routes SET active = 0 WHERE id = ?`;

            pool.query(query, [route_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error deleting routes", err, res);
                }

                if (result.affectedRows === 0) {
                    return GLOBAL_ERROR_RESPONSE("No routs deleted", {}, res);
                }

                return GLOBAL_SUCCESS_RESPONSE("Route deleted successfully", result, res);
            });

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** View route details in roh_routes table Coded by Vishnu July 07 2025 */
    this.ViewRoute = async (req, res) => {
        try {
            const { route_id } = req.body;

            const query = `SELECT * FROM roh_routes WHERE id = ?`;

            pool.query(query, [route_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error fetching route details", err, res);
                }

                if (result.length === 0) {
                    return GLOBAL_ERROR_RESPONSE("Route not found", {}, res);
                }

                return GLOBAL_SUCCESS_RESPONSE("Route details fetched successfully", result[0], res);
            });

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };
}

module.exports = new RoutesApi();
