const ModelApi = require("./controller");
const authMiddleware = require('../../../middleware/authMiddleware');
const {
  validateGetModel,
  validateCreateModel,
  validateDetailModel,
  validateUpdateModel,
  validateDeleteModel
} = require('./validation');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer (if you later allow model images) */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../assets/uploads/media/model/');
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

    while (fs.existsSync(path.join(__dirname, '../../../assets/uploads/media/model/', newFileName))) {
      newFileName = `${fileNameWithoutExt}-${counter}${fileExtension}`;
      counter++;
    }

    cb(null, newFileName);
  },
});

const upload = multer({ storage });

/** API: Create a new model — Coded by Raj Oct 31 2025 */
app.post(
  ADMIN_NAME + "/model/create",
  authMiddleware,
  upload.single("model_picture_file"),
  // validateCreateModel,
  (req, res, next) => {
    if (req.file) {
      req.body.model_picture_file = req.file.filename;
    }
    ModelApi.createModel(req, res, next);
  }
);

/** API: Get models list (with pagination & filter) — Coded by Raj Oct 31 2025 */
app.post(
  ADMIN_NAME + "/model/list",
  // authMiddleware,
  // validateGetModel,
  (req, res, next) => {
    ModelApi.getModelData(req, res, next);
  }
);

/** API: Get model details by ID — Coded by Raj Oct 31 2025 */
app.post(
  ADMIN_NAME + "/model/details",
  authMiddleware,
  // validateDetailModel,
  (req, res, next) => {
    ModelApi.getModelDetail(req, res, next);
  }
);

/** API: Update model — Coded by Raj Oct 31 2025 */
app.post(
  ADMIN_NAME + "/model/update",
  authMiddleware,
  upload.single("model_picture_file"),
  (req, res, next) => {
    if (req.file) {
      req.body.model_picture_file = req.file.filename;
    }
   ModelApi.updateModel(req, res, next);
  }
);
