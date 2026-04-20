const AuthController = require("./controller");
const generateFooterData = require("../../../utils/generateFooterData");
const {validateUserSignUp, validateServiceProviderRegister, validateUserLogin, validateAdminUserLogin,validateAvailabilityCheck, signUpvalidateOTP, validateResendOTP, signInverifyOtp,  ValidateGetServiceProviderinfo} = require("./validation");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/** Set storage engine for multer */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const uploadPath = path.join(__dirname, '../../../../frontend/public/media/host/items/');
    const uploadPath = path.join(__dirname, '../../../assets/uploads/media/host/items/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const fileNameWithoutExt = path.basename(originalName, fileExtension);

    // const uploadPath = path.join(__dirname, '../../../../frontend/public/media/host/items/');
    const uploadPath = path.join(__dirname, '../../../assets/uploads/media/host/items/');
    let newFileName = originalName;
    let counter = 1;

    while (fs.existsSync(path.join(uploadPath, newFileName))) {
      newFileName = `${fileNameWithoutExt}-${counter}${fileExtension}`;
      counter++;
    }
    cb(null, newFileName);
  }
});

/** Initialize multer */
const upload = multer({ storage });


/** API to detect country for the request */
app.post(
    "/api/public/detect-country",
    //checkLoginAuth,
    (req, res, next) => {
        AuthController.trackRequest(req, res, next);  /** Call the controller */
    }
)

/** Api for register user Coded by Raj July 07 2025 */
app.post(
    "/api/auth/signup",
    //checkLoginAuth,
    validateUserSignUp,
    (req, res, next) => {
        AuthController.userRegister(req, res, next);  /** Call the controller */
    }
)

/** Api for register service provider Coded by Raj July 08 2025 */
app.post(
    // ADMIN_NAME + "/user/signup",
    "/api/auth/service-provider/register",
    //checkLoginAuth,
    validateServiceProviderRegister,
    (req, res, next) => {
        AuthController.serviceProviderRegister(req, res, next);
    }
);

/** Api to login the user - Coded by Raj July 09 2025 */
app.post(
    "/api/auth/login",
    validateUserLogin,
    (req, res, next) => {
        AuthController.userLogin(req, res, next); /** Calling the controller */
    }
);

/** Api to login the admin - Coded by Raj July 10 2025 */
app.post(
    "/api/adminrohpnl/login",
    validateAdminUserLogin,
    (req, res, next) => {
        AuthController.adminUserLogin(req, res, next); /** Calling the controller */
    }
);

/** API Check Availability Coded by Vishnu Aug 11 2025 */
app.post(
    "/api/auth/checkavailability",
    validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.checkAvailability(req, res, next); /** Calling the controller */
    }
);

/** OTP Verification Coded by Vishnu Aug 12 2025 */
app.post(
    "/api/auth/sign-up-verifyotp",
    signUpvalidateOTP,
    (req, res, next) => {
        AuthController.signUpverifyOTP(req, res, next); /** Calling the controller */
    }
);

/** Resend OTP Coded by Vishnu Aug 12 2025 */
app.post(
    "/api/auth/verify-resendotp",
    // validateResendOTP,
    (req, res, next) => {
        AuthController.resendOTP(req, res, next); /** Calling the controller */
    }
);

/** signInverifyOtp user login - Coded by Vishnu Aug 13 2025 */
app.post(
    "/api/auth/sign-in-verify-otp",
    signInverifyOtp,
    (req, res, next) => {
        AuthController.signInverifyOtp(req, res, next); /** Calling the controller */
    }
);

/** Api to User Forgot Password - Send Reset Token (Only user_role_id = 3) - Coded by Vishnu Dec 01 2025 */
app.post(
    "/api/auth/forgot-password",
    (req, res, next) => {
        AuthController.UserforgotPassword(req, res, next);
    }
);

/** Api to User Reset Password (Only user_role_id = 3) - Coded by Vishnu Dec 01 2025 */
app.post(
    "/api/auth/reset-password",
    (req, res, next) => {
        AuthController.UserResetPassword(req, res, next);
    }
);

