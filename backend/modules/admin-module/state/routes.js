const authMiddleware = require('../../../middleware/authMiddleware');
const {ValidateaddnewState, ValidategetallState, ValidateeditState, ValidateDeleteState, ValidateSingleState, ValidateAllActiveState} = require("./validation");
const StateController = require("./controller");

/** Api for adding new states Coded by Vishnu July 03 2025 */
app.post(
    ADMIN_NAME + "/state/add", 
    authMiddleware,
    ValidateaddnewState, /** Validation middleware */
    (req, res, next) => {
        StateController.AddnewState(req, res, next); /** Call the controller after validation */
    }
);

/** Api for get all states Coded by Vishnu July 04 2025 */
app.post(
    ADMIN_NAME + "/state/get", 
    authMiddleware,
    ValidategetallState, /** Validation middleware */
    (req, res, next) => {
        StateController.GetallState(req, res, next);/** Call the controller after validation */
    }
);

/** Api for edit states Coded by Vishnu July 04 2025 */
app.post(
    ADMIN_NAME + "/state/edit", 
    authMiddleware,
    ValidateeditState, /** Validation middleware */
    (req, res, next) => {
        StateController.EditState(req, res, next);/** Call the controller after validation */
    }
);


/** Api for delete states Coded by Vishnu July 04 2025 */
app.post(
    ADMIN_NAME + "/state/delete", 
    authMiddleware,
    ValidateDeleteState, /** Validation middleware */
    (req, res, next) => {
        StateController.DeleteState(req, res, next);/** Call the controller after validation */
    }
);

/** Get single state Coded by Vishnu July 22 2025 */
app.post(
    ADMIN_NAME + "/state/getsingle", 
    authMiddleware,
    ValidateSingleState, /** Validation middleware */
    (req, res, next) => {
        StateController.GetSingleState(req, res, next);/** Call the controller after validation */
    }
);

/** Get all state id and name Coded by Vishnu July 24 2025 */
app.get(
    ADMIN_NAME + "/state/getall", 
    authMiddleware,
    ValidateAllActiveState, /** Validation middleware */
    (req, res, next) => {
        StateController.GetAllActiveState(req, res, next);/** Call the controller after validation */
    }
);