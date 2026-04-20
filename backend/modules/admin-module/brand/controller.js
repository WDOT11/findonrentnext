const pool = require('../../../config/connection');
const path = require('path');

function BrandApi() {

    /** Create a new brand - Updated with brand_slug (Coded by Raj Oct 31, 2025) */
    this.createBrand = async (req, res) => {
        try {
            const { brand_name, cat_id, add_id, edit_id } = req.body;
            const active = 1;

            // Basic validation
            if (!brand_name) {
                return GLOBAL_ERROR_RESPONSE("Brand name is required.", {}, res);
            }

            /** Generate slug from brand_name */
            const brand_slug = brand_name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")  // remove special characters
                .replace(/\s+/g, "-")      // replace spaces with hyphens
                .replace(/--+/g, "-");     // remove multiple hyphens

            /** Check for existing active brand by slug */
            const [existingActive] = await pool.query(`SELECT id  FROM roh_brands WHERE brand_slug = ? AND cat_id = ? AND active = 1`, [brand_slug, cat_id]);

            if (existingActive.length > 0) {
                return GLOBAL_ERROR_RESPONSE("A brand with the same name and category already exists.", {}, res);
            }

            /** Check if same slug exists but inactive */
            const [existingInactive] = await pool.query(
                `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 0`, [brand_slug]
            );

            if (existingInactive.length > 0) {
                const brandId = existingInactive[0].id;

                const [reactivate] = await pool.query(
                `UPDATE roh_brands
                SET brand_name = ?,
                    brand_slug = ?,
                    cat_id = ?,
                    active = 1,
                    edit_id = ?,
                    edit_date = NOW()
                WHERE id = ?`,
                [brand_name, brand_slug, cat_id || null, edit_id, brandId]
                );

                if (reactivate.affectedRows === 1) {
                return GLOBAL_SUCCESS_RESPONSE(
                    "Brand reactivated successfully.",
                    { brand_id: brandId, brand_name, brand_slug },
                    res
                );
                } else {
                return GLOBAL_ERROR_RESPONSE("Failed to reactivate brand.", {}, res);
                }
            }

            /** Insert a completely new brand */
            const insertSql = `
                INSERT INTO roh_brands
                (brand_name, brand_slug, cat_id, active, add_id, edit_id, add_date, edit_date)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;

            const [insertResult] = await pool.query(insertSql, [
                brand_name,
                brand_slug,
                cat_id || null,
                active,
                add_id,
                edit_id,
            ]);

            if (insertResult.affectedRows === 1) {
                return GLOBAL_SUCCESS_RESPONSE(
                "Brand created successfully.",
                {
                    brand_id: insertResult.insertId,
                    brand_name,
                    brand_slug,
                    cat_id,
                },
                res
                );
            } else {
                return GLOBAL_ERROR_RESPONSE("Failed to create brand.", {}, res);
            }
        } catch (err) {
            let message = "Internal server error";
            if (err.code === "ER_DUP_ENTRY") {
                message = "Duplicate brand slug detected.";
            }

            return GLOBAL_ERROR_RESPONSE(message, err, res);
        }
    };

    /** Get brand list - with pagination and optional filter */
    this.getBrandData = async (req, res) => {
        try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const offset = (page - 1) * limit;

        const brandName = req.body.brand_name || "";
        const brandCategory = req.body.category_id || "";
        const brandStatus = req.body.status || "";

        let sql = `
            SELECT b.id, b.brand_name, b.cat_id, b.active,
                c.name AS category_name
            FROM roh_brands b
            LEFT JOIN roh_categories c ON b.cat_id = c.id
            WHERE b.active = 1
        `;

        const queryParams = [];

        if (brandName) {
            sql += ` AND b.brand_name LIKE ?`;
            queryParams.push(`%${brandName}%`);
        }
        if (brandCategory) {
            sql += ` AND b.cat_id LIKE ?`;
            queryParams.push(`%${brandCategory}%`);
        }
        if (brandStatus) {
            sql += ` AND b.active LIKE ?`;
            queryParams.push(`%${brandStatus}%`);
        }

        sql += " ORDER BY b.id DESC";

        const [brands] = await pool.query(sql, queryParams);
        const total = brands.length;
        const totalPages = Math.ceil(total / limit);

        if (total === 0 || page > totalPages) {
            return GLOBAL_SUCCESS_RESPONSE(
            "No brands found.",
            {
                brands: [],
                page,
                limit,
                total,
                totalPages,
            },
            res
            );
        }

        const paginated = brands.slice(offset, offset + limit);

        return GLOBAL_SUCCESS_RESPONSE(
            "Brands fetched successfully.",
            {
            brands: paginated,
            page,
            limit,
            total,
            totalPages,
            },
            res
        );
        } catch (error) {
        console.error("❌ Error fetching brand list:", error);
        return GLOBAL_ERROR_RESPONSE("Internal server error", error, res);
        }
    };

    /** Get Brand Details - Coded by Raj Oct 2025 */
    this.getBrandDetail = async (req, res) => {
        try {
        const { id } = req.body;

        if (!id) {
            return GLOBAL_ERROR_RESPONSE("Brand ID is required.", {}, res);
        }

        const [rows] = await pool.query(
            `SELECT b.id, b.brand_name, b.cat_id, c.name AS category_name
            FROM roh_brands b
            LEFT JOIN roh_categories c ON b.cat_id = c.id
            WHERE b.id = ? AND b.active = 1`,
            [id]
        );

        if (rows.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Brand not found.", {}, res);
        }

        return GLOBAL_SUCCESS_RESPONSE("Brand details fetched successfully.", rows[0], res);
        } catch (err) {
        console.error("❌ Error fetching brand details:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Update brand - Updated with brand_slug (Coded by Raj Oct 31, 2025) */
    this.updateBrand = async (req, res) => {
        try {
        const { id, brand_name, cat_id, edit_id } = req.body;

        if (!id || !brand_name) {
            return GLOBAL_ERROR_RESPONSE("Missing required fields.", {}, res);
        }

        /**  Generate a clean slug from brand_name */
        const brand_slug = brand_name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "") // remove special chars
            .replace(/\s+/g, "-")     // replace spaces with dashes
            .replace(/--+/g, "-");    // remove multiple dashes

        /** Check if another brand already uses this slug */
        const [duplicate] = await pool.query(
            `SELECT id FROM roh_brands WHERE brand_slug = ? AND id != ? AND cat_id = ? AND active = 1`,
            [brand_slug, id, cat_id]
        );

        if (duplicate.length > 0) {
            return GLOBAL_ERROR_RESPONSE(
            "Another brand with the same name already exists.",
            {},
            res
            );
        }

        /** Update brand */
        const updateSql = `
            UPDATE roh_brands
            SET
            brand_name = ?,
            brand_slug = ?,
            cat_id = ?,
            edit_id = ?,
            edit_date = NOW()
            WHERE id = ? AND active = 1
        `;

        const [result] = await pool.query(updateSql, [
            brand_name,
            brand_slug,
            cat_id || null,
            edit_id,
            id,
        ]);

        if (result.affectedRows === 0) {
            return GLOBAL_ERROR_RESPONSE("Brand not found or not updated.", {}, res);
        }

        return GLOBAL_SUCCESS_RESPONSE("Brand updated successfully.", {
            id,
            brand_name,
            brand_slug,
            cat_id,
        }, res);

        } catch (err) {
        console.error("❌ Error updating brand:", err);

        let message = "Internal server error";
        if (err.code === "ER_DUP_ENTRY") {
            message = "Duplicate brand slug detected.";
        }

        return GLOBAL_ERROR_RESPONSE(message, err, res);
        }
    };

    /** Delete brand (soft delete) */
    this.deleteBrand = async (req, res) => {
        try {
            const { id } = req.body;

            //  Validate input
            if (!id) {
                return GLOBAL_ERROR_RESPONSE("Brand ID is required.", {}, res);
            }

            //  Update query to soft delete (set active = 0)
            const sql = `
                UPDATE roh_brands
                SET active = 0, edit_date = NOW()
                WHERE id = ?
            `;

            const [result] = await pool.query(sql, [id]);

            if (result.affectedRows === 0) {
                return GLOBAL_ERROR_RESPONSE("No brand found with the given ID.", {}, res);
            }

            return GLOBAL_SUCCESS_RESPONSE(
                "Brand deleted successfully.",
                { brand_id: id },
                res
            );
        } catch (err) {
            console.error("❌ Error deleting brand:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Dropdown list of active categories for brand creation */
    this.categoryDropdown = async (req, res) => {
        try {
            const sql = `
                SELECT id, name
                FROM roh_categories
                WHERE active = 1
                ORDER BY name ASC
            `;
            const [categories] = await pool.query(sql);

            return GLOBAL_SUCCESS_RESPONSE(
                "Categories fetched successfully.",
                { categories },
                res
            );
        } catch (err) {
            console.error("❌ Error fetching category dropdown:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    this.getBrandsForDropdownByCatId = async (req, res) => {
        try {
          const { cat_id } = req.body;

          //  Validation
          if (!cat_id) {
            return GLOBAL_ERROR_RESPONSE("Category ID is required.", {}, res);
          }

          //  Fetch all active brands under this category
          const [brands] = await pool.query(
            `SELECT id, brand_name, brand_slug
             FROM roh_brands
             WHERE cat_id = ? AND active = 1
             ORDER BY brand_name ASC`,
            [cat_id]
          );

          if (!brands || brands.length === 0) {
            return GLOBAL_SUCCESS_RESPONSE("No brands found for this category.", { brands: [] }, res);
          }

          return GLOBAL_SUCCESS_RESPONSE("Brands fetched successfully.", { brands }, res);
        } catch (err) {
          console.error("❌ Error fetching brands by category:", err);
          return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get all brands to show in the dropdown */
    this.getBrandsForDropdown = async (req, res) => {
        try {

          //  Fetch all active brands under this category
          const [brands] = await pool.query(
            `SELECT id, brand_name
             FROM roh_brands
             WHERE active = 1
             ORDER BY brand_name ASC`
          );

          if (!brands || brands.length === 0) {
            return GLOBAL_SUCCESS_RESPONSE("No brands found for this category.", { brands: [] }, res);
          }

          return GLOBAL_SUCCESS_RESPONSE("Brands fetched successfully.", { brands }, res);
        } catch (err) {
          console.error("❌ Error fetching brands by category:", err);
          return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };
}

module.exports = new BrandApi();