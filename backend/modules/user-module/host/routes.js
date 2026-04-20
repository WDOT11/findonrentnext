const UserHostModuleController = require("./controller");
const StateController = require("../../admin-module/state/controller");
const generateFooterData = require("../../../utils/generateFooterData");
const {ValidategetUserActivecity, ValidategetUserActivecategory, ValidategetUserActivechildcategory, ValidategetUserActivechildcategorybrands, ValidategetUserActivechildcategorybrandsmodel, ValidateHostAddNewVehicle, ValidateLoginServiceProviderItems, ValidateLoginServiceProviderSingleItems, ValidateDeleteServiceProviderSingleItems, ValidategetUserBusinessData, ValidateBusinessCategories, ValidateCategortyBrands, ValidateBrandModels, ValidateAddVehicleItem, ValidatesubmitAllItems, ValidateUpdateVehicleItem, Validatedeleteitem} = require("./validation");

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

/** Api main for become a host - Coded by Vishnu August 22 2025 */
app.post(
  "/api/user/becomehost",
  upload.array('image_ids', 20),
  ValidateHostAddNewVehicle,
  (req, res, next) => UserHostModuleController.becomeAHost(req, res, next)
);

/** Api to get all active city - Coded by Vishnu Dec 15 2025 */
app.post(
    "/api/user/getallactivecity",
    ValidategetUserActivecity,
    (req, res, next) => {
      UserHostModuleController.getAllActiveCity(req, res, next);
    }
);

/** Api to get all active parent category - Coded by Vishnu August 19 2025 */
app.get(
    "/api/user/getallactivecategory",
    ValidategetUserActivecategory,
    (req, res, next) => {
      UserHostModuleController.getAllActiveCategory(req, res, next);
    }
);

/** Api to get all active parent and child categories at once */
app.get(
    "/api/user/getallcategorieswithchildren",
    (req, res, next) => {
      UserHostModuleController.getAllCategoriesWithChildren(req, res, next);
    }
);

/** Api to get all active child category - Coded by Vishnu August 20 2025 */
app.post(
    "/api/user/getallactivechildcategory",
    ValidategetUserActivechildcategory,
    (req, res, next) => {
      UserHostModuleController.getAllActiveChildCategory(req, res, next);
    }
);

/** Api to get all child category brands - Coded by Vishnu August 20 2025 */
app.post(
    "/api/user/getallchildcategorybrands",
    ValidategetUserActivechildcategorybrands,
    (req, res, next) => {
      UserHostModuleController.getAllChildCategoryBrands(req, res, next);
    }
);

/** Api to get all child category brands models - Coded by Vishnu August 21 2025 */
app.post(
    "/api/user/getallchildcategorybrandsmodel",
    ValidategetUserActivechildcategorybrandsmodel,
    (req, res, next) => {
      UserHostModuleController.getAllChildCategoryBrandsModel(req, res, next);
    }
);

/** Api to get all service providers listed items - Coded by Vishnu August 23 2025 */
app.post(
    "/api/user/getalllisteditems",
    ValidateLoginServiceProviderItems,
    (req, res, next) => {
      UserHostModuleController.getServiceProviderListedItems(req, res, next);
    }
);

/** API to view service provider single items - Coded by Vishnu August 25 2025 */
app.post(
    "/api/user/getallsinglelisteditems",
    ValidateLoginServiceProviderSingleItems,
    (req, res, next) => {
      UserHostModuleController.getServiceProviderSingleListedItems(req, res, next);
    }
);

/** API to update service provider single items - Coded by Vishnu Nov 26 2025 */
app.post(
  "/api/user/updatesinglelisteditems",
  upload.array("image_ids", 10),

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
    UserHostModuleController.updateServiceProviderSingleListedItems(req, res, next);
  }
);

/** API to delete service provider single items - Coded by Vishnu September 06 2025 */
app.post(
    "/api/user/deletesinglelisteditems",
    ValidateDeleteServiceProviderSingleItems,
    (req, res, next) => {
      UserHostModuleController.deleteServiceProviderSingleListedItems(req, res, next);
    }
);

/** API to get the user business data */
app.post(
  "/api/user/userbusinessdetails",
  ValidategetUserBusinessData,
  (req, res, next) => {
    UserHostModuleController.getUserBusinessDetails(req, res, next);
  }
);

/** API to add a new item to the vendor account */
app.post(
  "/api/user/addnewvehicle",
  upload.array('images', 10),
  ValidateHostAddNewVehicle,
  (req, res, next) => UserHostModuleController.addNewVehicle(req, res, next)
);

/** Getting vendor details */
app.get("/api/vendor/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, phone, slug, category_name FROM vendors WHERE slug = ?`, [slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Vendor not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** API to get the user business categories */
app.post(
  "/api/user/businessCategories",
  ValidateBusinessCategories,
  (req, res, next) => {
    UserHostModuleController.getBusinessCategories(req, res, next);
  }
);

/** API to get the brands for the add-item form */
app.post(
  "/api/user/brandsByCategory",
  ValidateCategortyBrands,
  (req, res, next) => {
    UserHostModuleController.getBrandByCategories(req, res, next);
  }
);

/** API to get the models for the add-item form */
app.post(
  "/api/user/modelsByBrand",
  ValidateBrandModels,
  (req, res, next) => {
    UserHostModuleController.getModelByBrands(req, res, next);
  }
);

/** API to save the item data */
app.post(
  "/api/user/addVehicleItem",
  upload.array('image', 10),
  ValidateAddVehicleItem,
  (req, res, next) => {
    UserHostModuleController.addVehicleItem(req, res, next);
  }
);

/** API to save the item data on final click */
app.post(
  "/api/user/submitAllItems",
  upload.array('image', 10),
  ValidatesubmitAllItems,
  (req, res, next) => {
    UserHostModuleController.submitAllItems(req, res, next);
  }
);

/** API to delete the item data on delete icon click */
app.post(
  "/api/user/singleItemDeleteOnBoarding",
  Validatedeleteitem,
  (req, res, next) => {
    UserHostModuleController.deleteSingleItem(req, res, next);
  }
);

/** Api to get all active child category - Coded by Vishnu August 20 2025 */
app.get(
  "/api/user/getallactivestates",
  (req, res, next) => {
    StateController.GetAllActiveState(req, res, next);
  }
);

app.get(
  "/api/user/getcitiesbystate/:id",
  (req, res, next) => {
    StateController.getCitiesByState(req, res, next);
  }
);