/** Api to check reset token (Only user_role_id = 3) - Coded by Vishnu Dec 01 2025 */
app.post(
    "/api/auth/check-reset-token",
    (req, res, next) => {
    AuthController.UserCheckResetToken(req, res, next);
});

/** Api to get service provider details - Coded by Vishnu August 31 2025 */
app.post(
    "/api/user/getserviceprovideinfo",
    ValidateGetServiceProviderinfo,
    (req, res, next) => {
        AuthController.getServiceProviderDetails(req, res, next); /** Calling the controller */
    }
);

/** Api to get user recently viewed items - Coded by Vishnu Nov 10, 2025 */
app.post(
    "/api/user/getrecentlyvieweditems",
    // ValidateGetUserRecentlyViewedItems,
    (req, res, next) => {
        AuthController.getRecentlyViewedItems(req, res, next); /** Calling the controller */
    }
);

/** Api to remove user recently viewed items - Coded by Vishnu Nov 11, 2025 */
app.post(
  "/api/user/removerecentlyviewed",
  (req, res, next) => {
    AuthController.removeRecentlyViewedItem(req, res, next);
  }
);

/** Api to restore user recently viewed items - Coded by Vishnu Nov 11, 2025 */
app.post(
    "/api/user/restoreviewitem",
    (req, res, next) => {
    AuthController.restoreViewedItem(req, res, next);
});

/** Api to get service providers business details - Coded by Vishnu Nov 19, 2025 */
app.post(
    "/api/user/getserbusinessdetails",
    (req, res, next) => {
        AuthController.getserBusinessDetails(req, res, next);
    }
);

/** Api to update service providers business details - Coded by Vishnu Nov 19, 2025 */
app.post(
    "/api/user/updateserbusinessdetails",
    (req, res, next) => {
        AuthController.updateSerBusinessDetails(req, res, next);
    }
);

/** API USED IN THE AGENT USER REGISTRATION FORM */
/** API to Check Availability by phone number Coded by Raj Dec 31 2025 */
app.post(
    "/api/auth/check-phone-availability",
    // validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.checkPhoneAvailability(req, res, next); /** Calling the controller */
    }
);

/** API to Register the agent vendor Coded by Raj Dec 31 2025 */
app.post(
  "/api/auth/agent/register-vendor",
  upload.any(),

    async (req, res, next) => {
    try {
      /** Generate footer data */
      await generateFooterData();
      next();
    } catch (err) {
      console.error("Footer data generation error:", err);
      next();
    }
  },

  (req, res, next) => {
    AuthController.agentRegisterVendor(req, res, next);
  }
);

/** API to get the total count of the available category items Coded by Raj March 13 2026 */
app.get(
    "/api/public/category-listing-count/:categoryId",
    // validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.getCatListCount(req, res, next); /** Calling the controller */
    }
);

/** API to get the total count of the available location items Coded by Raj March 13 2026 */
app.get(
    "/api/public/location-listing-count/:locationSlug",
    // validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.getLocationListCount(req, res, next); /** Calling the controller */
    }
);

/** API to get the total count of the available category and location items Coded by Raj March 13 2026 */
app.get(
    "/api/public/category-location-listing-count/:categoryId/:locationSlug",
    // validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.getCatLocationListCount(req, res, next); /** Calling the controller */
    }
);

/** API to get the total count of the available category and model items Coded by Raj March 13 2026 */
app.get(
    "/api/public/category-model-listing-count/:categoryId/:modelSlug",
    // validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.getCategoryModelListCount(req, res, next); /** Calling the controller */
    }
);

/** API to get the total count of the available category and model items Coded by Raj March 13 2026 */
app.get(
    "/api/public/category-model-location-listing-count/:categoryId/:modelSlug/:locationSlug",
    // validateAvailabilityCheck,
    (req, res, next) => {
        AuthController.getCategoryModelLocationListingCount(req, res, next); /** Calling the controller */
    }
);

/** Api to refresh admin token - sliding session */
app.post(
    "/api/auth/refresh-admin-token",
    (req, res, next) => {
        AuthController.refreshAdminToken(req, res, next);
    }
);
