const pool = require('../../../config/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const toNumberOrNull = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const toIntOrNull = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
};


function hostModuleApi() {


  /** get all active city Coded by Vishnu August 19 2025 */
  this.getAllActiveCity = async (req, res) => {
    try {
      const keyword = req.body.keyword || "";

      const [rows] = await pool.query(
        `SELECT city_name, city_slug
        FROM roh_cities
        WHERE active = 1
        AND city_name LIKE ?
        ORDER BY city_name ASC
        LIMIT 10`,
        [`%${keyword}%`]
      );

      res.status(200).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.error("getAllActiveCity error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  /** get all active parent category Coded by Vishnu August 19 2025 */
  this.getAllActiveCategory = async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, slug, parent_category_id FROM `roh_categories` WHERE `active` = 1 AND `parent_category_id` IS NULL'
      );
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /** get all active child category Coded by Vishnu August 20 2025 */
  this.getAllActiveChildCategory = async (req, res) => {
    try {
      const { parent_category_id } = req.body;

      if (!parent_category_id) {
        return res.status(400).json({ message: "parent_category_id is required" });
      }

      const [rows] = await pool.query(
        `
        SELECT
          c.id,
          c.name,
          c.slug,
          SUBSTRING_INDEX(c.description, ' ', 30) AS description,
          c.parent_category_id,
          c.cat_img_id,
          CONCAT(m.file_path, m.file_name) AS full_image_url
        FROM roh_categories AS c
        LEFT JOIN roh_media_gallery AS m
          ON c.cat_img_id = m.id
        WHERE
          c.active = 1
          AND c.cate_available = 1
          AND c.parent_category_id = ?
        `,
        [parent_category_id]
      );

      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /** get all active categories grouped with their children Coded by Backend */
  this.getAllCategoriesWithChildren = async (req, res) => {
    try {
      const [parentRows] = await pool.query(
        'SELECT id, name, slug, parent_category_id FROM `roh_categories` WHERE `active` = 1 AND `parent_category_id` IS NULL'
      );

      if (parentRows.length === 0) {
        return res.status(200).json([]);
      }

      const parentIds = parentRows.map(p => p.id);
      
      const [childRows] = await pool.query(
        `
        SELECT
          c.id,
          c.name,
          c.slug,
          SUBSTRING_INDEX(c.description, ' ', 30) AS description,
          c.parent_category_id,
          c.cat_img_id,
          CONCAT(m.file_path, m.file_name) AS full_image_url
        FROM roh_categories AS c
        LEFT JOIN roh_media_gallery AS m
          ON c.cat_img_id = m.id
        WHERE
          c.active = 1
          AND c.cate_available = 1
          AND c.parent_category_id IN (?)
        `,
        [parentIds]
      );

      const result = parentRows.map(parent => {
        return {
          ...parent,
          children: childRows.filter(child => child.parent_category_id === parent.id)
        };
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllCategoriesWithChildren:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /** get all active child category active brands Coded by Vishnu August 20 2025 */
  this.getAllChildCategoryBrands = async (req, res) => {
      try {
          const { child_category_id } = req.body;

          if (!child_category_id || isNaN(child_category_id)) {
              return res.status(400).json({ message: 'Valid Category id is required' });
          }

          const [rows] = await pool.query(
              'SELECT id, brand_name, cat_id FROM roh_brands WHERE active = 1 AND cat_id = ?',
              [child_category_id]
          );

          if (rows.length === 0) {
              return res.status(404).json({ message: 'No brands found for given category' });
          }

          res.status(200).json(rows);
      } catch (error) {
          res.status(500).json({ message: 'Internal server error' });
      }
  };

  /** get all active child category active brands model Coded by Vishnu August 21 2025 */
  this.getAllChildCategoryBrandsModel = async (req, res) => {
      try {
          const { brand_id } = req.body;

          if (!brand_id || isNaN(brand_id)) {
              return res.status(400).json({ message: 'Valid Brand id is required' });
          }

          const [rows] = await pool.query(
              'SELECT id, model_name, brand_id, tag_id FROM roh_models WHERE active = 1 AND brand_id = ?',
              [brand_id]
          );

          if (rows.length === 0) {
              return res.status(404).json({ message: 'No models found for given brand' });
          }

          res.status(200).json(rows);
      } catch (error) {
          res.status(500).json({ message: 'Internal server error' });
      }
  };

  /** Main Api for Become a host Add new vehicle Coded by Raj Oct 25 2025 */
  this.becomeAHost = async (req, res) => {
    const connection = await pool.getConnection();

    // --- helpers ---
    const slugify = (str) =>
      String(str || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "");

    const generateUniqueKey = () => {
      const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      return `BUSN_${ymd}_${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;
    };

    try {
      const {
        service_provider_id,
        businessName,
        contactPerson,
        PhoneNumber,
        gstNumber,
        address,
        category_mapping,
        fleet_mapping,
      } = req.body;

      /** Basic validation */
      if (!service_provider_id)
        return res
          .status(400)
          .json({ message: "service_provider_id is required" });
      if (!businessName)
        return res.status(400).json({ message: "businessName is required" });
      if (
        !address?.streetAddress ||
        !address?.city_slug ||
        !address?.state_slug ||
        !address?.pinCode
      )
        return res
          .status(400)
          .json({ message: "Complete address is required" });

      /** Start transaction */
      await connection.beginTransaction();

      /** Ensure user exists & mark as service provider if needed */
      const [userRows] = await connection.query(
        `SELECT user_id, is_service_provider, alt_phone_number FROM roh_users WHERE user_id = ?`,
        [service_provider_id]
      );
      if (userRows.length === 0) {
        throw new Error(`User with ID ${service_provider_id} not found.`);
      }
      if (Number(userRows[0].is_service_provider) === 0) {
        await connection.query(
          `UPDATE roh_users SET is_service_provider = 1 WHERE user_id = ?`,
          [service_provider_id]
        );
      }

      /** Create business slug */
      const baseSlug = slugify(`${businessName} ${address.city}`);
      let businessSlug = baseSlug || slugify(businessName);
      let suffix = 1;
      for (let tries = 0; tries < 50; tries++) {
        const [slugRows] = await connection.query(
          `SELECT id FROM roh_user_business WHERE business_slug = ?`,
          [businessSlug]
        );
        if (slugRows.length === 0) break;
        suffix += 1;
        businessSlug = `${baseSlug}-${suffix}`;
      }

      /** Generate feedback_unique_key */
      const feedbackKey = generateUniqueKey();

      /** Insert business main info */
      const [insBiz] = await connection.query(
        `INSERT INTO roh_user_business
            (user_id, business_name, business_slug, feedback_unique_key, gst_number, phone_number, alt_phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          service_provider_id,
          businessName,
          businessSlug,
          feedbackKey,
          gstNumber || null,
          PhoneNumber || null,
          userRows[0].alt_phone_number ||null
        ]
      );

      const businessId = insBiz.insertId;

      /** Insert business address */
      await connection.query(
        `INSERT INTO roh_user_business_address
            (user_id, street_address, landmark, city, state, pincode)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [
          service_provider_id,
          address.streetAddress || "",
          address.landmark || null,
          address.city_slug || "",
          address.state_slug || "",
          address.pinCode || "",
        ]
      );

      const fleetMap = {};
      if (Array.isArray(fleet_mapping)) {
        fleet_mapping.forEach((f) => {
          fleetMap[f.sub_category_id] = f.fleet_size;
        });
      }

      /** Insert category relationships WITH fleet size */
      if (Array.isArray(category_mapping) && category_mapping.length > 0) {
        const now = new Date();
        const insertRows = [];

        category_mapping.forEach((cat) => {
          const { category_id, sub_categories } = cat;

          if (Array.isArray(sub_categories) && sub_categories.length > 0) {
            sub_categories.forEach((subId) => {
              const fleetSize = fleetMap[subId] || 0;

              insertRows.push([
                service_provider_id,
                businessId,
                category_id,
                subId,
                fleetSize,
                1,
                service_provider_id,
                service_provider_id,
                now,
                now,
              ]);
            });
          } else {
            insertRows.push([
              service_provider_id,
              businessId,
              category_id,
              null,
              0,
              1,
              service_provider_id,
              service_provider_id,
              now,
              now,
            ]);
          }
        });

        if (insertRows.length > 0) {
          await connection.query(
            `INSERT INTO roh_business_cate_relat
              (user_id, business_id, category_id, sub_category_id, fleet_size, active, add_id, edit_id, created_at, updated_at)
            VALUES ?`,
            [insertRows]
          );
        }
      }

      /** Commit transaction */
      await connection.commit();
      connection.release();

      return res.status(200).json({
        success: true,
        message: "Business created successfully with category & fleet mapping",
        data: {
          business_id: businessId,
          business_slug: businessSlug,
          feedback_unique_key: feedbackKey,
        },
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch (e) {}
      try {
        connection.release();
      } catch (e) {}
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /** Api to get all login service providers listed items - Coded by Vishnu August 23 2025 */
  this.getServiceProviderListedItems = async (req, res) => {
      try {
        const { service_provider_id } = req.body;

        // Step 1: Fetch vehicle list with category name
        const [vehicles] = await pool.query(
          `SELECT
              d.id,
              d.service_provider_id,
              d.item_name,
              d.sub_cat_id,
              c.name,
              d.image_ids,
              d.item_status,
              d.admin_item_status,
              a.registration_number
          FROM roh_vehicle_details d
          LEFT JOIN roh_vehicle_attributes a
              ON d.id = a.vehicle_id
          LEFT JOIN roh_categories c
              ON d.sub_cat_id = c.id
          WHERE d.service_provider_id = ?
          ORDER BY d.add_date DESC`,
          [service_provider_id]
        );

        if (vehicles.length === 0) {
          return res.status(200).json([]);
        }

        // Step 2: For each vehicle, parse image_ids and fetch media data
        const enhancedVehicles = await Promise.all(
          vehicles.map(async (vehicle) => {
            let imageIds = [];

            try {
              imageIds = JSON.parse(vehicle.image_ids);
            } catch (e) {
              console.warn('Invalid JSON in image_ids for vehicle id:', vehicle.id);
            }

            let mediaGallery = [];
            if (imageIds.length > 0) {
              const placeholders = imageIds.map(() => '?').join(',');
              const [mediaResult] = await pool.query(
                `SELECT id, file_name, file_path
                FROM roh_media_gallery
                WHERE id IN (${placeholders})`,
                imageIds
              );
              mediaGallery = mediaResult;
            }

            return {
              ...vehicle,
              media_gallery: mediaGallery
            };
          })
        );

        // Step 3: Return final result with category_name
        return res.status(200).json(enhancedVehicles);

      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
  };

  /** Api to view login service providers single items - Coded by Vishnu August 25 2025 */
  this.getServiceProviderSingleListedItems = async (req, res) => {
    try {
      const { id } = req.body;

      // Step 1: Fetch all details with proper aliases
      const [result] = await pool.query(
        `SELECT
            d.id,
            d.service_provider_id,
            d.business_id,
            d.item_name,
            d.vehicle_description,

            c.name AS category_name,
            sc.name AS sub_category_name,
            t.tag_name,
            b.brand_name,
            m.model_name,

            d.image_ids,
            d.price_per_day,
            d.price_per_week,
            d.price_per_month,
            d.price_custom_day,
            d.security_deposit,
            d.booking_terms,
            d.availability_status,
            d.fleet_size,
            d.item_status,
            d.admin_item_status,

            a.engine_type,
            a.transmission_type,
            a.fuel_consumption,
            a.seating_capacity,
            a.color,
            a.vehicle_age,
            a.mileage,
            a.registration_number,
            a.insurance_validity,
            a.vehicle_type,
            a.rental_period,
            a.vehicle_condition,
            a.accessories,
            a.address_1,
            a.landmark,
            a.item_state,
            a.city,
            a.pincode,
            a.booking_instructions

        FROM roh_vehicle_details d
        LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
        LEFT JOIN roh_categories c ON d.category_id = c.id
        LEFT JOIN roh_categories sc ON d.sub_cat_id = sc.id
        LEFT JOIN roh_tags t ON d.tag_id = t.id
        LEFT JOIN roh_brands b ON d.brand_id = b.id
        LEFT JOIN roh_models m ON d.model_id = m.id
        WHERE d.id = ?`,
        [id]
      );

      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      const vehicle = result[0];

      // Step 2: Parse image_ids safely
      let imageIds = [];
      try {
        imageIds = JSON.parse(vehicle.image_ids || "[]");
        if (!Array.isArray(imageIds)) imageIds = [];
      } catch (e) {
        console.warn("Invalid JSON in image_ids for vehicle id:", vehicle.id);
      }

      // Step 3: Fetch image details
      let mediaGallery = [];
      if (imageIds.length > 0) {
        const placeholders = imageIds.map(() => "?").join(",");
        const [mediaResult] = await pool.query(
          `SELECT id, file_name, file_path
          FROM roh_media_gallery
          WHERE id IN (${placeholders})`,
          imageIds
        );
        mediaGallery = mediaResult;
      }

      // Step 4: Prepare final clean response (no *_id fields)
      const response = {
        id: vehicle.id,
        service_provider_id: vehicle.service_provider_id,
        business_id: vehicle.business_id,
        item_name: vehicle.item_name,
        vehicle_description: vehicle.vehicle_description,
        category_name: vehicle.category_name || null,
        sub_category_name: vehicle.sub_category_name || null,
        tag_name: vehicle.tag_name || null,
        brand_name: vehicle.brand_name || null,
        model_name: vehicle.model_name || null,
        price_per_day: vehicle.price_per_day,
        price_per_week: vehicle.price_per_week,
        price_per_month: vehicle.price_per_month,
        price_custom_day: vehicle.price_custom_day,
        security_deposit: vehicle.security_deposit,
        booking_terms: vehicle.booking_terms,
        availability_status: vehicle.availability_status,
        fleet_size: vehicle.fleet_size,
        item_status: vehicle.item_status,
        admin_item_status: vehicle.admin_item_status,
        engine_type: vehicle.engine_type,
        transmission_type: vehicle.transmission_type,
        fuel_consumption: vehicle.fuel_consumption,
        seating_capacity: vehicle.seating_capacity,
        color: vehicle.color,
        vehicle_age: vehicle.vehicle_age,
        mileage: vehicle.mileage,
        registration_number: vehicle.registration_number,
        insurance_validity: vehicle.insurance_validity,
        vehicle_type: vehicle.vehicle_type,
        rental_period: vehicle.rental_period,
        vehicle_condition: vehicle.vehicle_condition,
        accessories: vehicle.accessories,
        address_1: vehicle.address_1,
        landmark: vehicle.landmark,
        item_state: vehicle.item_state,
        city: vehicle.city,
        pincode: vehicle.pincode,
        booking_instructions: vehicle.booking_instructions,
        media_gallery: mediaGallery
      };

      // Step 5: Return clean response
      return res.status(200).json(response);

    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /** Api to update login service providers single items - Coded by Vishnu Nov 26 2025 */
  this.updateServiceProviderSingleListedItems = async (req, res) => {
    try {
      const {
        id,
        item_name,
        vehicle_description,
        registration_number,
        price_per_day,
        price_per_week,
        price_per_month,
        security_deposit,
        availability_status,
        fleet_size,
        engine_type,
        transmission_type,
        fuel_consumption,
        seating_capacity,
        color,
        mileage,
        address_1,
        landmark,
        item_state,
        city,
        pincode,
        booking_instructions,
        accessories,
        existing_image_ids // frontend se JSON string
      } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Vehicle ID is required" });
      }

      // =============================
      // 1. HANDLE EXISTING IMAGES
      // =============================
      let existingIds = [];
      try {
        existingIds = JSON.parse(existing_image_ids || "[]");
        if (!Array.isArray(existingIds)) existingIds = [];
      } catch {
        existingIds = [];
      }

      // =============================
      // 2. HANDLE NEW UPLOADED IMAGES
      // =============================
      let newImageIds = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const [insertRes] = await pool.query(
            `
              INSERT INTO roh_media_gallery (file_name, file_path)
              VALUES (?, '/uploads/media/host/items/')
            `,
            [file.filename]
          );

          newImageIds.push(insertRes.insertId);
        }
      }

      // =============================
      // FINAL IMAGE IDS = old + new
      // =============================
      const finalImageIds = [...existingIds, ...newImageIds];

      // Convert to JSON for DB
      const imageIdsJson = JSON.stringify(finalImageIds);

      // ================================
      // UPDATE vehicle_details
      // ================================
      await pool.query(
        `
          UPDATE roh_vehicle_details
          SET
            item_name = ?,
            vehicle_description = ?,
            price_per_day = ?,
            price_per_week = ?,
            price_per_month = ?,
            security_deposit = ?,
            availability_status = ?,
            fleet_size = ?,
            image_ids = ?
          WHERE id = ?
        `,
        [
          item_name,
          vehicle_description,
          toNumberOrNull(price_per_day),
          toNumberOrNull(price_per_week),
          toNumberOrNull(price_per_month),
          toNumberOrNull(security_deposit),
          availability_status,
          fleet_size,
          imageIdsJson,
          id,
        ]
      );

      // ================================
      // UPDATE vehicle_attributes
      // ================================
      await pool.query(
      `
        UPDATE roh_vehicle_attributes
        SET
          engine_type = ?,
          transmission_type = ?,
          fuel_consumption = ?,
          seating_capacity = ?,
          color = ?,
          mileage = ?,
          accessories = ?,
          address_1 = ?,
          landmark = ?,
          item_state = ?,
          city = ?,
          pincode = ?,
          booking_instructions = ?
        WHERE vehicle_id = ?
      `,
      [
        engine_type,
        transmission_type,
        toNumberOrNull(fuel_consumption),
        toIntOrNull(seating_capacity),
        color || null,
        toNumberOrNull(mileage),
        accessories,
        address_1,
        landmark,
        item_state,
        city,
        pincode,
        booking_instructions,
        id,
      ]
    );

      // =============================
      // FETCH updated media gallery
      // =============================
      let mediaGallery = [];

      if (finalImageIds.length > 0) {
        const placeholders = finalImageIds.map(() => "?").join(",");
        const [rows] = await pool.query(
          `
            SELECT id, file_name, file_path
            FROM roh_media_gallery
            WHERE id IN (${placeholders})
          `,
          finalImageIds
        );
        mediaGallery = rows;
      }

      // =============================
      // SUCCESS RESPONSE
      // =============================
      return res.status(200).json({
        message: "Vehicle updated successfully",
        updated_id: id,
        image_ids: finalImageIds,
        media_gallery: mediaGallery
      });

    } catch (error) {
      console.error("Error updating vehicle:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /** Api to delete login service providers single items - Coded by Vishnu September 06 2025 */
  this.deleteServiceProviderSingleListedItems = async (req, res) => {
    try {
      const { id, action = "delete" } = req.body || {};
      if (!id) return res.status(400).json({ message: "Missing required field: id" });

      if (action === "delete") {
        const [result] = await pool.query(
          `UPDATE roh_vehicle_details SET item_status = 0 WHERE id = ?`,
          [id]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Item not found or already inactive" });
        }
        return res.status(200).json({ message: "Item soft deleted successfully", success: true });
      }

      if (action === "reactivate") {
        const [result] = await pool.query(
          `UPDATE roh_vehicle_details SET item_status = 1 WHERE id = ? AND admin_item_status = 1`,
          [id]
        );
        if (result.affectedRows === 0) {
          const [rows] = await pool.query(
            `SELECT id, admin_item_status FROM roh_vehicle_details WHERE id = ?`,
            [id]
          );
          if (rows.length === 0) return res.status(404).json({ message: "Item not found" });
          if (Number(rows[0].admin_item_status) !== 1) {
            return res.status(403).json({
              message: "Reactivate not allowed. Admin has not approved this item yet.",
            });
          }
          return res.status(400).json({ message: "Unable to reactivate item." });
        }
        return res.status(200).json({ message: "Item reactivated successfully", success: true });
      }

      return res.status(400).json({ message: "Invalid action" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /** API to get business data along with category & sub-category details - Coded by Raj - October 2025*/
  this.getUserBusinessDetails = async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }

      // Step 1: Get user business data
      const [businessRows] = await pool.query(
        "SELECT * FROM `roh_user_business` WHERE `user_id` = ?",
        [user_id]
      );

      if (businessRows.length === 0) {
        return res.status(404).json({ message: "No business found for this user" });
      }

      const business = businessRows[0];

      // Step 2: Parse stored IDs
      const categoryIds = JSON.parse(business.category_ids || "[]");
      const subCategoryIds = JSON.parse(business.sub_category_ids || "[]");

      // Step 3: Fetch category and sub-category details
      let categories = [];
      let subCategories = [];

      if (categoryIds.length > 0) {
        const [catRows] = await pool.query(
          `SELECT id, name, slug
          FROM roh_categories
          WHERE id IN (?) AND parent_category_id IS NULL AND active = 1`,
          [categoryIds]
        );
        categories = catRows;
      }

      if (subCategoryIds.length > 0) {
        const [subCatRows] = await pool.query(
          `SELECT id, name, slug, parent_category_id
          FROM roh_categories
          WHERE id IN (?) AND parent_category_id IS NOT NULL AND active = 1`,
          [subCategoryIds]
        );
        subCategories = subCatRows;
      }

      // Step 4: Build response
      const responseData = {
        ...business,
        categories,
        sub_categories: subCategories,
      };

      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /** API to get business categories - Coded by Raj Nov 20 2025 */
  this.getBusinessCategories = async (req, res) => {

    const { user_id, category_id } = req.body;

    try {
      // -------------------------------
      // STEP 1: Get business_id for user
      // -------------------------------
      const [businessRows] = await pool.query(
        `SELECT id AS business_id
        FROM roh_user_business
        WHERE user_id = ? LIMIT 1`,
        [user_id]
      );

      if (businessRows.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No business found for this user",
        });
      }

      const business_id = businessRows[0].business_id;

      // -------------------------------
      // STEP 2: Fetch all sub_category_ids for this business + category
      // -------------------------------
      const [subCatRows] = await pool.query(
        `SELECT sub_category_id FROM roh_business_cate_relat WHERE user_id = ? AND business_id = ? AND category_id = ? AND active = 1`, [user_id, business_id, category_id]
      );

      if (subCatRows.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No sub categories assigned",
          business_id,
          sub_categories: [],
        });
      }

      // Extract IDs
      const subCategoryIds = subCatRows.map(row => row.sub_category_id);

      // -------------------------------
      // STEP 3: Fetch details of each sub-category
      // -------------------------------
      const [subCategoryDetails] = await pool.query(
        `SELECT id, name, slug FROM roh_categories WHERE id IN (?) AND active = 1`, [subCategoryIds]
      );

      // -------------------------------
      // STEP 4: Response
      // -------------------------------
      return res.status(200).json({
        success: true,
        business_id,
        category_id,
        sub_categories: subCategoryDetails,
      });

    } catch (error) {
      return res.status(200).json({
        success: false,
        message: "Internal server error",
        error
      });
    }
  };

  /** API to get the brands by category id */
  this.getBrandByCategories = async (req, res) => {
    try {
      const { cat_id } = req.body;
      const [brands] = await pool.query(
        `SELECT id, brand_name FROM roh_brands WHERE active = 1 AND cat_id = ? ORDER BY brand_name ASC`,
        [cat_id]
      );

      return res.status(200).json({ success: true, brands });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  /** API to get the models by brand id */
  this.getModelByBrands = async (req, res) => {
    try {
      const { brand_id } = req.body;
      const [models] = await pool.query(
        `SELECT id, model_name, model_slug, description, tag_id FROM roh_models WHERE active = 1 AND brand_id = ? ORDER BY model_name ASC`,
        [brand_id]
      );

      return res.status(200).json({ success: true, models });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  /** API: Create New Item for a Service Provider - single item (from save and add more button) */
  this.addVehicleItem = async (req, res) => {
      const connection = await pool.getConnection();
      try {
          // Handle body structure (FormData → { service_provider_id, items: [ {...} ] })
          let { service_provider_id } = req.body;
          let bodyItems = req.body;

          // --- KEY MAPPING ---
          const {
              business_id,
              category_id,
              sub_category_id,
              brand_id,
              model_id,
              tag_id,
              title,
              description,
              price_per_day,
              price_per_week,
              price_per_month,
              security_deposit,
              availability,
              engine_type,
              transmission,
              registration_number,
              condition,
              booking_instructions,
              fuel_consumption,
              seating_capacity,
              color,
              vehicle_age,
              mileage,
              insurance_validity,
              vehicle_type,
              rental_period,
              accessories,

              // NOTE: The request body fields for address (address_1, landmark, item_state, city, pincode)
              // are kept here but will be overwritten by values fetched from the database below.
              address_1,
              landmark,
              item_state,
              city,
              pincode,

              fleet_size,
          } = bodyItems;

          // --- Basic validation (Updated to use new variable names) ---
          if (!service_provider_id)
              return res.status(400).json({ success: false, message: "Service provider not found." });
          if (!title)
              return res.status(400).json({ success: false, message: "Title is required."});
          if (!business_id)
              return res.status(400).json({ success: false, message: "Business is required."});
          if (!category_id)
              return res.status(400).json({ success: false, message: "Category is required." });
          if (!brand_id)
              return res.status(400).json({ success: false, message: "Brand is required." });
          if (!model_id)
              return res.status(400).json({ success: false, message: "Model is required" });

          // =================================================================
          // >> STEP 0: FETCH ADDRESS DATA BASED ON business_id RELATION
          // =================================================================

          // 0a: Get user_id from roh_user_business using business_id
          const [businessRows] = await connection.query(
              `SELECT user_id FROM roh_user_business WHERE id = ?`,
              [business_id]
          );

          if (businessRows.length === 0) {
              return res.status(404).json({ success: false, message: "Business ID not found in roh_user_business." });
          }

          const userId = businessRows[0].user_id;

          // 0b: Get address details from roh_user_business_address using user_id
          // Assuming user_id is the foreign key (or equivalent) to find the address.
          // Also assuming you want the first address found (e.g., the primary one).
          const [addressRows] = await connection.query(
              `SELECT street_address, landmark, city, state, pincode FROM roh_user_business_address WHERE user_id = ? ORDER BY id ASC LIMIT 1`,
              [userId]
          );

          if (addressRows.length === 0) {
              // Optional: If no address is found, you might use the address values from the request body as a fallback,
              // or return an error if an address is mandatory. We will return an error here.
              return res.status(404).json({ success: false, message: "Address not found for the associated User ID." });
          }

          // Overwrite request body address variables with fetched database values
          // NOTE: street_address in DB is mapped to address_1 in the API body
          const fetchedAddress = addressRows[0];

          const db_address_1 = fetchedAddress.street_address;
          const db_landmark = fetchedAddress.landmark;
          const db_item_state = fetchedAddress.state; // Note the mapping: DB column 'state' maps to API variable 'item_state'
          const db_city = fetchedAddress.city;
          const db_pincode = fetchedAddress.pincode;


          // Begin transaction
          await connection.beginTransaction();

          // =================================================================
          // >> STEP 1: Handle image uploads (Same as original code)
          // =================================================================
          let uploadedFiles = [];
          if (Array.isArray(req.files)) {
              uploadedFiles = req.files;
          } else if (req.files && typeof req.files === "object") {
              const imageFiles = req.files.image || [];
              if (Array.isArray(imageFiles)) {
                  uploadedFiles.push(...imageFiles);
              }
              // Fallback for other files if needed
              for (const key of Object.keys(req.files)) {
                  if (key !== 'image' && Array.isArray(req.files[key])) {
                      uploadedFiles.push(...req.files[key]);
                  }
              }
          }

          const staticPathForDB = "/uploads/media/host/items/";
          const mediaQuery = "INSERT INTO roh_media_gallery (file_name, file_path, file_type, active) VALUES (?, ?, ?, ?)";
          const mediaIds = [];

          // Check if `path` module is available (required by `extname`)
          const path = require("path");

          for (const f of uploadedFiles) {
              const extFromMime = f.mimetype?.split("/")?.[1] || null;
              const extFromName =
                  path.extname(f.originalname)?.replace(".", "") || null;
              const fileType = extFromMime || extFromName || "bin";

              const [ins] = await connection.query(mediaQuery, [
                  f.filename,
                  staticPathForDB,
                  fileType,
                  1,
              ]);
              mediaIds.push(ins.insertId);
          }

          // const imagesJson = JSON.stringify(mediaIds);

          // --------------------------------------------------
          // Normalize image IDs
          // --------------------------------------------------
          let finalMediaIds = Array.isArray(mediaIds) ? mediaIds : [];

          // If no images uploaded → try fallback from model
          if (finalMediaIds.length === 0 && model_id) {
            const [modelRows] = await connection.query(`SELECT model_img_id FROM roh_models WHERE id = ? AND active = 1 LIMIT 1`, [model_id]);

            if (modelRows.length && modelRows[0].model_img_id) {
              finalMediaIds = [modelRows[0].model_img_id];
            }
          }

          // Convert to JSON for DB
          const imagesJson = JSON.stringify(finalMediaIds);

          const normalizedSecurityDeposit = security_deposit !== undefined && security_deposit !== null && security_deposit !== "" ? parseFloat(security_deposit) : null;
          const normalizedPerDayPrize = price_per_day !== undefined && price_per_day !== null && price_per_day !== "" ? parseFloat(price_per_day) : null;
          const normalizedAvailablity = availability && availability.trim() !== "" ? availability.trim() : 'Available';

          // =================================================================
          // >> STEP 2: Insert into roh_vehicle_details (Same as original code)
          // =================================================================
          const [vehicleResult] = await connection.query(
              `INSERT INTO roh_vehicle_details (service_provider_id, business_id, item_name, vehicle_description, category_id, sub_cat_id, tag_id, brand_id, model_id, image_ids, price_per_day, price_per_week, price_per_month, item_status, admin_item_status, total_views, security_deposit, booking_terms, availability_status, fleet_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                  service_provider_id,
                  business_id,
                  title,
                  description,
                  category_id,
                  sub_category_id,
                  tag_id,
                  brand_id,
                  model_id,
                  imagesJson,
                  normalizedPerDayPrize,
                  null,
                  null,
                  1, // item_status
                  1, // admin_item_status
                  0, // total_views
                  normalizedSecurityDeposit,
                  booking_instructions,
                  normalizedAvailablity,
                  fleet_size
              ]
          );

          const vehicle_id = vehicleResult.insertId;
          const normalizedRegistrationNumber = registration_number && registration_number.trim() !== "" ? registration_number.trim() : null;
          const normalizedEngineType = engine_type && engine_type.trim() !== "" ? engine_type.trim() : 'Petrol';
          const normalizedTransmission = transmission && transmission.trim() !== "" ? transmission.trim() : 'Automatic';

          // =================================================================
          // >> STEP 3: Insert into roh_vehicle_attributes
          //            (Using fetched DB address variables)
          // =================================================================
          await connection.query(
              `INSERT INTO roh_vehicle_attributes (vehicle_id, engine_type, transmission_type, fuel_consumption, seating_capacity, color, vehicle_age, mileage, registration_number, insurance_validity, vehicle_type, rental_period, vehicle_condition, accessories, address_1, landmark, item_state, city, pincode, booking_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                  vehicle_id,
                  normalizedEngineType,
                  normalizedTransmission,
                  fuel_consumption,
                  seating_capacity,
                  color,
                  vehicle_age,
                  mileage,
                  normalizedRegistrationNumber,
                  insurance_validity,
                  vehicle_type,
                  rental_period,
                  condition,
                  accessories,
                  // ** Using fetched address data here **
                  db_address_1,
                  db_landmark,
                  db_item_state,
                  db_city,
                  db_pincode,
                  // **********************************
                  booking_instructions,
              ]
          );

          /* --- NEW ADDITION START --- */
          // Update the sub-category availability status if it's currently 0
          if (sub_category_id) {
              await connection.query(
                  `UPDATE roh_categories SET cate_available = 1 WHERE id = ? AND cate_available = 0`,
                  [sub_category_id]
              );
          }
          /* --- NEW ADDITION END --- */

          // Commit transaction
          await connection.commit();
          connection.release();

          return res.status(200).json({
              success: true,
              message: "Item created successfully",
              inserted_id: vehicle_id,
              image_ids: mediaIds,
              fetched_address: `${db_address_1}, ${db_city}, ${db_item_state}, ${db_pincode}` // Optional: Add this for debugging/confirmation
          });
      } catch (error) {
          console.error("Error in addVehicleItem:", error); // Added error logging for debugging
          try {
              await connection.rollback();
          } catch {}
          try {
              connection.release();
          } catch {}
          return res.status(500).json({ success: false, message: "Internal server error" });
      }
  };

  // --- Final Reusable Function to Insert Vehicle Item ---
  const insertVehicleItemIntoDB = async (connection, itemPayload, uploadedFiles = []) => {
      const {
          business_id,
          category_id,
          sub_category_id,
          brand_id,
          model_id,
          tag_id,
          title,
          description,
          pricePerDay,
          pricePerWeek,
          pricePerMonth,
          securityDeposit,
          availability,
          engineType,
          transmission,
          registrationNumber,
          condition,
          bookingInstructions,
          booking_terms = null,
          fuel_consumption = null,
          seating_capacity = null,
          color = null,
          vehicle_age = null,
          mileage = null,
          insurance_validity = null,
          vehicle_type = null,
          rental_period = null,
          accessories = null,

          // These fields from itemPayload are now expected to be overwritten by DB fetch
          address_1 = null,
          landmark = null,
          item_state = null,
          city = null,
          pincode = null,

          service_provider_id,
          fleetSize,
      } = itemPayload;


      // =================================================================
      // >> STEP 0: FETCH ADDRESS DATA BASED ON business_id RELATION
      // =================================================================

      let db_address_1 = address_1; // Initialize with payload defaults (which are null/passed in)
      let db_landmark = landmark;
      let db_item_state = item_state;
      let db_city = city;
      let db_pincode = pincode;

      try {
          // 0a: Get user_id from roh_user_business using business_id
          const [businessRows] = await connection.query(
              `SELECT user_id FROM roh_user_business WHERE id = ?`,
              [business_id]
          );

          if (businessRows.length > 0) {
              const userId = businessRows[0].user_id;

              // 0b: Get address details from roh_user_business_address using user_id
              const [addressRows] = await connection.query(
                  `SELECT street_address, landmark, city, state, pincode FROM roh_user_business_address WHERE user_id = ? ORDER BY id ASC LIMIT 1`,
                  [userId]
              );

              if (addressRows.length > 0) {
                  const fetchedAddress = addressRows[0];

                  // Overwrite the variables with fetched database values
                  db_address_1 = fetchedAddress.street_address; // DB column 'street_address'
                  db_landmark = fetchedAddress.landmark;
                  db_item_state = fetchedAddress.state;         // DB column 'state'
                  db_city = fetchedAddress.city;
                  db_pincode = fetchedAddress.pincode;
              } else {
                  // Address not found: Log or handle as necessary.
                  // For now, it will proceed using the initial null/payload values.
                  console.warn(`Address not found for User ID: ${userId}. Proceeding with payload address data.`);
              }
          } else {
              // Business ID not found: Log or handle as necessary.
              console.warn(`Business ID: ${business_id} not found. Proceeding with payload address data.`);
          }

      } catch (error) {
          // Handle database error during address fetching
          console.error("Error fetching related address data:", error);
          // Important: Re-throw the error so the calling function's transaction handler catches it
          throw new Error("Failed to fetch required address data.");
      }


      // --- Image Handling (saves file path to DB) ---
      const mediaIds = [];
      // let imagesJson = JSON.stringify([]);

      if (uploadedFiles.length > 0) {
          // Requires 'path' module availability in the scope where this function is defined
          // or imported at the top of the file. Assuming 'path' is available here.
          const path = require("path");

          const staticPathForDB = "/uploads/media/host/items/";
          const mediaQuery = "INSERT INTO roh_media_gallery (file_name, file_path, file_type, active) VALUES (?, ?, ?, ?)";

          for (const f of uploadedFiles) {
              const extFromMime = f.mimetype?.split("/")?.[1] || null;
              const extFromName = path.extname(f.originalname)?.replace(".", "") || null;
              const fileType = extFromMime || extFromName || "bin";

              const [ins] = await connection.query(mediaQuery, [
                  f.filename,
                  staticPathForDB,
                  fileType,
                  1,
              ]);
              mediaIds.push(ins.insertId);
          }
          // imagesJson = JSON.stringify(mediaIds);
      }

      let finalMediaIds = Array.isArray(mediaIds) ? mediaIds : [];

        // If no images uploaded → try fallback from model
        if (finalMediaIds.length === 0 && model_id) {
          const [modelRows] = await connection.query(`SELECT model_img_id FROM roh_models WHERE id = ? AND active = 1 LIMIT 1`, [model_id]);

          if (modelRows.length && modelRows[0].model_img_id) {
            finalMediaIds = [modelRows[0].model_img_id];
          }
        }

      // Convert to JSON for DB
      const imagesJson = JSON.stringify(finalMediaIds);

      const normalizedSecurityDeposit = securityDeposit !== undefined && securityDeposit !== null && securityDeposit !== "" ? parseFloat(securityDeposit) : null;
      const normalizedPricPerDay = pricePerDay !== undefined && pricePerDay !== null && pricePerDay !== "" ? pricePerDay : null;
      const normalizedAvailablity = availability && availability.trim() !== "" ? availability.trim() : 'Available';

      //  Step 1: Insert into roh_vehicle_details
      const [vehicleResult] = await connection.query(
          `INSERT INTO roh_vehicle_details (service_provider_id, business_id, item_name, vehicle_description, category_id, sub_cat_id, tag_id, brand_id, model_id, image_ids, price_per_day, price_per_week, price_per_month, item_status, admin_item_status, total_views, security_deposit, booking_terms, availability_status, fleet_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              service_provider_id,
              business_id,
              title,
              description,
              category_id,
              sub_category_id,
              tag_id,
              brand_id,
              model_id,
              imagesJson,
              normalizedPricPerDay,
              null,
              null,
              1, // item_status
              1, // admin_item_status
              0, // total_views
              normalizedSecurityDeposit,
              bookingInstructions,
              normalizedAvailablity,
              fleetSize
          ]
      );

      const vehicle_id = vehicleResult.insertId;
      const normalizedRegistrationNumber = registrationNumber && registrationNumber.trim() !== "" ? registrationNumber.trim() : null;
      const normalizedEngineType = engineType && engineType.trim() !== "" ? engineType.trim() : 'Petrol';
      const normalizedTransmission = transmission && transmission.trim() !== "" ? transmission.trim() : 'Automatic';

      //  Step 2: Insert into roh_vehicle_attributes
      // ** Using fetched address variables: db_address_1, db_landmark, db_item_state, db_city, db_pincode **
      await connection.query(
          `INSERT INTO roh_vehicle_attributes (vehicle_id, engine_type, transmission_type, fuel_consumption, seating_capacity, color, vehicle_age, mileage, registration_number, insurance_validity, vehicle_type, rental_period, vehicle_condition, accessories, address_1, landmark, item_state, city, pincode, booking_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
              vehicle_id,
              normalizedEngineType,
              normalizedTransmission,
              fuel_consumption,
              seating_capacity,
              color,
              vehicle_age,
              mileage,
              normalizedRegistrationNumber,
              insurance_validity,
              vehicle_type,
              rental_period,
              condition,
              accessories,
              // Use DB fetched values here
              db_address_1,
              db_landmark,
              db_item_state,
              db_city,
              db_pincode,
              bookingInstructions,
          ]
      );

      return { vehicle_id, mediaIds };
  };

  /** API: to create/finalize the items on the final submit */
  this.submitAllItems = async (req, res) => {
      const connection = await pool.getConnection();
      let updatedVehicleIds = [];
      let insertedVehicleIds = [];

      // --- 1. Parse Data (Handles both JSON and FormData strings) ---
      let parsedData = req.body;
      let uploadedFiles = req.files || []; // Files from Multer (if sent via FormData)

      try {
          const { business_id, service_provider_id, category_id, items, terms_accepted } = parsedData;

          // --- 2. High-level Validation ---
          if (!service_provider_id || !business_id || !Array.isArray(items) || items.length === 0 || !category_id) {
              return res.status(400).json({ success: false, message: "Missing required submission data (IDs or Items). ❌" });
          }
          if (!terms_accepted) {
              return res.status(400).json({ success: false, message: "Terms and conditions must be accepted. ⚠️" });
          }

          await connection.beginTransaction();

          // Query to UPDATE/Finalize items that were already saved (have an ID)
          const updateQuery = `
              UPDATE roh_vehicle_details
              SET admin_item_status = 1, item_status = 1
              WHERE id = ? AND service_provider_id = ? AND business_id = ?
          `;

          for (const item of items) {
              const vehicle_id = item.id;

              // Re-map top-level fields onto the item payload
              const itemPayload = {
                  ...item,
                  business_id,
                  service_provider_id,
                  category_id,
              };

              if (vehicle_id && vehicle_id > 0) {
                  const [updateResult] = await connection.query(updateQuery, [
                      vehicle_id,
                      service_provider_id,
                      business_id
                  ]);

                  if (updateResult.affectedRows > 0) {
                      updatedVehicleIds.push(vehicle_id);
                  }
              } else {

                  // if (!itemPayload.title || !itemPayload.pricePerDay || !itemPayload.brand_id) {
                  if (!itemPayload.title || !itemPayload.brand_id) {
                      await connection.rollback();
                      return res.status(400).json({ success: false, message: `Unsaved item failed validation: Missing title, or brand. 🛑` });
                  }

                  // Call the insertion function, passing the uploaded files (if any were sent)
                  const { vehicle_id: new_vehicle_id } = await insertVehicleItemIntoDB(connection, itemPayload, uploadedFiles);
                  insertedVehicleIds.push(new_vehicle_id);

                  uploadedFiles = [];
              }
          }

          /* --- NEW ADDITION START --- */
          // Collect unique sub_category_ids from the items array
          const subCategoryIds = [...new Set(items.map(i => i.sub_category_id).filter(Boolean))];
          if (subCategoryIds.length > 0) {
              // Batch update categories to make them available
              await connection.query(
                  `UPDATE roh_categories SET cate_available = 1 WHERE id IN (?) AND cate_available = 0`,
                  [subCategoryIds]
              );
          }
          /* --- NEW ADDITION END --- */

          // --- 4. Finalize Transaction ---
          await connection.commit();
          connection.release();

          const totalProcessed = updatedVehicleIds.length + insertedVehicleIds.length;

          if (totalProcessed === 0) {
              return res.status(400).json({ success: false, message: "Final submission failed: No items processed." });
          }

          return res.status(200).json({
              success: true,
              message: `${totalProcessed} items processed successfully. (${insertedVehicleIds.length} inserted, ${updatedVehicleIds.length} finalized).`,
              finalized_ids: [...updatedVehicleIds, ...insertedVehicleIds],
          });
      } catch (error) {
          // --- Error Handling ---
          try { await connection.rollback(); } catch {}
          try { connection.release(); } catch {}
          if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('registration_number')) {
              return res.status(400).json({ success: false, message: `Duplicate registration number found. Please check your data. 🛑` });
          }
          return res.status(500).json({ success: false, message: "Internal server error during final submission." });
      }
  };

  /** API to delete the single item data */
  this.deleteSingleItem = async (req, res) => {
      // Assuming 'pool' (database connection pool) is available in this scope.
      const connection = await pool.getConnection();

      try {
          // Validation middleware se saaf data mila
          const { id, service_provider_id } = req.body;

          // Transaction shuru karein
          await connection.beginTransaction();

          // Step 1: Delete the entry from roh_vehicle_attributes
          const [attrResult] = await connection.query(
              `DELETE FROM roh_vehicle_attributes WHERE vehicle_id = ?`,
              [id]
          );

          // Step 2: Delete the main item entry from roh_vehicle_details
          const [detailResult] = await connection.query(
              `DELETE FROM roh_vehicle_details WHERE id = ? AND service_provider_id = ?`,
              [id, service_provider_id]
          );

          if (detailResult.affectedRows === 0) {
              await connection.rollback();
              connection.release();
              return res.status(404).json({
                  success: false,
                  message: "Item not found or you are not authorized to delete this item. 🛑",
              });
          }

          await connection.commit();
          connection.release();

          return res.status(200).json({
              success: true,
              message: `Item deleted successfully.`,
          });

      } catch (error) {
          try { await connection.rollback(); } catch {}
          try { connection.release(); } catch {}
          console.error("❌ Error deleting item:", error);
          return res.status(500).json({
              success: false,
              message: "Internal server error during item deletion. ❌",
          });
      }
  };
}

module.exports = new hostModuleApi();