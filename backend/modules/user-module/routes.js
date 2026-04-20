const UserModuleController = require("./controller");
const {ValidategetUserDtls, ValidateEditUserDtls} = require("./validation");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the path to the frontend directory
    const uploadPath = path.join(__dirname, '/../../assets/uploads/media/users/profile/');

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
    while (fs.existsSync(path.join(__dirname, '/../../assets/uploads/media/users/profile/', newFileName))) {
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

/** Api to get user details - Coded by Vishnu August 14 2025 */
app.post(
    "/api/user/userdetails",
    ValidategetUserDtls,
    (req, res, next) => {
        UserModuleController.getUserDetails(req, res, next);
    }
);

/** API to edit user details - Coded by Vishnu August 15 2025 */
app.post(
    "/api/user/edituserdetails",
    upload.single('profile_picture_file'),    /** Handle the file upload (single file with 'profile_picture_file' field) */
    ValidateEditUserDtls,
    (req, res, next) => {
        UserModuleController.editUserDetails(req, res, next);
    }
);