const { pool } = require('../../../config/connection');  /** Import the pool */

function StateApi() {
    /** Add new state in state collection Coded by Vishnu July 03 2025 */
    this.AddnewState = async (req, res) => {
        try {
            const { state_name, state_slug, add_id, edit_id } = req.body;

            /** If validation passes, proceed with inserting the new state */
            const query = `
                INSERT INTO roh_states (state_name, state_slug, add_id, edit_id, active)
                VALUES (?, ?, ?, ?, ?)
            `;

            /** Proceed with inserting the state into the database */
            pool.execute(query, [state_name, state_slug, add_id, edit_id, 1], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error saving state", err, res);
                }

                return GLOBAL_SUCCESS_RESPONSE("State added successfully", { id: result.insertId }, res);
            });

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get all state in state collection Coded by Vishnu July 04 2025 */
    this.GetallState = async (req, res) => {
        try {
          const page = parseInt(req.body.page) || 1;
          const limit = parseInt(req.body.limit) || 10;
          const offset = (page - 1) * limit;
          const search = req.body.search || '';
          const status = req.body.status; // "active", "inactive" ya undefined

          let activeCondition = '';
          let params = [];

          // Search clause for state_name
          const searchClause = `%${search}%`;

          if (status === 'active') {
            activeCondition = 'AND active = 1';
          } else if (status === 'inactive') {
            activeCondition = 'AND active = 0';
          } else {
            activeCondition = ''; // No condition
          }

          // Total count query
          const countQuery = `
            SELECT COUNT(*) AS totalCount FROM roh_states
            WHERE state_name LIKE ? ${activeCondition}
          `;

          params.push(searchClause);

          // Condition for active or inactive
          if (status === 'active') {
            params.push(); // no extra param, condition fixed as active=1
          } else if (status === 'inactive') {
            params.push(); // same as above
          }

          pool.query(countQuery, [searchClause], (countErr, countResult) => {
            if (countErr) {
              return GLOBAL_ERROR_RESPONSE("Error counting states", countErr, res);
            }

            const totalCount = countResult[0].totalCount;
            const totalPages = Math.ceil(totalCount / limit);

            const dataQuery = `
              SELECT * FROM roh_states
              WHERE state_name LIKE ? ${activeCondition}
              LIMIT ? OFFSET ?
            `;

            pool.query(dataQuery, [searchClause, limit, offset], (dataErr, dataResult) => {
              if (dataErr) {
                return GLOBAL_ERROR_RESPONSE("Error getting states", dataErr, res);
              }

              return res.status(200).json({
                status: true,
                message: "States fetched successfully",
                data: dataResult,
                totalCount: totalCount,
                totalPages: totalPages,
                currentPage: page,
              });
            });
          });
        } catch (err) {
          return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Edit state in state collection Coded by Vishnu July 04 2025 */
    this.EditState = async (req, res) => {
      try {
          const { state_id, state_name, state_slug, edit_id } = req.body;

          // Check if the slug already exists for a different state
          const checkSlugQuery = `
              SELECT state_id FROM roh_states WHERE state_slug = ? AND state_id != ?
          `;

          pool.query(checkSlugQuery, [state_slug, state_id], (err, result) => {
              if (err) {
                  return GLOBAL_ERROR_RESPONSE("Error checking for existing slug", err, res);
              }

              if (result.length > 0) {
                  return GLOBAL_ERROR_RESPONSE("Slug already exists for another state", null, res);
              }

              // Only update name, slug, and edit_id
              const updateQuery = `
                  UPDATE roh_states
                  SET state_name = ?, state_slug = ?, edit_id = ?
                  WHERE state_id = ?
              `;

              pool.query(updateQuery, [state_name, state_slug, edit_id, state_id], (err, result) => {
                  if (err) {
                      return GLOBAL_ERROR_RESPONSE("Error updating state", err, res);
                  }
                  return GLOBAL_SUCCESS_RESPONSE("State updated successfully", result, res);
              });
          });
      } catch (err) {
          return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
      }
    };

    /** Delete state in state collection Coded by Vishnu July 04 2025 */
    this.DeleteState = (req, res) => {
        try {
            const { state_id } = req.body;

            /** SQL query to update the state (set active = 0 to mark it as deleted) */
            const query = `
                UPDATE roh_states SET active = 0 WHERE state_id = ?
            `;

            /** Use the callback approach for handling the query */
            pool.query(query, [state_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error deleting state", err, res);
                }

                /** If no rows were affected, it means the state ID does not exist */
                if (result.affectedRows === 0) {
                    return GLOBAL_ERROR_RESPONSE("No state found with the given ID", {}, res);
                }

                /** If the state was successfully updated, return a success response */
                return GLOBAL_SUCCESS_RESPONSE("State deleted successfully", result, res);
            });

        } catch (err) {
            console.error("Error in DeleteState:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get state in state collection Coded by Vishnu July 22 2025 */
    this.GetSingleState = async (req, res) => {
        try {
            const { state_id } = req.body;
            const query = `
                SELECT * FROM roh_states WHERE state_id = ?
            `;
            pool.query(query, [state_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error getting state", err, res);
                }
                return GLOBAL_SUCCESS_RESPONSE("State fetched successfully", result, res);
            });
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** get all state id and state name  collection Coded by Vishnu July 24 2025 */
    this.GetAllActiveState = async (req, res) => {
        try {
            const query = `
                SELECT state_id, state_name, state_slug FROM roh_states WHERE active = 1
            `;
            pool.query(query, (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error getting states", err, res);
                }
                return GLOBAL_SUCCESS_RESPONSE("States fetched successfully", result, res);
            });
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** get all cities by state id: Coded by Raj jan 10 2025 */
    this.getCitiesByState = async (req, res) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                return GLOBAL_ERROR_RESPONSE(
                    "State ID is required",
                    null,
                    res
                );
            }
    
            const query = `
                SELECT 
                    city_id,
                    city_name,
                    city_slug
                FROM roh_cities
                WHERE state_id = ?
                  AND active = 1
                ORDER BY city_name ASC
            `;
    
            pool.query(query, [id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE(
                        "Error getting cities",
                        err,
                        res
                    );
                }
    
                return GLOBAL_SUCCESS_RESPONSE(
                    "Cities fetched successfully",
                    result,
                    res
                );
            });
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE(
                "Internal server error",
                err,
                res
            );
        }
    };
}

module.exports = new StateApi();
