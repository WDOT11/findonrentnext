const { pool } = require('../../../config/connection');  // Correct import of the pool

function roleApi() {
    
    /** Add new role to roles collection Coded by Raj July 06 2025 */
    this.addRole = (req, res) => {
        try {
            const { name, active, add_id, edit_id=0} = req.body;

            /** SQL query to add a new role */
            const query = `INSERT INTO roh_roles (name, active, add_id, edit_id) VALUES (?,?, ?, ?)`;

            /** Proceed with inserting the role into the database */
            pool.execute(query, [name,active, add_id, edit_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error saving role.", err, res);
                }

                /** If successful, return the inserted ID */
                return GLOBAL_SUCCESS_RESPONSE("Role added successfully.", { id: result.insertId }, res);
            });

        } catch (err) {
            console.error("Error in Add new role:", err);  // Log the error for debugging
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get all roles from role collection Coded by Raj July 07 2025 */
    this.getAllRoles = (req, res) => {
        try {
            /** Get page and limit from query parameters */
            const page = parseInt(req.body.page);  /** Parse the page as an integer */
            const limit = parseInt(req.body.limit);  /** Parse the limit as an integer */

            /** Calculate the offset for pagination */
            const offset = (page - 1) * limit;

            /** SQL query to fetch roles with pagination */
            // const query = `
            //     SELECT id, name, active FROM roh_roles WHERE active = 1 LIMIT ? OFFSET ?
            // `;

            const query = `
            SELECT id, name, active FROM roh_roles LIMIT ? OFFSET ?
        `;

            /** Execute the query to get the paginated roles */
            pool.query(query, [limit, offset], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error getting roles.", err, res);
                }

                /** Check if no roles are found */
                if (result.length === 0) {
                    return GLOBAL_ERROR_RESPONSE("No active roles found.", {}, res);
                }

                /** Return paginated results */
                return GLOBAL_SUCCESS_RESPONSE("Roles fetched successfully.", result, res);
            });
        } catch (err) {
            console.error("Error in getching roles:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Edit role in roles collection Coded by Raj July 07 2025 */
    this.updateRole = (req, res) => {
        try {
            const { id, name, edit_id } = req.body;

            /** SQL query to update the role */
            const query = `UPDATE roh_roles SET name = ?, edit_id = ?, edit_date = NOW()  WHERE id = ?`;

            /** Proceed with updating the role in the database */
            pool.query(query, [name, edit_id, id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error updating role.", err, res);
                }

                /** If successful, return the updated role */
                return GLOBAL_SUCCESS_RESPONSE("Role updated successfully.", result, res);
            });

        } catch (err) {
            console.error("Error in update role:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Delete role in roles collection Coded by Raj July 07 2025 */
    this.deleteRole = (req, res) => {
        try {
            const { edit_id, role_id } = req.body;

            /** SQL query to update the role (set active = 0 to mark it as deleted) */
            const query = `UPDATE roh_roles SET active = 0, edit_id = ?, edit_date = NOW()  WHERE id = ?`;

            /** Proceed with deleting the role in the database */
            pool.query(query, [edit_id, role_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error deleting role.", err, res);
                }

                /** If no rows were affected, it means the role ID does not exist */
                if (result.affectedRows === 0) {
                    return GLOBAL_ERROR_RESPONSE("No role found with the given ID.", {}, res);
                }

                /** If the role was successfully deleted, return a success response */
                return GLOBAL_SUCCESS_RESPONSE("Role deleted successfully.", result, res);
            });

        } catch (err) {
            console.error("Error in delte role:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error.", err, res);
        }
    };

    /** Get all roles and ID from roles collection Coded by Vishnu July 12 2025 */
    this.getRoles = (req, res) => {
        try {
            /** SQL query to fetch roles */
            const query = `SELECT id, name FROM roh_roles WHERE active = 1`;

            /** Execute the query to get the roles */
            pool.query(query, (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error getting roles.", err, res);
                }

                /** Check if no roles are found */
                if (result.length === 0) {
                    return GLOBAL_ERROR_RESPONSE("No active roles found.", {}, res);
                }

                /** Return the roles */
                return GLOBAL_SUCCESS_RESPONSE("Roles fetched successfully.", result, res);
            });
        } catch (err) {
            console.error("Error in getching roles:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** View role details Coded by Vishnu July 17 2025 */
    this.viewRole = (req, res) => {
        try {
            const { role_id } = req.body;

            const query = `SELECT * FROM roh_roles WHERE id = ?`;

            pool.query(query, [role_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error getting role details.", err, res);
                }

                if (result.length === 0) {
                    return GLOBAL_ERROR_RESPONSE("Role not found.", {}, res);
                }

                return GLOBAL_SUCCESS_RESPONSE("Role details fetched successfully.", result, res);
            });

        } catch (err) {
            console.error("Error in getching roles:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };
}

module.exports = new roleApi();