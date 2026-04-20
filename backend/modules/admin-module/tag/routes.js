const TagApi = require("./controller");
const authMiddleware = require('../../../middleware/authMiddleware');
const {
  validateGetTag,
  validateCreateTag,
  validateDetailTag,
  validateUpdateTag,
  validateDeleteTag,
} = require('./validation');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../../frontend/public/media/category/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const fileNameWithoutExt = path.basename(originalName, fileExtension);
    let newFileName = originalName;
    let counter = 1;

    while (fs.existsSync(path.join(__dirname, '../../../../frontend/public/media/category', newFileName))) {
      newFileName = `${fileNameWithoutExt}-${counter}${fileExtension}`;
      counter++;
    }

    cb(null, newFileName);
  },
});

/** Initialize multer */
const upload = multer({ storage: storage });

/** Create a new tag */
app.post(
  ADMIN_NAME + "/tag/create",
  authMiddleware,
  // validateCreateTag,
  (req, res, next) => {
    TagApi.createTag(req, res, next);
  }
);

/** 📄 Get all tags (with pagination + filters) */
app.post(
  ADMIN_NAME + "/tag/list",
  // authMiddleware,
  // validateGetTag,
  (req, res, next) => {
    TagApi.getTagData(req, res, next);
  }
);

/** 🔍 Get tag details by ID */
app.post(
  ADMIN_NAME + "/tag/details",
  authMiddleware,
  // validateDetailTag,
  (req, res, next) => {
    TagApi.getTagDetail(req, res, next);
  }
);

/** ✏️ Update tag */
app.post(
  ADMIN_NAME + "/tag/update",
  authMiddleware,
  // validateUpdateTag,
  (req, res, next) => {
    TagApi.updateTag(req, res, next);
  }
);

/** 🗑️ Soft delete tag */
app.post(
  ADMIN_NAME + "/tag/delete",
  // authMiddleware,
  // validateDeleteTag,
  (req, res, next) => {
    TagApi.deleteTag(req, res, next);
  }
);

/** 🏷️ Get tags by category ID - Coded by Raj Oct 31 2025 */
app.post(
  ADMIN_NAME + "/tag/getByCategory",
  authMiddleware,
  (req, res, next) => {
    TagApi.getTagsByCategory(req, res, next);
  }
);

/** Get tags all active tags(dropdown) - Coded by Raj Dec 06 2025 */
app.post(
  ADMIN_NAME + "/tag/dropdownAll",
  authMiddleware,
  (req, res, next) => {
    TagApi.getActiveTagsDropdown(req, res, next);
  }
);
