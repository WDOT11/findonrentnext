const PublicModuleController = require("./controller");
const {ValidateGetAllActivevehiclesCars, ValidateGetAllActivevehiclesCarsWithDrivers, ValidateGetAllActivevehiclesBikes, ValidateGetAllActivevehiclesScooters, ValidateGetAllActiveRecreationalVehicles, ValidateGetAllActiveLuxuryVehicles, ValidateGetAllActiveCommercialVehicles, ValidateViewSingleProduct, ValidateGetSingleCategoryRecentPosts, ValidateGetSingleCategoryRecentFaqs, ValidateCreateContactUsEntry, ValidateGetAllActiveBlogs, ValidateViewSingleBlog, ValidateGetSeoMetaData, ValidategetUserAvailableActivecity} = require("./validation");


/** Get all active vehicles cars vehicles--cars page - Coded by Vishnu Aug 29 2025 */
app.get(
    "/api/public/getallvehiclescars",
    ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getActivevehiclesCars(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles by category id - Coded by Raj Dec 15 2025 */
app.post(
    "/api/public/getallvehiclesbyCatId",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getActivevehiclesByCatId(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles by location slug - Coded by Raj Dec 16 2025 */
app.post(
    "/api/public/getallvehiclesByLocation",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getallvehiclesByLocSlug(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles by location and category - Coded by Raj Dec 16 2025 */
app.post(
    "/api/public/getallvehiclesByCategoryLocation",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getvehiclesByCategoryAndLocation(req, res, next); /** Calling the controller */
    }
);

/** Get all active model by location and category - Coded by Raj Jan 30 2025 */
app.post(
    "/api/public/getModelsByCategoryAndLocation",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getModelsByCategoryAndLocation(req, res, next); /** Calling the controller */
    }
);

/** Get all active model globally for sitemap API batching */
app.get(
    "/api/public/getAllModelsForSitemap",
    (req, res, next) => {
        PublicModuleController.getAllModelsForSitemap(req, res, next);
    }
);

/** Get all active category model slug for sitemap - Coded by Vishnu Feb 10 2026 */
app.get(
    "/api/public/getcatmodel-slug",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getcatmodelSlug(req, res, next); /** Calling the controller */
    }
);

/** Get all active model by location and category - Coded by Vishnu Feb 09 2026 */
app.get(
    "/api/public/getCategoryModelsFooter",
    (req, res, next) => {
        PublicModuleController.getCategoryModelsFooter(req, res, next); /** Calling the controller */
    }
);

/** Get all active category model location slug for Footer - Coded by Vishnu Feb 11 2026 */
app.get(
    "/api/public/getAllCategoryModelsLocationFooter",
    (req, res, next) => {
        PublicModuleController.getAllCategoryModelsLocationFooter(req, res, next); /** Calling the controller */
    }
);

/** Get all active category model location slug for Json - Coded by Vishnu March 07 2026 */
app.get(
    "/api/public/getAllCategoryModelsLocation",
    (req, res, next) => {
        PublicModuleController.getAllCategoryModelsLocation(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles by location and category - Coded by Raj Dec 16 2025 */
app.post(
    "/api/public/getallvehiclesByCategoryModelLocation",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getvehiclesByCategoryModelAndLocation(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles by category and model - Coded by Raj Feb 06 2025 */
app.post(
    "/api/public/getallvehiclesByCategoryModel",
    // ValidateGetAllActivevehiclesCars,
    (req, res, next) => {
        PublicModuleController.getvehiclesByCategoryAndModel(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles cars with drivers vehicles--cars page - Coded by Vishnu Dec 12 2025 */
app.get(
    "/api/public/getallvehiclescarswithdrivers",
    ValidateGetAllActivevehiclesCarsWithDrivers,
    (req, res, next) => {
        PublicModuleController.getActivevehiclesCarsWithDrivers(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles bikes vehicles--bikes page - Coded by Vishnu Oct 01 2025 */
app.get(
    "/api/public/getallvehiclesbikes",
    ValidateGetAllActivevehiclesBikes,
    (req, res, next) => {
        PublicModuleController.getActivevehiclesBikes(req, res, next); /** Calling the controller */
    }
);

/** Get all active vehicles scooters vehicles--scooters page - Coded by Vishnu Oct 16 2025 */
app.get(
    "/api/public/getallvehiclesscooters",
    ValidateGetAllActivevehiclesScooters,
    (req, res, next) => {
        PublicModuleController.getActivevehiclesScooters(req, res, next); /** Calling the controller */
    }
);

/** Get all active Recreational Vehicles page - Coded by Vishnu Oct 31 2025 */
app.get(
    "/api/public/getallrecreationalvehicles",
    ValidateGetAllActiveRecreationalVehicles,
    (req, res, next) => {
        PublicModuleController.getActiveRecreationalVehicles(req, res, next); /** Calling the controller */
    }
);

/** Get all active Luxury Vehicles page - Coded by Vishnu Oct 31 2025 */
app.get(
    "/api/public/getallluxuryvehicles",
    ValidateGetAllActiveLuxuryVehicles,
    (req, res, next) => {
        PublicModuleController.getActiveLuxuryVehicles(req, res, next); /** Calling the controller */
    }
);

/** Get all active Commercial Vehicles page - Coded by Vishnu Oct 31 2025 */
app.get(
    "/api/public/getallcommercialvehicles",
    ValidateGetAllActiveCommercialVehicles,
    (req, res, next) => {
        PublicModuleController.getActiveCommercialVehicles(req, res, next); /** Calling the controller */
    }
);

/** View single item Coded by Vishnu Aug 30 2025 */
app.get(
  "/api/public/viewsingleitem/:id",
  ValidateViewSingleProduct,
  (req, res, next) => {
    PublicModuleController.getsingleListedItemsVie(req, res, next);
  }
);

/** API to get single catregory recent 4 posts/blos - Coded by Vishnu Oct 13 2025 */
app.post(
    "/api/public/getsinglecategoryrecentposts",
    // ValidateGetSingleCategoryRecentPosts,
    (req, res, next) => {
        PublicModuleController.getSingleCategoryRecentPosts(req, res, next); /** Calling the controller */
    }
);

/** API to get singe catregory recent 3 FAQs - Coded by Vishnu Oct 14 2025 */
app.post(
    "/api/public/getsinglecategoryrecentfaqs",
    // ValidateGetSingleCategoryRecentFaqs,
    (req, res, next) => {
        PublicModuleController.getSingleCategoryRecentFaqs(req, res, next); /** Calling the controller */
    }
);

/** API to create a new contact us entry - Coded by Vishnu Oct 14 2025 */
app.post(
    "/api/public/contactinquirie",
    ValidateCreateContactUsEntry,
    (req, res, next) => {
        PublicModuleController.createContactUsEntry(req, res, next); /** Calling the controller */
    }
);

/** Api to get all active blogs - Coded by Vishnu Oct 17 2025 */
app.get(
    "/api/public/getallactiveblogs",
    ValidateGetAllActiveBlogs,
    (req, res, next) => {
        PublicModuleController.getAllActiveBlogs(req, res, next); /** Calling the controller */
    }
);

/** Api to get single blog - Coded by Vishnu Oct 18 2025 */
app.post(
    "/api/public/viewsingleblog",
    ValidateViewSingleBlog,
    (req, res, next) => {
    PublicModuleController.getSingleBlog(req, res, next);
});

/** Api to get SEO Meta by Page Slug (Public API) - Coded by Vishnu Oct 21 2025 */
app.post(
  "/api/public/getseometa",
  ValidateGetSeoMetaData,
  (req, res, next) => {
    PublicModuleController.GetPageMetaBySlug(req, res, next);
  }
);

/** Api to get vehicles brands by category id - Coded by Vishnu Oct 31 2025 */
app.post(
    "/api/public/getvehiclesbrands",
    // ValidateGetVehiclesBrands,
    (req, res, next) => {
        PublicModuleController.getVehiclesBrands(req, res, next); /** Calling the controller */
    }
);

/** Api to get vehicles brands by category id - Coded by Vishnu Feb 02 2026 */
app.post(
    "/api/public/getvehiclesbrandscatpg",
    (req, res, next) => {
        PublicModuleController.getVehiclesBrandsCatPg(req, res, next); /** Calling the controller */
    }
);

/** Api to get vehicles models by category id - Coded by Vishnu Nov 01 2025 */
app.post(
    "/api/public/getvehiclestags",
    // ValidateGetVehiclesTags,
    (req, res, next) => {
        PublicModuleController.getVehiclesTags(req, res, next); /** Calling the controller */
    }
);

/** Api to get vehicles models by category id - Coded by Vishnu Nov 01 2025 */
app.post(
    "/api/public/getvehiclesmodels",
    // ValidateGetVehiclesModels,
    (req, res, next) => {
        PublicModuleController.getVehiclesModels(req, res, next); /** Calling the controller */
    }
);

/** Api to track item views - Coded by Vishnu (Nov 09, 2025) */
app.post(
    "/api/public/trackitemviews",
    // ValidateTrackItemViews,
    (req, res, next) => {
        PublicModuleController.trackItemView(req, res, next); /** Calling the controller */
    }
);

/** Api to get business details - Coded by Raj Nov 10, 2025 */
app.get(
    "/api/public/vendor/:slug",
    (req, res, next) => {
        PublicModuleController.getVendorDetails(req, res, next);
    }
);

/** Api to get items list on vendor single page - Coded by Raj Nov 11, 2025 */
app.post(
    "/api/public/vendor/items",
    (req, res, next) => {
        PublicModuleController.getVendorItemsByCategory(req, res, next);
    }
);

/** Api to get items list on vendor single page - Coded by Raj Jan 16, 2025 */
app.get(
    "/api/public/rental-service-provider/items/:slug",
    (req, res, next) => {
        PublicModuleController.getVendorItems(req, res, next);
    }
);

/** Api to get all active blogs slugs - Coded by Vishnu Nov 25 2025 */
app.get(
    "/api/public/getallactiveblogslugs",
    (req, res, next) => {
        PublicModuleController.getAllBlogSlugsOnly(req, res, next);
    }
);

/** API to get the all active cities */
// app.get(
//     "/api/public/getallactiveblogslugs",
//     (req, res, next) => {
//         PublicModuleController.getAllBlogSlugsOnly(req, res, next);
//     }
// );

/** API to get the all active states */
// app.get(
//     "/api/public/getallactiveblogslugs",
//     (req, res, next) => {
//         PublicModuleController.getAllBlogSlugsOnly(req, res, next);
//     }
// );

/** Api to get the slugs for the pages(location, categories, and other) - Coded by Raj Dec 15, 2025 */
app.get(
    "/api/public/getslugs/:slug",
    (req, res, next) => {
        PublicModuleController.getSlugs(req, res, next);
    }
);

/** Api to get the slugs for the category-location page - Coded by Raj Dec 16, 2025 */
app.get(
    "/api/public/resolve-category-location",
    (req, res, next) => {
        PublicModuleController.getCategoryLocationSlugs(req, res, next);
    }
);

/** Api to get the slugs for the category-model-location page - Coded by Raj Jan 28, 2026 */
app.get(
    "/api/public/resolve-category-model-location",
    (req, res, next) => {
        PublicModuleController.resolveCategoryModelLocation(req, res, next);
    }
);

/** Api to get the slugs for the category-model page - Coded by Raj Feb 06, 2026 */
app.get(
    "/api/public/resolve-category-model",
    (req, res, next) => {
        PublicModuleController.resolveCategoryModel(req, res, next);
    }
);

/** Api to record the view click logs on click of view contact details in vendor, category, location and category-lcoation pages - Coded by Raj Dec 17, 2025 */
app.post(
    "/api/public/view-contact",
    (req, res, next) => {
        PublicModuleController.addViewContact(req, res, next);
    }
);

/** Api to get all active vendors - Coded by Vishnu Dec 17, 2025 */
app.post(
    "/api/public/getallactivevendors",
    (req, res, next) => {
        PublicModuleController.getAllActiveVendors(req, res, next);
    }
);

/** API to get all dyamic slug - Coded by Vishnu Dec 22 2025 (Updated 18-01-2026, Raj) */
/** The slugs that have items in the database are getting here, used in the sitemap api yet */
app.get(
  "/api/public/get-all-slugs",
  (req, res, next) => {
    PublicModuleController.getAllSlug(req, res, next);
  }
);

/** API to get all vendor dynamic slug - Coded by Vishnu Dec 30 2025 */
app.get(
  "/api/public/get-all-vendor-slugs",
  (req, res, next) => {
    PublicModuleController.getAllVendorSlug(req, res, next);
  }
);

/** API to get category-model-location dynamic slug - Coded by Vishnu Feb 05 2025 */
app.get(
  "/api/public/get-all-category-model-location-slugs",
  (req, res, next) => {
    PublicModuleController.getAllCategoryModelLocationSlug(req, res, next);
  }
);

/** Api to get all active available city - Coded by Vishnu Jan 02 2026 */
app.post(
    "/api/public/getallavailablecity",
    // ValidategetUserAvailableActivecity,
    (req, res, next) => {
        PublicModuleController.getAllActiveAvailableCity(req, res, next);
    }
);

/** API to get the single city by id */
app.post(
    "/api/public/getcity",
    (req, res, next) => {
        PublicModuleController.GetSingleCityById(req, res, next);
    }
);

/** Api to get the vendors by city Id(Used in the single post) - Coded by Raj Jan 15, 2026 */
app.get(
    "/api/public/getVendorsByCity/:location_id",
    (req, res, next) => {
        PublicModuleController.getVendorsByLocationId(req, res, next);
    }
);

/** Api to get the vendors by city Id(Used in category, location, and category-location page) - Coded by Raj Jan 19, 2026 */
app.get(
    "/api/public/getVendorsByLocOrCat",
    (req, res, next) => {
        PublicModuleController.getVendorsByLocationOrCategory(req, res, next);
    }
);

/** Api to get the vendors by business ids(used in the cat-model-loc page) - Coded by Raj Jan 30, 2026 */
app.post(
    "/api/public/getVendorsByBusinessIds",
    (req, res, next) => {
        PublicModuleController.getVendorsByBusinessIds(req, res, next);
    }
);

/** API to get Trending Searches Footer location category listing - Coded by Vishnu Jan 16 2026 */
app.get(
    "/api/public/trendingsearches",
    (req, res, next) => {
        PublicModuleController.getTrendingSearches(req, res, next);
    }
);

/** API to get Trending Searches Footer category location listing - Coded by Vishnu March 07 2026 */
app.get(
    "/api/public/trendingcategorylocation",
    (req, res, next) => {
        PublicModuleController.getTrendingCategoryLocation(req, res, next);
    }
);

/** API to Page redirect - Coded by Vishnu Feb 12 2026 */
app.post(
    "/api/public/pageredirect",
    (req, res, next) => {
        PublicModuleController.PageRedirectService(req, res, next);
    }
);

/** API to Create Category Location page json - Coded by Vishnu March 08 2026 */
app.get(
  "/api/public/catlocjson",
  (req, res, next) => {
    PublicModuleController.getAllCategoryLocationFaq(req, res, next);
  }
);

/** API to Create Category Model Location page json - Coded by Vishnu March 17 2026 */
app.get(
  "/api/public/catmodlocjson",
  (req, res, next) => {
    PublicModuleController.getAllCategoryModelLocationFaq(req, res, next);
  }
);

/** Api to get all active city - Coded by Vishnu March 20 2026 */
app.get(
    "/api/public/getallactivecity",
    (req, res, next) => {
      PublicModuleController.getAllPublicActiveCity(req, res, next);
    }
);

/** Api to dynamic pages json data - Coded by Vishnu March 21 2026 */
app.get(
    "/api/public/getCategoryModelLocationMaster",
    (req, res, next) => {
      PublicModuleController.getCategoryModelLocationMaster(req, res, next);
    }
);

/** Api to home page json data - Coded by Vishnu March 21 2026 */
app.get(
    "/api/public/getHomeFaqMaster",
    (req, res, next) => {
      PublicModuleController.getHomePageFaqKeys(req, res, next);
    }
);