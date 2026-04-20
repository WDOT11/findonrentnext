const { pool } = require('../../../config/connection');
const path = require('path');

function AllVehiclesAdminApi() {

    /** List all vehicles admin side with pagination and search - Coded by Vishnu Nov 20, 2025 */
    this.ListAllVehiclesListadmin = async (req, res) => {
        try {
            let {
                keyword = "",
                service_provider_id = "",
                admin_item_status = "",
                item_status = "",
                sub_cat_id = "",
                page = 1,
                limit = 10
            } = req.body;

            page = Number(page);
            limit = Number(limit);
            const offset = (page - 1) * limit;

            let where = "WHERE 1=1";

            if (keyword) {
                where += ` AND p.item_name LIKE '%${keyword}%' `;
            }

            if (service_provider_id) {
                where += ` AND p.service_provider_id = ${service_provider_id} `;
            }

            if (admin_item_status !== "") {
                where += ` AND p.admin_item_status = ${admin_item_status} `;
            }

            if (item_status !== "") {
                where += ` AND p.item_status = ${item_status} `;
            }

            if (sub_cat_id) {
                where += ` AND p.sub_cat_id = ${sub_cat_id} `;
            }

            const sql = `
                SELECT
                    p.id,
                    p.item_name,
                    p.price_per_day,
                    p.price_per_month,
                    p.security_deposit,
                    p.item_status,
                    p.admin_item_status,
                    p.availability_status,
                    p.total_views,

                    b.business_name,
                    b.business_slug,

                    u.user_id AS sp_user_id,
                    u.first_name AS sp_first_name,
                    u.last_name AS sp_last_name,

                    c1.name AS category_name,
                    c2.name AS sub_category_name,
                    br.brand_name AS brand_name,
                    mo.model_name AS model_name

                FROM roh_vehicle_details p

                LEFT JOIN roh_user_business b
                    ON p.business_id = b.id

                LEFT JOIN roh_users u
                    ON p.service_provider_id = u.user_id

                LEFT JOIN roh_categories c1
                    ON p.category_id = c1.id

                LEFT JOIN roh_categories c2
                    ON p.sub_cat_id = c2.id

                LEFT JOIN roh_brands br
                    ON p.brand_id = br.id

                LEFT JOIN roh_models mo
                    ON p.model_id = mo.id

                ${where}
                ORDER BY p.id DESC
                LIMIT ${limit} OFFSET ${offset}
            `;

            const countSql = `
                SELECT COUNT(*) AS total
                FROM roh_vehicle_details p
                ${where}
            `;

            const [rows] = await pool.promise().query(sql);
            const [countRow] = await pool.promise().query(countSql);

            return res.status(200).json({
                success: true,
                products: rows,
                total: countRow[0].total,
                page,
                limit
            });

        } catch (err) {
            console.error("Unexpected error:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };


    /** View single vehicle admin side - Coded by Vishnu Nov 20, 2025 */
    this.AdminVehicleView = async (req, res) => {
        try {
            const { vehicle_id } = req.body;

            if (!vehicle_id) {
                return res.status(400).json({
                    success: false,
                    message: "vehicle_id is required",
                });
            }

            /* ==========================
            MAIN VEHICLE DETAILS
            =========================== */
            const sql = `
                SELECT
                    v.*,
                    b.business_name,
                    u.first_name AS sp_first_name,
                    u.last_name AS sp_last_name,

                    c1.name AS category_name,
                    c2.name AS sub_category_name,

                    br.brand_name,
                    mo.model_name

                FROM roh_vehicle_details v
                LEFT JOIN roh_user_business b ON v.business_id = b.id
                LEFT JOIN roh_users u ON v.service_provider_id = u.user_id
                LEFT JOIN roh_categories c1 ON v.category_id = c1.id
                LEFT JOIN roh_categories c2 ON v.sub_cat_id = c2.id
                LEFT JOIN roh_brands br ON v.brand_id = br.id
                LEFT JOIN roh_models mo ON v.model_id = mo.id

                WHERE v.id = ?
            `;

            const [rows] = await pool.promise().query(sql, [vehicle_id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Vehicle not found",
                });
            }

            const vehicle = rows[0];

            /* ==========================
            VEHICLE ATTRIBUTES
            =========================== */
            const attrSql = `
                SELECT *
                FROM roh_vehicle_attributes
                WHERE vehicle_id = ?
            `;
            const [attrRows] = await pool.promise().query(attrSql, [vehicle_id]);
            const attributes = attrRows[0] || {};

            /* ==========================
            FETCH IMAGES FROM GALLERY
            =========================== */
            let imageList = [];

            if (vehicle.image_ids) {
                let ids = [];

                try {
                    ids = JSON.parse(vehicle.image_ids); // "[54,55,56]" → [54, 55, 56]
                } catch (err) {
                    /** Else here */
                }

                if (Array.isArray(ids) && ids.length > 0) {
                    const imgSql = `
                        SELECT id, file_name, file_path
                        FROM roh_media_gallery
                        WHERE id IN (?)
                    `;
                    const [imgRows] = await pool.promise().query(imgSql, [ids]);
                    imageList = imgRows;
                }
            }

            /* ==========================
            FINAL MERGED RESPONSE
            =========================== */
            const finalVehicle = {
                ...vehicle,
                ...attributes,
                images: imageList
            };

            return res.json({
                success: true,
                vehicle: finalVehicle,
            });

        } catch (err) {
            console.error("Vehicle View Error:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** Edit vehicle admin side - Coded by Vishnu Nov 21, 2025 */
    this.AdminVehicleEdit = async (req, res) => {
    try {
        const {
        vehicle_id, // NOW TAKING REAL ID FROM FRONTEND

        item_name,
        vehicle_description,
        price_per_day,
        price_per_month,
        security_deposit,
        booking_terms,
        fleet_size,


        engine_type,
        transmission_type,
        seating_capacity,
        color,
        fuel_consumption,
        registration_number,
        vehicle_type,
        vehicle_condition,
        accessories,
        mileage,
        vehicle_age,
        address_1,
        landmark,
        city,
        item_state,
        pincode,
        booking_instructions
        } = req.body;

        // VALIDATION
        if (!vehicle_id) {
        return res.status(400).json({
            success: false,
            message: "vehicle_id is required"
        });
        }

        /* ===============================
            UPDATE roh_vehicle_details
        =============================== */

        await pool.promise().query(
        `
            UPDATE roh_vehicle_details SET
            item_name = ?,
            vehicle_description = ?,
            price_per_day = ?,
            price_per_month = ?,
            security_deposit = ?,
            fleet_size = ?,
            booking_terms = ?
            WHERE id = ?
        `,
        [
            item_name,
            vehicle_description,
            price_per_day,
            price_per_month,
            security_deposit,
            fleet_size,
            booking_terms,
            vehicle_id
        ]
        );

        /* ===============================
            UPDATE roh_vehicle_attributes
        =============================== */

        await pool.promise().query(
        `
            UPDATE roh_vehicle_attributes SET
            engine_type = ?,
            transmission_type = ?,
            seating_capacity = ?,
            color = ?,
            fuel_consumption = ?,
            registration_number = ?,
            vehicle_type = ?,
            vehicle_condition = ?,
            accessories = ?,
            mileage = ?,
            vehicle_age = ?,
            address_1 = ?,
            landmark = ?,
            city = ?,
            item_state = ?,
            pincode = ?,
            booking_instructions = ?
            WHERE vehicle_id = ?
        `,
        [
            engine_type,
            transmission_type,
            seating_capacity,
            color,
            fuel_consumption,
            registration_number,
            vehicle_type,
            vehicle_condition,
            accessories,
            mileage,
            vehicle_age,
            address_1,
            landmark,
            city,
            item_state,
            pincode,
            booking_instructions,
            vehicle_id
        ]
        );

        return res.status(200).json({
        success: true,
        message: "Vehicle updated successfully"
        });

    } catch (err) {
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err
        });
    }
    };

    /** API for admin approve/unapprove vehicle - Coded by Vishnu Nov 21, 2025 */
    this.AdminVehicleStatusUpdate = async (req, res) => {
    try {
        const { vehicle_id, status } = req.body;

        if (!vehicle_id) {
        return res.status(400).json({
            success: false,
            message: "vehicle_id is required",
        });
        }

        if (![0, 1, 2].includes(Number(status))) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value",
        });
        }

        // Check if vehicle exists
        const [check] = await pool.promise().query(
        "SELECT id FROM roh_vehicle_details WHERE id = ?",
        [vehicle_id]
        );

        if (check.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Vehicle not found",
        });
        }

        // Update status
        await pool.promise().query(
        "UPDATE roh_vehicle_details SET admin_item_status = ? WHERE id = ?",
        [status, vehicle_id]
        );

        return res.json({
        success: true,
        message:
            status == 1
            ? "Vehicle Approved Successfully"
            : status == 0
            ? "Vehicle Unapproved Successfully"
            : "Vehicle marked as Pending",
        });

    } catch (err) {
        console.error("AdminVehicleStatusUpdate Error:", err);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err,
        });
    }
    };



}

module.exports = new AllVehiclesAdminApi();
