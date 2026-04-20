const authMiddleware = require('../../../middleware/authMiddleware');
const {validateAddRedirect} = require("./validation");
const RedirectController = require("./controller");


/**Api for Add New Redirect Coded by Vishnu Feb 12 2026 */
app.post(
    ADMIN_NAME + "/redirect/add",
    //checkLoginAuth,
    authMiddleware,
    validateAddRedirect, /** Validation middleware */
    (req, res, next) => {
        RedirectController.addRedirect(req, res, next);  /** Call the controller */
    }
);

/** Api for get all Redirect Coded by Vishnu Feb 12 2026 */
app.post(
    ADMIN_NAME + "/redirect/list",
    //checkLoginAuth,
    authMiddleware,
    // validateGetRedirect, /** Validation middleware */
    (req, res, next) => {
        RedirectController.getAllRedirect(req, res, next); /** Call the controller */
    }
);

/** Api for edit Redirect Coded by Vishnu Feb 12 2026 */
app.post(
    ADMIN_NAME + "/redirect/update",
    //checkLoginAuth,
    authMiddleware,
    // validateUpdateRedirect, /** Validation middleware */
    (req, res, next) => {
        RedirectController.updateRedirect(req, res, next);/** Call the controller */
    }
);

/** Api for delete Redirect Coded by Vishnu Feb 12 2026 */
app.post(
    ADMIN_NAME + "/redirect/delete",
    //checkLoginAuth,
    authMiddleware,
    // validateDeleteRedirect, /** Validation middleware */
    (req, res, next) => {
        RedirectController.deleteRedirect(req, res, next);/** Call the controller */
    }
);


/** View redirect details Coded by Vishnu Feb 12 2026 */
app.post(
    ADMIN_NAME + "/redirect/view",
    //checkLoginAuth,
    // authMiddleware,
    // validateViewRedirect, /** Validation middleware */
    (req, res, next) => {
        RedirectController.viewRedirect(req, res, next);/** Call the controller */
    }
);