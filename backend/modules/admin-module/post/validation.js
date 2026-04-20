const { pool } = require("../../../config/connection");

/** Add new post validation - Coded by Vishnu Oct 11, 2025 */
const ValidateaddnewPost = async (req, res, next) => {
  const { post_title, post_slug } = req.body;

  if (!post_title || !post_slug) {
    return res.status(400).json({
      success: false,
      message: "post_title and post_slug are required."
    });
  }

  try {
    pool.query(
      "SELECT id FROM roh_posts WHERE post_slug = ? LIMIT 1",
      [post_slug],
      (err, results) => {
        if (err) {
          console.error("Validation DB error:", err);
          return res.status(500).json({
            success: false,
            message: "Database validation error."
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Post slug already exists. Please use a unique slug."
          });
        }

        next(); /** Continue to controller */
      }
    );
  } catch (err) {
    console.error("Validation exception:", err);
    return res.status(500).json({
      success: false,
      message: "Internal validation error."
    });
  }
};

/** Get all posts list validation - Coded by Vishnu Oct 11, 2025 */


module.exports = { ValidateaddnewPost };
