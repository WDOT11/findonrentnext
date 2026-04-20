const { pool } = require('../../../config/connection');  // Correct import of the pool
const { Readable } = require('stream');
const csv = require('csv-parser');

function CityApi() {

    /** Add new city to cities collection Coded by Vishnu July 05 2025 */
    this.AddnewCity = (req, res) => {
        try {
            const {
                city_name,
                city_slug,
                city_desc,
                state_id,
                add_id,
                edit_id = 0
            } = req.body;

            /** SQL query to add a new city */
            const query = `
                INSERT INTO roh_cities
                (city_name, city_slug, city_desc, state_id, add_id, edit_id, active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            /** Proceed with inserting the city into the database */
            pool.execute(
                query,
                [city_name, city_slug, city_desc, state_id, add_id, edit_id, 1],
                (err, result) => {
                    if (err) {
                        return GLOBAL_ERROR_RESPONSE("Error saving city", err, res);
                    }

                    /** If successful, return the inserted ID */
                    return GLOBAL_SUCCESS_RESPONSE(
                        "City added successfully",
                        { id: result.insertId },
                        res
                    );
                }
            );

        } catch (err) {
            console.error("Error in AddnewCity:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get all cities from cities collection Coded by Vishnu July 05 2025 */
    this.GetallCity = (req, res) => {
        try {
          const page = parseInt(req.body.page) || 1;
          const limit = parseInt(req.body.limit) || 10;
          const offset = (page - 1) * limit;
          const search = req.body.search || '';
          const status = req.body.status; // Can be '1', '0', or 'all'

          let whereClause = `WHERE 1=1`;
          const queryParams = [];

          if (status === '1' || status === '0') {
            whereClause += ` AND active = ?`;
            queryParams.push(status);
          }

          if (search && search.trim() !== '') {
            whereClause += ` AND city_name LIKE ?`;
            queryParams.push(`%${search.trim()}%`);
          }

          const mainQuery = `
            SELECT * FROM roh_cities
            ${whereClause}
            ORDER BY city_id DESC
            LIMIT ? OFFSET ?
          `;

          const countQuery = `
            SELECT COUNT(*) AS totalCount FROM roh_cities
            ${whereClause}
          `;

          // Add pagination params
          queryParams.push(limit, offset);

          // First get total count
          pool.query(countQuery, queryParams.slice(0, queryParams.length - 2), (err, countResult) => {
            if (err) {
              return GLOBAL_ERROR_RESPONSE("Error counting cities", err, res);
            }

            const totalCount = countResult[0]?.totalCount || 0;
            const totalPages = Math.ceil(totalCount / limit);

            // Then fetch actual data
            pool.query(mainQuery, queryParams, (err, dataResult) => {
              if (err) {
                return GLOBAL_ERROR_RESPONSE("Error fetching cities", err, res);
              }

              return GLOBAL_SUCCESS_RESPONSE("Cities fetched successfully", {
                data: dataResult,
                currentPage: page,
                totalPages,
                totalCount
              }, res);
            });
          });
        } catch (err) {
          console.error("Error in GetallCity:", err);
          return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Edit city in cities collection Coded by Vishnu July 05 2025 */
    this.EditCity = (req, res) => {
        try {
            const {
                city_id,
                city_name,
                city_slug,
                city_desc,
                edit_id,
                state_id
            } = req.body;

            // Check for duplicate city_slug except current city_id
            const checkSlugQuery = `
                SELECT city_id
                FROM roh_cities
                WHERE city_slug = ? AND city_id != ?
            `;

            pool.query(checkSlugQuery, [city_slug, city_id], (err, results) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error checking duplicate slug", err, res);
                }

                if (results.length > 0) {
                    return res.status(200).json({
                        status: false,
                        message: "City slug already exists. Please choose another.",
                        error: "Duplicate slug",
                    });
                }

                // No duplicate found → update city
                const updateQuery = `
                    UPDATE roh_cities
                    SET
                        city_name = ?,
                        city_slug = ?,
                        city_desc = ?,
                        edit_id = ?,
                        state_id = ?
                    WHERE city_id = ?
                `;

                pool.query(
                    updateQuery,
                    [city_name, city_slug, city_desc, edit_id, state_id, city_id],
                    (err, result) => {
                        if (err) {
                            return GLOBAL_ERROR_RESPONSE("Error updating city", err, res);
                        }

                        return GLOBAL_SUCCESS_RESPONSE(
                            "City updated successfully",
                            result,
                            res
                        );
                    }
                );
            });

        } catch (err) {
            console.error("Error in EditCity:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Delete city in cities collection Coded by Vishnu July 05 2025 */
    this.DeleteCity = (req, res) => {
        try {
            const { city_id } = req.body;

            /** SQL query to update the city (set active = 0 to mark it as deleted) */
            const query = `UPDATE roh_cities SET active = 0 WHERE city_id = ?`;

            /** Proceed with deleting the city in the database */
            pool.query(query, [city_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error deleting city", err, res);
                }

                /** If no rows were affected, it means the city ID does not exist */
                if (result.affectedRows === 0) {
                    return GLOBAL_ERROR_RESPONSE("No city found with the given ID", {}, res);
                }

                /** If the city was successfully deleted, return a success response */
                return GLOBAL_SUCCESS_RESPONSE("City deleted successfully", result, res);
            });

        } catch (err) {
            console.error("Error in DeleteCity:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** get single city all details Coded by Vishnu July 24 2025 */
    this.GetSingleCity = (req, res) => {
        try {
            const { city_id } = req.body;

            /** SQL query to fetch the city details */
            const query = `SELECT * FROM roh_cities WHERE city_id = ?`;
            // const query = `SELECT * FROM roh_cities WHERE city_id = ? AND active = 1`;

            /** Proceed with fetching the city details from the database */
            pool.query(query, [city_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error fetching city details", err, res);
                }

                /** If no matching city is found, return an error */
                if (result.length === 0) {
                    return GLOBAL_ERROR_RESPONSE("Invalid City ID. The city ID does not exist or is inactive.", {}, res);
                }

                /** If the city was successfully fetched, return a success response */
                return GLOBAL_SUCCESS_RESPONSE("City details fetched successfully", result, res);
            });

        } catch (err) {
            console.error("Error in GetSingleCity:", err);  /** Log the error for debugging */
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** get all active city get method - Coded by Vishnu Jan. 01 2026 */
    this.AdminGetAllActiveCity = (req, res) => {
      try {
        const query = `
          SELECT city_id, city_name, city_slug
          FROM roh_cities
          WHERE active = 1
          ORDER BY city_name ASC
        `;

        pool.query(query, (err, results) => {
          if (err) {
            return GLOBAL_ERROR_RESPONSE(
              "Error fetching cities",
              err,
              res
            );
          }

          return GLOBAL_SUCCESS_RESPONSE(
            "Cities fetched successfully",
            results,
            res
          );
        });

      } catch (err) {
        console.error("Error in AdminGetAllActiveCity:", err);
        return GLOBAL_ERROR_RESPONSE(
          "Internal server error",
          err,
          res
        );
      }
    };

    /** function to import the cities from csv */
    this.AdminImportCities = async (req, res) => {
        try {
            const { state_id } = req.body;
            const file = req.file;

            if (!state_id || !file) {
                return res.status(400).json({ status: false, message: "State ID and CSV file are required" });
            }

            const cityNamesFromCSV = [];
            const alreadyExists = [];
            const importedCities = [];

            const stream = Readable.from(file.buffer);

            stream
                .pipe(csv())
                .on('data', (row) => {
                    const cityName = row['city'] || row['City'] || row['city_name'];
                    if (cityName && cityName.trim()) {
                        cityNamesFromCSV.push(cityName.trim());
                    }
                })
                .on('end', async () => {
                    try {
                        for (let name of cityNamesFromCSV) {
                            // 1. Check if city already exists for this state
                            const [existing] = await pool.promise().query(
                                `SELECT city_id FROM roh_cities WHERE city_name = ? AND state_id = ?`,
                                [name, state_id]
                            );

                            if (existing && existing.length > 0) {
                                alreadyExists.push(name);
                                continue;
                            }

                            // 2. Generate the Slug
                            const citySlug = generateSlug(name);

                            // 3. Insert into roh_cities
                            const [cityResult] = await pool.promise().query(
                                `INSERT INTO roh_cities (city_name, city_slug, state_id) VALUES (?, ?, ?)`,
                                [name, citySlug, state_id]
                            );

                            const newCityId = cityResult.insertId;

                            // 4. Insert into roh_slugs
                            // FIXED: Spelling of cat_singular_name (added the 'i')
                            // await pool.promise().query(
                            //     `INSERT INTO roh_slugs (slug, cat_singular_name, type, entity_id) VALUES (?, ?, ?, ?)`,
                            //     [citySlug, name, 'location', newCityId]
                            // );

                            importedCities.push(name);
                        }

                        return res.status(200).json({
                            status: true,
                            message: "Import process finished",
                            data: {
                                totalProcessed: cityNamesFromCSV.length,
                                imported: importedCities,
                                duplicates: alreadyExists
                            }
                        });

                    } catch (dbErr) {
                        console.error("Database Loop Error:", dbErr);
                        return res.status(500).json({
                            status: false,
                            message: "Database error: " + dbErr.message
                        });
                    }
                })
                .on('error', (streamErr) => {
                    console.error("Stream Error:", streamErr);
                    return res.status(500).json({ status: false, message: "Error parsing CSV" });
                });

        } catch (err) {
            console.error("General Error:", err);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    /** Helper to generate slug exactly like frontend */
    const generateSlug = (cityName) => {
        return cityName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };
}

module.exports = new CityApi();
