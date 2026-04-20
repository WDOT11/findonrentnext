const { pool } = require('../../../config/connection');
const path = require('path');

function FaqsApi() {

    /** Add new faq in roh_posts table - Coded by Vishnu Oct 14, 2025 */
    this.AddnewFaq = async (req, res) => {
      try {
        const {
          title,
          description,
          dynamic_slug,
          dynamic_cat_id,
          dynamic_loc_id,
          add_id,
          edit_id,
          active,
        } = req.body;

        /* ============================
          BASIC VALIDATION
        ============================ */
        if (!title || !description || !dynamic_slug) {
          return GLOBAL_ERROR_RESPONSE(
            "Title, Description, and Dynamic Slug are required",
            {},
            res
          );
        }

        /* ============================
          DUPLICATE SLUG CHECK
        ============================ */
        const [existing] = await pool
          .promise()
          .query(
            `SELECT id FROM roh_new_faqs WHERE dynamic_slug = ? LIMIT 1`,
            [dynamic_slug]
          );

        /* ============================
          INSERT FAQ
        ============================ */
        const faqQuery = `
          INSERT INTO roh_new_faqs
          (
            title,
            description,
            dynamic_slug,
            dynamic_cat_id,
            dynamic_loc_id,
            add_id,
            edit_id,
            active,
            add_date,
            edit_date
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const faqValues = [
          title,
          description,
          dynamic_slug,
          dynamic_cat_id || null, // category id (e.g. 5)
          dynamic_loc_id || null, // city id (e.g. 2)
          add_id || null,
          edit_id || null,
          active ?? 1,
        ];

        const [result] = await pool
          .promise()
          .execute(faqQuery, faqValues);

        return GLOBAL_SUCCESS_RESPONSE(
          "FAQ added successfully",
          { id: result.insertId },
          res
        );

      } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage || err.message,
        });
      }
    };



    /** List All FAQs - Coded by Vishnu Oct 14, 2025 */
    this.ListAllFaqs = async (req, res) => {
    try {
        /** Pagination */
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        /** Filters */
        const searchTitle = (req.query.title || "").trim();
        const searchStatus = (req.query.status || "").trim();
        const searchSlug = (req.query.dynamic_slug || "").trim();

        /** Build WHERE conditions */
        let whereClauses = [];
        let params = [];

        if (searchTitle) {
        whereClauses.push(`f.title LIKE ?`);
        params.push(`%${searchTitle}%`);
        }

        if (searchStatus) {
        whereClauses.push(`f.active = ?`);
        params.push(searchStatus === "active" ? 1 : 0);
        }

        if (searchSlug) {
        whereClauses.push(`f.dynamic_slug = ?`);
        params.push(searchSlug);
        }

        const whereSQL = whereClauses.length
        ? `WHERE ${whereClauses.join(" AND ")}`
        : "";

        /** List query */
        const listQuery = `
        SELECT
            f.id,
            f.title,
            f.description,
            f.dynamic_slug,
            f.active,
            f.add_date,
            f.edit_date
        FROM roh_new_faqs f
        ${whereSQL}
        ORDER BY f.add_date DESC
        LIMIT ? OFFSET ?
        `;

        /** Count query */
        const countQuery = `
        SELECT COUNT(*) AS total
        FROM roh_new_faqs f
        ${whereSQL}
        `;

        /** Execute queries */
        const [rows] = await pool
        .promise()
        .query(listQuery, [...params, limit, offset]);

        const [countRows] = await pool
        .promise()
        .query(countQuery, params);

        const totalFaqs = countRows[0].total;
        const totalPages = Math.ceil(totalFaqs / limit);

        /** Format response */
        const formattedResults = rows.map((faq) => ({
        id: faq.id,
        title: faq.title,
        description: faq.description,
        dynamic_slug: faq.dynamic_slug,
        status: faq.active === 1 ? "Active" : "Inactive",
        add_date: faq.add_date,
        edit_date: faq.edit_date,
        }));

        return res.status(200).json({
        status: true,
        message: "FAQs fetched successfully",
        data: formattedResults,
        pagination: {
            currentPage: page,
            totalPages,
            totalFaqs,
            limit,
        },
        });
    } catch (err) {
        console.error("Unexpected error in ListAllFaqs:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };

    /** View single FAQ - Optimized - Coded by Vishnu Oct 14, 2025 */
    this.ViewSingleFaq = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
        return GLOBAL_ERROR_RESPONSE("FAQ ID is required", null, res);
        }

        /** Fetch FAQ */
        const viewQuery = `
        SELECT
            id,
            title,
            description,
            dynamic_slug,
            active,
            add_date,
            edit_date
        FROM roh_new_faqs
        WHERE id = ?
        LIMIT 1
        `;

        const [results] = await pool
        .promise()
        .execute(viewQuery, [id]);

        if (results.length === 0) {
        return GLOBAL_ERROR_RESPONSE("FAQ not found", null, res);
        }

        const faq = results[0];

        /** Format response */
        const formattedFaq = {
        id: faq.id,
        title: faq.title,
        description: faq.description,
        dynamic_slug: faq.dynamic_slug,
        active: Number(faq.active),
        add_date: faq.add_date,
        edit_date: faq.edit_date,
        };

        return GLOBAL_SUCCESS_RESPONSE(
        "FAQ details fetched successfully",
        formattedFaq,
        res
        );

    } catch (err) {
        console.error("Unexpected error in ViewSingleFaq:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };


    /** Update single FAQ - Coded by Vishnu Oct 14, 2025 */
    this.UpdateSingleFaq = async (req, res) => {
    try {
      const {
        id,
        title,
        description,
        dynamic_slug,
        dynamic_cat_id,
        dynamic_loc_id,
        active,
        edit_id,
      } = req.body;

      /* ============================
        BASIC VALIDATION
      ============================ */
      if (!id) {
        return GLOBAL_ERROR_RESPONSE("FAQ ID is required", null, res);
      }

      if (!title || !description || !dynamic_slug) {
        return GLOBAL_ERROR_RESPONSE(
          "Title, Description, and Dynamic Slug are required",
          null,
          res
        );
      }

      /* ============================
        DUPLICATE SLUG CHECK (OPTIONAL)
      ============================ */
      const [existing] = await pool
        .promise()
        .query(
          `
          SELECT id
          FROM roh_new_faqs
          WHERE dynamic_slug = ?
          AND id != ?
          LIMIT 1
          `,
          [dynamic_slug, id]
        );

      /* ============================
        UPDATE FAQ
      ============================ */
      const updateQuery = `
        UPDATE roh_new_faqs
        SET
          title = ?,
          description = ?,
          dynamic_slug = ?,
          dynamic_cat_id = ?,
          dynamic_loc_id = ?,
          active = ?,
          edit_id = ?,
          edit_date = NOW()
        WHERE id = ?
      `;

      const updateValues = [
        title,
        description,
        dynamic_slug,
        dynamic_cat_id || null, // category id
        dynamic_loc_id || null, // city id
        active !== undefined ? active : 1,
        edit_id || null,
        id,
      ];

      const [result] = await pool
        .promise()
        .execute(updateQuery, updateValues);

      if (result.affectedRows === 0) {
        return GLOBAL_ERROR_RESPONSE(
          "FAQ not found or no changes made",
          null,
          res
        );
      }

      return GLOBAL_SUCCESS_RESPONSE(
        "FAQ updated successfully",
        {},
        res
      );

    } catch (err) {
      console.error("Unexpected error in UpdateSingleFaq:", err);
      return GLOBAL_ERROR_RESPONSE(
        err.sqlMessage || "Internal server error",
        err,
        res
      );
    }
  };




}

module.exports = new FaqsApi();
