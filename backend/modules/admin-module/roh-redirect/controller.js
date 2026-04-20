const { pool } = require('../../../config/connection');

function redirectApi() {

  /** Api to add new redirect - Coded by Vishnu - Feb 12 2026 */
  this.addRedirect = async (req, res) => {
    try {
      const {
        source_url,
        target_url,
        redirect_type = '301',
        is_regex = 0,
        match_type = "exact",
        status = 1,
        notes = null,
      } = req.body;

      /* ================= BASIC VALIDATION ================= */
      if (!source_url || !target_url) {
        return res.status(400).json({
          success: false,
          message: "Source URL and Target URL are required",
        });
      }

      /* ================= ENUM VALIDATION ================= */
      const allowedRedirects = ['301', '302', '307', '308'];
      const redirectCode = String(redirect_type);

      if (!allowedRedirects.includes(redirectCode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid redirect type",
        });
      }

      /* ================= DUPLICATE CHECK ================= */
      const checkQuery = `
        SELECT id
        FROM roh_redirects
        WHERE source_url = ?
        LIMIT 1
      `;

      const [existing] = await pool.promise().query(checkQuery, [source_url]);

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Redirect already exists for this source URL",
        });
      }

      /* ================= INSERT ================= */
      const insertQuery = `
        INSERT INTO roh_redirects
        (
          source_url,
          target_url,
          redirect_type,
          is_regex,
          match_type,
          status,
          hit_count,
          notes,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 0, ?, NOW(), NOW())
      `;

      const [result] = await pool.promise().query(insertQuery, [
        source_url,
        target_url,
        redirectCode,   /** STRING for ENUM */
        is_regex ? 1 : 0,
        match_type,
        status ? 1 : 0,
        notes,
      ]);

      return res.status(201).json({
        success: true,
        message: "Redirect added successfully",
        data: {
          id: result.insertId,
          source_url,
          target_url,
          redirect_type: redirectCode,
        },
      });

    } catch (err) {
      console.error("Error in Add new Redirect:", err);
      return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };

  /** Api to get all redirects - Coded by Vishnu - Feb 12 2026 */
  this.getAllRedirect = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 200,
      status = 1,
      redirect_type,
    } = req.query;

    const offset = (page - 1) * limit;

    /* ================= BUILD CONDITIONS ================= */
    let whereClause = `WHERE status = ?`;
    let params = [status];

    if (redirect_type) {
      whereClause += ` AND redirect_type = ?`;
      params.push(String(redirect_type)); // ENUM safe
    }

    /* ================= MAIN QUERY ================= */
    const query = `
      SELECT 
        id,
        source_url,
        target_url,
        redirect_type,
        is_regex,
        match_type,
        hit_count,
        notes,
        created_at
      FROM roh_redirects
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(Number(limit), Number(offset));

    const [results] = await pool.promise().query(query, params);

    /* ================= COUNT QUERY ================= */
    const countQuery = `
      SELECT COUNT(*) as total
      FROM roh_redirects
      ${whereClause}
    `;

    const [countResult] = await pool.promise().query(
      countQuery,
      params.slice(0, params.length - 2)
    );

    return res.status(200).json({
      success: true,
      message: "Redirect list fetched successfully",
      data: results,
      pagination: {
        total: countResult[0].total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(countResult[0].total / limit),
      },
    });

  } catch (err) {
    console.error("Error in get all Redirect:", err);
    return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
  }
  };

  /** Api to edit/update redirect - Coded by Vishnu - Feb 12 2026 */
  this.updateRedirect = async (req, res) => {
  try {
    const {
      id,
      source_url,
      target_url,
      redirect_type,
      match_type = 'exact',
      status = 'active',     // ENUM
      notes = null
    } = req.body;

    /* ================= BASIC VALIDATION ================= */
    if (!id || !source_url || !target_url || !redirect_type) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    /* ================= ENUM VALIDATION ================= */
    const allowedRedirects = ['301', '302', '307', '308'];
    const allowedStatus = ['active', 'inactive'];

    if (!allowedRedirects.includes(String(redirect_type))) {
      return res.status(400).json({
        success: false,
        message: "Invalid redirect type",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    /* ================= CHECK EXIST ================= */
    const [exists] = await pool.promise().query(
      `SELECT id FROM roh_redirects WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!exists.length) {
      return res.status(404).json({
        success: false,
        message: "Redirect not found",
      });
    }

    /* ================= UPDATE ================= */
    const updateQuery = `
      UPDATE roh_redirects
      SET
        source_url = ?,
        target_url = ?,
        redirect_type = ?,
        is_regex = 0,            -- hard coded as requested
        match_type = ?,
        status = ?,              -- ENUM active/inactive
        notes = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await pool.promise().query(updateQuery, [
      source_url,
      target_url,
      String(redirect_type),
      match_type,
      status,
      notes,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: "Redirect updated successfully",
    });

  } catch (err) {
    console.error("Error in update Redirect:", err);
    return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
  }
  };

  /** Api to view redirect details - Coded by Vishnu - Feb 12 2026 */
  this.viewRedirect = async (req, res) => {
    try {
        const { redirect_id } = req.body;

        /* ================= VALIDATION ================= */
        if (!redirect_id) {
        return res.status(400).json({
            success: false,
            message: "Redirect ID is required",
        });
        }

        /* ================= QUERY ================= */
        const query = `
        SELECT 
            id,
            source_url,
            target_url,
            redirect_type,
            is_regex,
            match_type,
            status,
            hit_count,
            notes
        FROM roh_redirects
        WHERE id = ?
        LIMIT 1
        `;

        const [rows] = await pool.promise().query(query, [redirect_id]);

        if (!rows.length) {
        return res.status(404).json({
            success: false,
            message: "Redirect not found",
        });
        }

        return res.status(200).json({
        success: true,
        message: "Redirect fetched successfully",
        data: rows[0],
        });

    } catch (err) {
        console.error("Error in view Redirect:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
  };


}

module.exports = new redirectApi();
