const pool = require("../../../config/connection");
const path = require("path");

function ModelApi() {

  /** Create a new model (with slug & optional image) */
  this.createModel = async (req, res) => {
    try {
      // 1. Destructure model_slug from req.body
      const {
        model_name,
        model_label,
        model_slug: provided_slug,
        description,
        brand_id,
        tag_id,
        add_id,
        edit_id,
        model_picture_file
      } = req.body;

      const active = 1;
      let model_img_id = null;

      /* ===============
      * Validate inputs
      * ============== */
      if (!model_name) {
        return GLOBAL_ERROR_RESPONSE("Model name is required.", {}, res);
      }

      /* ================================
      * If image uploaded → insert media
      * ================================= */
      if (model_picture_file) {
        const fileExtension = path.extname(model_picture_file);
        const modelImageType = fileExtension.replace(".", "");
        const modelImagePath = "/uploads/media/model/";

        const [mediaInsert] = await pool.query(
          `INSERT INTO roh_media_gallery (file_name, file_path, file_type, active) VALUES (?, ?, ?, ?)`,
          [model_picture_file, modelImagePath, modelImageType, 1]
        );

        model_img_id = mediaInsert.insertId;
      }

      /* ========================================================
      * Handle Slug Logic
      * Use the provided slug if it exists, otherwise generate it
      * ======================================================== */
      let final_slug = provided_slug;

      if (!final_slug) {
        final_slug = model_name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-");
      } else {
        final_slug = final_slug
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
      }

      /* ==============================================
      * Check duplicate active model (using final_slug)
      * =============================================== */
      const [existingActive] = await pool.query(
        `SELECT id FROM roh_models WHERE model_slug = ? AND brand_id = ? AND active = 1`,
        [final_slug, brand_id || null]
      );

      if (existingActive.length > 0) {
        return GLOBAL_ERROR_RESPONSE("A model with this slug/name already exists under this brand.", {}, res);
      }

      /* ===========
      * Insert model
      * =========== */
      const insertSql = `
        INSERT INTO roh_models
        (model_name, model_label, model_slug, description, brand_id, tag_id, model_img_id, active, add_id, edit_id, add_date, edit_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const [insertResult] = await pool.query(insertSql, [
        model_name,
        model_label,
        final_slug,
        description || null,
        brand_id || null,
        tag_id || null,
        model_img_id,
        active,
        add_id,
        edit_id || null,
      ]);

      /* ===============
      * Success response
      * =============== */
      if (insertResult.affectedRows === 1) {
        return GLOBAL_SUCCESS_RESPONSE(
          "Model created successfully.",
          {
            model_id: insertResult.insertId,
            model_name,
            model_label,
            model_slug: final_slug,
            description: description || null,
            brand_id: brand_id || null,
            tag_id: tag_id || null,
            model_img_id,
          },
          res
        );
      }

      return GLOBAL_ERROR_RESPONSE("Failed to create model.", {}, res);

    } catch (err) {
      console.error("Error creating model:", err);

      let message = "Internal server error";
      if (err.code === "ER_DUP_ENTRY") {
        message = "Duplicate model slug detected.";
      }

      return GLOBAL_ERROR_RESPONSE(message, err, res);
    }
  };

  /** Get Model List (with pagination and optional search) — Updated by Raj Oct 31 2025 */
  this.getModelData = async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 10;
      const offset = (page - 1) * limit;

      const modelName = req.body.model_name?.trim() || "";
      const modelBrand = req.body.brand_id || "";
      const modelCategory = req.body.category_id || "";
      const modelStatus = req.body.status ?? ""; // IMPORTANT
      const modelTag = req.body.tag_id || "";

      /** --------------------------------
       * Base query — NO active filter here
       * -------------------------------- */
      let sql = `
        SELECT
          m.id,
          m.model_name,
          m.model_label,
          m.model_slug,
          m.model_old_slug,
          m.brand_id,
          m.tag_id,
          m.active,
          b.brand_name,
          b.cat_id,
          t.tag_name,
          c.name AS category_name
        FROM roh_models m
        LEFT JOIN roh_brands b ON m.brand_id = b.id
        LEFT JOIN roh_tags t ON m.tag_id = t.id
        LEFT JOIN roh_categories c ON b.cat_id = c.id
        WHERE 1 = 1
      `;

      const queryParams = [];

      /** --------------------------------
       * Filters
       * -------------------------------- */
      if (modelName) {
        sql += ` AND m.model_name LIKE ?`;
        queryParams.push(`%${modelName}%`);
      }

      if (modelBrand) {
        sql += ` AND m.brand_id = ?`;
        queryParams.push(modelBrand);
      }

      if (modelCategory) {
        sql += ` AND b.cat_id = ?`;
        queryParams.push(modelCategory);
      }

      if (modelTag) {
        sql += ` AND m.tag_id = ?`;
        queryParams.push(modelTag);
      }

      /** ✅ Status filter (ACTIVE / INACTIVE / ALL) */
      if (modelStatus !== "") {
        sql += ` AND m.active = ?`;
        queryParams.push(modelStatus);
      }

      sql += ` ORDER BY m.id DESC`;

      /** --------------------------------
       * Execute query
       * -------------------------------- */
      const [models] = await pool.query(sql, queryParams);

      const total = models.length;
      const totalPages = Math.ceil(total / limit);

      if (total === 0 || page > totalPages) {
        return GLOBAL_SUCCESS_RESPONSE(
          "No models found.",
          { models: [], page, limit, total, totalPages },
          res
        );
      }

      /** --------------------------------
       * Pagination
       * -------------------------------- */
      const paginated = models.slice(offset, offset + limit);

      return GLOBAL_SUCCESS_RESPONSE(
        "Models fetched successfully.",
        { models: paginated, page, limit, total, totalPages },
        res
      );

    } catch (error) {
      console.error("Error fetching model list:", error);
      return GLOBAL_ERROR_RESPONSE("Internal server error", error, res);
    }
  };


  /** Get Model Details by ID */
  this.getModelDetail = async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return GLOBAL_ERROR_RESPONSE("Model ID is required.", {}, res);
      }

      const [rows] = await pool.query(
        `
        SELECT
          m.id,
          m.model_name,
          m.model_label,
          m.model_slug,
          m.model_old_slug,
          m.brand_id,
          m.tag_id,
          m.description,
          m.active,

          b.brand_name,

          b.cat_id AS sub_category_id,
          sc.name AS sub_category_name,

          sc.parent_category_id,
          pc.name AS main_category_name,

          t.tag_name,

          mg.file_path,
          mg.file_name

        FROM roh_models m

        LEFT JOIN roh_brands b ON m.brand_id = b.id
        LEFT JOIN roh_categories sc ON b.cat_id = sc.id
        LEFT JOIN roh_categories pc ON sc.parent_category_id = pc.id
        LEFT JOIN roh_tags t ON m.tag_id = t.id
        LEFT JOIN roh_media_gallery mg ON m.model_img_id = mg.id

        WHERE m.id = ?`, [id]
      );

      if (rows.length === 0) {
        return GLOBAL_ERROR_RESPONSE("Model not found.", {}, res);
      }

      const model = rows[0];

      /** Build image_url safely */
      const image_url =
        model.file_name && model.file_path
          ? `${model.file_path}${model.file_name}`
          : null;

      /** Remove raw media columns */
      delete model.file_name;
      delete model.file_path;

      return GLOBAL_SUCCESS_RESPONSE(
        "Model details fetched successfully.",
        {
          ...model,
          image_url,
        },
        res
      );

    } catch (err) {
      console.error("❌ Error fetching model details:", err);
      return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };

  /** Update Model */
  this.updateModel = async (req, res) => {
    try {
      // 1. Destructure model_slug from the request body
      const {
        id,
        model_name,
        model_label,
        model_slug: provided_slug,
        model_old_slug,
        brand_id,
        tag_id,
        description,
        edit_id,
        active
      } = req.body;

      if (!id || !model_name) {
        return GLOBAL_ERROR_RESPONSE("Missing required fields.", {}, res);
      }

      /** --------------------------------
       * Handle Slug Logic
       * Prioritize the slug from frontend, fallback to generation
       * -------------------------------- */
      let final_slug = provided_slug;

      if (!final_slug) {
        final_slug = model_name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-");
      } else {
        // Clean the provided slug for safety
        final_slug = final_slug
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
      }

      /** --------------------------------
       * Check duplicate slug (exclude self via id != ?)
       * -------------------------------- */
      const [duplicate] = await pool.query(
        `SELECT id FROM roh_models WHERE model_slug = ? AND id != ? AND brand_id = ? AND active = 1`,
        [final_slug, id, brand_id || null]
      );

      if (duplicate.length > 0) {
        return GLOBAL_ERROR_RESPONSE(
          "Another model with this slug already exists under this brand.",
          {},
          res
        );
      }

      /** --------------------------------
       * Handle image upload (optional)
       * -------------------------------- */
      let model_img_id = null;

      if (req.file) {
        const fileName = req.file.filename;
        const fileExtension = fileName.split(".").pop();
        const modelImagePath = "/uploads/media/model/";

        const [mediaInsert] = await pool.query(
          `INSERT INTO roh_media_gallery (file_name, file_path, file_type, active) VALUES (?, ?, ?, ?)`,
          [fileName, modelImagePath, fileExtension, 1]
        );

        model_img_id = mediaInsert.insertId;
      }

      /** --------------------------------
       * Build update query dynamically
       * -------------------------------- */
      let updateSql = `UPDATE roh_models SET model_name = ?, model_label = ?, model_slug = ?, model_old_slug = ?, brand_id = ?, tag_id = ?, description = ?, active = ?, edit_id = ?, edit_date = NOW()`;

      const updateParams = [
        model_name,
        model_label,
        final_slug, // Using the processed slug
        model_old_slug,
        brand_id || null,
        tag_id || null,
        description || null,
        active !== undefined ? active : 1,
        edit_id,
      ];

      /** If image uploaded → update image id */
      if (model_img_id) {
        updateSql += `, model_img_id = ?`;
        updateParams.push(model_img_id);
      }

      updateSql += ` WHERE id = ?`;
      updateParams.push(id);

      /** --------------------------------
       * Execute update
       * -------------------------------- */
      const [result] = await pool.query(updateSql, updateParams);

      if (result.affectedRows === 0) {
        return GLOBAL_ERROR_RESPONSE(
          "Model not found or no changes were made.", {}, res
        );
      }

      /** --------------------------------
       * Success response
       * -------------------------------- */
      return GLOBAL_SUCCESS_RESPONSE(
        "Model updated successfully.",
        {
          id,
          model_name,
          model_label,
          model_slug: final_slug,
          model_old_slug,
          brand_id,
          tag_id,
          description,
          active: active !== undefined ? active : 1,
          ...(model_img_id && { model_img_id })
        },
        res
      );

    } catch (err) {
      console.error("Update Error:", err);
      let message = "Internal server error";
      if (err.code === "ER_DUP_ENTRY") {
        message = "Duplicate model slug detected.";
      }

      return GLOBAL_ERROR_RESPONSE(message, err, res);
    }
  };

  /** Soft Delete Model */
  this.deleteModel = async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return GLOBAL_ERROR_RESPONSE("Model ID is required.", {}, res);
      }

      const sql = `
        UPDATE roh_models
        SET active = 0, edit_date = NOW()
        WHERE id = ?
      `;

      const [result] = await pool.query(sql, [id]);

      if (result.affectedRows === 0) {
        return GLOBAL_ERROR_RESPONSE("No model found with the given ID.", {}, res);
      }

      return GLOBAL_SUCCESS_RESPONSE(
        "Model deleted successfully.",
        { model_id: id },
        res
      );
    } catch (err) {
      console.error("Error deleting model:", err);
      return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };
}

module.exports = new ModelApi();
