const authMiddleware = require('../../../middleware/authMiddleware');
const {ValidateaddnewUser, ValidateGetAllUsers, ValidateEditUser,ValidateDeleteUser, ValidateViewUser, ValidateSwitchUser } = require("./validation");
const UserController = require("./controller");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the path to the frontend directory
    const uploadPath = path.join(__dirname, '../../../assets/uploads/media/users/profile/');
    
    // Ensure the folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath); // Save to this path
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname; // Original filename (e.g., pankaj-img-1.webp)
    const fileExtension = path.extname(originalName); // Extract the file extension (.webp)
    const fileNameWithoutExt = path.basename(originalName, fileExtension); // Extract filename without extension (e.g., pankaj-img-1)

    let newFileName = originalName; // Default to the original name
    let counter = 1;

    // Check if the file already exists in the folder
    while (fs.existsSync(path.join(__dirname, '../../../assets/uploads/media/users/profile/', newFileName))) {
      // If it exists, append the counter (e.g., pankaj-img-1-1.webp, pankaj-img-1-2.webp)
      newFileName = `${fileNameWithoutExt}-${counter}${fileExtension}`;
      counter++;
    }

    // Save the file with the unique name
    cb(null, newFileName);
  }
});

/** Initialize multer with storage configuration */
const upload = multer({ storage: storage });

/** API for adding new user - Coded by Vishnu July 06, 2025 */
app.post(
  ADMIN_NAME + "/user/create",
  authMiddleware,                           /** Authenticate the user */
  upload.single('profile_picture_file'),    /** Handle the file upload (single file with 'profile_picture_file' field) */
  ValidateaddnewUser,                      /** Validation middleware */
  (req, res, next) => {
    if (req.file) {
      req.body.profile_picture_url = req.file.filename; /** Set file name to request body */
    } else {
      //return res.status(400).json({ message: "No file uploaded" });
    }

    /** Proceed with adding the new user */
    UserController.AddnewUser(req, res, next);
  }
);



/** Get all user Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/user/get",
    authMiddleware,
    ValidateGetAllUsers, /** Validation middleware */
    (req, res, next) => {
        UserController.GetAllUsers(req, res, next); /** Call the controller */
    }
);

/** Edit user Coded by Vishnu July 07 2025 */
app.post(
  ADMIN_NAME + "/user/edit",
  authMiddleware,
  upload.single('profile_picture_file'), /** Handle file upload for profile picture */
  ValidateEditUser,  /** Validation middleware */
  (req, res, next) => {
    /** The file handling logic for the profile picture is handled inside the controller */
    UserController.UpdateUser(req, res, next);  /** Call the controller */
  }
);



/** Delete user Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/user/delete",
    authMiddleware,
    ValidateDeleteUser, /** Validation middleware */
    (req, res, next) => {
        UserController.DeleteUser(req, res, next); /** Call the controller */
    }
);

/** View user details Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/user/view", // Change GET to POST
    authMiddleware, // Use your authentication middleware if needed
    ValidateViewUser,  // Your validation middleware
    (req, res, next) => {
        UserController.ViewUser(req, res, next); // Call the controller
    }
);

/** Api to get all service providers - Coded by Vishnu Nov 20, 2025 */
app.get(
  ADMIN_NAME + "/user/allserprovid",
  authMiddleware,
  (req, res) => UserController.GetAllServiceProviders(req, res)
);

/** Switch User (Impersonation) - Coded by Vishnu April 14, 2026 */
app.post(
  ADMIN_NAME + "/user/switch",
  authMiddleware,
  ValidateSwitchUser,
  (req, res, next) => {
    UserController.SwitchUser(req, res, next);
  }
);
