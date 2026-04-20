// Create Tag Validation — Coded by Raj Nov 2025
const validateCreateTag = (req, res, next) => {
    const { tag_name } = req.body;
  
    if (!tag_name || typeof tag_name !== 'string' || tag_name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "The 'tag_name' field is required and must be a non-empty string.",
      });
    }
  
    next();
  };
  
  // Get Tag Details Validation — Coded by Raj Nov 2025
  const validateDetailTag = (req, res, next) => {
    const { id } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid 'id' is required to get tag details.",
      });
    }
  
    next();
  };
  
  // Delete Tag Validation — Coded by Raj Nov 2025
  const validateDeleteTag = (req, res, next) => {
    const { id } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid 'id' is required to delete a tag.",
      });
    }
  
    next();
  };
  
  // Update Tag Validation — Coded by Raj Nov 2025
  const validateUpdateTag = (req, res, next) => {
    const { id, tag_name } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid 'id' is required to update a tag.",
      });
    }
  
    if (tag_name && typeof tag_name !== 'string') {
      return res.status(400).json({
        success: false,
        message: "The 'tag_name' field must be a string if provided.",
      });
    }
  
    next();
  };
  
  // Get All Tags Validation — Coded by Raj Nov 2025
  const validateGetTag = (req, res, next) => {
    try {
      const { page, limit } = req.body;
  
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
  
      if (!pageNum || !limitNum || pageNum <= 0 || limitNum <= 0) {
        return GLOBAL_ERROR_RESPONSE(
          "Page number and limit must be positive integers.",
          {},
          res
        );
      }
  
      next();
    } catch (err) {
      console.error("Validation error:", err);
      return GLOBAL_ERROR_RESPONSE(
        "Validation error",
        { error: err.message || err },
        res
      );
    }
  };
  
  //  Export all validation functions
  module.exports = {
    validateCreateTag,
    validateDetailTag,
    validateDeleteTag,
    validateUpdateTag,
    validateGetTag,
  };  