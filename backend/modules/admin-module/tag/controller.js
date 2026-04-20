const pool = require('../../../config/connection');
const path = require('path');

function TagApi() {

  /** Create a new tag - with tag_slug (Coded by Raj Nov 2025) */
  this.createTag = async (req, res) => {
    try {
      const { tag_name, cat_id, add_id, edit_id } = req.body;
      const active = 1;

      //  Basic validation
      if (!tag_name) {
        return GLOBAL_ERROR_RESPONSE("Tag name is required.", {}, res);
      }

      /**  Generate slug from tag_name */
      const tag_slug = tag_name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")  // remove special characters
        .replace(/\s+/g, "-")      // replace spaces with hyphens
        .replace(/--+/g, "-");     // remove multiple hyphens

      /** Step 1: Check for existing active tag by slug */
      const [existingActive] = await pool.query(
        `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1`,
        [tag_slug]
      );

      if (existingActive.length > 0) {
        return GLOBAL_ERROR_RESPONSE(
          "A tag with the same name (slug) already exists.",
          {},
          res
        );
      }

      /** Step 2: Check if same slug exists but inactive */
      const [existingInactive] = await pool.query(
        `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 0`,
        [tag_slug]
      );

      if (existingInactive.length > 0) {
        const tagId = existingInactive[0].id;

        const [reactivate] = await pool.query(
          `UPDATE roh_tags
           SET tag_name = ?,
               tag_slug = ?,
               cat_id = ?,
               active = 1,
               edit_id = ?,
               edit_date = NOW()
           WHERE id = ?`,
          [tag_name, tag_slug, cat_id || null, edit_id, tagId]
        );

        if (reactivate.affectedRows === 1) {
          return GLOBAL_SUCCESS_RESPONSE(
            "Tag reactivated successfully.",
            { tag_id: tagId, tag_name, tag_slug },
            res
          );
        } else {
          return GLOBAL_ERROR_RESPONSE("Failed to reactivate tag.", {}, res);
        }
      }

      /** Step 3: Insert a completely new tag */
      const insertSql = `
        INSERT INTO roh_tags
        (tag_name, tag_slug, cat_id, active, add_id, edit_id, add_date, edit_date)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const [insertResult] = await pool.query(insertSql, [
        tag_name,
        tag_slug,
        cat_id || null,
        active,
        add_id,
        edit_id,
      ]);

      if (insertResult.affectedRows === 1) {
        return GLOBAL_SUCCESS_RESPONSE(
          "Tag created successfully.",
          {
            tag_id: insertResult.insertId,
            tag_name,
            tag_slug,
            cat_id,
          },
          res
        );
      } else {
        return GLOBAL_ERROR_RESPONSE("Failed to create tag.", {}, res);
      }
    } catch (err) {
      console.error("❌ Error creating tag:", err);

      let message = "Internal server error";
      if (err.code === "ER_DUP_ENTRY") {
        message = "Duplicate tag slug detected.";
      }

      return GLOBAL_ERROR_RESPONSE(message, err, res);
    }
  };

  /** 📄 Get tag list - with pagination and optional filter */
  this.getTagData = async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 10;
      const offset = (page - 1) * limit;
      const tagName = req.body.tag_name || "";
      const tagCategory = req.body.category_id || "";
      const tagStatus = req.body.status || "";

      let sql = `
        SELECT t.id, t.tag_name, t.cat_id, t.active, c.name AS category_name
        FROM roh_tags t
        LEFT JOIN roh_categories c ON t.cat_id = c.id
        WHERE t.active = 1
      `;

      const queryParams = [];

      if (tagName) {
        sql += ` AND t.tag_name LIKE ?`;
        queryParams.push(`%${tagName}%`);
      }
      if (tagCategory) {
        sql += ` AND t.cat_id LIKE ?`;
        queryParams.push(`%${tagCategory}%`);
      }
      if (tagStatus) {
        sql += ` AND t.active LIKE ?`;
        queryParams.push(`%${tagStatus}%`);
      }

      sql += " ORDER BY t.id DESC";

      const [tags] = await pool.query(sql, queryParams);
      const total = tags.length;
      const totalPages = Math.ceil(total / limit);

      if (total === 0 || page > totalPages) {
        return GLOBAL_SUCCESS_RESPONSE(
          "No tags found.",
          {
            tags: [],
            page,
            limit,
            total,
            totalPages,
          },
          res
        );
      }

      const paginated = tags.slice(offset, offset + limit);

      return GLOBAL_SUCCESS_RESPONSE(
        "Tags fetched successfully.",
        {
          tags: paginated,
          page,
          limit,
          total,
          totalPages,
        },
        res
      );
    } catch (error) {
      console.error("❌ Error fetching tag list:", error);
      return GLOBAL_ERROR_RESPONSE("Internal server error", error, res);
    }
  };

  /** 🔍 Get Tag Details - Coded by Raj Nov 2025 */
  this.getTagDetail = async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return GLOBAL_ERROR_RESPONSE("Tag ID is required.", {}, res);
      }

      const [rows] = await pool.query(
        `SELECT t.id, t.tag_name, t.cat_id, c.name AS category_name
         FROM roh_tags t
         LEFT JOIN roh_categories c ON t.cat_id = c.id
         WHERE t.id = ? AND t.active = 1`,
        [id]
      );

      if (rows.length === 0) {
        return GLOBAL_ERROR_RESPONSE("Tag not found.", {}, res);
      }

      return GLOBAL_SUCCESS_RESPONSE("Tag details fetched successfully.", rows[0], res);
    } catch (err) {
      console.error("❌ Error fetching tag details:", err);
      return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };

  /** ✏️ Update tag - with tag_slug (Coded by Raj Nov 2025) */
  this.updateTag = async (req, res) => {
    try {
      const { id, tag_name, cat_id, edit_id } = req.body;

      if (!id || !tag_name) {
        return GLOBAL_ERROR_RESPONSE("Missing required fields.", {}, res);
      }

      /**  Generate a clean slug from tag_name */
      const tag_slug = tag_name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");

      /** Step 1️⃣: Check if another tag already uses this slug */
      const [duplicate] = await pool.query(
        `SELECT id FROM roh_tags WHERE tag_slug = ? AND id != ? AND active = 1`,
        [tag_slug, id]
      );

      if (duplicate.length > 0) {
        return GLOBAL_ERROR_RESPONSE(
          "Another tag with the same name already exists.",
          {},
          res
        );
      }

      /** Step 2️⃣: Update tag */
      const updateSql = `
        UPDATE roh_tags
        SET
          tag_name = ?,
          tag_slug = ?,
          cat_id = ?,
          edit_id = ?,
          edit_date = NOW()
        WHERE id = ? AND active = 1
      `;

      const [result] = await pool.query(updateSql, [
        tag_name,
        tag_slug,
        cat_id || null,
        edit_id,
        id,
      ]);

      if (result.affectedRows === 0) {
        return GLOBAL_ERROR_RESPONSE("Tag not found or not updated.", {}, res);
      }

      return GLOBAL_SUCCESS_RESPONSE(
        "Tag updated successfully.",
        { id, tag_name, tag_slug, cat_id },
        res
      );
    } catch (err) {
      console.error("❌ Error updating tag:", err);

      let message = "Internal server error";
      if (err.code === "ER_DUP_ENTRY") {
        message = "Duplicate tag slug detected.";
      }

      return GLOBAL_ERROR_RESPONSE(message, err, res);
    }
  };

  /** 🗑️ Delete tag (soft delete) */
  this.deleteTag = async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return GLOBAL_ERROR_RESPONSE("Tag ID is required.", {}, res);
      }

      const sql = `
        UPDATE roh_tags
        SET active = 0, edit_date = NOW()
        WHERE id = ?
      `;

      const [result] = await pool.query(sql, [id]);

      if (result.affectedRows === 0) {
        return GLOBAL_ERROR_RESPONSE("No tag found with the given ID.", {}, res);
      }

      return GLOBAL_SUCCESS_RESPONSE(
        "Tag deleted successfully.",
        { tag_id: id },
        res
      );
    } catch (err) {
      console.error("❌ Error deleting tag:", err);
      return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };

  /** 📋 Dropdown list of active categories for tag creation */
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

  /** 🏷️ Get all active tags by sub-category ID Coded by Raj, Oct 31 2025 */
  this.getTagsByCategory = async (req, res) => {
    try {
      const { sub_cat_id } = req.body;

      //  Validate input
      if (!sub_cat_id) {
        return GLOBAL_ERROR_RESPONSE("Sub-category ID is required.", {}, res);
      }

      //  Fetch active tags linked to this subcategory
      const [tags] = await pool.query(
        `SELECT id, tag_name
        FROM roh_tags
        WHERE cat_id = ? AND active = 1
        ORDER BY tag_name ASC`,
        [sub_cat_id]
      );

      if (!tags || tags.length === 0) {
        return GLOBAL_SUCCESS_RESPONSE("No tags found for this subcategory.", { tags: [] }, res);
      }

      return GLOBAL_SUCCESS_RESPONSE("Tags fetched successfully.", { tags }, res);
    } catch (err) {
      console.error("Error fetching tags by subcategory:", err);
      return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };

  /** Get Tags all active tags Coded by Raj, Dec 06 2025*/
  this.getActiveTagsDropdown = async (req, res) => {
      try {
          const [tags] = await pool.query(
              `SELECT id, tag_name
              FROM roh_tags
              WHERE active = 1`,
          );

          if (tags.length === 0) {
              return res.status(404).json({ message: "No tag found." });
          }

          // return res.status(200).json({ tags });
          return GLOBAL_SUCCESS_RESPONSE(
                "Tags fetched successfully.",
                { tags },
                res
            );
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
      }
  };
}

module.exports = new TagApi();