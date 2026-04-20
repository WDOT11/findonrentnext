const authMiddleware = require('../../../middleware/authMiddleware');
const RouteController = require("./controller");
const {ValidateaddnewRoute, ValidateGetAllRoutes, ValidateEditRoute, ValidateDeleteRoute, ValidateViewRoute} = require("./validation");

/** Api for adding new route Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/route/create", 
    authMiddleware,
    ValidateaddnewRoute, /** Validation middleware */
    (req, res, next) => {
        RouteController.AddNewAdminRoute(req, res, next); /** Call the controller after validation */
    }
);

/** Get all route Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/route/get", 
    authMiddleware,
    ValidateGetAllRoutes, /** Validation middleware */
    (req, res, next) => {
        RouteController.GetAllRoutes(req, res, next);/** Call the controller after validation */
    }
);

/** Edit route Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/route/edit", 
    authMiddleware,
    ValidateEditRoute, /** Validation middleware */
    (req, res, next) => {
        RouteController.EditRoute(req, res, next);/** Call the controller after validation */
    }
);

/** Delete route Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/route/delete", 
    authMiddleware,
    ValidateDeleteRoute, /** Validation middleware */
    (req, res, next) => {
        RouteController.DeleteRoute(req, res, next);/** Call the controller after validation */
    }
);

/** View route details Coded by Vishnu July 07 2025 */
app.post(
    ADMIN_NAME + "/route/view", 
    authMiddleware,
    ValidateViewRoute, /** Validation middleware */
    (req, res, next) => {
        RouteController.ViewRoute(req, res, next);/** Call the controller after validation */
    }
);