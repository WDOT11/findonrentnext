// Create Category Validation Coded by Raj July 04 2025
const validateCreateCategory = (req, res, next) => {
    
    const { name  } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "The 'name' field is required and must be a non-empty string."
        });
    }

    next();
};

// Update Category Validation Coded by Raj July 04 2025
const validateDetailCategory = (req, res, next) => {
    const { id } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            message: "A valid 'id' is required to get the details."
        });
    }

    next();
};

/** Update validation category Coded by Raj July 04 2025 */
const validateUpdateCategory = (req ,res, next) => {
    const { id } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            message: "A valid 'id' is required to update a category."
        });
    }

    next();
};

/** Get all categories validations Coded by Raj July 15 2025 */
const validateGetCategory = (req, res, next) => {
    try {
        const { page, limit } = req.body;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (!pageNum || !limitNum || pageNum <= 0 || limitNum <= 0) {
            return GLOBAL_ERROR_RESPONSE("Page number and limit must be positive integers", {}, res);
        }

        next();
    } catch (err) {
        return GLOBAL_ERROR_RESPONSE("Validation error", { error: err.message || err }, res);
    }
};

// Export all validation functions
module.exports = {
    validateCreateCategory,
    validateDetailCategory,
    validateUpdateCategory,
    validateGetCategory
};
