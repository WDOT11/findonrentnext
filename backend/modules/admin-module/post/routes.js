const authMiddleware = require('../../../middleware/authMiddleware');
const { ValidateaddnewPost } = require("./validation");
const PostController = require("./controller");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../assets/uploads/media/post/');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    let newName = originalName;
    let counter = 1;
    while (fs.existsSync(path.join(__dirname, '../../../assets/uploads/media/post/', newName))) {
      newName = `${base}-${counter}${ext}`;
      counter++;
    }
    cb(null, newName);
  }
});

const upload = multer({ storage });

/** API for adding new post - Coded by Vishnu Oct 11, 2025 */
app.post(
  ADMIN_NAME + "/post/create",
  authMiddleware,                             /** Authenticate admin */
  upload.single('post_picture_file'),          /** File upload field */
  ValidateaddnewPost,                         /** Validation middleware */
  (req, res, next) => {
    if (req.file) {
      req.body.post_picture_url = req.file.filename;
    }
    PostController.AddnewPost(req, res, next);
  }
);

/** API for get all posts - Coded by Vishnu Oct 11, 2025 */
app.get(
  ADMIN_NAME + "/post/list",
  authMiddleware,  
  (req, res, next) => 
    PostController.ListAllPosts(req, res, next)
);

/** API for view single post -Coded by Vishnu Oct 12, 2025 */
app.post(
  ADMIN_NAME + "/post/view",
  authMiddleware,  
  (req, res, next) => 
    PostController.ViewSinglePost(req, res, next)
);

/** API for update single post -Coded by Vishnu Oct 12, 2025 */
app.post(
  ADMIN_NAME + "/post/edit",
  authMiddleware,
  upload.single('post_picture_file'), // multer will parse FormData
  (req, res, next) => {
    if (req.file) {
      req.body.post_picture_url = req.file.filename; // attach uploaded filename
    }
    PostController.UpdateSinglePost(req, res, next);
  }
);