const cron = require("node-cron");
const generateFooterData = require("./generateFooterData");

/** Run the initial data generation server start then run the cron job */
// generateFooterData();
/** Cron job to run every hour */
cron.schedule("0 * * * *", async () => {
  await generateFooterData();
});

