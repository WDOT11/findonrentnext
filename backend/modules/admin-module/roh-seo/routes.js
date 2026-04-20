const authMiddleware = require('../../../middleware/authMiddleware');
const { ValidateaddnewSEO, ValidateGetAllSeoMeta, ValidateViewSingleSeoMeta, ValidateUpdateSeoMeta} = require("./validation");
const SEOController = require("./controller");

/** API for adding new page meta - Coded by Vishnu Oct 21, 2025 */
app.post(
  ADMIN_NAME + "/seometa/create",
  authMiddleware,                 /** Authenticate admin */
  ValidateaddnewSEO,             /** Validate fields */
  (req, res, next) => {
    SEOController.AddnewPageMeta(req, res, next);
  }
);

/** Api to get all page meta - Coded by Vishnu Oct 21, 2025 */
app.get(
  ADMIN_NAME + "/seometa/list",
  authMiddleware,  
  ValidateGetAllSeoMeta,
  (req, res, next) => 
    SEOController.ListAllPageMeta(req, res, next)
);

/** Api to view single page meta - Coded by Vishnu Oct 21, 2025 */
app.post(
  ADMIN_NAME + "/seometa/view",
  authMiddleware,
  ValidateViewSingleSeoMeta,
  (req, res, next) => 
    SEOController.ViewSinglePageMeta(req, res, next)
);

/** Api to update page meta - Coded by Vishnu Oct 21, 2025 */
app.post(
  ADMIN_NAME + "/seometa/update",
  authMiddleware,
  ValidateUpdateSeoMeta,
  (req, res, next) => 
    SEOController.UpdatePageMeta(req, res, next)
);