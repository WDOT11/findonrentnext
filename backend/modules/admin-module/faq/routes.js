const authMiddleware = require('../../../middleware/authMiddleware');
const { ValidateaddnewFaqs, ValidateGetAllFaqs, ValidateViewSingleFaq, ValidateUpdateFaq } = require("./validation");
const FaqController = require("./controller");

/** API for adding new FAQ - Coded by Vishnu Oct 14, 2025 */
app.post(
  ADMIN_NAME + "/faq/create",
  authMiddleware,                 /** Authenticate admin */
  ValidateaddnewFaqs,             /** Validate fields */
  (req, res, next) => {
    FaqController.AddnewFaq(req, res, next);
  }
);

/** API for get all faqs - Coded by Vishnu Oct 14, 2025 */
app.get(
  ADMIN_NAME + "/faqs/list",
  authMiddleware,  
  ValidateGetAllFaqs,
  (req, res, next) => 
    FaqController.ListAllFaqs(req, res, next)
);


/** API for view single FAQ - Coded by Vishnu Oct 14, 2025 */
app.post(
  ADMIN_NAME + "/faq/view",
  authMiddleware,
  ValidateViewSingleFaq,
  (req, res, next) => 
    FaqController.ViewSingleFaq(req, res, next)
);


/** API for update single FAQ -Coded by Vishnu Oct 14, 2025 */
app.post(
  ADMIN_NAME + "/faq/edit",
  authMiddleware,
  ValidateUpdateFaq,
  (req, res, next) => {
    FaqController.UpdateSingleFaq(req, res, next);
  }
);