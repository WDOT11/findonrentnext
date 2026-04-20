// Create Model Validation — Coded by Raj Oct 31 2025
const validateCreateModel = (req, res, next) => {
    const { model_name, cat_id, brand_id, tag_id } = req.body;
  
    if (!model_name || typeof model_name !== "string" || model_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "The 'model_name' field is required and must be a non-empty string.",
      });
    }
  
    // Optional validations (if required later)
    if (cat_id && isNaN(Number(cat_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }
  
    if (brand_id && isNaN(Number(brand_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID.",
      });
    }
  
    if (tag_id && isNaN(Number(tag_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID.",
      });
    }
  
    next();
  };
  
  // Get Model Detail Validation — Coded by Raj Oct 31 2025
  const validateDetailModel = (req, res, next) => {
    const { id } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid 'id' is required to get model details.",
      });
    }
  
    next();
  };
  
  // Delete Model Validation — Coded by Raj Oct 31 2025
  const validateDeleteModel = (req, res, next) => {
    const { id } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid 'id' is required to delete a model.",
      });
    }
  
    next();
  };
  
  // Update Model Validation — Coded by Raj Oct 31 2025
  const validateUpdateModel = (req, res, next) => {
    const { id, model_name } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid 'id' is required to update a model.",
      });
    }
  
    if (!model_name || typeof model_name !== "string" || model_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "The 'model_name' field is required and must be a non-empty string.",
      });
    }
  
    next();
  };
  
  // Get Models List Validation — Coded by Raj Oct 31 2025
  const validateGetModel = (req, res, next) => {
    try {
      const { page, limit } = req.body;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
  
      if (!pageNum || !limitNum || pageNum <= 0 || limitNum <= 0) {
        return GLOBAL_ERROR_RESPONSE("Page number and limit must be positive integers", {}, res);
      }
  
      next();
    } catch (err) {
      console.error("Validation error:", err);
      return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
  };
  
  // Export all validation functions
  module.exports = {
    validateCreateModel,
    validateDetailModel,
    validateDeleteModel,
    validateUpdateModel,
    validateGetModel,
  };
  