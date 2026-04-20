const pool = require('../../../config/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const saltRounds = 10;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function PublicModuleApi() {

    /**
     * Get all Active vehicles -- card on vehicles/cars page
     * Enhanced with Brand & Tag filter by Vishnu (Nov 02, 2025)
     */
    this.getActivevehiclesCars = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1;
            const offset = (page - 1) * limit;

            const qRaw = (req.query.q || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const locRaw = (req.query.location || "").trim();
            const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

            const userCity = (req.query.user_city || "").trim();
            const brandSlug = (req.query.brand_slug || "").trim();
            const tagSlug = (req.query.tag_slug || "").trim();

            let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
            let params = [];

            /** Only cars (sub_cat_id = 2) */
            whereClauses.push(`d.sub_cat_id = ?`);
            params.push(2);

            /** Keyword Search */
            if (qLike) {
            whereClauses.push(`d.item_name LIKE ?`);
            params.push(qLike);
            }

            /** Location Filter */
            if (locTokens.length) {
            const groups = [];
            for (const tok of locTokens) {
                const like = `%${tok}%`;
                if (/^\d{4,6}$/.test(tok)) {
                groups.push(`(a.pincode LIKE ?)`);
                params.push(like);
                } else {
                groups.push(`(
                    a.address_1 LIKE ? OR
                    a.landmark LIKE ? OR
                    a.item_state LIKE ? OR
                    a.city LIKE ?
                )`);
                params.push(like, like, like, like);
                }
            }
            whereClauses.push(`(${groups.join(" AND ")})`);
            }

            /** =====================
             * Brand & Tag Filter
             * ===================== */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
                [brandSlug]
            );
            if (brand.length > 0) {
                whereClauses.push(`d.brand_id = ?`);
                params.push(brand[0].id);
            } else {
                // No valid brand → empty result
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            if (tagSlug) {
            const [tag] = await pool.query(
                `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
                [tagSlug]
            );
            if (tag.length > 0) {
                whereClauses.push(`d.tag_id = ?`);
                params.push(tag[0].id);
            } else {
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            /** Final WHERE */
            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /** =====================
             * MAIN PRODUCT QUERY
             * ===================== */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.service_provider_id,
                d.item_name,
                d.category_id,
                d.sub_cat_id,
                d.image_ids,
                d.item_status,
                d.add_date,
                d.availability_status,
                d.price_per_day,
                d.brand_id,
                d.tag_id,
                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                b.brand_name,
                b.brand_slug,
                t.tag_name,
                t.tag_slug
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_tags t ON d.tag_id = t.id
            ${whereSQL}
            ORDER BY
                CASE WHEN a.city = ? THEN 0 ELSE 1 END,
                d.add_date DESC,
                d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, userCity, limit, offset]
            );

            if (!products || products.length === 0) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /** =====================
             * TOTAL COUNT
             * ===================== */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            ${whereSQL}
            `,
            params
            );

            /** =====================
             * ENHANCE MEDIA GALLERY
             * ===================== */
            const enhancedProducts = await Promise.all(
            products.map(async (product) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid JSON for product id:", product.id);
                }

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

                return { ...product, media_gallery: mediaGallery };
            })
            );

            /** Final Response */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });
        } catch (error) {
            console.error("Error in getActivevehiclesCars:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /**
     * Get all Active vehicles -- card on vehicles/cars with drivers page
     * Enhanced with Brand & Tag filter by Vishnu (Dec 12, 2025)
     */
    this.getActivevehiclesCarsWithDrivers = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1;
            const offset = (page - 1) * limit;

            const qRaw = (req.query.q || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const locRaw = (req.query.location || "").trim();
            const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

            const userCity = (req.query.user_city || "").trim();
            const brandSlug = (req.query.brand_slug || "").trim();
            const tagSlug = (req.query.tag_slug || "").trim();

            let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
            let params = [];

            /** Only cars (sub_cat_id = 10) */
            whereClauses.push(`d.sub_cat_id = ?`);
            params.push(10);

            /** Keyword Search */
            if (qLike) {
            whereClauses.push(`d.item_name LIKE ?`);
            params.push(qLike);
            }

            /** Location Filter */
            if (locTokens.length) {
            const groups = [];
            for (const tok of locTokens) {
                const like = `%${tok}%`;
                if (/^\d{4,6}$/.test(tok)) {
                groups.push(`(a.pincode LIKE ?)`);
                params.push(like);
                } else {
                groups.push(`(
                    a.address_1 LIKE ? OR
                    a.landmark LIKE ? OR
                    a.item_state LIKE ? OR
                    a.city LIKE ?
                )`);
                params.push(like, like, like, like);
                }
            }
            whereClauses.push(`(${groups.join(" AND ")})`);
            }

            /** =====================
             * Brand & Tag Filter
             * ===================== */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
                [brandSlug]
            );
            if (brand.length > 0) {
                whereClauses.push(`d.brand_id = ?`);
                params.push(brand[0].id);
            } else {
                // No valid brand → empty result
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            if (tagSlug) {
            const [tag] = await pool.query(
                `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
                [tagSlug]
            );
            if (tag.length > 0) {
                whereClauses.push(`d.tag_id = ?`);
                params.push(tag[0].id);
            } else {
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            /** Final WHERE */
            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /** =====================
             * MAIN PRODUCT QUERY
             * ===================== */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.service_provider_id,
                d.item_name,
                d.category_id,
                d.sub_cat_id,
                d.image_ids,
                d.item_status,
                d.add_date,
                d.availability_status,
                d.price_per_day,
                d.brand_id,
                d.tag_id,
                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                b.brand_name,
                b.brand_slug,
                t.tag_name,
                t.tag_slug
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_tags t ON d.tag_id = t.id
            ${whereSQL}
            ORDER BY
                CASE WHEN a.city = ? THEN 0 ELSE 1 END,
                d.add_date DESC,
                d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, userCity, limit, offset]
            );

            if (!products || products.length === 0) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /** =====================
             * TOTAL COUNT
             * ===================== */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            ${whereSQL}
            `,
            params
            );

            /** =====================
             * ENHANCE MEDIA GALLERY
             * ===================== */
            const enhancedProducts = await Promise.all(
            products.map(async (product) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid JSON for product id:", product.id);
                }

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

                return { ...product, media_gallery: mediaGallery };
            })
            );

            /** Final Response */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });
        } catch (error) {
            console.error("Error in getActivevehiclesCarswithdrivers:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Get all Active vehicles -- card on vehicles/bikes page - Coded by Vishnu Oct 01 2025 */
    this.getActivevehiclesBikes = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1;
            const offset = (page - 1) * limit;

            const qRaw = (req.query.q || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const locRaw = (req.query.location || "").trim();
            const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

            const userCity = (req.query.user_city || "").trim();
            const brandSlug = (req.query.brand_slug || "").trim();
            const tagSlug = (req.query.tag_slug || "").trim();

            let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
            let params = [];

            /** Only bike (sub_cat_id = 3) */
            whereClauses.push(`d.sub_cat_id = ?`);
            params.push(3);

            /** Keyword Search */
            if (qLike) {
            whereClauses.push(`d.item_name LIKE ?`);
            params.push(qLike);
            }

            /** Location Filter */
            if (locTokens.length) {
            const groups = [];
            for (const tok of locTokens) {
                const like = `%${tok}%`;
                if (/^\d{4,6}$/.test(tok)) {
                groups.push(`(a.pincode LIKE ?)`);
                params.push(like);
                } else {
                groups.push(`(
                    a.address_1 LIKE ? OR
                    a.landmark LIKE ? OR
                    a.item_state LIKE ? OR
                    a.city LIKE ?
                )`);
                params.push(like, like, like, like);
                }
            }
            whereClauses.push(`(${groups.join(" AND ")})`);
            }

            /** =====================
             * Brand & Tag Filter
             * ===================== */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
                [brandSlug]
            );
            if (brand.length > 0) {
                whereClauses.push(`d.brand_id = ?`);
                params.push(brand[0].id);
            } else {
                // No valid brand → empty result
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            if (tagSlug) {
            const [tag] = await pool.query(
                `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
                [tagSlug]
            );
            if (tag.length > 0) {
                whereClauses.push(`d.tag_id = ?`);
                params.push(tag[0].id);
            } else {
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            /** Final WHERE */
            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /** =====================
             * MAIN PRODUCT QUERY
             * ===================== */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.service_provider_id,
                d.item_name,
                d.category_id,
                d.sub_cat_id,
                d.image_ids,
                d.item_status,
                d.add_date,
                d.availability_status,
                d.price_per_day,
                d.brand_id,
                d.tag_id,
                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                b.brand_name,
                b.brand_slug,
                t.tag_name,
                t.tag_slug
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_tags t ON d.tag_id = t.id
            ${whereSQL}
            ORDER BY
                CASE WHEN a.city = ? THEN 0 ELSE 1 END,
                d.add_date DESC,
                d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, userCity, limit, offset]
            );

            if (!products || products.length === 0) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /** =====================
             * TOTAL COUNT
             * ===================== */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            ${whereSQL}
            `,
            params
            );

            /** =====================
             * ENHANCE MEDIA GALLERY
             * ===================== */
            const enhancedProducts = await Promise.all(
            products.map(async (product) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid JSON for product id:", product.id);
                }

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

                return { ...product, media_gallery: mediaGallery };
            })
            );

            /** Final Response */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });
        } catch (error) {
            console.error("Error in getActivevehiclesCars:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Get all Active vehicles -- card on vehicles/scooters page - Coded by Vishnu Oct 01 2025 */
    this.getActivevehiclesScooters = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1;
            const offset = (page - 1) * limit;

            const qRaw = (req.query.q || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const locRaw = (req.query.location || "").trim();
            const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

            const userCity = (req.query.user_city || "").trim();
            const brandSlug = (req.query.brand_slug || "").trim();
            const tagSlug = (req.query.tag_slug || "").trim();

            let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
            let params = [];

            /** Only for Scooters (sub_cat_id = 8) */
            whereClauses.push(`d.sub_cat_id = ?`);
            params.push(8);

            /** Keyword Search */
            if (qLike) {
            whereClauses.push(`d.item_name LIKE ?`);
            params.push(qLike);
            }

            /** Location Filter */
            if (locTokens.length) {
            const groups = [];
            for (const tok of locTokens) {
                const like = `%${tok}%`;
                if (/^\d{4,6}$/.test(tok)) {
                groups.push(`(a.pincode LIKE ?)`);
                params.push(like);
                } else {
                groups.push(`(
                    a.address_1 LIKE ? OR
                    a.landmark LIKE ? OR
                    a.item_state LIKE ? OR
                    a.city LIKE ?
                )`);
                params.push(like, like, like, like);
                }
            }
            whereClauses.push(`(${groups.join(" AND ")})`);
            }

            /** =====================
             * Brand & Tag Filter
             * ===================== */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
                [brandSlug]
            );
            if (brand.length > 0) {
                whereClauses.push(`d.brand_id = ?`);
                params.push(brand[0].id);
            } else {
                // No valid brand → empty result
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            if (tagSlug) {
            const [tag] = await pool.query(
                `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
                [tagSlug]
            );
            if (tag.length > 0) {
                whereClauses.push(`d.tag_id = ?`);
                params.push(tag[0].id);
            } else {
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            /** Final WHERE */
            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /** =====================
             * MAIN PRODUCT QUERY
             * ===================== */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.service_provider_id,
                d.item_name,
                d.category_id,
                d.sub_cat_id,
                d.image_ids,
                d.item_status,
                d.add_date,
                d.availability_status,
                d.price_per_day,
                d.brand_id,
                d.tag_id,
                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                b.brand_name,
                b.brand_slug,
                t.tag_name,
                t.tag_slug
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_tags t ON d.tag_id = t.id
            ${whereSQL}
            ORDER BY
                CASE WHEN a.city = ? THEN 0 ELSE 1 END,
                d.add_date DESC,
                d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, userCity, limit, offset]
            );

            if (!products || products.length === 0) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /** =====================
             * TOTAL COUNT
             * ===================== */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            ${whereSQL}
            `,
            params
            );

            /** =====================
             * ENHANCE MEDIA GALLERY
             * ===================== */
            const enhancedProducts = await Promise.all(
            products.map(async (product) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid JSON for product id:", product.id);
                }

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

                return { ...product, media_gallery: mediaGallery };
            })
            );

            /** Final Response */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });
        } catch (error) {
            console.error("Error in getActivevehiclesCars:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Get all Active vehicles -- card on vehicles/recreational page - Coded by Vishnu Oct 31 2025 */
    this.getActiveRecreationalVehicles = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1;
            const offset = (page - 1) * limit;

            const qRaw = (req.query.q || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const locRaw = (req.query.location || "").trim();
            const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

            const userCity = (req.query.user_city || "").trim();
            const brandSlug = (req.query.brand_slug || "").trim();
            const tagSlug = (req.query.tag_slug || "").trim();

            let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
            let params = [];

            /** Only recreational (sub_cat_id = 6) */
            whereClauses.push(`d.sub_cat_id = ?`);
            params.push(6);

            /** Keyword Search */
            if (qLike) {
            whereClauses.push(`d.item_name LIKE ?`);
            params.push(qLike);
            }

            /** Location Filter */
            if (locTokens.length) {
            const groups = [];
            for (const tok of locTokens) {
                const like = `%${tok}%`;
                if (/^\d{4,6}$/.test(tok)) {
                groups.push(`(a.pincode LIKE ?)`);
                params.push(like);
                } else {
                groups.push(`(
                    a.address_1 LIKE ? OR
                    a.landmark LIKE ? OR
                    a.item_state LIKE ? OR
                    a.city LIKE ?
                )`);
                params.push(like, like, like, like);
                }
            }
            whereClauses.push(`(${groups.join(" AND ")})`);
            }

            /** =====================
             * Brand & Tag Filter
             * ===================== */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
                [brandSlug]
            );
            if (brand.length > 0) {
                whereClauses.push(`d.brand_id = ?`);
                params.push(brand[0].id);
            } else {
                // No valid brand → empty result
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            if (tagSlug) {
            const [tag] = await pool.query(
                `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
                [tagSlug]
            );
            if (tag.length > 0) {
                whereClauses.push(`d.tag_id = ?`);
                params.push(tag[0].id);
            } else {
                return res.status(200).json({ products: [], total: 0 });
            }
            }

            /** Final WHERE */
            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /** =====================
             * MAIN PRODUCT QUERY
             * ===================== */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.service_provider_id,
                d.item_name,
                d.category_id,
                d.sub_cat_id,
                d.image_ids,
                d.item_status,
                d.add_date,
                d.availability_status,
                d.price_per_day,
                d.brand_id,
                d.tag_id,
                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                b.brand_name,
                b.brand_slug,
                t.tag_name,
                t.tag_slug
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_tags t ON d.tag_id = t.id
            ${whereSQL}
            ORDER BY
                CASE WHEN a.city = ? THEN 0 ELSE 1 END,
                d.add_date DESC,
                d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, userCity, limit, offset]
            );

            if (!products || products.length === 0) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /** =====================
             * TOTAL COUNT
             * ===================== */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            ${whereSQL}
            `,
            params
            );

            /** =====================
             * ENHANCE MEDIA GALLERY
             * ===================== */
            const enhancedProducts = await Promise.all(
            products.map(async (product) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid JSON for product id:", product.id);
                }

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

                return { ...product, media_gallery: mediaGallery };
            })
            );

            /** Final Response */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });
        } catch (error) {
            console.error("Error in getActivevehiclesCars:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Get all Active vehicles -- card on vehicles/luxury page - Coded by Vishnu Oct 31 2025 */
    this.getActiveLuxuryVehicles = async (req, res) => {
        try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;

        const qRaw = (req.query.q || "").trim();
        const qLike = qRaw ? `%${qRaw}%` : null;

        const locRaw = (req.query.location || "").trim();
        const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

        const userCity = (req.query.user_city || "").trim();
        const brandSlug = (req.query.brand_slug || "").trim();
        const tagSlug = (req.query.tag_slug || "").trim();

        let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
        let params = [];

        /** Only luxury vehicles (sub_cat_id = 5) */
        whereClauses.push(`d.sub_cat_id = ?`);
        params.push(5);

        /** Keyword Search */
        if (qLike) {
        whereClauses.push(`d.item_name LIKE ?`);
        params.push(qLike);
        }

        /** Location Filter */
        if (locTokens.length) {
        const groups = [];
        for (const tok of locTokens) {
            const like = `%${tok}%`;
            if (/^\d{4,6}$/.test(tok)) {
            groups.push(`(a.pincode LIKE ?)`);
            params.push(like);
            } else {
            groups.push(`(
                a.address_1 LIKE ? OR
                a.landmark LIKE ? OR
                a.item_state LIKE ? OR
                a.city LIKE ?
            )`);
            params.push(like, like, like, like);
            }
        }
        whereClauses.push(`(${groups.join(" AND ")})`);
        }

        /** =====================
         * Brand & Tag Filter
         * ===================== */
        if (brandSlug) {
        const [brand] = await pool.query(
            `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
            [brandSlug]
        );
        if (brand.length > 0) {
            whereClauses.push(`d.brand_id = ?`);
            params.push(brand[0].id);
        } else {
            // No valid brand → empty result
            return res.status(200).json({ products: [], total: 0 });
        }
        }

        if (tagSlug) {
        const [tag] = await pool.query(
            `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
            [tagSlug]
        );
        if (tag.length > 0) {
            whereClauses.push(`d.tag_id = ?`);
            params.push(tag[0].id);
        } else {
            return res.status(200).json({ products: [], total: 0 });
        }
        }

        /** Final WHERE */
        const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

        /** =====================
         * MAIN PRODUCT QUERY
         * ===================== */
        const [products] = await pool.query(
        `
        SELECT
            d.id,
            d.service_provider_id,
            d.item_name,
            d.category_id,
            d.sub_cat_id,
            d.image_ids,
            d.item_status,
            d.add_date,
            d.availability_status,
            d.price_per_day,
            d.brand_id,
            d.tag_id,
            a.registration_number,
            a.rental_period,
            a.address_1,
            a.landmark,
            a.item_state,
            a.city,
            a.pincode,
            b.brand_name,
            b.brand_slug,
            t.tag_name,
            t.tag_slug
        FROM roh_vehicle_details d
        LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
        LEFT JOIN roh_brands b ON d.brand_id = b.id
        LEFT JOIN roh_tags t ON d.tag_id = t.id
        ${whereSQL}
        ORDER BY
            CASE WHEN a.city = ? THEN 0 ELSE 1 END,
            d.add_date DESC,
            d.id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, userCity, limit, offset]
        );

        if (!products || products.length === 0) {
        return res.status(200).json({ products: [], total: 0 });
        }

        /** =====================
         * TOTAL COUNT
         * ===================== */
        const [[{ total }]] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM roh_vehicle_details d
        LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
        ${whereSQL}
        `,
        params
        );

        /** =====================
         * ENHANCE MEDIA GALLERY
         * ===================== */
        const enhancedProducts = await Promise.all(
        products.map(async (product) => {
            let imageIds = [];
            try {
            imageIds = JSON.parse(product.image_ids || "[]");
            } catch {
            console.warn("Invalid JSON for product id:", product.id);
            }

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

            return { ...product, media_gallery: mediaGallery };
        })
        );

        /** Final Response */
        return res.status(200).json({
        products: enhancedProducts,
        total,
        });
        } catch (error) {
            console.error("Error in getActivevehiclesCars:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Get all Active vehicles -- card on vehicles/commercial page - Coded by Vishnu Oct 31 2025 */
    this.getActiveCommercialVehicles = async (req, res) => {
     try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;

        const qRaw = (req.query.q || "").trim();
        const qLike = qRaw ? `%${qRaw}%` : null;

        const locRaw = (req.query.location || "").trim();
        const locTokens = locRaw ? locRaw.split(/\s+/).filter(Boolean) : [];

        const userCity = (req.query.user_city || "").trim();
        const brandSlug = (req.query.brand_slug || "").trim();
        const tagSlug = (req.query.tag_slug || "").trim();

        let whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`];
        let params = [];

        /** Only commercial vehicles (sub_cat_id = 4) */
        whereClauses.push(`d.sub_cat_id = ?`);
        params.push(4);

        /** Keyword Search */
        if (qLike) {
        whereClauses.push(`d.item_name LIKE ?`);
        params.push(qLike);
        }

        /** Location Filter */
        if (locTokens.length) {
        const groups = [];
        for (const tok of locTokens) {
            const like = `%${tok}%`;
            if (/^\d{4,6}$/.test(tok)) {
            groups.push(`(a.pincode LIKE ?)`);
            params.push(like);
            } else {
            groups.push(`(
                a.address_1 LIKE ? OR
                a.landmark LIKE ? OR
                a.item_state LIKE ? OR
                a.city LIKE ?
            )`);
            params.push(like, like, like, like);
            }
        }
        whereClauses.push(`(${groups.join(" AND ")})`);
        }

        /** =====================
         * Brand & Tag Filter
         * ===================== */
        if (brandSlug) {
        const [brand] = await pool.query(
            `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
            [brandSlug]
        );
        if (brand.length > 0) {
            whereClauses.push(`d.brand_id = ?`);
            params.push(brand[0].id);
        } else {
            // No valid brand → empty result
            return res.status(200).json({ products: [], total: 0 });
        }
        }

        if (tagSlug) {
        const [tag] = await pool.query(
            `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
            [tagSlug]
        );
        if (tag.length > 0) {
            whereClauses.push(`d.tag_id = ?`);
            params.push(tag[0].id);
        } else {
            return res.status(200).json({ products: [], total: 0 });
        }
        }

        /** Final WHERE */
        const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

        /** =====================
         * MAIN PRODUCT QUERY
         * ===================== */
        const [products] = await pool.query(
        `
        SELECT
            d.id,
            d.service_provider_id,
            d.item_name,
            d.category_id,
            d.sub_cat_id,
            d.image_ids,
            d.item_status,
            d.add_date,
            d.availability_status,
            d.price_per_day,
            d.brand_id,
            d.tag_id,
            a.registration_number,
            a.rental_period,
            a.address_1,
            a.landmark,
            a.item_state,
            a.city,
            a.pincode,
            b.brand_name,
            b.brand_slug,
            t.tag_name,
            t.tag_slug
        FROM roh_vehicle_details d
        LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
        LEFT JOIN roh_brands b ON d.brand_id = b.id
        LEFT JOIN roh_tags t ON d.tag_id = t.id
        ${whereSQL}
        ORDER BY
            CASE WHEN a.city = ? THEN 0 ELSE 1 END,
            d.add_date DESC,
            d.id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, userCity, limit, offset]
        );

        if (!products || products.length === 0) {
        return res.status(200).json({ products: [], total: 0 });
        }

        /** =====================
         * TOTAL COUNT
         * ===================== */
        const [[{ total }]] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM roh_vehicle_details d
        LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
        ${whereSQL}
        `,
        params
        );

        /** =====================
         * ENHANCE MEDIA GALLERY
         * ===================== */
        const enhancedProducts = await Promise.all(
        products.map(async (product) => {
            let imageIds = [];
            try {
            imageIds = JSON.parse(product.image_ids || "[]");
            } catch {
            console.warn("Invalid JSON for product id:", product.id);
            }

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

            return { ...product, media_gallery: mediaGallery };
        })
        );

        /** Final Response */
        return res.status(200).json({
        products: enhancedProducts,
        total,
        });
    } catch (error) {
        console.error("Error in getActivevehiclesCars:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    };

    /** Api to view single items - Coded by Vishnu August 30 2025 */
    this.getsingleListedItemsVie = async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await pool.query(
            `SELECT
                d.id,
                d.service_provider_id,
                d.item_name,
                d.sub_cat_id,
                d.vehicle_description,
                d.image_ids,
                d.model_id,
                d.price_per_day,
                d.security_deposit,
                d.booking_terms,
                d.availability_status,

                a.booking_instructions,
                a.item_state,
                a.city,
                a.pincode,
                a.engine_type,
                a.transmission_type,
                a.vehicle_condition,

                u.first_name,
                u.last_name,

                b.business_name,
                b.business_slug,
                YEAR(b.created_at) AS business_created_at,

                ba.street_address,
                ba.city AS business_city,

                -- MODEL DATA
                m.model_name,
                m.description AS model_description

            FROM roh_vehicle_details d

            LEFT JOIN roh_vehicle_attributes a
                ON d.id = a.vehicle_id

            LEFT JOIN roh_users u
                ON d.service_provider_id = u.user_id

            LEFT JOIN roh_user_business b
                ON d.service_provider_id = b.user_id

            LEFT JOIN roh_user_business_address ba
                ON d.service_provider_id = ba.user_id

            -- JOIN MODELS TABLE
            LEFT JOIN roh_models m
                ON d.model_id = m.id

            WHERE d.id = ?`,
            [id]
            );

            if (!result || result.length === 0) {
            return res.status(404).json({ message: "Item not found" });
            }

            const vehicle = result[0];

            /** Parse image_ids */
            let imageIds = [];
            try {
            imageIds = JSON.parse(vehicle.image_ids || "[]");
            if (!Array.isArray(imageIds)) imageIds = [];
            } catch (e) {
            console.warn("Invalid JSON in image_ids for vehicle id:", vehicle.id);
            }

            /** Fetch media */
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

            return res.status(200).json({
            ...vehicle,
            media_gallery: mediaGallery,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Api to get single category recent 4 post/blogs - Coded by Vishnu Oct 13 2025 */
    this.getSingleCategoryRecentPosts = async (req, res) => {
        try {
            const { cate_id, loc_id } = req.body;
            const limit = 4;

            let rows = [];

            /* ============================
            CASE 1: CATEGORY + LOCATION
            /cars/goa
            → ONLY exact match
            ============================ */
            if (cate_id && loc_id) {
            [rows] = await pool.query(
                `
                SELECT
                p.id,
                p.post_title,
                p.post_slug,
                p.post_excerpt,
                p.post_status,
                p.add_date,
                p.dynamic_slug,
                m.file_name AS post_image_name,
                m.file_path AS post_image_path
                FROM roh_posts p
                LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
                WHERE
                p.post_status = 'published'
                AND p.dynamic_cat_id = ?
                AND p.dynamic_loc_id = ?
                ORDER BY p.add_date DESC
                LIMIT ?
                `,
                [cate_id, loc_id, limit]
            );
            }

            /* ============================
            CASE 2: CATEGORY ONLY
            /cars
            ============================ */
            else if (cate_id && !loc_id) {
            [rows] = await pool.query(
                `
                SELECT
                p.id,
                p.post_title,
                p.post_slug,
                p.post_excerpt,
                p.post_status,
                p.add_date,
                p.dynamic_slug,
                m.file_name AS post_image_name,
                m.file_path AS post_image_path
                FROM roh_posts p
                LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
                WHERE
                p.post_status = 'published'
                AND p.dynamic_cat_id = ?
                AND p.dynamic_loc_id IS NULL
                ORDER BY p.add_date DESC
                LIMIT ?
                `,
                [cate_id, limit]
            );
            }

            /* ============================
            CASE 3: LOCATION ONLY
            /goa
            ============================ */
            else if (loc_id && !cate_id) {
            [rows] = await pool.query(
                `
                SELECT
                p.id,
                p.post_title,
                p.post_slug,
                p.post_excerpt,
                p.post_status,
                p.add_date,
                p.dynamic_slug,
                m.file_name AS post_image_name,
                m.file_path AS post_image_path
                FROM roh_posts p
                LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
                WHERE
                p.post_status = 'published'
                AND p.dynamic_loc_id = ?
                AND p.dynamic_cat_id IS NULL
                ORDER BY p.add_date DESC
                LIMIT ?
                `,
                [loc_id, limit]
            );
            } else {
            return res.status(400).json({
                status: false,
                message: "cate_id or loc_id is required",
            });
            }

            /* ============================
            FORMAT RESPONSE (INLINE)
            ============================ */
            const formattedResults = rows.map(post => {
            let excerpt = post.post_excerpt || "";
            const words = excerpt.split(" ");
            if (words.length > 12) {
                excerpt = words.slice(0, 12).join(" ") + " ...";
            }

            return {
                id: post.id,
                post_title: post.post_title,
                post_slug: post.post_slug,
                dynamic_slug: post.dynamic_slug,
                post_excerpt: excerpt,
                post_status: post.post_status,
                add_date: post.add_date,
                post_image_url: post.post_image_name
                ? post.post_image_path + post.post_image_name
                : null,
            };
            });

            return res.status(200).json({
            status: true,
            message: "Recent posts fetched successfully",
            data: formattedResults,
            });

        } catch (error) {
            console.error("Error in getSingleCategoryRecentPosts:", error);
            return res.status(500).json({
            status: false,
            message: "Internal server error",
            });
        }
    };

    /** Api to get single catregory recent 3 FAQs - Coded by Vishnu Oct 14 2025 */
    this.getSingleCategoryRecentFaqs = async (req, res) => {
        try {
            const { cate_id, loc_id } = req.body;
            const limit = 5;

            /* ============================
            CASE 1️⃣ : CATEGORY + LOCATION
            /cars/goa
            → ONLY exact match
            ============================ */
            if (cate_id && loc_id) {
            const [rows] = await pool.query(
                `
                SELECT id, title, description, dynamic_slug, add_date
                FROM roh_new_faqs
                WHERE active = 1
                AND dynamic_cat_id = ?
                AND dynamic_loc_id = ?
                ORDER BY add_date DESC
                LIMIT ?
                `,
                [cate_id, loc_id, limit]
            );

            return res.json({
                status: true,
                data: rows
            });
            }

            /* ============================
            CASE 2️⃣ : CATEGORY ONLY
            /cars
            ============================ */
            if (cate_id && !loc_id) {
            const [rows] = await pool.query(
                `
                SELECT id, title, description, dynamic_slug, add_date
                FROM roh_new_faqs
                WHERE active = 1
                AND dynamic_cat_id = ?
                AND dynamic_loc_id IS NULL
                ORDER BY add_date DESC
                LIMIT ?
                `,
                [cate_id, limit]
            );

            return res.json({
                status: true,
                data: rows
            });
            }

            /* ============================
            CASE 3️⃣ : LOCATION ONLY
            /goa
            ============================ */
            if (loc_id && !cate_id) {
            const [rows] = await pool.query(
                `
                SELECT id, title, description, dynamic_slug, add_date
                FROM roh_new_faqs
                WHERE active = 1
                AND dynamic_loc_id = ?
                AND dynamic_cat_id IS NULL
                ORDER BY add_date DESC
                LIMIT ?
                `,
                [loc_id, limit]
            );

            return res.json({
                status: true,
                data: rows
            });
            }

            return res.status(400).json({
            status: false,
            message: "Invalid FAQ request"
            });

        } catch (error) {
            console.error("FAQ Fetch Error:", error);
            return res.status(500).json({
            status: false,
            message: "Internal server error"
            });
        }
    };

    /** Api to create a new contact us entry - Coded by Vishnu Oct 14 2025 */
    this.createContactUsEntry = async (req, res) => {
        try {
            const { first_name, last_name, email, phone, subject, message, ip_address } = req.body;
            const full_name = `${first_name} ${last_name}`.trim();

            // === Insert into DB ===
            const query = `
            INSERT INTO roh_contact_us
            (full_name, email, phone, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(query, [
                full_name,
                email,
                phone,
                subject,
                message,
                ip_address || req.ip || "unknown",
            ]);

            // === Email HTML ===
            const htmlBody = `
            <div style="background:#f7f9fb;padding:40px 0;font-family:'Inter',Arial,sans-serif;">
                <table style="max-width:640px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e9f2;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                    <td style="background:#ffffff;border-bottom:3px solid #007BFF;padding:25px 30px;">
                    <h2 style="margin:0;color:#222;font-size:22px;font-weight:700;">
                        📩 New Contact Inquirie — <span style="color:#007BFF;">${subject}</span>
                    </h2>
                    <p style="margin:5px 0 0;color:#777;font-size:14px;">
                        Received from FindOnRent (ROH) Contact Form
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:30px;">
                    <h3 style="margin:0 0 15px;color:#007BFF;font-size:18px;">Contact Details</h3>
                    <table style="width:100%;border-collapse:collapse;font-size:15px;">
                        <tr><td style="padding:6px 0;font-weight:600;width:140px;">Full Name:</td><td>${first_name} ${last_name}</td></tr>
                        <tr><td style="padding:6px 0;font-weight:600;">Email:</td><td><a href="mailto:${email}" style="color:#007BFF;text-decoration:none;">${email}</a></td></tr>
                        <tr><td style="padding:6px 0;font-weight:600;">Phone:</td><td><a href="tel:${phone}" style="color:#222;text-decoration:none;">${phone}</a></td></tr>
                        <tr><td style="padding:6px 0;font-weight:600;">Subject:</td><td>${subject}</td></tr>
                    </table>
                    <div style="margin-top:25px;">
                        <h3 style="color:#007BFF;font-size:18px;margin-bottom:10px;">Message</h3>
                        <div style="background:#f8f9fa;padding:15px;border-radius:6px;border-left:4px solid #007BFF;line-height:1.6;color:#333;">
                        ${message.replace(/\n/g, "<br>")}
                        </div>
                    </div>
                    <p style="font-size:13px;color:#777;margin-top:25px;">
                        📍 IP Address: <strong>${ip_address || req.ip || "unknown"}</strong>
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="background:#f1f1f1;text-align:center;padding:15px;color:#555;font-size:13px;border-top:1px solid #e1e1e1;">
                    This email was automatically sent from
                    <strong style="color:#007BFF;">FindOnRent Contact Form</strong>.<br>
                    Please do not reply directly.
                    </td>
                </tr>
                </table>
                <div style="text-align:center;margin-top:25px;font-size:12px;color:#999;">
                © 2026 FindOnRent. All rights reserved.<br>
                Powered by <strong style="color:#007BFF;">WebDevOps Pvt Ltd</strong>
                </div>
            </div>
            `;

            // === Send via SendGrid ===
            /* await sgMail.send({
                to: process.env.TOEMAILS.split(',').filter(Boolean),
                cc: process.env.CCEMAILS ? process.env.CCEMAILS.split(',').filter(Boolean) : undefined,
                from: process.env.FROM_EMAIL,   // must be verified in SendGrid
                subject: `📨 New Contact Inquirie — ${subject}`,
                html: htmlBody,
            }); */

            /* ===============================
            💤 OLD GMAIL SMTP CODE (disabled)
            Uncomment this block to re-enable
            =============================== */


            const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            });

            await transporter.sendMail({
            from: `"FindOnRent Contact" <${process.env.SMTP_FROM}>`,
            to: process.env.TOEMAILS.split(',').filter(Boolean),
            cc: process.env.CCEMAILS ? process.env.CCEMAILS.split(',').filter(Boolean) : undefined,
            subject: `📨 New Contact Inquirie — ${subject}`,
            html: htmlBody,
            });

            // === Auto-Reply Logic for Specific Subjects (Vishnu April 18 2026) ===
            const autoReplySubjects = ["Vehicle Rental Support", "General Inquirie"];
            if (autoReplySubjects.includes(subject)) {
                // Delay auto-reply by 3 seconds to avoid server/SMTP load
                setTimeout(async () => {
                    const autoReplyHtml = `
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
                    <p style="margin:0 0 12px;">Hi <strong>${first_name}</strong>,</p>

                    <p style="margin:0 0 12px;">
                        Thank you for reaching out to us. We really appreciate your interest in
                        <strong>FindOnRent</strong>.
                    </p>

                    <p style="margin:0 0 12px;">
                        If this is your first time visiting <strong>FindOnRent.com</strong>,
                        please create your account using the link below:
                    </p>

                    <p style="margin:0 0 12px;">
                        <strong>Signup:</strong>
                        <a href="https://findonrent.com/register" target="_blank" style="color:#2563eb;text-decoration:none;" rel="noopener noreferrer">
                            https://findonrent.com/register
                        </a>
                    </p>

                    <p style="margin:0 0 12px;">
                        Once registered, please verify your account and log in here:
                    </p>

                    <p style="margin:0 0 12px;">
                        <strong>Login:</strong>
                        <a href="https://findonrent.com/login" target="_blank" style="color:#2563eb;text-decoration:none;" rel="noopener noreferrer">
                            https://findonrent.com/login
                        </a>
                    </p>

                    <p style="margin:0 0 12px;">
                        To rent a vehicle, select your city and choose the vehicle you need.
                        You can view listings and directly contact vendors for booking.
                    </p>

                    <p style="margin:0 0 12px;">
                        If you need any assistance, feel free to reply to this email.
                        We’ll be happy to help you.
                    </p>

                    <p style="margin:16px 0 4px;">
                        Warm regards,<br>
                        <strong>FindOnRent Team</strong>
                    </p>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">

                    <p style="font-size:12px;color:#6b7280;margin:0;">
                        This is an automated response from FindOnRent.
                        Please do not share your login credentials with anyone.
                    </p>
                </div>`;

                    try {
                        await transporter.sendMail({
                            from: `"FindOnRent Support" <${process.env.SMTP_FROM}>`,
                            to: email,
                            subject: `Re: ${subject} - Acknowledgement`,
                            html: autoReplyHtml,
                        });

                        // Update email_status to 'replied' in DB
                        if (result && result.insertId) {
                            await pool.query(
                                `UPDATE roh_contact_us SET email_status = 'replied' WHERE id = ?`,
                                [result.insertId]
                            );
                        }
                    } catch (emailError) {
                        console.error("❌ Auto-reply email failed:", emailError);
                    }
                }, 3000);
            }


            // === Response ===
            return res.status(200).json({
                success: true,
                message: "Contact entry created & email sent successfully.",
                data: result,
            });
        } catch (error) {
            console.error("❌ createContactUsEntry error:", error.response?.body || error);
            return res.status(500).json({
            success: false,
            message: "Internal server error",
            });
        }
    };

    /** Api to get all active blogs - Coded by Vishnu Oct 17 2025 */
    this.getAllActiveBlogs = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 21;
            const offset = (page - 1) * limit;

            const [rows] = await pool.query(`
            SELECT
                p.id,
                p.post_title,
                p.post_slug,
                p.post_excerpt,
                p.post_status,
                p.add_date,
                m.file_name,
                m.file_path,
                c.name AS category_name,
                c.slug AS category_slug
            FROM roh_posts AS p
            LEFT JOIN roh_media_gallery AS m ON p.post_img_id = m.id
            LEFT JOIN roh_categories AS c ON p.cate_id = c.id
            WHERE p.post_status = 'published'
            ORDER BY p.add_date DESC
            LIMIT ? OFFSET ?
            `, [limit, offset]);

            const [[{ total }]] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM roh_posts
            WHERE post_status = 'published'
            `);

            res.status(200).json({ data: rows, total });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    /** APi to get single blog - Coded by Vishnu Oct 18 2025 */
    this.getSingleBlog = async (req, res) => {
        try {
            const { slug } = req.body;

            if (!slug) {
            return res.status(400).json({
                status: false,
                message: "slug is required",
            });
            }

            /* ===========================
            FETCH MAIN BLOG
            =========================== */
            const [blogRows] = await pool.query(
            `
            SELECT
                p.id,
                p.post_title,
                p.post_slug,
                p.post_excerpt,
                p.description,
                p.post_status,
                p.add_date,
                p.edit_date,
                p.dynamic_cat_id,
                p.dynamic_loc_id,
                m.file_name,
                m.file_path
            FROM roh_posts p
            LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
            WHERE p.post_slug = ?
                AND p.post_status = 'published'
            LIMIT 1
            `,
            [slug]
            );

            if (!blogRows.length) {
            return res.status(404).json({
                status: false,
                message: "Blog not found",
            });
            }

            const blog = blogRows[0];

            /* ===========================
            BUILD RELATED WHERE CLAUSE
            =========================== */
            let whereClause = `p.post_status = 'published' AND p.post_slug != ?`;
            const params = [slug];

            // CASE 1: category + location (cars/goa)
            if (blog.dynamic_cat_id && blog.dynamic_loc_id) {
            whereClause += ` AND p.dynamic_cat_id = ? AND p.dynamic_loc_id = ?`;
            params.push(blog.dynamic_cat_id, blog.dynamic_loc_id);
            }
            // CASE 2: only category
            else if (blog.dynamic_cat_id) {
            whereClause += ` AND p.dynamic_cat_id = ? AND p.dynamic_loc_id IS NULL`;
            params.push(blog.dynamic_cat_id);
            }
            // CASE 3: only location
            else if (blog.dynamic_loc_id) {
            whereClause += ` AND p.dynamic_loc_id = ? AND p.dynamic_cat_id IS NULL`;
            params.push(blog.dynamic_loc_id);
            }

            /* ===========================
            FETCH RELATED BLOGS
            =========================== */
            const [relatedRows] = await pool.query(
            `
            SELECT
                p.id,
                p.post_title,
                p.post_slug,
                p.post_excerpt,
                p.add_date,
                m.file_name,
                m.file_path
            FROM roh_posts p
            LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
            WHERE ${whereClause}
            ORDER BY p.add_date DESC
            LIMIT 3
            `,
            params
            );

            /* ===========================
            RESPONSE
            =========================== */
            return res.status(200).json({
            status: true,
            blog: {
                id: blog.id,
                post_title: blog.post_title,
                post_slug: blog.post_slug,
                post_excerpt: blog.post_excerpt,
                description: blog.description,
                add_date: blog.add_date,
                edit_date: blog.edit_date ? new Date(blog.edit_date).toISOString(): null,
                dynamic_cat_id: blog.dynamic_cat_id,
                dynamic_loc_id: blog.dynamic_loc_id,
                file_name: blog.file_name || null,
                file_path: blog.file_path || null,
            },
            related: relatedRows.map((post) => ({
                id: post.id,
                post_title: post.post_title,
                post_slug: post.post_slug,
                post_excerpt: post.post_excerpt,
                add_date: post.add_date,
                file_name: post.file_name || null,
                file_path: post.file_path || null,
            })),
            });
        } catch (error) {
            console.error("Error fetching single blog:", error);
            return res.status(500).json({
            status: false,
            message: "Internal server error",
            });
        }
    };

    /** Api to get SEO Meta by Page Slug (Public API) - Coded by Vishnu Oct 21 2025 */
    this.GetPageMetaBySlug = async (req, res) => {
        try {
            let slug = req.body.slug || ""; /** now reading from body since it's POST */
            slug = decodeURIComponent(slug);

            if (!slug.startsWith("/")) {
            slug = "/" + slug; // ensure starts with /
            }

            const query = `
            SELECT
                page_slug,
                page_title,
                meta_description,
                meta_keywords,
                og_title,
                og_image,
                canonical_url,
                meta_schema,
                noindex,
                active
            FROM roh_seo_meta
            WHERE page_slug = ? AND active = 1
            LIMIT 1
            `;

            const [rows] = await pool.query(query, [slug]);

            if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Meta data not found for this page",
            });
            }

            return res.status(200).json({
            status: true,
            message: "Meta data fetched successfully",
            data: rows[0], //  return inside data
            });
        } catch (err) {
            console.error("Error fetching SEO meta:", err);
            return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message || err,
            });
        }
    };

    /** Api to get vehicles brands by category id - Coded by Vishnu Oct 31 2025 */
    this.getVehiclesBrands = async (req, res) => {
        try {
            const { cat_id, city_slug } = req.body;

            if (!cat_id || !city_slug) {
            return res.status(400).json({
                message: "Category ID and city slug are required",
            });
            }

            const [brands] = await pool.query(
            `
            SELECT DISTINCT
                b.id,
                b.brand_name,
                b.brand_slug,
                b.cat_id
            FROM roh_brands b
            INNER JOIN roh_vehicle_details v
                ON v.brand_id = b.id
            INNER JOIN roh_vehicle_attributes va
                ON va.vehicle_id = v.id
            WHERE b.cat_id = ?
                AND b.active = 1
                AND v.item_status = 1
                AND v.admin_item_status = 1
                AND va.city = ?
            ORDER BY b.brand_name ASC
            `,
            [cat_id, city_slug]
            );

            return res.status(200).json({ brands });
        } catch (error) {
            console.error("getVehiclesBrands error:", error);
            return res.status(500).json({
            message: "Internal server error",
            });
        }
    };

    /** Api to get vehicles brands by category id - Coded by Vishnu Feb 02 2026 */
    this.getVehiclesBrandsCatPg = async (req, res) => {
        try {
            const { cat_id } = req.body;

            if (!cat_id) {
                return res.status(400).json({
                    message: "Category ID is required",
                });
            }

            const [brands] = await pool.query(
                `
                SELECT DISTINCT
                    b.id,
                    b.brand_name,
                    b.brand_slug,
                    b.cat_id
                FROM roh_brands b
                INNER JOIN roh_vehicle_details v
                    ON v.brand_id = b.id
                INNER JOIN roh_vehicle_attributes va
                    ON va.vehicle_id = v.id
                WHERE b.cat_id = ?
                    AND b.active = 1
                    AND v.item_status = 1
                    AND v.admin_item_status = 1
                ORDER BY b.brand_name ASC
                `,
                [cat_id]
            );

            return res.status(200).json({ brands });
        } catch (error) {
            console.error("getVehiclesBrands error:", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    };

    /** Get Vehicle Tags by Category ID - Coded by Vishnu (Nov 01, 2025) */
    this.getVehiclesTags = async (req, res) => {
        try {
            const { cat_id } = req.body;
            if (!cat_id) {
                return res.status(400).json({ message: "Category ID required" });
            }

            const [models] = await pool.query(
                `SELECT id, tag_name, tag_slug, cat_id
                FROM roh_tags
                WHERE cat_id = ? AND active = ?`,
                [cat_id, 1]
            );

            if (models.length === 0) {
                return res.status(404).json({ message: "No active models found for this category" });
            }

            return res.status(200).json({ models });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Get Vehicles Models by brand_id or tag_id - Coded by Vishnu (Nov 01, 2025) */
    this.getVehiclesModels = async (req, res) => {
        try {
            const { brand_id, tag_id } = req.body;

            if (!brand_id && !tag_id) {
                return res.status(400).json({ message: "brand_id or tag_id is required" });
            }

            let query = `SELECT id, model_name, model_slug, brand_id, tag_id, active
                        FROM roh_models
                        WHERE active = 1`;
            const params = [];

            if (brand_id) {
                query += ` AND brand_id = ?`;
                params.push(brand_id);
            }

            if (tag_id) {
                query += ` AND tag_id = ?`;
                params.push(tag_id);
            }

            const [models] = await pool.query(query, params);

            if (models.length === 0) {
                return res.status(404).json({ message: "No active models found for the given filter" });
            }

            return res.status(200).json({ models });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Api to track item views - Coded by Vishnu (Nov 09, 2025) */
    this.trackItemView = async (req, res) => {
        try {
            const { item_id } = req.body;
            if (!item_id) return res.status(400).json({ message: "item_id required" });

            /** Prefer server authUser when available (middleware set), else accept client-sent user_id */
            const authUser = req.authUser || null;
            const bodyUserId = req.body.user_id ?? null;
            const user_id = authUser?.id || bodyUserId || null;

            /** Session: prefer cookie (if you set it), else accept client-sent session_id */
            let session_id = null;
            try {
            if (req.cookies && req.cookies.roh_session) {
                const s = JSON.parse(req.cookies.roh_session);
                session_id = s?.id || null;
            }
            } catch (e) { /* ignore */ }
            if (!session_id && req.body.session_id) session_id = req.body.session_id;

            /** IP: prefer x-forwarded-for or socket, else accept client-sent ip_address */
            let ip_address = null;
            try {
            ip_address =
                (req.headers['x-forwarded-for'] || "").split(',')[0]?.trim() ||
                req.socket?.remoteAddress ||
                null;
            } catch (e) { ip_address = null; }
            if ((!ip_address || ip_address === '::1') && req.body.ip_address) {
            ip_address = req.body.ip_address;
            }

            /** 24 hours window (server-time) */
            const HOURS = 24;
            const cutoffTime = new Date(Date.now() - HOURS * 60 * 60 * 1000);

            /** 1 minute window */
            // const MINUTES = 1;
            // const cutoffTime = new Date(Date.now() - MINUTES * 60 * 1000);

            /** 1) Find any existing row within 24 hours that matches by user OR session OR IP */
            const findQuery = `
            SELECT id, user_id, view_count
            FROM roh_item_vw_track
            WHERE item_id = ?
                AND (
                (user_id IS NOT NULL AND user_id = ?)
                OR (session_id IS NOT NULL AND session_id = ?)
                OR (ip_address IS NOT NULL AND ip_address = ?)
                )
                AND last_viewed_at >= ?
            LIMIT 1
            `;

            const findParams = [item_id, user_id, session_id, ip_address, cutoffTime];

            /** If your pool.query returns [rows, fields], unwrap accordingly */
            const existingRows = await pool.query(findQuery, findParams);
            /** support both mysql and mysql2-js return shapes: */
            const existing = Array.isArray(existingRows) && Array.isArray(existingRows[0]) ? existingRows[0] : existingRows;

            if (existing && existing.length > 0) {
            const row = existing[0];

            /** CASE A: existing row has no user attached, but now we have a logged-in user -> attach user and increment */
            if ((!row.user_id || row.user_id === 0) && user_id) {
                await pool.query(
                `UPDATE roh_item_vw_track
                SET user_id = ?, view_count = view_count + 1, last_viewed_at = NOW()
                WHERE id = ?`,
                [user_id, row.id]
                );

                return res.status(200).json({ message: "View updated (user attached)" });
            }

            /** CASE B: existing row has a different user_id than current logged-in user */
            if (row.user_id && user_id && Number(row.user_id) !== Number(user_id)) {
                /** treat as a different user => insert a new row for current user */
                await pool.query(
                `INSERT INTO roh_item_vw_track (item_id, user_id, session_id, ip_address, view_count, last_viewed_at)
                VALUES (?, ?, ?, ?, 1, NOW())`,
                [item_id, user_id, session_id, ip_address]
                );
                return res.status(200).json({ message: "New view recorded (different user)" });
            }

            /** CASE C: same user/session/ip — simply increment view_count and update timestamp */
            await pool.query(
                `UPDATE roh_item_vw_track
                SET view_count = view_count + 1, last_viewed_at = NOW()
                WHERE id = ?`,
                [row.id]
            );

            return res.status(200).json({ message: "View count updated" });
            }

            /** No recent existing row found -> insert new record */
            await pool.query(
            `INSERT INTO roh_item_vw_track
            (item_id, user_id, session_id, ip_address, view_count, last_viewed_at)
            VALUES (?, ?, ?, ?, 1, NOW())`,
            [item_id, user_id, session_id, ip_address]
            );

            return res.status(200).json({ message: "New view recorded" });
        } catch (error) {
            console.error("trackItemView error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    /** API to get the business details for the service provider page */
    this.getVendorDetails = async (req, res) => {
        const { slug } = req.params;
        const connection = await pool.getConnection();

        try {
            /* ===============================
            * 1. Fetch business by slug
            * =============================== */
            const [businessRows] = await connection.query(
                `SELECT * FROM roh_user_business WHERE business_slug = ? LIMIT 1`,
                [slug]
            );

            if (!businessRows.length) {
                return res.status(200).json({
                    success: false,
                    message: "Vendor not found",
                });
            }

            const business = businessRows[0];
            const businessId = business.id;
            const userId = business.user_id;

            /* ===============================
            * 1.1 MUST HAVE AT LEAST 1 ACTIVE ITEM
            * =============================== */
            const [[activeItemRow]] = await connection.query(
                `SELECT 1
                FROM roh_vehicle_details
                WHERE business_id = ?
                AND item_status = 1
                AND admin_item_status = 1
                LIMIT 1`,
                [businessId]
            );

            if (!activeItemRow) {
                return res.status(200).json({
                    success: false,
                    message: "Vendor not available",
                });
            }

            /* ===============================
            * 2. Fetch vendor user
            * =============================== */
            const [userRows] = await connection.query(
                `SELECT first_name, last_name, profile_picture_url, verified
                FROM roh_users
                WHERE user_id = ?
                LIMIT 1`,
                [userId]
            );

            const user = userRows[0] || null;
            const vendorName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : null;
            const isVerified = user ? user.verified : 0;

            /* ===============================
            * 3. Profile picture
            * =============================== */
            let vendorProfilePic = null;

            if (user?.profile_picture_url) {
                const [mediaRows] = await connection.query(
                    `SELECT file_name, file_path
                    FROM roh_media_gallery
                    WHERE id = ?
                    LIMIT 1`,
                    [user.profile_picture_url]
                );

                if (mediaRows.length) {
                    vendorProfilePic = {
                        file_name: mediaRows[0].file_name,
                        file_path: mediaRows[0].file_path,
                    };
                }
            }

            /* ===============================
            * 4. Address
            * =============================== */
            const [addressRows] = await connection.query(
                `SELECT street_address, landmark, city, state, pincode
                FROM roh_user_business_address
                WHERE user_id = ?
                LIMIT 1`,
                [userId]
            );

            const address = addressRows[0] || null;

            /* ===============================
            * 5. ONLY categories having
            *    at least 1 ACTIVE item
            * =============================== */
            const [catRows] = await connection.query(
                `SELECT DISTINCT
                    rel.category_id,
                    rel.sub_category_id,
                    cat.name     AS category_name,
                    subcat.name  AS sub_category_name
                FROM roh_business_cate_relat rel
                INNER JOIN roh_vehicle_details vd
                    ON vd.business_id = rel.business_id
                    AND vd.category_id = rel.category_id
                    AND vd.sub_cat_id  = rel.sub_category_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1
                INNER JOIN roh_categories cat
                    ON cat.id = rel.category_id
                INNER JOIN roh_categories subcat
                    ON subcat.id = rel.sub_category_id
                WHERE rel.business_id = ?
                AND rel.active = 1`,
                [businessId]
            );

            const categories = catRows.map(row => ({
                category_id: row.category_id,
                category_name: row.category_name,
                sub_category_id: row.sub_category_id,
                sub_category_name: row.sub_category_name,
            }));

            /* ===============================
            * 6. Fleet size
            * =============================== */
            const [[fleetRow]] = await connection.query(
                `SELECT COALESCE(SUM(fleet_size), 0) AS total_fleet_size
                FROM roh_vehicle_details
                WHERE business_id = ?
                AND item_status = 1
                AND admin_item_status = 1`,
                [businessId]
            );

            /* ===============================
            * 7. Final response
            * =============================== */
            return res.status(200).json({
                success: true,
                data: {
                    business_id: businessId,
                    business_name: business.business_name,
                    business_description: business.business_description,
                    feedback_unique_key: business.feedback_unique_key,
                    service_pr_id: business.user_id,

                    owner_name: vendorName,
                    is_verified: isVerified,
                    address,
                    categories,

                    total_fleet_size: fleetRow?.total_fleet_size || 0,
                    profile_picture: vendorProfilePic,
                },
            });

        } catch (error) {
            console.error("getVendorDetails error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        } finally {
            connection.release();
        }
    };

    /** API: Get Vendor Items by Business, Category & Subcategory */
    this.getVendorItemsByCategory = async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const { business_id, category_id, sub_category_id } = req.body || {};

            if (!business_id || !category_id || !sub_category_id) {
                return res.status(400).json({
                    success: false,
                    message: "business_id, category_id, and sub_category_id are required",
                });
            }

            const [items] = await connection.query(
                `SELECT
                    d.id,
                    d.service_provider_id,
                    d.business_id,
                    d.item_name,
                    d.category_id,
                    d.sub_cat_id,
                    d.image_ids,
                    d.price_per_day,
                    d.item_status,
                    d.admin_item_status,
                    d.availability_status,
                    d.add_date,
                    c.name AS category_name,
                    sc.name AS sub_category_name,
                    a.engine_type,
                    a.seating_capacity,
                    a.city,
                    a.item_state,
                    a.transmission_type
                FROM roh_vehicle_details d
                LEFT JOIN roh_categories c ON d.category_id = c.id
                LEFT JOIN roh_categories sc ON d.sub_cat_id = sc.id
                LEFT JOIN roh_vehicle_attributes a ON a.vehicle_id = d.id
                WHERE
                    d.business_id = ? AND
                    d.category_id = ? AND
                    d.sub_cat_id = ? AND
                    d.item_status = 1 AND
                    d.admin_item_status = 1

                ORDER BY d.add_date DESC, d.id DESC`,
                [business_id, category_id, sub_category_id]
                );


            if (!items || items.length === 0) {
            return res.status(200).json({ success: true, items: [] });
            }

            const enhancedItems = await Promise.all(
            items.map(async (product) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid JSON for product id:", product.id);
                }

                let mediaGallery = [];
                if (imageIds.length > 0) {
                const placeholders = imageIds.map(() => "?").join(",");
                const [mediaResult] = await connection.query(
                    `SELECT id, file_name, file_path
                    FROM roh_media_gallery
                    WHERE id IN (${placeholders})`,
                    imageIds
                );
                mediaGallery = mediaResult;
                }

                return {
                ...product,
                media_gallery: mediaGallery,
                };
            })
            );

            return res.status(200).json({
            success: true,
            items: enhancedItems,
            });
        } catch (error) {
            return res.status(500).json({
            success: false,
            message: "Internal server error",
            });
        } finally {
            connection.release();
        }
    };

    /** API: Get Vendor Items by Business Slug (Category-wise) - Coded by Raj Jan 16, 2026  */
    this.getVendorItems = async (req, res) => {
        const connection = await pool.getConnection();

        try {
            const { slug } = req.params || req.body || {};

            if (!slug) {
            return res.status(400).json({
                success: false,
                message: "business slug is required.",
            });
            }

            /** Get business_id from slug */
            const [[business]] = await connection.query(
            `SELECT id
            FROM roh_user_business
            WHERE business_slug = ?
            LIMIT 1`,
            [slug]
            );

            if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found.",
            });
            }

            const business_id = business.id;

            /** Fetch vendor items */
            const [items] = await connection.query(
            `SELECT
                d.id,
                d.service_provider_id,
                d.business_id,
                d.item_name,
                d.category_id,
                d.sub_cat_id,
                d.image_ids,
                d.price_per_day,
                d.item_status,
                d.admin_item_status,
                d.availability_status,
                d.add_date,
                c.name AS category_name,
                sc.name AS sub_category_name,
                a.engine_type,
                a.seating_capacity,
                a.city,
                a.item_state,
                a.transmission_type
                FROM roh_vehicle_details d
                LEFT JOIN roh_categories c ON d.category_id = c.id
                LEFT JOIN roh_categories sc ON d.sub_cat_id = sc.id
                LEFT JOIN roh_vehicle_attributes a ON a.vehicle_id = d.id
                WHERE
                d.business_id = ?
                AND d.item_status = 1
                AND d.admin_item_status = 1
                ORDER BY d.add_date DESC, d.id DESC`,
            [business_id]
            );

            if (!items || items.length === 0) {
            return res.status(200).json({
                success: true,
                categories: [],
            });
            }

            /** Attach media gallery */
            const enhancedItems = await Promise.all(
            items.map(async (product) => {
                let imageIds = [];

                try {
                imageIds = JSON.parse(product.image_ids || "[]");
                } catch {
                console.warn("Invalid image_ids JSON:", product.id);
                }

                let media_gallery = [];

                if (imageIds.length) {
                const placeholders = imageIds.map(() => "?").join(",");
                const [media] = await connection.query(
                    `SELECT id, file_name, file_path
                    FROM roh_media_gallery
                    WHERE id IN (${placeholders})`,
                    imageIds
                );
                media_gallery = media;
                }

                return {
                ...product,
                media_gallery,
                };
            })
            );

            /** Group items category-wise */
            const categoryMap = {};

            for (const item of enhancedItems) {
            if (!categoryMap[item.category_id]) {
                categoryMap[item.category_id] = {
                category_id: item.category_id,
                category_name: item.category_name,
                items: [],
                };
            }

            categoryMap[item.category_id].items.push(item);
            }

            return res.status(200).json({
            success: true,
            categories: Object.values(categoryMap),
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
            success: false,
            message: "Internal server error",
            });
        } finally {
            connection.release();
        }
    };

    /** Api to get all active blogs slugs - Coded by Vishnu Nov 25 2025 */
    this.getAllBlogSlugsOnly = async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT post_slug
                FROM roh_posts
                WHERE post_status = 'published'
            `);

            /** return as array of slugs */
            const slugs = rows.map(r => r.post_slug);

            res.status(200).json({ slugs });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    /** API to get the slugs for the pages */
    this.getSlugs = async (req, res) => {
        let connection;

        try {
            connection = await pool.getConnection();
            const { slug } = req.params;

                // Block invalid / internal slugs early
                if (!slug || slug === "_next" || slug.startsWith("_") || slug.includes(".")) {
                    return res.status(404).json({ success: false, message: "Invalid slug" });
                }

                const normalizedSlug = slug.trim().toLowerCase();

                const [rows] = await connection.query(`SELECT slug, cat_singular_name, type, entity_id FROM roh_slugs WHERE slug = ? AND status = 'active' LIMIT 1`, [normalizedSlug]);

                if (!rows || rows.length === 0) {
                    return res.status(200).json({ success: false, message: "Slug not found" });
                }

                let categoryName = '';
                if(rows[0].type == 'category') {
                    const categoryData = await connection.query(`SELECT name as categoryName FROM roh_categories WHERE id = ? LIMIT 1`, [rows[0].entity_id]);
                    categoryName = categoryData[0][0]?.categoryName || null;
                }

                return res.status(200).json({
                    success: true,
                    data: {
                        slug: rows[0].slug,
                        type: rows[0].type,
                        entityId: rows[0].entity_id,
                        categorySinName: rows[0].cat_singular_name,
                        categoryName: categoryName,
                    },
                });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        } finally {
            if (connection) connection.release();
        }
    };

    /** API to resolve category + location slugs - Coded by Raj – Dec 16, 2025 */
    this.getCategoryLocationSlugs = async (req, res) => {
        let connection;
        try {
            connection = await pool.getConnection();

            const { category, location } = req.query;

            if (!category || !location) {
            return res.status(400).json({
                success: false,
                message: "Category and Location slugs are required",
            });
            }

            const categorySlug = category.trim().toLowerCase();
            const locationSlug = location.trim().toLowerCase();

            if (categorySlug.includes(".") || locationSlug.includes(".")) {
            return res.status(404).json({
                success: false,
                message: "Invalid slug",
            });
            }

            /* ----------------------------------------
            STEP 1: CATEGORY SLUG → ID + NAME
            ---------------------------------------- */
            const [catRows] = await connection.query(
            `
            SELECT
                s.entity_id AS categoryId,
                c.name AS categoryName,
                s.cat_singular_name
            FROM roh_slugs s
            INNER JOIN roh_categories c ON c.id = s.entity_id
            WHERE s.slug = ?
                AND s.type = 'category'
                AND s.status = 'active'
            LIMIT 1
            `,
            [categorySlug]
            );

            if (!catRows.length) {
            return res.status(200).json({ success: false });
            }

            const {
            categoryId,
            categoryName,
            cat_singular_name: categorySinName,
            } = catRows[0];

            /* ----------------------------------------
            STEP 2: LOCATION SLUG → ID + CITY NAME
            ---------------------------------------- */
            const [locRows] = await connection.query(
            `
            SELECT
                s.entity_id AS locationId,
                c.city_name,
                c.city_desc
            FROM roh_slugs s
            INNER JOIN roh_cities c ON c.city_id = s.entity_id
            WHERE s.slug = ?
                AND s.type = 'location'
                AND s.status = 'active'
            LIMIT 1
            `,
            [locationSlug]
            );

            if (!locRows.length) {
            return res.status(200).json({ success: false });
            }

            const { locationId, city_name, city_desc } = locRows[0];

            /* ----------------------------------------
            SUCCESS RESPONSE
            ---------------------------------------- */
            return res.status(200).json({
            success: true,
            data: {
                categoryId,
                categoryName,
                categorySinName,
                categorySlug,
                locationId,
                cityName: city_name,
                cityDesc: city_desc,
                locationSlug,
            },
            });

        } catch (error) {
            console.error("getCategoryLocationSlugs error:", error);
            return res.status(500).json({
            success: false,
            message: "Internal server error",
            });
        } finally {
            if (connection) connection.release();
        }
    };

    /** API to resolve Category + Model + Location combo */
    this.resolveCategoryModelLocation = async (req, res) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const { category, model, location } = req.query;

            // 1. Basic validation
            if (!category || !model || !location) {
                return res.status(400).json({
                    success: false,
                    message: "Category, Model, and Location slugs are required",
                });
            }

            const categorySlug = category.trim().toLowerCase();
            const modelSlug = model.trim().toLowerCase();
            const locationSlug = location.trim().toLowerCase();

            if ([categorySlug, modelSlug, locationSlug].some(s => s.includes("."))) {
                return res.status(404).json({ success: false, message: "Invalid slug format" });
            }

            /* -----------------------------------------------------------
            The Updated Query: Checks both model_slug AND model_old_slug
            ----------------------------------------------------------- */
            const query = `
                SELECT
                    c.id AS categoryId,
                    c.name AS categoryName,
                    c.cat_singular_name AS categorySinName,
                    m.id AS modelId,
                    m.model_name AS modelName,
                    m.model_label AS modelLabel,
                    m.model_slug AS modelSlug,
                    m.model_old_slug AS modelOldSlug,
                    g.file_path AS imgPath,
                    g.file_name AS imgName,
                    l.city_id AS locationId,
                    l.city_name AS cityName,
                    l.city_slug AS locationSlug
                FROM roh_models m
                JOIN roh_brands b ON m.brand_id = b.id
                JOIN roh_categories c ON b.cat_id = c.id
                LEFT JOIN roh_media_gallery g ON m.model_img_id = g.id
                JOIN roh_cities l ON l.city_slug = ?
                WHERE c.slug = ?
                AND (m.model_slug = ? OR m.model_old_slug = ?)
                AND c.active = 1
                AND m.active = 1
                AND b.active = 1
                LIMIT 1
            `;

            // Note: We pass modelSlug twice to check both columns
            const [rows] = await connection.query(query, [
                locationSlug,
                categorySlug,
                modelSlug,
                modelSlug
            ]);

            if (!rows || rows.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "This specific model combination was not found in this location."
                });
            }

            const modelData = rows[0];

            // 3. Construct the Image URL
            let fullImageUrl = null;
            if (modelData.imgPath && modelData.imgName) {
                const path = modelData.imgPath.endsWith('/') ? modelData.imgPath : `${modelData.imgPath}/`;
                fullImageUrl = `${path}${modelData.imgName}`;
            }

            // Check if the user is using the old slug
            const isOldSlug = modelSlug === modelData.modelOldSlug?.toLowerCase();

            // 4. Success Response
            return res.status(200).json({
                success: true,
                data: {
                    ...modelData,
                    modelImageUrl: fullImageUrl,
                    isOldSlug: isOldSlug
                }
            });

        } catch (error) {
            console.error("resolveCategoryModelLocation error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        } finally {
            if (connection) connection.release();
        }
    };

    /** API to resolve the category model pages */
    this.resolveCategoryModel = async (req, res) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const { category, model } = req.query;

            // 1. Basic validation
            if (!category || !model) {
                return res.status(400).json({
                    success: false,
                    message: "Category and Model slugs are required",
                });
            }

            const categorySlug = category.trim().toLowerCase();
            const modelSlug = model.trim().toLowerCase();

            // 2. Prevent invalid slug formats
            if ([categorySlug, modelSlug].some(s => s.includes("."))) {
                return res.status(404).json({ success: false, message: "Invalid slug format" });
            }

            /* -----------------------------------------------------------
            The Updated Query: Checks both model_slug AND model_old_slug
            ----------------------------------------------------------- */
            const query = `
                SELECT
                    c.id AS categoryId,
                    c.name AS categoryName,
                    c.cat_singular_name AS categorySinName,
                    m.id AS modelId,
                    m.model_name AS modelName,
                    m.model_label AS modelLabel,
                    m.model_slug AS modelSlug,
                    m.model_old_slug AS modelOldSlug,
                    g.file_path AS imgPath,
                    g.file_name AS imgName
                FROM roh_models m
                JOIN roh_brands b ON m.brand_id = b.id
                JOIN roh_categories c ON b.cat_id = c.id
                LEFT JOIN roh_media_gallery g ON m.model_img_id = g.id
                WHERE c.slug = ?
                AND (m.model_slug = ? OR m.model_old_slug = ?)
                AND c.active = 1
                AND m.active = 1
                AND b.active = 1
                LIMIT 1
            `;

            // Pass modelSlug twice: once for current slug, once for old slug fallback
            const [rows] = await connection.query(query, [categorySlug, modelSlug, modelSlug]);

            if (!rows || rows.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "This model was not found in this category."
                });
            }

            const modelData = rows[0];

            // 3. Construct the Image URL
            let fullImageUrl = null;
            if (modelData.imgPath && modelData.imgName) {
                const path = modelData.imgPath.endsWith('/') ? modelData.imgPath : `${modelData.imgPath}/`;
                fullImageUrl = `${path}${modelData.imgName}`;
            }

            // 1. Check if the user is using the old slug (case-insensitive check)
            const isOldSlug = modelSlug === modelData.modelOldSlug?.toLowerCase();

            return res.status(200).json({
                success: true,
                data: {
                    ...modelData,
                    modelImageUrl: fullImageUrl,
                    categorySlug,
                    isOldSlug: isOldSlug
                }
            });

        } catch (error) {
            console.error("resolveCategoryModel error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        } finally {
            if (connection) connection.release();
        }
    };

    /** API to get the vehicles by category id - Coded by Raj Dec 16, 2025 */
    this.getActivevehiclesByCatId = async (req, res) => {
        try {
            /* ---------------- Pagination ---------------- */
            const page = parseInt(req.body.page, 10) || 1;
            const limit = parseInt(req.body.limit, 10) || 20;
            const offset = (page - 1) * limit;

            /* ---------------- Inputs ---------------- */
            const qRaw = (req.body.search_by || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const userCity = (req.body.user_city || "").trim();
            const brandSlug = (req.body.brand || "").trim();
            const subCatId = parseInt(req.body.cat_id, 10);

            if (!subCatId) {
                return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Validate Category ---------------- */
            const [catExists] = await pool.query(
                `SELECT id FROM roh_categories WHERE id = ? AND active = 1 LIMIT 1`, [subCatId]
            );

            if (!catExists.length) {
                return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- WHERE Builder ---------------- */
            const whereClauses = [`d.item_status = 1`, `d.admin_item_status = 1`, `d.sub_cat_id = ?`];
            const params = [subCatId];

            /* ---------------- Keyword Search ---------------- */
            if (qLike) {
                whereClauses.push(`(d.item_name LIKE ? OR b.brand_name LIKE ?)`);
                params.push(qLike, qLike);
            }

            /* ---------------- Brand Filter ---------------- */
            if (brandSlug) {
                const [brand] = await pool.query(`SELECT id FROM roh_brands WHERE brand_slug = ? AND cat_id = ? AND active = 1 LIMIT 1`, [brandSlug, subCatId]);

                if (!brand.length) {
                    return res.status(200).json({ products: [], total: 0 });
                }
                whereClauses.push(`d.brand_id = ?`);
                params.push(brand[0].id);
            }

            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /* ---------------- ORDER BY (City Priority) ---------------- */
            const orderBySQL = userCity ? `ORDER BY CASE WHEN a.city = ? THEN 0 ELSE 1 END, d.add_date DESC, d.id DESC` : `ORDER BY d.add_date DESC, d.id DESC`;

            const queryParams = userCity ? [...params, userCity, limit, offset] : [...params, limit, offset];

            /* ---------------- Main Query ---------------- */
            const [products] = await pool.query(
            `
                SELECT
                    d.id,
                    d.item_name,
                    d.sub_cat_id,
                    d.image_ids,
                    d.add_date,
                    d.availability_status,
                    d.price_per_day,

                    a.registration_number,
                    a.rental_period,
                    a.address_1,
                    a.landmark,
                    a.item_state,
                    a.city,
                    a.pincode,
                    a.transmission_type,

                    b.brand_name,
                    b.brand_slug,

                    u.first_name,
                    u.last_name,

                    c.business_name,
                    c.business_slug

                FROM roh_vehicle_details d
                LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
                LEFT JOIN roh_brands b ON d.brand_id = b.id

                LEFT JOIN roh_users u
                    ON u.user_id = d.service_provider_id

                LEFT JOIN roh_user_business c
                    ON c.user_id = d.service_provider_id

                ${whereSQL}
                ${orderBySQL}
                LIMIT ? OFFSET ?
            `,
            queryParams
            );


            if (!products.length) {
                return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Total Count ---------------- */
            const [[{ total }]] = await pool.query(
                `SELECT COUNT(*) AS total FROM roh_vehicle_details d
                LEFT JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
                LEFT JOIN roh_brands b ON d.brand_id = b.id
                ${whereSQL}`, params
            );

            /* ---------------- Media Gallery ---------------- */
            const enhancedProducts = await Promise.all(
                products.map(async (p) => {
                    let imageIds = [];
                    try {
                        imageIds = JSON.parse(p.image_ids || "[]");
                    } catch {}

                    let media_gallery = [];
                    if (imageIds.length) {
                        const placeholders = imageIds.map(() => "?").join(",");
                        const [media] = await pool.query(
                            `
                            SELECT id, file_name, file_path
                            FROM roh_media_gallery
                            WHERE id IN (${placeholders})
                            `, imageIds
                        );
                        media_gallery = media;
                    }

                    return { ...p, media_gallery };
                })
            );

            /* ---------------- Response ---------------- */
            return res.status(200).json({
                products: enhancedProducts,
                total,
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** API to get latest vehicles per sub-category by location - Coded by Raj – Dec 16, 2025*/
    this.getallvehiclesByLocSlug = async (req, res) => {
        try {
            const {
            loc_slug = "",
            page = 1,
            limit = 4,
            q = "",
            brand_slug = "",
            tag_slug = "",
            } = req.body;

            if (!loc_slug) {
            return res.status(200).json({ success: true, categories: [] });
            }

            const offset = (page - 1) * limit;
            const qLike = q ? `%${q.trim()}%` : null;

            /* -------- MAIN CATEGORIES -------- */
            const [mainCategories] = await pool.query(`
            SELECT id, name, slug
            FROM roh_categories
            WHERE parent_category_id IS NULL AND active = 1
            `);

            const finalResponse = [];

            for (const mainCat of mainCategories) {
            const [subCategories] = await pool.query(
                `SELECT id, name, slug
                FROM roh_categories
                WHERE parent_category_id = ? AND active = 1 AND cate_available = 1`,
                [mainCat.id]
            );

            const subCategoryBlocks = [];

            for (const subCat of subCategories) {
                let where = `
                d.item_status = 1
                AND d.admin_item_status = 1
                AND LOWER(a.city) = LOWER(?)
                AND d.sub_cat_id = ?
                `;
                let params = [loc_slug, subCat.id];

                /* 🔍 SEARCH */
                if (qLike) {
                where += ` AND (
                    d.item_name LIKE ?
                    OR b.brand_name LIKE ?
                    OR t.tag_name LIKE ?
                )`;
                params.push(qLike, qLike, qLike);
                }

                /* 🏷 BRAND */
                if (brand_slug) {
                const [[brand]] = await pool.query(
                    `SELECT id FROM roh_brands WHERE brand_slug = ? AND active = 1 LIMIT 1`,
                    [brand_slug]
                );
                if (!brand) continue;
                where += ` AND d.brand_id = ?`;
                params.push(brand.id);
                }

                /* 🏷 TAG */
                if (tag_slug) {
                const [[tag]] = await pool.query(
                    `SELECT id FROM roh_tags WHERE tag_slug = ? AND active = 1 LIMIT 1`,
                    [tag_slug]
                );
                if (!tag) continue;
                where += ` AND d.tag_id = ?`;
                params.push(tag.id);
                }

                const [products] = await pool.query(
                `
                SELECT
                    d.id,
                    d.item_name,
                    d.image_ids,
                    d.price_per_day,
                    d.add_date,
                    d.availability_status,

                    a.city,
                    a.address_1,
                    a.transmission_type,

                    b.brand_name,
                    t.tag_name,

                    u.first_name,
                    u.last_name,

                    ub.business_slug,
                    ub.business_name

                FROM roh_vehicle_details d

                LEFT JOIN roh_vehicle_attributes a
                    ON d.id = a.vehicle_id

                LEFT JOIN roh_brands b
                    ON d.brand_id = b.id

                LEFT JOIN roh_tags t
                    ON d.tag_id = t.id

                LEFT JOIN roh_users u
                    ON u.user_id = d.service_provider_id

                LEFT JOIN roh_user_business ub
                    ON ub.id = d.business_id

                WHERE ${where}
                ORDER BY d.add_date DESC
                LIMIT ? OFFSET ?
                `,
                [...params, limit, offset]
                );



                if (!products.length) continue;

                /* 🖼 MEDIA */
                const enhanced = await Promise.all(
                products.map(async (p) => {
                    let ids = [];
                    try { ids = JSON.parse(p.image_ids || "[]"); } catch {}
                    if (!ids.length) return { ...p, media_gallery: [] };

                    const [media] = await pool.query(
                    `SELECT id, file_name, file_path
                    FROM roh_media_gallery
                    WHERE id IN (${ids.map(() => "?").join(",")})`,
                    ids
                    );

                    return { ...p, media_gallery: media };
                })
                );

                subCategoryBlocks.push({
                sub_cat_id: subCat.id,
                sub_cat_name: subCat.name,
                sub_cat_slug: subCat.slug,
                products: enhanced,
                });
            }

            if (subCategoryBlocks.length) {
                finalResponse.push({
                category_id: mainCat.id,
                category_name: mainCat.name,
                category_slug: mainCat.slug,
                sub_categories: subCategoryBlocks,
                });
            }
            }

            return res.status(200).json({
            success: true,
            location: loc_slug,
            categories: finalResponse,
            });

        } catch (err) {
            console.error("getallvehiclesByLocSlug error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    };

    /** API to get the vehicles by location and categorty - Coded by Raj – Dec 17, 2025*/
    this.getvehiclesByCategoryAndLocation = async (req, res) => {
        try {
            /* ---------------- Pagination ---------------- */
            const page = parseInt(req.body.page, 10) || 1;
            const limit = parseInt(req.body.limit, 10) || 20;
            const offset = (page - 1) * limit;

            /* ---------------- Inputs ---------------- */
            const qRaw = (req.body.search_by || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const brandSlug = (req.body.brand || "").trim();
            const locationSlug = (req.body.location_slug || "").trim(); // USE SLUG DIRECTLY
            const subCatId = parseInt(req.body.cat_id, 10);

            if (!subCatId) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Validate Category ---------------- */
            const [catExists] = await pool.query(
            `SELECT id FROM roh_categories WHERE id = ? AND active = 1 LIMIT 1`,
            [subCatId]
            );

            if (!catExists.length) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- WHERE Builder ---------------- */
            const whereClauses = [
            `d.item_status = 1`,
            `d.admin_item_status = 1`,
            `d.sub_cat_id = ?`,
            ];
            const params = [subCatId];

            /* ---------------- Keyword Search ---------------- */
            if (qLike) {
            whereClauses.push(`(d.item_name LIKE ? OR b.brand_name LIKE ?)`);
            params.push(qLike, qLike);
            }

            /* ---------------- Brand Filter ---------------- */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands
                WHERE brand_slug = ? AND cat_id = ? AND active = 1 LIMIT 1`,
                [brandSlug, subCatId]
            );

            if (!brand.length) {
                return res.status(200).json({ products: [], total: 0 });
            }

            whereClauses.push(`d.brand_id = ?`);
            params.push(brand[0].id);
            }

            /* ---------------- Location Filter (FIXED) ---------------- */
            if (locationSlug) {
            // slug-to-slug comparison (NO city_name)
            whereClauses.push(`LOWER(a.city) = LOWER(?)`);
            params.push(locationSlug);
            }

            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /* ---------------- Main Query ---------------- */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.item_name,
                d.sub_cat_id,
                d.image_ids,
                d.add_date,
                d.availability_status,
                d.price_per_day,

                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                a.transmission_type,

                b.brand_name,
                b.brand_slug,

                u.first_name,
                u.last_name,

                ub.business_slug,
                ub.business_name
            FROM roh_vehicle_details d
            INNER JOIN roh_vehicle_attributes a
                ON d.id = a.vehicle_id   -- INNER JOIN (intentional)
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_users u ON u.user_id = d.service_provider_id
            LEFT JOIN roh_user_business ub ON ub.user_id = d.service_provider_id
            ${whereSQL}
            ORDER BY d.add_date DESC, d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, limit, offset]
            );

            if (!products.length) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Total Count ---------------- */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            INNER JOIN roh_vehicle_attributes a
                ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            ${whereSQL}
            `,
            params
            );

            /* ---------------- Media Gallery ---------------- */
            const enhancedProducts = await Promise.all(
            products.map(async (p) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(p.image_ids || "[]");
                } catch {}

                let media_gallery = [];
                if (imageIds.length) {
                const placeholders = imageIds.map(() => "?").join(",");
                const [media] = await pool.query(
                    `SELECT id, file_name, file_path
                    FROM roh_media_gallery
                    WHERE id IN (${placeholders})`,
                    imageIds
                );
                media_gallery = media;
                }

                return { ...p, media_gallery };
            })
            );

            /* ---------------- Response ---------------- */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });

        } catch (error) {
            console.error("getvehiclesByCategoryAndLocation error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** API to get the vehicles by location and categorty - Coded by Raj – Dec 17, 2025*/
    this.getvehiclesByCategoryModelAndLocation = async (req, res) => {
        try {
            /* ---------------- Pagination ---------------- */
            const page = parseInt(req.body.page, 10) || 1;
            const limit = parseInt(req.body.limit, 10) || 20;
            const offset = (page - 1) * limit;

            /* ---------------- Inputs ---------------- */
            const qRaw = (req.body.search_by || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const brandSlug = (req.body.brand || "").trim();
            const locationSlug = (req.body.location_slug || "").trim(); // USE SLUG DIRECTLY
            const subCatId = parseInt(req.body.cat_id, 10);
            const modelId = parseInt(req.body.model_id);

            if (!subCatId) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Validate Category ---------------- */
            const [catExists] = await pool.query(
            `SELECT id FROM roh_categories WHERE id = ? AND active = 1 LIMIT 1`,
            [subCatId]
            );

            if (!catExists.length) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- WHERE Builder ---------------- */
            const whereClauses = [
            `d.item_status = 1`,
            `d.admin_item_status = 1`,
            `d.sub_cat_id = ?`,
            ];
            const params = [subCatId];

            if (modelId && !isNaN(modelId)) {
                whereClauses.push(`d.model_id = ?`);
                params.push(modelId);
            }

            /* ---------------- Keyword Search ---------------- */
            if (qLike) {
            whereClauses.push(`(d.item_name LIKE ? OR b.brand_name LIKE ?)`);
            params.push(qLike, qLike);
            }

            /* ---------------- Brand Filter ---------------- */
            if (brandSlug) {
            const [brand] = await pool.query(
                `SELECT id FROM roh_brands
                WHERE brand_slug = ? AND cat_id = ? AND active = 1 LIMIT 1`,
                [brandSlug, subCatId]
            );

            if (!brand.length) {
                return res.status(200).json({ products: [], total: 0 });
            }

            whereClauses.push(`d.brand_id = ?`);
            params.push(brand[0].id);
            }

            /* ---------------- Location Filter (FIXED) ---------------- */
            if (locationSlug) {
            // slug-to-slug comparison (NO city_name)
            whereClauses.push(`LOWER(a.city) = LOWER(?)`);
            params.push(locationSlug);
            }

            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /* ---------------- Main Query ---------------- */
            const [products] = await pool.query(
            `
            SELECT
                d.id,
                d.item_name,
                d.sub_cat_id,
                d.image_ids,
                d.add_date,
                d.availability_status,
                d.price_per_day,

                a.registration_number,
                a.rental_period,
                a.address_1,
                a.landmark,
                a.item_state,
                a.city,
                a.pincode,
                a.transmission_type,

                b.brand_name,
                b.brand_slug,

                u.first_name,
                u.last_name,

                ub.business_slug,
                ub.business_name,
                ub.id as business_id
            FROM roh_vehicle_details d
            INNER JOIN roh_vehicle_attributes a
                ON d.id = a.vehicle_id   -- INNER JOIN (intentional)
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            LEFT JOIN roh_users u ON u.user_id = d.service_provider_id
            LEFT JOIN roh_user_business ub ON ub.user_id = d.service_provider_id
            ${whereSQL}
            ORDER BY d.add_date DESC, d.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, limit, offset]
            );

            if (!products.length) {
            return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Total Count ---------------- */
            const [[{ total }]] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM roh_vehicle_details d
            INNER JOIN roh_vehicle_attributes a
                ON d.id = a.vehicle_id
            LEFT JOIN roh_brands b ON d.brand_id = b.id
            ${whereSQL}
            `,
            params
            );

            /* ---------------- Media Gallery ---------------- */
            const enhancedProducts = await Promise.all(
            products.map(async (p) => {
                let imageIds = [];
                try {
                imageIds = JSON.parse(p.image_ids || "[]");
                } catch {}

                let media_gallery = [];
                if (imageIds.length) {
                const placeholders = imageIds.map(() => "?").join(",");
                const [media] = await pool.query(
                    `SELECT id, file_name, file_path
                    FROM roh_media_gallery
                    WHERE id IN (${placeholders})`,
                    imageIds
                );
                media_gallery = media;
                }

                return { ...p, media_gallery };
            })
            );

            /* ---------------- Response ---------------- */
            return res.status(200).json({
            products: enhancedProducts,
            total,
            });

        } catch (error) {
            console.error("getvehiclesByCategoryAndLocation error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Api to get the vehicles by category and model - Coded by Raj Feb 06, 2026 */
    this.getvehiclesByCategoryAndModel = async (req, res) => {
        try {
            /* ---------------- Pagination ---------------- */
            const page = parseInt(req.body.page, 10) || 1;
            const limit = parseInt(req.body.limit, 10) || 28; // Matching your frontend limit
            const offset = (page - 1) * limit;

            /* ---------------- Inputs ---------------- */
            const qRaw = (req.body.search_by || "").trim();
            const qLike = qRaw ? `%${qRaw}%` : null;

            const subCatId = parseInt(req.body.cat_id, 10);
            const modelId = parseInt(req.body.model_id, 10);
            const userCity = (req.body.user_city || "").trim();

            if (!subCatId || !modelId) {
                return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Validate Category ---------------- */
            const [catExists] = await pool.query(
                `SELECT id FROM roh_categories WHERE id = ? AND active = 1 LIMIT 1`,
                [subCatId]
            );

            if (!catExists.length) {
                return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- WHERE Builder ---------------- */
            const whereClauses = [
                `d.item_status = 1`,
                `d.admin_item_status = 1`,
                `d.sub_cat_id = ?`,
                `d.model_id = ?` // Mandatory for this function
            ];
            const params = [subCatId, modelId];

            /* ---------------- Keyword Search ---------------- */
            if (qLike) {
                whereClauses.push(`(d.item_name LIKE ? OR b.brand_name LIKE ?)`);
                params.push(qLike, qLike);
            }

            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;

            /* ---------------- ORDER BY (City Priority) ---------------- */
            const orderBySQL = userCity ? `ORDER BY CASE WHEN a.city = ? THEN 0 ELSE 1 END, d.add_date DESC, d.id DESC` : `ORDER BY d.add_date DESC, d.id DESC`;

            const queryParams = userCity ? [...params, userCity, limit, offset] : [...params, limit, offset];

            /* ---------------- Main Query ---------------- */
            const [products] = await pool.query(
                `
                SELECT
                    d.id,
                    d.item_name,
                    d.sub_cat_id,
                    d.image_ids,
                    d.add_date,
                    d.availability_status,
                    d.price_per_day,
                    a.registration_number,
                    a.rental_period,
                    a.address_1,
                    a.landmark,
                    a.item_state,
                    a.city,
                    a.pincode,
                    a.transmission_type,
                    b.brand_name,
                    b.brand_slug,
                    u.first_name,
                    u.last_name,
                    ub.business_slug,
                    ub.business_name,
                    ub.id as business_id
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
                LEFT JOIN roh_brands b ON d.brand_id = b.id
                LEFT JOIN roh_users u ON u.user_id = d.service_provider_id
                LEFT JOIN roh_user_business ub ON ub.user_id = d.service_provider_id

                ${whereSQL}
                ${orderBySQL}

                LIMIT ? OFFSET ?
                `,
                queryParams
            );
            // const [products] = await pool.query(
            //     `
            //     SELECT
            //         d.id,
            //         d.item_name,
            //         d.sub_cat_id,
            //         d.image_ids,
            //         d.add_date,
            //         d.availability_status,
            //         d.price_per_day,
            //         a.registration_number,
            //         a.rental_period,
            //         a.address_1,
            //         a.landmark,
            //         a.item_state,
            //         a.city,
            //         a.pincode,
            //         a.transmission_type,
            //         b.brand_name,
            //         b.brand_slug,
            //         u.first_name,
            //         u.last_name,
            //         ub.business_slug,
            //         ub.business_name,
            //         ub.id as business_id
            //     FROM roh_vehicle_details d
            //     INNER JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
            //     LEFT JOIN roh_brands b ON d.brand_id = b.id
            //     LEFT JOIN roh_users u ON u.user_id = d.service_provider_id
            //     LEFT JOIN roh_user_business ub ON ub.user_id = d.service_provider_id
            //     ${whereSQL}

            //     ORDER BY d.add_date DESC, d.id DESC

            //     LIMIT ? OFFSET ?

            //     `,
            //     [...params, limit, offset]
            // );

            if (!products.length) {
                return res.status(200).json({ products: [], total: 0 });
            }

            /* ---------------- Total Count ---------------- */
            const [[{ total }]] = await pool.query(
                `
                SELECT COUNT(*) AS total
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a ON d.id = a.vehicle_id
                LEFT JOIN roh_brands b ON d.brand_id = b.id
                ${whereSQL}
                `,
                params
            );

            /* ---------------- Media Gallery (Mapping images) ---------------- */
            const enhancedProducts = await Promise.all(
                products.map(async (p) => {
                    let imageIds = [];
                    try {
                        imageIds = JSON.parse(p.image_ids || "[]");
                    } catch {}

                    let media_gallery = [];
                    if (imageIds.length) {
                        const placeholders = imageIds.map(() => "?").join(",");
                        const [media] = await pool.query(
                            `SELECT id, file_name, file_path
                            FROM roh_media_gallery
                            WHERE id IN (${placeholders})`,
                            imageIds
                        );
                        media_gallery = media;
                    }
                    return { ...p, media_gallery };
                })
            );

            /* ---------------- Response ---------------- */
            return res.status(200).json({
                products: enhancedProducts,
                total,
            });

        } catch (error) {
            console.error("getvehiclesByCategoryAndModel error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Api to get all active vendors - Coded by Vishnu Dec 17, 2025 */
    this.getAllActiveVendors = async (req, res) => {
        try {
            const {
                vendors,
                page = 1,
                limit = 9,
                query = "",
                city = "",
                user_city = "",
                sort_by= "latest"
            } = req.body;

            if (!vendors) {
                return res.status(400).json({ success: false, message: "Invalid request" });
            }

            const currentPage = Number(page);
            const perPage = Number(limit);
            const offset = (currentPage - 1) * perPage;

            const searchKeyword = `%${query.trim()}%`;
            const cityKeyword = `%${city.trim()}%`;

            let orderByClause = `ORDER BY CASE WHEN addr.city = ? THEN 0 ELSE 1 END,`;

            // Decide sorting
            if (sort_by === "alphabetical") {
                orderByClause += ` b.business_name ASC `;
            } else {
                orderByClause += ` b.created_at DESC `;
            }

            /* ============================================
            TOTAL COUNT (ONLY VENDORS WITH ≥1 ACTIVE ITEM)
            ============================================== */
            const [[{ total }]] = await pool.query(
                `
                SELECT COUNT(DISTINCT u.user_id) AS total
                FROM roh_users u
                INNER JOIN roh_user_business b ON b.user_id = u.user_id

                INNER JOIN roh_vehicle_details vd
                    ON vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1

                LEFT JOIN roh_user_business_address addr ON addr.user_id = u.user_id
                LEFT JOIN roh_slugs sl ON sl.slug = addr.city
                LEFT JOIN roh_business_cate_relat rel ON rel.user_id = u.user_id AND rel.active = 1
                LEFT JOIN roh_categories cat ON cat.id = rel.category_id AND cat.active = 1
                LEFT JOIN roh_categories subcat ON subcat.id = rel.sub_category_id AND subcat.active = 1

                WHERE u.active = 1
                AND u.is_service_provider = 1
                AND (
                    b.business_name LIKE ?
                    OR CONCAT(u.first_name,' ',u.last_name) LIKE ?
                    OR addr.city LIKE ?
                    OR addr.state LIKE ?
                    OR cat.name LIKE ?
                    OR subcat.name LIKE ?
                )
                AND addr.city LIKE ?
                `,
                [
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    cityKeyword,
                ]
            );

            /* =================
            PAGINATED VENDOR IDS
            =================== */
            const [vendorIds] = await pool.query(
                `
                SELECT DISTINCT
                    u.user_id,
                    b.business_name,
                    b.business_description,
                    b.created_at,
                    addr.city
                FROM roh_users u
                INNER JOIN roh_user_business b ON b.user_id = u.user_id

                INNER JOIN roh_vehicle_details vd
                    ON vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1

                LEFT JOIN roh_user_business_address addr ON addr.user_id = u.user_id
                LEFT JOIN roh_slugs sl ON sl.slug = addr.city
                LEFT JOIN roh_business_cate_relat rel ON rel.user_id = u.user_id AND rel.active = 1
                LEFT JOIN roh_categories cat ON cat.id = rel.category_id AND cat.active = 1
                LEFT JOIN roh_categories subcat ON subcat.id = rel.sub_category_id AND subcat.active = 1

                WHERE u.active = 1
                AND u.is_service_provider = 1
                AND (
                    b.business_name LIKE ?
                    OR CONCAT(u.first_name,' ',u.last_name) LIKE ?
                    OR addr.city LIKE ?
                    OR addr.state LIKE ?
                    OR cat.name LIKE ?
                    OR subcat.name LIKE ?
                )
                AND addr.city LIKE ?

                ${orderByClause}

                LIMIT ? OFFSET ?
                `,
                [
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    searchKeyword,
                    cityKeyword,
                    user_city,
                    perPage,
                    offset,
                ]
            );
            const userIds = vendorIds.map(v => v.user_id);

            if (!userIds.length) {
                return res.json({
                    success: true,
                    vendors: [],
                    pagination: {
                        total,
                        page: currentPage,
                        limit: perPage,
                        totalPages: Math.ceil(total / perPage),
                    },
                });
            }

            /* =============
            MAIN DATA QUERY
            ============== */
            const [rows] = await pool.query(
                `
                SELECT
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.verified,
                    b.business_name,
                    b.business_description,
                    b.business_slug,
                    addr.city,
                    addr.state,
                    sl.cat_singular_name AS locationName,
                    cat.name AS category_name,
                    subcat.name AS sub_category_name,
                    mg.file_path,
                    mg.file_name,
                    vp.min_price_per_day
                FROM roh_users u
                INNER JOIN roh_user_business b ON b.user_id = u.user_id
                LEFT JOIN roh_user_business_address addr ON addr.user_id = u.user_id
                LEFT JOIN roh_slugs sl ON sl.slug = addr.city
                LEFT JOIN roh_business_cate_relat rel ON rel.user_id = u.user_id AND rel.active = 1
                LEFT JOIN roh_categories cat ON cat.id = rel.category_id AND cat.active = 1
                LEFT JOIN roh_categories subcat ON subcat.id = rel.sub_category_id AND subcat.active = 1
                LEFT JOIN roh_media_gallery mg ON mg.id = u.profile_picture_url

                LEFT JOIN (
                    SELECT
                        service_provider_id,
                        MIN(price_per_day) AS min_price_per_day
                    FROM roh_vehicle_details
                    WHERE item_status = 1
                    AND admin_item_status = 1
                    AND price_per_day > 0
                    GROUP BY service_provider_id
                ) vp ON vp.service_provider_id = u.user_id

                WHERE u.user_id IN (?)
                ORDER BY FIELD(u.user_id, ${userIds.join(",")})
                `,
                [userIds]
            );

            /* ===========
            GROUP RESPONSE
            ============ */

            const vendorsMap = new Map();

            rows.forEach(row => {

                if (!vendorsMap.has(row.user_id)) {
                    vendorsMap.set(row.user_id, {
                        user_id: row.user_id,
                        first_name: row.first_name?.trim(),
                        last_name: row.last_name?.trim(),
                        business_name: row.business_name?.trim(),

                        business_description: row.business_description
                            ? row.business_description
                                .trim()
                                .split(/\s+/)
                                .slice(0, 20)
                                .join(" ") +
                            (row.business_description.trim().split(/\s+/).length > 20 ? " ..." : "")
                            : null,

                        business_slug: row.business_slug,
                        is_verified: row.verified || 0,
                        city: row.city?.trim(),
                        locationName: row.locationName?.trim() || row.city,
                        state: row.state?.trim(),

                        profile_image:
                            row.file_path && row.file_name
                                ? `${row.file_path}${row.file_name}`
                                : null,

                        min_price_per_day: row.min_price_per_day ?? null,
                        categories: [],
                    });
                }

                if (row.sub_category_name) {
                    vendorsMap.get(row.user_id).categories.push({
                        category_name: row.category_name,
                        sub_category_name: row.sub_category_name,
                    });
                }
            });


            /* ================================
            SORT CATEGORIES INSIDE EACH VENDOR
            ================================== */

            Array.from(vendorsMap.values()).forEach(vendor => {
                vendor.categories.sort((a, b) =>
                    a.sub_category_name.localeCompare(b.sub_category_name)
                );
            });


            /* ==============================
            FINAL RESPONSE (ORDER PRESERVED)
            ================================= */

            return res.json({
                success: true,
                vendors: Array.from(vendorsMap.values()),
                pagination: {
                    total,
                    page: currentPage,
                    limit: perPage,
                    totalPages: Math.ceil(total / perPage),
                },
            });

        } catch (err) {
            console.error("getAllActiveVendors error:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** API to record the view contact details count (daily) - Coded by Raj Dec 17, 2025 */
    this.addViewContact = async (req, res) => {
        try {
            const { service_provider_id, item_id, user_id } = req.body;
            // Basic validation
            if (!user_id || !service_provider_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                });
            }

            // Get IP Address (no packages)
            const ip_address = (req.headers["x-forwarded-for"] || "").split(",").shift() || req.socket?.remoteAddress || null;

            /* ---------------- Check existing record (TODAY) ---------------- */
            let query = `SELECT id FROM roh_vendor_views WHERE user_id = ? AND vendor_id = ? AND DATE(created_at) = CURDATE()`;

            const params = [user_id, service_provider_id];

            // Item-specific vs vendor-level view
            if (item_id !== undefined && item_id !== null) {
                query += ` AND item_id = ?`;
                params.push(item_id);
            } else {
                query += ` AND item_id IS NULL`;
            }

            const [rows] = await pool.query(query, params);

            /* ---------------- Update or Insert ---------------- */
            if (rows.length > 0) {
                // Update existing daily record
                await pool.query(
                    `UPDATE roh_vendor_views SET view_count = view_count + 1, edit_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [user_id, rows[0].id]
                );

                return res.json({
                    success: true,
                    message: "View count updated",
                });
            } else {
            // Insert new daily record
            await pool.query(
                `INSERT INTO roh_vendor_views (user_id, vendor_id, item_id, ip_address, view_count, add_id) VALUES (?, ?, ?, ?, 1, ?)`, [user_id, service_provider_id, item_id ?? null, ip_address, user_id]
            );

            return res.json({
                success: true,
                message: "View recorded",
            });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** API to get all dynamic slugs - Coded by Vishnu Dec 22, 2025 */
    this.getAllSlug = async (req, res) => {
        try {
            const query = `
                SELECT DISTINCT
                    s.slug,
                    s.type,
                    s.status
                FROM roh_slugs s
                LEFT JOIN roh_vehicle_attributes a
                    ON (s.type = 'location' AND s.slug = a.city)
                WHERE s.status = 'active'
                    AND s.slug IS NOT NULL
                    AND s.slug != ''
                    AND (
                        (s.type = 'location' AND a.city IS NOT NULL)
                        OR
                        (s.type != 'location')
                    )
            `;

            const [rows] = await pool.query(query);

            return res.status(200).json({
                success: true,
                count: rows.length,
                data: rows,
            });

        } catch (error) {
            console.error("getAllSlug error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** API to get all vendor dynamic slug - Coded by Vishnu Dec 30 2025 */
    this.getAllVendorSlug = async (req, res) => {
        try {
            const query = `
            SELECT DISTINCT
                b.business_name,
                b.business_slug
            FROM roh_user_business b

            /* MUST HAVE AT LEAST ONE ACTIVE + APPROVED ITEM */
            INNER JOIN roh_vehicle_details vd
                ON vd.business_id = b.id
                AND vd.item_status = 1
                AND vd.admin_item_status = 1

            WHERE b.business_slug IS NOT NULL
                AND b.business_slug != ''
            `;

            const [rows] = await pool.query(query);

            return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows,
            });

        } catch (error) {
            console.error("getAllVendorSlug error:", error);

            return res.status(500).json({
            success: false,
            message: "Internal server error",
            });
        }
    };

    /** API to get category-model-location dynamic slug - Coded by Vishnu Feb 05 2025 */
    this.getAllCategoryModelLocationSlug = async (req, res) => {
    try {
        const query = `
        SELECT
            cat.slug AS category_slug,
            m.model_slug AS model_slug,
            loc.slug AS city_slug,
            COUNT(d.id) AS total_items
        FROM roh_vehicle_details d

        INNER JOIN roh_vehicle_attributes a
            ON a.vehicle_id = d.id

        INNER JOIN roh_models m
            ON m.id = d.model_id
        AND m.active = 1

        INNER JOIN roh_slugs cat
            ON cat.entity_id = d.sub_cat_id
        AND cat.type = 'category'
        AND cat.status = 'active'

        INNER JOIN roh_slugs loc
            ON LOWER(loc.cat_singular_name) = LOWER(a.city)
        AND loc.type = 'location'
        AND loc.status = 'active'

        WHERE
            d.item_status = 1
            AND d.admin_item_status = 1
            AND d.model_id IS NOT NULL
            AND a.city IS NOT NULL
            AND a.city != ''

        GROUP BY
            cat.slug,
            m.model_slug,
            loc.slug

        HAVING COUNT(d.id) >= 1

        ORDER BY
            cat.slug ASC,
            m.model_slug ASC,
            loc.slug ASC
        `;

        const [rows] = await pool.query(query);

        return res.status(200).json({
        success: true,
        count: rows.length,
        data: rows,
        });

    } catch (error) {
        console.error("getAllCategoryModelLocationSlug error:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };

    /** Get all active category model location slug for Footer - Coded by Vishnu Feb 11 2026 */
    this.getAllCategoryModelsLocationFooter = async (req, res) => {
    try {
        const query = `
        SELECT
            cat.slug AS category_slug,
            cat.cat_singular_name AS category_name,

            m.model_slug AS model_slug,
            m.model_name AS model_name,
            m.model_label AS model_label,

            loc.slug AS city_slug,
            loc.cat_singular_name AS city_name,

            COUNT(d.id) AS total_items
        FROM roh_vehicle_details d

        INNER JOIN roh_vehicle_attributes a
            ON a.vehicle_id = d.id

        INNER JOIN roh_models m
            ON m.id = d.model_id
            AND m.active = 1

        INNER JOIN roh_slugs cat
            ON cat.entity_id = d.sub_cat_id
            AND cat.type = 'category'
            AND cat.status = 'active'

        INNER JOIN roh_slugs loc
            ON LOWER(loc.cat_singular_name) = LOWER(a.city)
            AND loc.type = 'location'
            AND loc.status = 'active'

        WHERE
            d.item_status = 1
            AND d.admin_item_status = 1
            AND d.model_id IS NOT NULL
            AND a.city IS NOT NULL
            AND a.city != ''

        GROUP BY
            cat.slug,
            cat.cat_singular_name,
            m.model_slug,
            m.model_name,
            m.model_label,
            loc.slug,
            loc.cat_singular_name

        HAVING COUNT(d.id) >= 1

        ORDER BY
            cat.slug ASC,
            m.model_slug ASC,
            loc.cat_singular_name ASC
        `;

        const [rows] = await pool.query(query);

        return res.status(200).json({
        success: true,
        count: rows.length,
        data: rows,
        });

    } catch (error) {
        console.error("getAllCategoryModelsLocationFooter error:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };

    /** Get all active category model location slug for Json - Coded by Vishnu March 07 2026 */
    this.getAllCategoryModelsLocation = async (req, res) => {
        try {

            const query = `
            SELECT
                cat.entity_id AS category_id,
                cat.slug AS category_slug,
                cat.cat_singular_name AS category_name,

                m.id AS model_id,
                m.model_slug AS model_slug,
                m.model_name AS model_name,
                m.model_label AS model_label,

                loc.slug AS city_slug,
                loc.cat_singular_name AS city_name,

                COUNT(d.id) AS total_items
            FROM roh_vehicle_details d

            INNER JOIN roh_vehicle_attributes a
                ON a.vehicle_id = d.id

            INNER JOIN roh_models m
                ON m.id = d.model_id
                AND m.active = 1

            INNER JOIN roh_slugs cat
                ON cat.entity_id = d.sub_cat_id
                AND cat.type = 'category'
                AND cat.status = 'active'

            INNER JOIN roh_slugs loc
                ON LOWER(loc.cat_singular_name) = LOWER(a.city)
                AND loc.type = 'location'
                AND loc.status = 'active'

            WHERE
                d.item_status = 1
                AND d.admin_item_status = 1
                AND d.model_id IS NOT NULL
                AND a.city IS NOT NULL
                AND a.city != ''

            GROUP BY
                cat.entity_id,
                cat.slug,
                cat.cat_singular_name,
                m.id,
                m.model_slug,
                m.model_name,
                m.model_label,
                loc.slug,
                loc.cat_singular_name

            HAVING COUNT(d.id) >= 1

            ORDER BY
                cat.slug ASC,
                m.model_slug ASC,
                loc.cat_singular_name ASC
            `;

            const [rows] = await pool.query(query);

            const categoryMap = {};

            rows.forEach(row => {

            /* Category create */
            if (!categoryMap[row.category_id]) {
                categoryMap[row.category_id] = {
                category_id: row.category_id,
                category_slug: row.category_slug,
                category_name: row.category_name,
                models: []
                };
            }

            const category = categoryMap[row.category_id];

            /* Find model */
            let model = category.models.find(
                m => m.model_id === row.model_id
            );

            if (!model) {
                model = {
                model_id: row.model_id,
                model_slug: row.model_slug,
                model_name: row.model_name,
                model_label: row.model_label,
                locations: []
                };

                category.models.push(model);
            }

            /* Add location */
            model.locations.push({
                location_slug: row.city_slug,
                location_name: row.city_name
            });

            });

            const formattedData = Object.values(categoryMap);

            return res.status(200).json({
            success: true,
            count: formattedData.length,
            data: formattedData
            });

        } catch (error) {
            console.error("getAllCategoryModelsLocation error:", error);
            return res.status(500).json({
            success: false,
            message: "Internal server error"
            });
        }
    };

    /** get all active available city Coded by Vishnu Jan 02 2026 */
    this.getAllActiveAvailableCity = async (req, res) => {
        try {
            const keyword = req.body.keyword || "";

            const [rows] = await pool.query(
            `
            SELECT slug, cat_singular_name
            FROM roh_slugs
            WHERE status = 'active'
                AND type = 'location'
                AND cat_singular_name LIKE ?
            ORDER BY cat_singular_name ASC
            LIMIT 10
            `,
            [`%${keyword}%`]
            );

            res.status(200).json({
            success: true,
            data: rows,
            });
        } catch (error) {
            console.error("getAllActiveAvailableCity error:", error);
            res.status(500).json({
            success: false,
            message: "Internal server error",
            });
        }
    };

    /** get single city all details Coded by Vishnu Jan 08 2026 */
    this.GetSingleCityById = async (req, res) => {
        try {
            const { city_id } = req.body;

            if (!city_id) {
                return res.status(400).json({
                    status: false,
                    message: "City ID is required",
                });
            }

            const query = `SELECT city_name, city_slug, city_desc FROM roh_cities WHERE city_id = ? AND active = 1`;

            const [rows] = await pool.query(query, [city_id]);

            if (!rows.length) {
                return res.status(404).json({
                    status: false,
                    message: "Invalid City ID. The city does not exist or is inactive.",
                });
            }

            return res.status(200).json({
                status: true,
                data: rows, /** or rows[0] if you want single object */
            });

        } catch (err) {
            console.error("Error in GetSingleCityById:", err);
            return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: err,
            });
        }
    };

    /** To get the vendors by using the city id, Coded by Raj Jan 15, 2026 */
    this.getVendorsByLocationId = async (req, res) => {
        let connection;

        try {
            connection = await pool.getConnection();
            const { location_id } = req.params;

            // get limit and categoryId from query (?limit=6&categoryId=10)
            let { limit, categoryId } = req.query;

            // default limit
            limit = parseInt(limit, 10);
            if (isNaN(limit) || limit <= 0) {
                limit = 6;
            }

            if (!location_id || isNaN(location_id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid location id",
                });
            }

            /* =====================================================
            STEP 1: GET CITY SLUG FROM roh_cities
            ===================================================== */
            const [cityRows] = await connection.query(
                `SELECT city_slug FROM roh_cities WHERE city_id = ? LIMIT 1`,
                [location_id]
            );

            if (!cityRows.length) {
                return res.json({ success: true, vendors: [] });
            }

            const citySlug = cityRows[0].city_slug;

            /* =====================================================
            STEP 2: GET USER IDS (Filtered by City & Optional Category)
            ===================================================== */
            let queryParams = [];
            let categoryFilter = "";

            // Only add the category condition if categoryId exists
            if (categoryId) {
                categoryFilter = `AND vd.sub_cat_id = ?`;
                queryParams.push(categoryId);
            }

            // let queryParams = [citySlug];
            queryParams.push(citySlug);

            // Add limit to params
            queryParams.push(limit);

            const [vendorIdRows] = await connection.query(
                `
                SELECT
                    u.user_id,
                    MAX(b.created_at) AS created_at
                FROM roh_users u
                INNER JOIN roh_user_business b
                    ON b.user_id = u.user_id
                INNER JOIN roh_vehicle_details vd
                    ON vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1
                    ${categoryFilter}
                INNER JOIN roh_user_business_address addr
                    ON addr.user_id = u.user_id
                    AND addr.city = ?
                WHERE u.active = 1
                AND u.is_service_provider = 1
                GROUP BY u.user_id
                ORDER BY created_at DESC
                LIMIT ?
                `,
                queryParams
            );

            if (!vendorIdRows.length) {
                return res.json({ success: true, vendors: [] });
            }

            const vendorIds = vendorIdRows.map(v => v.user_id);

            /* =====================================================
            STEP 3: FETCH VENDOR DATA
            ===================================================== */
            const [rows] = await connection.query(
                `
                SELECT
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.verified,
                    b.business_name,
                    b.business_description,
                    b.business_slug,
                    addr.city,
                    addr.state,
                    cat.name AS category_name,
                    subcat.name AS sub_category_name,
                    mg.file_path,
                    mg.file_name,
                    vp.min_price_per_day
                FROM roh_users u
                INNER JOIN roh_user_business b
                    ON b.user_id = u.user_id
                INNER JOIN roh_vehicle_details vd
                    ON vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1
                LEFT JOIN roh_user_business_address addr
                    ON addr.user_id = u.user_id
                LEFT JOIN roh_business_cate_relat rel
                    ON rel.user_id = u.user_id AND rel.active = 1
                LEFT JOIN roh_categories cat
                    ON cat.id = rel.category_id AND cat.active = 1
                LEFT JOIN roh_categories subcat
                    ON subcat.id = rel.sub_category_id AND subcat.active = 1
                LEFT JOIN roh_media_gallery mg
                    ON mg.id = u.profile_picture_url
                LEFT JOIN (
                    SELECT
                        service_provider_id,
                        MIN(price_per_day) AS min_price_per_day
                    FROM roh_vehicle_details
                    WHERE item_status = 1
                    AND admin_item_status = 1
                    AND price_per_day IS NOT NULL
                    AND price_per_day > 0
                    GROUP BY service_provider_id
                ) vp ON vp.service_provider_id = u.user_id
                WHERE u.user_id IN (?)
                ORDER BY FIELD(u.user_id, ${vendorIds.join(",")})
                `,
                [vendorIds]
            );

            /* =====================================================
            STEP 4: GROUP RESPONSE
            ===================================================== */
            const vendorsMap = {};

            rows.forEach(row => {
                if (!vendorsMap[row.user_id]) {
                    vendorsMap[row.user_id] = {
                        user_id: row.user_id,
                        first_name: row.first_name?.trim(),
                        last_name: row.last_name?.trim(),
                        business_name: row.business_name?.trim(),
                        business_description: row.business_description?.trim(),
                        business_slug: row.business_slug,
                        is_verified: row.verified || 0,
                        city: row.city?.trim(),
                        state: row.state?.trim(),
                        profile_image:
                            row.file_path && row.file_name
                                ? `${row.file_path}${row.file_name}`
                                : null,
                        min_price_per_day: row.min_price_per_day ?? null,
                        categories: [],
                    };
                }

                if (row.sub_category_name) {
                    const key = `${row.category_name}|${row.sub_category_name}`;
                    if (!vendorsMap[row.user_id].categoryMap) {
                        vendorsMap[row.user_id].categoryMap = {};
                    }
                    if (!vendorsMap[row.user_id].categoryMap[key]) {
                        vendorsMap[row.user_id].categoryMap[key] = {
                            category_name: row.category_name,
                            sub_category_name: row.sub_category_name,
                        };
                    }
                }
            });

            Object.values(vendorsMap).forEach(vendor => {
                vendor.categories = Object.values(vendor.categoryMap || {});
                delete vendor.categoryMap;
                vendor.categories.sort((a, b) =>
                    a.sub_category_name.localeCompare(b.sub_category_name)
                );
            });

            return res.json({
                success: true,
                vendors: Object.values(vendorsMap),
            });

        } catch (error) {
            console.error("getVendorsByLocationId error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        } finally {
            if (connection) connection.release();
        }
    };

    /** To get the vendors by using the city and category slug, Coded by Raj Jan 19, 2026 */
    this.getVendorsByLocationOrCategory = async (req, res) => {
        let connection;

        try {
            connection = await pool.getConnection();

            let { locationSlug, limit, categoryId } = req.query;

            /* ---------------- NORMALIZE INPUT ---------------- */
            locationSlug = typeof locationSlug === "string" ? locationSlug.trim() : null;
            categoryId = categoryId ? parseInt(categoryId, 10) : null;

            limit = parseInt(limit, 10);
            if (isNaN(limit) || limit <= 0) {
                limit = 6;
            }

            /* ---------------- GUARD: BOTH MISSING ---------------- */
            if (!locationSlug && !categoryId) {
                return res.json({ success: true, vendors: [] });
            }

            /* =====================================================
            STEP 1: VERIFY CITY EXISTS (ONLY IF LOCATION GIVEN)
            ===================================================== */
            let locationName = null;

            if (locationSlug) {
                const [cityRows] = await connection.query(
                    `SELECT city_slug FROM roh_cities WHERE city_slug = ? LIMIT 1`,
                    [locationSlug]
                );

                if (!cityRows.length) {
                    return res.json({ success: true, vendors: [] });
                }

                /* Resolve display name (Udaipur, Goa, etc.) */
                const [slugRows] = await connection.query(
                    `SELECT cat_singular_name FROM roh_slugs WHERE slug = ? LIMIT 1`,
                    [locationSlug]
                );

                if (slugRows.length) {
                    locationName = slugRows[0].cat_singular_name?.trim();
                }
            }

            /* =====================================================
            STEP 2: BUILD DYNAMIC FILTERS
            ===================================================== */
            let conditions = [];
            let queryParams = [];

            if (categoryId) {
                conditions.push(`vd.sub_cat_id = ?`);
                queryParams.push(categoryId);
            }

            if (locationSlug) {
                conditions.push(`addr.city = ?`);
                queryParams.push(locationSlug);
            }

            const whereClause = conditions.length
                ? `AND ${conditions.join(" AND ")}`
                : "";

            queryParams.push(limit);

            /* =====================================================
            STEP 3: GET VENDOR IDS (SORTED BY DATE)
            ===================================================== */
            // This Step fetches IDs sorted by latest created_at
            const [vendorIdRows] = await connection.query(
                `
                SELECT
                    u.user_id,
                    MAX(b.created_at) AS created_at
                FROM roh_users u
                INNER JOIN roh_user_business b ON b.user_id = u.user_id
                INNER JOIN roh_vehicle_details vd
                    ON vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1
                LEFT JOIN roh_user_business_address addr
                    ON addr.user_id = u.user_id
                WHERE u.active = 1
                AND u.is_service_provider = 1
                ${whereClause}
                GROUP BY u.user_id
                ORDER BY created_at DESC  -- Ensure latest are first
                LIMIT ?
                `,
                queryParams
            );

            if (!vendorIdRows.length) {
                return res.json({ success: true, vendors: [] });
            }

            // Keep this array. It holds the correct order!
            const vendorIds = vendorIdRows.map(v => v.user_id);

            /* =====================================================
            STEP 4: FETCH VENDOR DETAILS
            ===================================================== */
            const [rows] = await connection.query(
                `
                SELECT
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.verified,
                    b.business_name,
                    b.business_description,
                    b.business_slug,
                    addr.city,
                    addr.state,
                    cat.name AS category_name,
                    subcat.name AS sub_category_name,
                    mg.file_path,
                    mg.file_name,
                    vp.min_price_per_day
                FROM roh_users u
                INNER JOIN roh_user_business b ON b.user_id = u.user_id
                INNER JOIN roh_vehicle_details vd
                    ON vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1
                LEFT JOIN roh_user_business_address addr ON addr.user_id = u.user_id
                LEFT JOIN roh_business_cate_relat rel
                    ON rel.user_id = u.user_id AND rel.active = 1
                LEFT JOIN roh_categories cat
                    ON cat.id = rel.category_id AND cat.active = 1
                LEFT JOIN roh_categories subcat
                    ON subcat.id = rel.sub_category_id AND subcat.active = 1
                LEFT JOIN roh_media_gallery mg ON mg.id = u.profile_picture_url
                LEFT JOIN (
                    SELECT
                        service_provider_id,
                        MIN(price_per_day) AS min_price_per_day
                    FROM roh_vehicle_details
                    WHERE item_status = 1
                    AND admin_item_status = 1
                    AND price_per_day IS NOT NULL
                    AND price_per_day > 0
                    GROUP BY service_provider_id
                ) vp ON vp.service_provider_id = u.user_id
                WHERE u.user_id IN (?)
                ORDER BY FIELD(u.user_id, ${vendorIds.join(",")})
                `,
                [vendorIds]
            );

            /* =====================================================
            STEP 5: FORMAT RESPONSE (PRESERVING ORDER)
            ===================================================== */
            const vendorsMap = {};

            // 5a. Populate the map
            rows.forEach(row => {
                if (!vendorsMap[row.user_id]) {
                    vendorsMap[row.user_id] = {
                        user_id: row.user_id,
                        first_name: row.first_name?.trim(),
                        last_name: row.last_name?.trim(),
                        business_name: row.business_name?.trim(),
                        business_description: row.business_description
                            ? row.business_description.trim().split(/\s+/).slice(0, 20).join(" ") +
                            (row.business_description.trim().split(/\s+/).length > 20 ? " ..." : "")
                            : null,
                        business_slug: row.business_slug,
                        is_verified: row.verified || 0,
                        city: row.city?.trim(),
                        state: row.state?.trim(),
                        locationName,
                        profile_image:
                            row.file_path && row.file_name
                                ? `${row.file_path}${row.file_name}`
                                : null,
                        min_price_per_day: row.min_price_per_day ?? null,
                        categories: [],
                    };
                }

                if (row.sub_category_name) {
                    const key = `${row.category_name}|${row.sub_category_name}`;
                    if (!vendorsMap[row.user_id].categoryMap) {
                        vendorsMap[row.user_id].categoryMap = {};
                    }
                    if (!vendorsMap[row.user_id].categoryMap[key]) {
                        vendorsMap[row.user_id].categoryMap[key] = {
                            category_name: row.category_name,
                            sub_category_name: row.sub_category_name,
                        };
                    }
                }
            });

            // 5b. Build final array using vendorIds to ENFORCE Order
            // Don't use Object.values(vendorsMap) because it might re-sort by ID
            const finalVendors = vendorIds
                .filter(id => vendorsMap[id]) // Check in case join failed for some reason
                .map(id => {
                    const vendor = vendorsMap[id];

                    // Convert categoryMap to array
                    vendor.categories = Object.values(vendor.categoryMap || {});
                    delete vendor.categoryMap;

                    // Sort categories internally (optional)
                    vendor.categories.sort((a, b) =>
                        a.sub_category_name.localeCompare(b.sub_category_name)
                    );

                    return vendor;
                });

            return res.json({
                success: true,
                vendors: finalVendors,
            });

        } catch (error) {
            console.error("getVendorsByLocationOrCategory error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        } finally {
            if (connection) connection.release();
        }
    };

    /** To get the vendors by using the business_ids, Coded by Raj Jan 30, 2026  */
    this.getVendorsByBusinessIds = async (req, res) => {
        let connection;

        try {
            connection = await pool.getConnection();

            let { business_ids, limit } = req.body;
            /* ---------------- VALIDATION ---------------- */
            if (!Array.isArray(business_ids) || business_ids.length === 0) {
                return res.json({
                    success: true,
                    vendors: [],
                });
            }

            // sanitize + unique
            business_ids = [...new Set(business_ids.map(id => parseInt(id, 10)).filter(Boolean))];

            if (!business_ids.length) {
                return res.json({ success: true, vendors: [] });
            }

            limit = Number(limit);
            if (isNaN(limit) || limit <= 0) {
                limit = business_ids.length;
            }

            /* =====================================================
            STEP 1: FETCH VENDOR DATA (SAME STRUCTURE)
            ===================================================== */
            const [rows] = await connection.query(
                `
                SELECT
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.verified,
                    b.id AS business_id,
                    b.business_name,
                    b.business_description,
                    b.business_slug,
                    addr.city,
                    addr.state,
                    cat.name AS category_name,
                    subcat.name AS sub_category_name,
                    mg.file_path,
                    mg.file_name,
                    vp.min_price_per_day
                FROM (
                    SELECT *
                    FROM roh_user_business
                    WHERE id IN (?)
                    ORDER BY FIELD(id, ${business_ids.join(",")})
                    LIMIT ?
                ) b
                INNER JOIN roh_users u
                    ON u.user_id = b.user_id
                    AND u.active = 1
                    AND u.is_service_provider = 1
                LEFT JOIN roh_user_business_address addr
                    ON addr.user_id = u.user_id
                LEFT JOIN roh_business_cate_relat rel
                    ON rel.user_id = u.user_id AND rel.active = 1
                LEFT JOIN roh_categories cat
                    ON cat.id = rel.category_id AND cat.active = 1
                LEFT JOIN roh_categories subcat
                    ON subcat.id = rel.sub_category_id AND subcat.active = 1
                LEFT JOIN roh_media_gallery mg
                    ON mg.id = u.profile_picture_url
                LEFT JOIN (
                    SELECT
                        service_provider_id,
                        MIN(price_per_day) AS min_price_per_day
                    FROM roh_vehicle_details
                    WHERE item_status = 1
                    AND admin_item_status = 1
                    AND price_per_day IS NOT NULL
                    AND price_per_day > 0
                    GROUP BY service_provider_id
                ) vp ON vp.service_provider_id = u.user_id
                WHERE EXISTS (
                    SELECT 1
                    FROM roh_vehicle_details vd
                    WHERE vd.service_provider_id = u.user_id
                    AND vd.item_status = 1
                    AND vd.admin_item_status = 1
                )
                ORDER BY FIELD(b.id, ${business_ids.join(",")})
                `
                ,
                [business_ids, limit]
            );

            if (!rows.length) {
                return res.json({ success: true, vendors: [] });
            }

            /* =====================================================
            STEP 2: GROUP RESPONSE (SAME AS YOUR API)
            ===================================================== */
            const vendorsMap = {};

            rows.forEach(row => {
                if (!vendorsMap[row.user_id]) {
                    vendorsMap[row.user_id] = {
                        user_id: row.user_id,
                        first_name: row.first_name?.trim(),
                        last_name: row.last_name?.trim(),
                        business_name: row.business_name?.trim(),

                        // 20 word limit
                        business_description: row.business_description
                            ? row.business_description
                                .trim()
                                .split(/\s+/)
                                .slice(0, 20)
                                .join(" ") +
                            (row.business_description.trim().split(/\s+/).length > 20 ? " ..." : "")
                            : null,

                        business_slug: row.business_slug,
                        is_verified: row.verified || 0,
                        city: row.city?.trim(),
                        state: row.state?.trim(),

                        profile_image:
                            row.file_path && row.file_name
                                ? `${row.file_path}${row.file_name}`
                                : null,

                        min_price_per_day: row.min_price_per_day ?? null,
                        categories: [],
                    };
                }

                if (row.sub_category_name) {
                    const key = `${row.category_name}|${row.sub_category_name}`;
                    if (!vendorsMap[row.user_id].categoryMap) {
                        vendorsMap[row.user_id].categoryMap = {};
                    }
                    if (!vendorsMap[row.user_id].categoryMap[key]) {
                        vendorsMap[row.user_id].categoryMap[key] = {
                            category_name: row.category_name,
                            sub_category_name: row.sub_category_name,
                        };
                    }
                }
            });

            const finalVendors = Object.values(vendorsMap).map(vendor => {
                vendor.categories = Object.values(vendor.categoryMap || {});
                delete vendor.categoryMap;
                vendor.categories.sort((a, b) =>
                    a.sub_category_name.localeCompare(b.sub_category_name)
                );
                return vendor;
            });

            return res.json({
                success: true,
                vendors: finalVendors,
            });

        } catch (error) {
            console.error("getVendorsByBusinessIds error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        } finally {
            if (connection) connection.release();
        }
    };

    /** To get the models by location and category, Coded by Raj Jan 30, 2026 */
    this.getModelsByCategoryAndLocation = async (req, res) => {
        try {
            /* ---------------- Inputs ---------------- */
            const locationSlug = (req.body.location_slug || "").trim();
            const subCatId = parseInt(req.body.cat_id);

            // If neither category nor location is present → return empty
            if (!subCatId && !locationSlug) {
                return res.status(200).json({
                    success: true,
                    models: [],
                });
            }

            /* ---------------- Dynamic Conditions ---------------- */
            let whereConditions = [];
            let bindings = [];

            // Mandatory conditions (always applied)
            whereConditions.push(`d.item_status = 1`);
            whereConditions.push(`d.admin_item_status = 1`);
            whereConditions.push(`d.model_id IS NOT NULL`);
            whereConditions.push(`LOWER(m.model_name) <> 'other'`);

            // Category condition
            if (subCatId) {
                whereConditions.push(`d.sub_cat_id = ?`);
                bindings.push(subCatId);
            }

            // Location condition
            if (locationSlug) {
                whereConditions.push(`LOWER(a.city) = LOWER(?)`);
                bindings.push(locationSlug);
            }

            // const query = `
            //     SELECT
            //         m.id AS model_id,
            //         m.model_name,
            //         m.model_slug,
            //         COUNT(d.id) AS total_items
            //     FROM roh_vehicle_details d
            //     INNER JOIN roh_vehicle_attributes a
            //         ON a.vehicle_id = d.id
            //     INNER JOIN roh_models m
            //         ON m.id = d.model_id
            //         AND m.active = 1
            //     WHERE ${whereConditions.join(" AND ")}
            //     GROUP BY m.id, m.model_name, m.model_slug
            //     HAVING COUNT(d.id) > 1
            //     ORDER BY m.model_name ASC
            // `;
            const query = `
                SELECT
                    m.id AS model_id,
                    m.model_name,
                    m.model_label,
                    COALESCE(NULLIF(m.model_label, ''), m.model_name) AS display_name,
                    m.model_slug,
                    d.sub_cat_id,
                    COUNT(d.id) AS total_items
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a
                    ON a.vehicle_id = d.id
                INNER JOIN roh_models m
                    ON m.id = d.model_id
                    AND m.active = 1
                WHERE ${whereConditions.join(" AND ")}
                GROUP BY
                    m.id,
                    m.model_name,
                    m.model_label,
                    m.model_slug,
                    d.sub_cat_id
                HAVING COUNT(d.id) > 0
                ORDER BY display_name ASC
            `;


            const [rows] = await pool.query(query, bindings);

            return res.status(200).json({
                success: true,
                models: rows,
            });

        } catch (error) {
            console.error("getModelsByCategoryAndLocation error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** API to get ALL active models with their locations and category ids for Sitemap - Batched to prevent query loop flooding */
    this.getAllModelsForSitemap = async (req, res) => {
        try {
            const query = `
                SELECT
                    LOWER(a.city) AS location_slug,
                    m.id AS model_id,
                    m.model_name,
                    m.model_label,
                    COALESCE(NULLIF(m.model_label, ''), m.model_name) AS display_name,
                    m.model_slug,
                    d.sub_cat_id,
                    COUNT(d.id) AS total_items
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a ON a.vehicle_id = d.id
                INNER JOIN roh_models m ON m.id = d.model_id AND m.active = 1
                WHERE d.item_status = 1
                  AND d.admin_item_status = 1
                  AND d.model_id IS NOT NULL
                  AND LOWER(m.model_name) <> 'other'
                GROUP BY
                    LOWER(a.city),
                    m.id,
                    m.model_name,
                    m.model_label,
                    m.model_slug,
                    d.sub_cat_id
                HAVING COUNT(d.id) > 0
            `;

            const [rows] = await pool.query(query);

            return res.status(200).json({
                success: true,
                models: rows,
            });

        } catch (error) {
            console.error("getAllModelsForSitemap error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** Get all active category model slug for sitemap - Coded by Vishnu Feb 10 2026 */
    this.getcatmodelSlug = async (req, res) => {
        try {
            const query = `
                SELECT
                    m.model_slug,
                    c.slug AS cat_slug,
                    COUNT(d.id) AS total_items
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a
                    ON a.vehicle_id = d.id
                INNER JOIN roh_models m
                    ON m.id = d.model_id
                    AND m.active = 1
                INNER JOIN roh_categories c
                    ON c.id = d.sub_cat_id
                    AND c.active = 1
                WHERE
                    d.item_status = 1
                    AND d.admin_item_status = 1
                    AND d.model_id IS NOT NULL
                    AND LOWER(m.model_name) <> 'other'
                GROUP BY
                    m.model_slug,
                    c.slug
                HAVING COUNT(d.id) > 0
                ORDER BY m.model_slug ASC
            `;

            const [rows] = await pool.query(query);

            return res.status(200).json({
                success: true,
                models: rows,
            });

        } catch (error) {
            console.error("getcatmodelSlug error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };


    /** API to get Trending Searches Footer location category listing - Coded by Vishnu Jan 16 2026 */
    this.getTrendingSearches = async (req, res) => {
        try {
            const query = `
            SELECT
                loc.slug              AS location_slug,
                loc.cat_singular_name AS location_name,

                CONCAT(
                '[',
                GROUP_CONCAT(
                    DISTINCT CONCAT(
                    '{',
                        '"category_id":', cat.entity_id, ',',
                        '"category_slug":"', cat.slug, '",',
                        '"category_name":"', cat.cat_singular_name, '"',
                    '}'
                    )
                ),
                ']'
                ) AS categories

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

            GROUP BY loc.slug, loc.cat_singular_name
            ORDER BY LOWER(loc.cat_singular_name) ASC
            LIMIT 100
            `;


            const [rows] = await pool.query(query);

            const data = rows.map(row => ({
            location_slug: row.location_slug,
            location_name: row.location_name,
            categories: JSON.parse(row.categories)
            }));

            return res.status(200).json({
            success: true,
            message: "Trending searches fetched successfully",
            data
            });

        } catch (error) {
            console.error("Error in getTrendingSearches:", error);
            return res.status(500).json({
            success: false,
            message: "Internal server error"
            });
        }
    };

    /** API to get Trending Searches Footer category location listing - Coded by Vishnu March 07 2026 */
    this.getTrendingCategoryLocation = async (req, res) => {
        try {

            const query = `
            SELECT
                cat.slug              AS category_slug,
                cat.cat_singular_name AS category_name,

                GROUP_CONCAT(
                    DISTINCT CONCAT(
                        loc.slug,'||',loc.cat_singular_name
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
            LIMIT 100000
            `;

            const [rows] = await pool.query(query);

            const data = rows.map(row => {

                let locationsArr = [];

                if (row.locations) {
                    locationsArr = row.locations.split(',').map(item => {
                        const parts = item.split('||');

                        return {
                            location_slug: parts[0] || "",
                            location_name: parts[1] || ""
                        };
                    });
                }

                return {
                    category_slug: row.category_slug,
                    category_name: row.category_name,
                    locations: locationsArr
                };
            });

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

     /** To get the models by location and category, Coded by Vishnu Feb 09, 2026 */
    this.getCategoryModelsFooter = async (req, res) => {
    try {
        const query = `
        SELECT DISTINCT
            cat.slug AS category_slug,
            rc.name AS category_name,
            m.model_slug AS model_slug,
            m.model_label AS model_label
        FROM roh_vehicle_details d

        INNER JOIN roh_vehicle_attributes a
            ON a.vehicle_id = d.id

        INNER JOIN roh_models m
            ON m.id = d.model_id
            AND m.active = 1
            AND LOWER(m.model_name) <> 'other'

        /* CATEGORY SLUG */
        INNER JOIN roh_slugs cat
            ON cat.entity_id = d.sub_cat_id
            AND cat.type = 'category'
            AND cat.status = 'active'

        /* CATEGORY NAME (AUTHORITATIVE SOURCE) */
        INNER JOIN roh_categories rc
            ON rc.id = d.sub_cat_id
            AND rc.active = 1

        /* LOCATION VALIDATION */
        INNER JOIN roh_slugs loc
            ON LOWER(loc.cat_singular_name) = LOWER(a.city)
            AND loc.type = 'location'
            AND loc.status = 'active'

        WHERE
            d.item_status = 1
            AND d.admin_item_status = 1
            AND d.model_id IS NOT NULL
            AND a.city IS NOT NULL
            AND a.city != ''
            AND cat.slug IS NOT NULL
            AND m.model_slug IS NOT NULL

        GROUP BY
            cat.slug,
            rc.name,
            m.model_slug,
            m.model_label

        HAVING COUNT(d.id) > 0

        ORDER BY
            rc.name ASC,
            m.model_slug ASC
        `;

        const [rows] = await pool.query(query);

        return res.status(200).json({
        success: true,
        count: rows.length,
        data: rows,
        });

    } catch (error) {
        console.error("getCategoryModelsFooter error:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };

    /** API to Page redirect - Coded by Vishnu Feb 12 2026 */
    this.PageRedirectService = async (req, res) => {
    try {
        const { page } = req.body;

        if (!page) {
        return res.status(400).json({
            success: false,
            message: "Page path is required",
        });
        }

        // normalize path (remove trailing slash)
        const cleanPage = page.replace(/\/$/, "");

        const query = `
        SELECT id, source_url, target_url, redirect_type
        FROM roh_redirects
        WHERE source_url = ?
            AND status = 1
        LIMIT 1
        `;

        const [rows] = await pool.query(query, [cleanPage]);

        if (!rows.length) {
        return res.status(200).json({
            success: true,
            found: false,
        });
        }

        const redirect = rows[0];

        // update hit count
        const updateQuery = `
        UPDATE roh_redirects
        SET hit_count = hit_count + 1
        WHERE id = ?
        `;
        await pool.query(updateQuery, [redirect.id]);

        return res.status(200).json({
        success: true,
        found: true,
        target: redirect.target_url,
        type: redirect.redirect_type, // 301 / 302
        });

    } catch (error) {
        console.error("PageRedirectService error:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };

    /** API to Create Category Location page json - Coded by Vishnu March 08 2026 */
    this.getAllCategoryLocationFaq = async (req, res) => {

        let connection;

        try {

            connection = await pool.getConnection();

            /* ---------- CATEGORY NAME MAP ---------- */

            const [categories] = await connection.query(`
                SELECT id, name
                FROM roh_categories
                WHERE active = 1
            `);

            const categoryMap = {};
            categories.forEach(c => {
                categoryMap[c.id] = c.name;
            });

            /* ---------- SLUG TABLE MAP ---------- */

            const [slugRows] = await connection.query(`
                SELECT entity_id, slug, type
                FROM roh_slugs
                WHERE status = 'active'
            `);

            const categorySlugMap = {};
            const locationSlugMap = {};

            slugRows.forEach(s => {

                if (s.type === "category") {
                    categorySlugMap[s.entity_id] = s.slug;
                }

                if (s.type === "location") {
                    locationSlugMap[s.slug] = {
                        loc_id: s.entity_id,
                        slug: s.slug
                    };
                }

            });

            /* ---------- CITY NAME MAP ---------- */

            const [cities] = await connection.query(`
                SELECT city_id, city_name
                FROM roh_cities
            `);

            const cityNameMap = {};
            cities.forEach(c => {
                cityNameMap[c.city_id] = c.city_name;
            });

            /* ---------- MAIN RAW QUERY ---------- */

            const [rows] = await connection.query(`
                SELECT
                    d.sub_cat_id,
                    a.city,
                    m.model_label,
                    m.model_slug,
                    b.user_id,
                    b.business_name,
                    b.business_slug,
                    d.fleet_size,
                    d.price_per_day
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a
                    ON a.vehicle_id = d.id
                INNER JOIN roh_models m
                    ON m.id = d.model_id AND m.active = 1
                INNER JOIN roh_user_business b
                    ON b.user_id = d.service_provider_id
                WHERE d.item_status = 1
                AND d.admin_item_status = 1
            `);

            /* ---------- GROUPING ---------- */

            const map = {};

            rows.forEach(row => {

                const citySlug = row.city;
                const locationMeta = locationSlugMap[citySlug];
                if (!locationMeta) return;

                const key = `${row.sub_cat_id}_${citySlug}`;
                const price = Number(row.price_per_day) || 0;
                const modelName = row.model_label?.trim();
                const modelSlug = row.model_slug;

                if (!map[key]) {

                    map[key] = {
                        cat_id: row.sub_cat_id,
                        loc_id: locationMeta.loc_id,
                        category_slug: categorySlugMap[row.sub_cat_id] || null,
                        city_slug: citySlug,
                        category: categoryMap[row.sub_cat_id] || null,
                        city: cityNameMap[locationMeta.loc_id] || null,
                        vendors: {},
                        min_price: Number.MAX_SAFE_INTEGER,
                        max_price: 0,
                        model_price_map: {},
                        model_slug_map: {},
                        model_count_map: {}   // ⭐ IMPORTANT FIX
                    };

                }

                /* ⭐ STORE MODEL SLUG */

                if (modelSlug && modelName) {
                    map[key].model_slug_map[modelSlug] = modelName;

                    map[key].model_count_map[modelSlug] =
                        (map[key].model_count_map[modelSlug] || 0) + 1;
                }

                /* ⭐ VENDOR FLEET */

                const vendorKey = row.user_id;

                if (!map[key].vendors[vendorKey]) {

                    map[key].vendors[vendorKey] = {
                        name: row.business_name,
                        slug: row.business_slug,
                        fleet: row.fleet_size || 0
                    };

                } else {

                    map[key].vendors[vendorKey].fleet += row.fleet_size || 0;

                }

                /* ⭐ PRICE RANGE */

                if (price > 0 && modelSlug && modelName) {

                    if (price < map[key].min_price) map[key].min_price = price;
                    if (price > map[key].max_price) map[key].max_price = price;

                    if (!map[key].model_price_map[modelSlug]) {

                        map[key].model_price_map[modelSlug] = {
                            model: modelName,
                            slug: modelSlug,
                            min: price,
                            max: price
                        };

                    } else {

                        if (price < map[key].model_price_map[modelSlug].min)
                            map[key].model_price_map[modelSlug].min = price;

                        if (price > map[key].model_price_map[modelSlug].max)
                            map[key].model_price_map[modelSlug].max = price;

                    }

                }

            });

            /* ---------- FINAL RESPONSE ---------- */

            const result = Object.values(map).map(item => {

                const vendors = Object.values(item.vendors)
                    .sort((a, b) => b.fleet - a.fleet)
                    .slice(0, 5)
                    .map(v => ({
                        name: v.name,
                        slug: v.slug
                    }));

                /* POPULAR MODELS SORTED BY VEHICLE COUNT */

                const popularModels = Object.entries(item.model_count_map)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([slug]) => ({
                        name: item.model_slug_map[slug],
                        slug
                    }));

                return {
                    cat_id: item.cat_id,
                    loc_id: item.loc_id,
                    category_slug: item.category_slug,
                    city_slug: item.city_slug,
                    category: item.category,
                    city: item.city,
                    price_range:
                        item.max_price > 0
                            ? (
                                item.min_price === item.max_price
                                    ? `Starts from ₹${item.min_price} per day`
                                    : `₹${item.min_price} – ₹${item.max_price} per day`
                            )
                            : null,
                    model_price_ranges: Object.values(item.model_price_map)
                        .sort((a, b) => a.min - b.min)
                        .slice(0, 5)
                        .map(m => ({
                            model: m.model,
                            slug: m.slug,
                            price_range:
                                m.min === m.max
                                    ? `Starts from ₹${m.min} per day`
                                    : `₹${m.min} – ₹${m.max} per day`
                        })),
                    popular_models: popularModels,
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

    /** API to Create Category Model Location page json - Coded by Vishnu March 17 2026 */
    this.getAllCategoryModelLocationFaq = async (req, res) => {

        let connection;

        try {

            connection = await pool.getConnection();

            /* ---------- CATEGORY MAP ---------- */

            const [categories] = await connection.query(`
                SELECT id, name
                FROM roh_categories
                WHERE active = 1
            `);

            const categoryMap = {};
            categories.forEach(c => categoryMap[c.id] = c.name);


            /* ---------- SLUG MAP ---------- */

            const [slugRows] = await connection.query(`
                SELECT entity_id, slug, type
                FROM roh_slugs
                WHERE status = 'active'
            `);

            const categorySlugMap = {};
            const locationSlugMap = {};

            slugRows.forEach(s => {

                if (s.type === "category") {
                    categorySlugMap[s.entity_id] = s.slug;
                }

                if (s.type === "location") {
                    locationSlugMap[s.slug] = {
                        loc_id: s.entity_id,
                        slug: s.slug
                    };
                }

            });


            /* ---------- CITY MAP ---------- */

            const [cities] = await connection.query(`
                SELECT city_id, city_name
                FROM roh_cities
            `);

            const cityNameMap = {};
            cities.forEach(c => cityNameMap[c.city_id] = c.city_name);


            /* ---------- MAIN QUERY (BRAND JOIN ADDED) ---------- */

            const [rows] = await connection.query(`
                SELECT
                    d.sub_cat_id,
                    a.city,
                    m.id AS model_id,
                    m.model_label,
                    m.model_slug,
                    br.brand_name,
                    b.user_id,
                    b.business_name,
                    b.business_slug,
                    d.fleet_size,
                    d.price_per_day
                FROM roh_vehicle_details d
                INNER JOIN roh_vehicle_attributes a
                    ON a.vehicle_id = d.id
                INNER JOIN roh_models m
                    ON m.id = d.model_id AND m.active = 1
                LEFT JOIN roh_brands br
                    ON br.id = m.brand_id
                INNER JOIN roh_user_business b
                    ON b.user_id = d.service_provider_id
                WHERE d.item_status = 1
                AND d.admin_item_status = 1
            `);


            /* ---------- GROUPING (CATEGORY + MODEL + CITY KEY) ---------- */

            const map = {};

            rows.forEach(row => {

                const citySlug = row.city;
                const locationMeta = locationSlugMap[citySlug];
                if (!locationMeta) return;

                const key = `${row.sub_cat_id}_${row.model_id}_${citySlug}`;
                const price = Number(row.price_per_day) || 0;

                if (!map[key]) {

                    map[key] = {
                        cat_id: row.sub_cat_id,
                        model_id: row.model_id,
                        loc_id: locationMeta.loc_id,

                        category: categoryMap[row.sub_cat_id] || null,
                        category_slug: categorySlugMap[row.sub_cat_id] || null,

                        model: row.model_label,
                        model_slug: row.model_slug,

                        brand: row.brand_name || null,

                        city: cityNameMap[locationMeta.loc_id] || null,
                        city_slug: citySlug,

                        vendors: {},
                        min_price: Number.MAX_SAFE_INTEGER,
                        max_price: 0,
                        total_listings: 0
                    };

                }

                map[key].total_listings++;

                /* ---------- VENDOR FLEET ---------- */

                const vendorKey = row.user_id;

                if (!map[key].vendors[vendorKey]) {

                    map[key].vendors[vendorKey] = {
                        name: row.business_name,
                        slug: row.business_slug,
                        fleet: row.fleet_size || 0
                    };

                } else {

                    map[key].vendors[vendorKey].fleet += row.fleet_size || 0;

                }

                /* ---------- PRICE RANGE ---------- */

                if (price > 0) {

                    if (price < map[key].min_price) map[key].min_price = price;
                    if (price > map[key].max_price) map[key].max_price = price;

                }

            });


            /* ---------- FINAL RESPONSE ---------- */

            const result = Object.values(map).map(item => {

                const vendors = Object.values(item.vendors)
                    .sort((a, b) => b.fleet - a.fleet)
                    .slice(0, 5)
                    .map(v => ({
                        name: v.name,
                        slug: v.slug
                    }));

                return {
                    cat_id: item.cat_id,
                    model_id: item.model_id,
                    loc_id: item.loc_id,

                    category: item.category,
                    category_slug: item.category_slug,

                    model: item.model,
                    model_slug: item.model_slug,

                    brand: item.brand,

                    city: item.city,
                    city_slug: item.city_slug,

                    total_listings: item.total_listings,

                    price_range:
                        item.max_price > 0
                            ? (
                                item.min_price === item.max_price
                                    ? `Starts from ₹${item.min_price} per day`
                                    : `₹${item.min_price} – ₹${item.max_price} per day`
                            )
                            : null,

                    vendors
                };

            });

            return res.json({
                success: true,
                data: result
            });

        } catch (error) {

            console.error("getAllCategoryModelLocationFaq error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });

        } finally {

            if (connection) connection.release();

        }

    };

    /** get all active city form slug tbl Coded by Vishnu March 20 2026 */
    this.getAllPublicActiveCity = async (req, res) => {
        try {
            const [rows] = await pool.query(
                `SELECT slug, cat_singular_name
                FROM roh_slugs
                WHERE type = ?
                AND status = ?
                ORDER BY cat_singular_name ASC`,
                ['location', 'active']
            );

            res.status(200).json({
                success: true,
                data: rows,
            });
        } catch (error) {
            console.error("getAllPublicActiveCity error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** Api to dynamic pages json data - Coded by Vishnu March 21 2026 */
    this.getCategoryModelLocationMaster = async (req, res) => {
        try {

            const categorySlug = (req.query.category_slug || "").trim();
            const locationSlug = (req.query.location_slug || "").trim();
            const modelSlug = (req.query.model_slug || "").trim();

            let where = [];
            let bindings = [];

            where.push(`vd.item_status = 1`);
            where.push(`vd.admin_item_status = 1`);
            where.push(`vd.model_id IS NOT NULL`);
            where.push(`m.active = 1`);
            where.push(`LOWER(m.model_name) <> 'other'`);

            if (categorySlug) {
            where.push(`cat.slug = ?`);
            bindings.push(categorySlug);
            }

            if (locationSlug) {
            where.push(`LOWER(loc.slug) = LOWER(?)`);
            bindings.push(locationSlug);
            }

            if (modelSlug) {
            where.push(`m.model_slug = ?`);
            bindings.push(modelSlug);
            }

            const query = `
            SELECT
                cat.entity_id AS category_id,
                cat.slug AS category_slug,
                cat.cat_singular_name AS category_name,

                m.id AS model_id,
                m.model_name,
                m.model_label,
                COALESCE(NULLIF(m.model_label,''), m.model_name) AS display_name,
                m.model_slug,

                loc.slug AS location_slug,
                loc.cat_singular_name AS location_name,

                COUNT(vd.id) AS total_items

            FROM roh_vehicle_details vd

            INNER JOIN roh_vehicle_attributes va
                ON va.vehicle_id = vd.id

            INNER JOIN roh_models m
                ON m.id = vd.model_id

            INNER JOIN roh_slugs cat
                ON cat.entity_id = vd.sub_cat_id
                AND cat.type = 'category'
                AND cat.status = 'active'

            INNER JOIN roh_slugs loc
                ON (
                LOWER(TRIM(loc.cat_singular_name)) = LOWER(TRIM(va.city))
                OR LOWER(loc.slug) = LOWER(REPLACE(TRIM(va.city),' ','-'))
                )
                AND loc.type = 'location'
                AND loc.status = 'active'

            WHERE ${where.join(" AND ")}

            GROUP BY
                cat.entity_id,
                cat.slug,
                cat.cat_singular_name,

                m.id,
                m.model_name,
                m.model_label,
                m.model_slug,

                loc.slug,
                loc.cat_singular_name

            HAVING COUNT(vd.id) > 0

            ORDER BY
                cat.slug ASC,
                display_name ASC,
                loc.cat_singular_name ASC
            `;

            const [rows] = await pool.query(query, bindings);

            const categoryMap = {};

            rows.forEach(row => {

            if (!categoryMap[row.category_id]) {
                categoryMap[row.category_id] = {
                category_id: row.category_id,
                category_slug: row.category_slug,
                category_name: row.category_name,
                models: []
                };
            }

            const category = categoryMap[row.category_id];

            let model = category.models.find(
                m => m.model_id === row.model_id
            );

            if (!model) {
                model = {
                model_id: row.model_id,
                model_slug: row.model_slug,
                model_name: row.model_name,
                model_label: row.model_label,
                display_name: row.display_name,
                total_items: row.total_items,
                locations: []
                };
                category.models.push(model);
            }

            model.locations.push({
                location_slug: row.location_slug,
                location_name: row.location_name
            });

            });

            const finalData = Object.values(categoryMap);

            return res.status(200).json({
            success: true,
            count: finalData.length,
            data: finalData
            });

        } catch (error) {
            console.error("getCategoryModelLocationMaster error:", error);
            return res.status(500).json({
            success: false,
            message: "Internal server error"
            });
        }
    };

    /** Api to home page json data - Coded by Vishnu March 21 2026 */
    this.getHomePageFaqKeys = async (req, res) => {

        let connection;

        try {

            connection = await pool.getConnection();

            const [rows] = await connection.query(`
                SELECT
                    c.id AS cat_id,
                    c.name AS category_name,
                    s.slug AS category_slug,
                    MIN(CASE WHEN d.price_per_day > 0 THEN d.price_per_day END) AS min_price,
                    MAX(CASE WHEN d.price_per_day > 0 THEN d.price_per_day END) AS max_price,
                    COUNT(d.id) AS total_listings
                FROM roh_vehicle_details d
                INNER JOIN roh_categories c
                    ON c.id = d.sub_cat_id
                LEFT JOIN roh_slugs s
                    ON s.entity_id = c.id
                    AND s.type = 'category'
                    AND s.status = 'active'
                WHERE d.item_status = 1
                AND d.admin_item_status = 1
                GROUP BY c.id, c.name, s.slug
                HAVING min_price IS NOT NULL
                ORDER BY total_listings DESC
                LIMIT 5
            `);

            return res.json({
                success: true,
                data: rows
            });

        } catch (error) {

            console.error("getHomePageFaqKeys error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });

        } finally {

            if (connection) connection.release();

        }

    };


}

module.exports = new PublicModuleApi();
