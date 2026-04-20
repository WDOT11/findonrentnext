const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_BASE_URL = process.env.NEXT_PUBLIC_BK_API_BASE_USER_URL || "http://localhost:3000/v1/api/user";
const API_BASE_PUBLIC_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL || "http://localhost:3000/v1/api/public";
const CITY_MASTER_API = `${API_BASE_PUBLIC_URL}/getCategoryModelLocationMaster`;

const DATA_DIR = path.join(__dirname, "../data"); // updated this

const DATA_FAQ_DIR = path.join(DATA_DIR, "faq");
const DATA_DIR_LOC = path.join(DATA_DIR, "location");

const FOOTER_DATA_PATH = path.join(DATA_DIR, "footer-data.json");
const CAT_LOC_DATA_PATH = path.join(DATA_FAQ_DIR, "catloc-data.json");
const CAT_MOD_LOC_DATA_PATH = path.join(DATA_FAQ_DIR, "catmodloc-data.json");

/* ===== ENSURE DIR ===== */
[DATA_DIR, DATA_FAQ_DIR, DATA_DIR_LOC].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function generateFooterData() {

  try {

    const [
      categoriesResp,
      trendingResp,
      categoryModelsResp,
      trendingCategoryLocationResp,
      getAllCategoryModelsLocationResp,
      catLocResp,
      catModLocResp,
      cityMasterResp
    ] = await Promise.all([
      axios.post(`${API_BASE_URL}/getallactivechildcategory`, { parent_category_id: 1 }),
      axios.get(`${API_BASE_PUBLIC_URL}/trendingsearches`),
      axios.get(`${API_BASE_PUBLIC_URL}/getCategoryModelsFooter`),
      axios.get(`${API_BASE_PUBLIC_URL}/trendingcategorylocation`),
      axios.get(`${API_BASE_PUBLIC_URL}/getAllCategoryModelsLocation`),
      axios.get(`${API_BASE_PUBLIC_URL}/catlocjson`),
      axios.get(`${API_BASE_PUBLIC_URL}/catmodlocjson`),
      axios.get(CITY_MASTER_API)
    ]);

    const categories = Array.isArray(categoriesResp.data) ? categoriesResp.data : (categoriesResp.data?.data || []);
    const trending = trendingResp.data?.data || [];
    const categoryModels = categoryModelsResp.data?.data || [];
    const categoryLocation = trendingCategoryLocationResp.data?.data || [];
    const getAllCategoryModelsLocation = getAllCategoryModelsLocationResp.data?.data || [];
    const catLocData = catLocResp.data?.data || [];
    const catModLocData = catModLocResp.data?.data || [];
    const masterData = cityMasterResp.data?.data || [];

    /* ================= BASE JSON ================= */

    fs.writeFileSync(path.join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2));
    fs.writeFileSync(path.join(DATA_DIR, "trending.json"), JSON.stringify(trending, null, 2));
    fs.writeFileSync(path.join(DATA_DIR, "category-models.json"), JSON.stringify(categoryModels, null, 2));
    fs.writeFileSync(path.join(DATA_DIR, "category-model-location.json"), JSON.stringify(getAllCategoryModelsLocation, null, 2));
    fs.writeFileSync(path.join(DATA_DIR, "category-location.json"), JSON.stringify(categoryLocation, null, 2));

    /* ================= CITY JSON ================= */

    const cityMap = {};

    masterData.forEach(category => {
      category.models.forEach(model => {
        model.locations.forEach(loc => {

          const city = loc.location_slug;

          if (!cityMap[city]) cityMap[city] = [];

          let categoryEntry = cityMap[city].find(c => c.category_id === category.category_id);

          if (!categoryEntry) {
            categoryEntry = {
              category_id: category.category_id,
              category_slug: category.category_slug,
              category_name: category.category_name,
              models: []
            };
            cityMap[city].push(categoryEntry);
          }

          let modelEntry = categoryEntry.models.find(m => m.model_id === model.model_id);

          if (!modelEntry) {
            modelEntry = {
              model_id: model.model_id,
              model_slug: model.model_slug,
              model_name: model.model_name,
              model_label: model.model_label,
              display_name: model.display_name,
              total_items: 0,
              locations: []
            };
            categoryEntry.models.push(modelEntry);
          }

          modelEntry.total_items += model.total_items;

          modelEntry.locations.push({
            location_slug: loc.location_slug,
            location_name: loc.location_name
          });

        });
      });
    });

    for (const city in cityMap) {

      const fileName = `data-roh-${city}.json`;
      const filePath = path.join(DATA_DIR_LOC, fileName);

      const finalData = {
        success: true,
        count: cityMap[city].length,
        data: cityMap[city]
      };

      fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));
      // console.log(`Saved city file: ${fileName}`);
    }

    /* ================= FAQ ================= */

    fs.writeFileSync(CAT_LOC_DATA_PATH, JSON.stringify(catLocData, null, 2));
    fs.writeFileSync(CAT_MOD_LOC_DATA_PATH, JSON.stringify(catModLocData, null, 2));

    /* ================= FOOTER ================= */

    const footerData = {
      categories,
      trending,
      categoryModels,
      updatedAt: new Date()
    };

    fs.writeFileSync(FOOTER_DATA_PATH, JSON.stringify(footerData, null, 2));

    console.log("\nFooter + City JSON Generated Successfully");

  } catch (error) {
    console.error("Error generating JSON:", error.message);
  }

}

module.exports = generateFooterData;