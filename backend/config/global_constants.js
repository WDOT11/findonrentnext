/** Create the global variables/constants here in this file */
require("dotenv").config();

ADMIN_NAME = "/api/adminrohpnl";

WEBSITE_ROOT_PATH = process.cwd() + "/";
WEBSITE_ADMIN_FULL_PATH = WEBSITE_ROOT_PATH + "backend/modules/admin-module/";
WEBSITE_PUBLIC_FULL_PATH = WEBSITE_ROOT_PATH + "backend/modules/public-module/";
WEBSITE_PUBLIC_USER_FULL_PATH = WEBSITE_ROOT_PATH + "backend/modules/user-module/";
WEBSITE_PUBLIC_USER_PATH = WEBSITE_ROOT_PATH + "backend/modules/user-module/";


STATUS_ERROR = false;
STATUS_SUCCESS = true;