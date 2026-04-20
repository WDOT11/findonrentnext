const authMiddleware = require('../../../middleware/authMiddleware');
const { ValidateGetAllContactUsEntries, ValidateViewSingleContactUsEntry, ValidateDeleteContactUsEntry } = require("./validation");
const ContactController = require("./controller");

/** API for adding new FAQ - Coded by Vishnu Oct 14, 2025 */
app.get(
  ADMIN_NAME + "/contact-us/getallcontactusentries",
  authMiddleware,                 /** Authenticate admin */
  ValidateGetAllContactUsEntries,             /** Validate fields */
  (req, res, next) => {
    ContactController.getContactUsAllEntry(req, res, next);
  }
);

/** API to view single contact us entry - Coded by Vishnu Oct 14 2025 */
app.post(
  ADMIN_NAME + "/contact-us/viewsinglecontactusentry",
  authMiddleware,                 /** Authenticate admin */
  ValidateViewSingleContactUsEntry,             /** Validate fields */
  (req, res, next) => {
    ContactController.getSingleContactUsEntry(req, res, next);
  }
);

/** API to reply single contact us entry - Coded by Vishnu Feb 20 2026 */
app.post(
  ADMIN_NAME + "/contact-us/reply",
  authMiddleware,                 /** Authenticate admin */
  // ValidateViewSingleContactUsreply,             /** Validate fields */
  (req, res, next) => {
    ContactController.replyToContactUs(req, res, next);
  }
);

/** API to delete single contact us entry - Coded by Vishnu April 18 2026 */
app.post(
  ADMIN_NAME + "/contact-us/delete",
  authMiddleware,                 /** Authenticate admin */
  ValidateDeleteContactUsEntry,             /** Validate fields */
  (req, res, next) => {
    ContactController.deleteContactUsEntry(req, res, next);
  }
);
