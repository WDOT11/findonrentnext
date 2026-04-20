const Category = require("./controller");
const authMiddleware = require('../../../middleware/authMiddleware');
const {validateGetCategory, validateCreateCategory, validateDetailCategory, validateUpdateCategory, validateadminGetAllActiveCate } = require('./validation');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer */
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    // const uploadPath = path.join(__dirname, '../../../assets/uploads/media/media/category/');
    const uploadPath = path.join(__dirname, '../../../assets/uploads/media/category/');
    
    // Ensure the folder exists
    if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath); // Save to this path
},
filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const fileNameWithoutExt = path.basename(originalName, fileExtension);

    let newFileName = originalName; // Default to the original name
    let counter = 1;

    // Check if the file already exists in the folder
    while (fs.existsSync(path.join(__dirname, '../../../assets/uploads/media/category/', newFileName))) {
    newFileName = `${fileNameWithoutExt}-${counter}${fileExtension}`;
    counter++;
    }

    // Save the file with the unique name
    cb(null, newFileName);
}
});

/** Initialize multer with storage configuration */
const upload = multer({ storage: storage });

/** API to create a category and sub category Coded by Raj July 04 2025 */
app.post(
    ADMIN_NAME + "/category/create",
    authMiddleware,
    upload.single('category_picture_file'),
    validateCreateCategory,
    (req, res, next) => {
        if (req.file) {
            req.body.category_picture_file = req.file.filename; /** Set file name to request body */
            } else {
            //return res.status(400).json({ message: "No file uploaded" });
            }
        Category.createCategory(req, res, next);
    }
);

/** API to get the category list Coded by Raj July 04 2025 */
app.post(
    ADMIN_NAME + "/category/list",
    authMiddleware,
    validateGetCategory,
    (req, res, next) => {
        Category.categoryList(req, res, next);
    }
);

/** API to get the parent category list for dropdowns Coded by Raj July 27 2025 */
app.get(
    ADMIN_NAME + "/category/getParent",
    authMiddleware,
    // validateGetCategory,
    (req, res, next) => {
        Category.parentCategoryDropdown(req, res, next);
    }
);

/** API to get the category details by category id Coded by Raj July 04 2025*/
app.post(
    ADMIN_NAME + "/category/details",
    authMiddleware,
    validateDetailCategory,
    (req, res, next) => {
        Category.categoryDetail(req, res, next);
    }
)

/** API to update the category data Coded by Raj Nov 04 2025 */
app.post(
    ADMIN_NAME + "/category/update",
    authMiddleware,
    upload.single('category_picture_file'),
    validateUpdateCategory,
    (req, res, next) => {
      if (req.file) {
        req.body.category_picture_file = req.file.filename;
      }
      Category.updateCategory(req, res, next);
    }
);

/** API to get all active parent and child category - Coded by Vishnu Oct 11 2025 */
app.get(
   ADMIN_NAME + "/category/admingetallactivecate",
    // authMiddleware,
    validateadminGetAllActiveCate,
    (req, res, next) => {
        Category.admingetAllActiveCate(req, res, next);
    }
);

/** API to get sub-categories by parent category - Coded by Raj Oct 31 2025 */
app.post(
    ADMIN_NAME + "/category/getSubCategories",
    authMiddleware,
    // validateGetSubCategories,
    (req, res, next) => {
      Category.getSubCategories(req, res, next);
    }
);

/** API to get all active main categories with their subcategories - Coded by Raj Oct 31 2025 */
app.get(
    ADMIN_NAME + "/category/getAllActiveWithChildren",
    authMiddleware,
    // validateGetAllActiveWithChildren, // optional validation
    (req, res, next) => {
      Category.getAllActiveWithChildren(req, res, next);
    }
  );