// const trackAndBlockMiddleware = require("../middleware/trackAndBlockMiddleware");

module.exports = {
    configure: (router) => {
      app = router;

      /* To track the location and block the ip */
      // app.use(trackAndBlockMiddleware);

      /** Admin modules routes */
      require(WEBSITE_ADMIN_FULL_PATH + "category/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "tag/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "model/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "brand/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "state/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "city/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "roles/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "user/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "route/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "post/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "faq/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "roh-seo/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "roh-redirect/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "settings/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "product/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "contact-us/routes");
      require(WEBSITE_ADMIN_FULL_PATH + "dashboard/routes");

      /** Public module routes */
      require(WEBSITE_PUBLIC_FULL_PATH + "auth/routes");
      require(WEBSITE_PUBLIC_USER_FULL_PATH + "/routes");
      require(WEBSITE_PUBLIC_USER_PATH + "/host/routes");
      require(WEBSITE_PUBLIC_USER_PATH + "/public/routes");
    },
  };