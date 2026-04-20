const { pool } = require('../../../config/connection');
const path = require('path');

function RohSEOApi() {

    /** Add new page meta in roh_seo_meta table - Coded by Vishnu Oct 21, 2025 */
    this.AddnewPageMeta = async (req, res) => {
        try {
            const {
                page_slug,
                page_title,
                meta_description,
                meta_keywords,
                og_title,
                og_image,
                canonical_url,
                noindex,
                meta_schema,
                add_id,
                edit_id,
                active,
            } = req.body;

            /** Validate mandatory fields */
            if (!page_slug || !page_title || !meta_description) {
                return GLOBAL_ERROR_RESPONSE(
                    "Page slug, title and description are required",
                    {},
                    res
                );
            }

            /** Insert record */
            const insertQuery = `
                INSERT INTO roh_seo_meta
                (
                    page_slug,
                    page_title,
                    meta_description,
                    meta_keywords,
                    og_title,
                    og_image,
                    canonical_url,
                    noindex,
                    meta_schema,
                    add_id,
                    edit_id,
                    active,
                    add_date,
                    edit_date
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;

            const values = [
                page_slug,
                page_title,
                meta_description,
                meta_keywords || null,
                og_title || null,
                og_image || null,
                canonical_url || null,
                noindex || 0,
                meta_schema || null,
                add_id || null,
                edit_id || null,
                active || 1,
            ];

            pool.execute(insertQuery, values, (err, result) => {
                if (err) {
                    console.error("Error inserting SEO Meta:", err);
                    return GLOBAL_ERROR_RESPONSE(
                        "Database error, please check input values",
                        err,
                        res
                    );
                }

                return GLOBAL_SUCCESS_RESPONSE(
                    "SEO Meta added successfully",
                    { id: result.insertId },
                    res
                );
            });
        } catch (err) {
            console.error("Unexpected error:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };


    /** Get all page meta in roh_seo_meta table - Coded by Vishnu Oct 21, 2025 */
    this.ListAllPageMeta = async (req, res) => {
    try {
        // Extract query params
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
        const offset = (page - 1) * limit;

        const searchSlug = (req.query.slug || "").trim();
        const searchTitle = (req.query.title || "").trim();
        const searchStatus = (req.query.status || "").trim();

        // Build dynamic WHERE
        const whereClauses = [];
        const params = [];

        if (searchSlug) {
        whereClauses.push(`s.page_slug LIKE ?`);
        params.push(`%${searchSlug}%`);
        }
        if (searchTitle) {
        whereClauses.push(`s.page_title LIKE ?`);
        params.push(`%${searchTitle}%`);
        }
        if (searchStatus) {
        whereClauses.push(`s.active = ?`);
        params.push(searchStatus === "active" ? 1 : 0);
        }

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // Count query
        const [countRows] = await pool
        .promise()
        .query(`SELECT COUNT(*) AS total FROM roh_seo_meta AS s ${whereSQL}`, params);

        const totalRecords = countRows[0]?.total ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

        // List query (must use numeric interpolation)
        const sql = `
        SELECT s.*
        FROM roh_seo_meta AS s
        ${whereSQL}
        ORDER BY s.id DESC
        LIMIT ${limit} OFFSET ${offset}
        `;
        const [rows] = await pool.promise().query(sql, params);

        // Ensure pagination info included
        return res.status(200).json({
        status: true,
        message: "SEO Meta list fetched successfully",
        data: rows,
        pagination: {
            page,
            limit,
            totalRecords,
            totalPages,
        },
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: err,
        });
    }
    };

    /** View single page meta in roh_seo_meta table - Coded by Vishnu Oct 21, 2025 */
    this.ViewSinglePageMeta = async (req, res) => {
    try {
        const { id } = req.body;

        const viewQuery = `
        SELECT
            id,
            page_slug,
            page_title,
            meta_description,
            meta_keywords,
            og_title,
            og_image,
            canonical_url,
            meta_schema,
            noindex,
            active,
            add_date
        FROM roh_seo_meta
        WHERE id = ?
        `;

        const [rows] = await pool.promise().query(viewQuery, [id]);

        if (rows.length === 0) {
        return GLOBAL_ERROR_RESPONSE("Page meta not found", null, res);
        }

        return GLOBAL_SUCCESS_RESPONSE("Page meta fetched successfully", rows[0], res);
    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };

    /** Update page meta in roh_seo_meta table - Coded by Vishnu Oct 21, 2025 */
    this.UpdatePageMeta = async (req, res) => {
    try {
        const {
        id,
        page_slug,
        page_title,
        meta_description,
        meta_keywords,
        og_title,
        og_image,
        canonical_url,
        noindex,
        active,
        meta_schema,
        edit_id,     
        } = req.body;

        if (!id) {
        return GLOBAL_ERROR_RESPONSE("ID is required", null, res);
        }

        const updateQuery = `
        UPDATE roh_seo_meta
        SET
            page_slug = ?,
            page_title = ?,
            meta_description = ?,
            meta_keywords = ?,
            og_title = ?,
            og_image = ?,
            canonical_url = ?,
            noindex = ?,
            active = ?,
            meta_schema = ?,     
            edit_id = ?,         
            edit_date = NOW()
        WHERE id = ?
        `;

        const values = [
        page_slug,
        page_title,
        meta_description,
        meta_keywords || null,
        og_title || null,
        og_image || null,
        canonical_url || null,
        noindex || 0,
        active || 1,
        meta_schema || null, 
        edit_id || null,
        id,
        ];

        const [result] = await pool.promise().query(updateQuery, values);

        if (result.affectedRows === 0) {
        return GLOBAL_ERROR_RESPONSE("Page meta not found", null, res);
        }

        return GLOBAL_SUCCESS_RESPONSE(
        "Page meta updated successfully",
        null,
        res
        );
    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };



}

module.exports = new RohSEOApi();
