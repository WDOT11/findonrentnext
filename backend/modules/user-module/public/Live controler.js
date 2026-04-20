Live controler 
this.getTrendingCategoryLocation = async (req, res) => {
  try {

    const query = `
      SELECT
        cat.slug AS category_slug,
        cat.cat_singular_name AS category_name,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'location_slug', loc.slug,
            'location_name', loc.cat_singular_name
          )
        ) AS locations

      FROM roh_vehicle_attributes va

      INNER JOIN roh_vehicle_details vd
        ON vd.id = va.vehicle_id

      INNER JOIN roh_slugs loc
        ON loc.slug = va.city
        AND loc.type = 'location'
        AND loc.status = 'active'

      INNER JOIN roh_slugs cat
        ON cat.entity_id = vd.sub_cat_id
        AND cat.type = 'category'
        AND cat.status = 'active'

      GROUP BY cat.slug, cat.cat_singular_name
      ORDER BY LOWER(cat.cat_singular_name) ASC
      LIMIT 100
    `;

    const [rows] = await pool.query(query);

    const data = rows.map(row => ({
      category_slug: row.category_slug,
      category_name: row.category_name,
      locations: row.locations || []
    }));

    return res.status(200).json({
      success: true,
      message: "Category locations fetched successfully",
      data
    });

  } catch (error) {

    console.error("Error in getTrendingCategoryLocation:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};



this.getAllCategoryLocationFaq = async (req, res) => {

  let connection;

  try {

    connection = await pool.getConnection();

    /* ---------------- CATEGORY MAP ---------------- */

    const [categories] = await connection.query(`
      SELECT id, name
      FROM roh_categories
      WHERE active = 1
    `);

    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.id] = c.name;
    });

    /* ---------------- CITY MAP ---------------- */

    const [cities] = await connection.query(`
      SELECT city_id, city_slug, city_name
      FROM roh_cities
    `);

    const cityMap = {};
    cities.forEach(c => {
      cityMap[c.city_slug] = {
        city_name: c.city_name,
        loc_id: c.city_id
      };
    });

    /* ---------------- MAIN QUERY ---------------- */

    const [rows] = await connection.query(`
      SELECT 
        d.sub_cat_id,
        a.city,
        b.user_id,
        b.business_name,
        b.business_slug,
        GROUP_CONCAT(DISTINCT m.model_name) AS model_names,
        SUM(d.fleet_size) AS fleet_size
      FROM roh_vehicle_details d
      INNER JOIN roh_vehicle_attributes a 
        ON a.vehicle_id = d.id
      INNER JOIN roh_models m 
        ON m.id = d.model_id AND m.active = 1
      INNER JOIN roh_user_business b
        ON b.user_id = d.service_provider_id
      WHERE d.item_status = 1
      AND d.admin_item_status = 1
      GROUP BY 
        d.sub_cat_id,
        a.city,
        b.user_id,
        b.business_name,
        b.business_slug
    `);

    /* ---------------- GROUP DATA ---------------- */

    const map = {};

    rows.forEach(row => {

      const key = `${row.sub_cat_id}_${row.city}`;

      if (!map[key]) {

        map[key] = {
          cat_id: row.sub_cat_id,
          loc_id: cityMap[row.city]?.loc_id || null,
          category_slug: categoryMap[row.sub_cat_id]?.toLowerCase() || "",
          city_slug: row.city,
          category: categoryMap[row.sub_cat_id],
          city: cityMap[row.city]?.city_name || null,
          popular_models: new Set(),
          vendors: new Map()
        };

      }

      /* ---------- POPULAR MODELS ---------- */

      if (row.model_names) {

        row.model_names.split(",").forEach(model => {
          map[key].popular_models.add(model);
        });

      }

      /* ---------- VENDORS ---------- */

      const vendorKey = row.user_id;

      if (!map[key].vendors.has(vendorKey)) {

        map[key].vendors.set(vendorKey, {
          name: row.business_name,
          slug: row.business_slug,
          fleet: row.fleet_size || 0
        });

      } else {

        const existingVendor = map[key].vendors.get(vendorKey);
        existingVendor.fleet += row.fleet_size || 0;

      }

    });

    /* ---------------- FINAL FORMAT ---------------- */

    const result = Object.values(map).map(item => {

      const vendors = Array.from(item.vendors.values())
        .sort((a, b) => b.fleet - a.fleet)
        .slice(0, 5)
        .map(v => ({
          name: v.name,
          slug: v.slug
        }));

      return {
        cat_id: item.cat_id,
        loc_id: item.loc_id,
        category_slug: item.category_slug,
        city_slug: item.city_slug,
        category: item.category,
        city: item.city,
        popular_models: Array.from(item.popular_models).slice(0, 5),
        vendors
      };

    });

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("getAllCategoryLocationFaq error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  } finally {

    if (connection) connection.release();

  }

};