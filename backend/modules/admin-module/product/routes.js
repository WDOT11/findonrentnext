const authMiddleware = require('../../../middleware/authMiddleware');
const { ValidateaddnewPost } = require("./validation");
const ProductsController = require("./controller");


/** API for get all vehicles - Coded by Vishnu Nov 20, 2025 */
app.post(
  ADMIN_NAME + "/product/vehiclesadlist",
  authMiddleware,
  (req, res, next) => ProductsController.ListAllVehiclesListadmin(req, res, next)
);

/** API for admin single vehicle view - Coded by Vishnu Nov 20, 2025 */
app.post(
  ADMIN_NAME + "/product/adminvehicleview",
  authMiddleware,
  (req, res, next) => ProductsController.AdminVehicleView(req, res, next)
);

/** API for admin edit/update vehicle - Coded by Vishnu Nov 21, 2025 */
app.post(
  ADMIN_NAME + "/product/adminvehicleupdate",
  authMiddleware,
  (req, res, next) => ProductsController.AdminVehicleEdit(req, res, next)
);

/** API for admin approve/unapprove vehicle - Coded by Vishnu Nov 21, 2025 */
app.post(
  ADMIN_NAME + "/product/adminvehiclestatusupdate",
  authMiddleware,
  (req, res) => ProductsController.AdminVehicleStatusUpdate(req, res)
);
