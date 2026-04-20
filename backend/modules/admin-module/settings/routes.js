const authMiddleware = require('../../../middleware/authMiddleware');
const { ValidateaddnewSettings, ValidateGetallSettings} = require("./validation");
const AdminSettingController = require("./controller");

/** API for adding new site setting - Coded by Vishnu Dec 23, 2025 */
app.post(
  ADMIN_NAME + "/add/site-setting",
  authMiddleware,                 /** Authenticate admin */
  ValidateaddnewSettings,             /** Validate fields */
  (req, res, next) => {
    AdminSettingController.AddnewSettings(req, res, next);
  }
);

/** API for get all site setting - Coded by Vishnu Jan 03, 2026 */
app.get(
  ADMIN_NAME + "/get/site-setting",
  authMiddleware,
  ValidateGetallSettings,  
  (req, res, next) => 
    AdminSettingController.GetallSettings(req, res, next)
);
 
/** API for sync site setting - Coded by Vishnu Jan 03, 2026 */
app.post(
  ADMIN_NAME + "/sync/site-setting",
  authMiddleware,
  (req, res, next) => 
    AdminSettingController.SyncSiteSettings(req, res, next)
);