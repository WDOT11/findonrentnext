// controller.js
const pool = require('../../../config/connection');
const path = require('path');

function CategoryApi() {

    /** Function method to create the category and sub-category Coded by Raj 04 Nov 2025 */
    this.createCategory = async (req, res) => {
        const connection = await pool.getConnection();
        try {
            const {
                name,
                description,
                add_id,
                edit_id,
                parent_category_id,
                cate_available,
                category_picture_file
            } = req.body;

            const active = 1;
            const available = cate_available ?? 1; // default ON
            let cat_img_id = null;

            await connection.beginTransaction();

            //  1. If image uploaded, insert in media gallery
            if (category_picture_file) {
                const fileExtension = path.extname(category_picture_file);
                const categoryImageType = fileExtension.slice(1);
                const categoryImagePath = "/uploads/media/category/";

                const [mediaInsert] = await connection.query(
                    `INSERT INTO roh_media_gallery (file_name, file_path, file_type, active)
                    VALUES (?, ?, ?, ?)`,
                    [category_picture_file, categoryImagePath, categoryImageType, 1]
                );
                cat_img_id = mediaInsert.insertId;
            }

            //  2. Generate slug and check duplicates
            const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");

            // Check if slug already active
            const [existingActive] = await connection.query(`SELECT id FROM roh_categories WHERE slug = ? AND active = 1`, [slug]);
            if (existingActive.length > 0) {
                await connection.rollback();
                connection.release();
                return GLOBAL_ERROR_RESPONSE("Category with same name already exists.", {}, res);
            }

            // Reactivate if inactive
            const [existingInactive] = await connection.query(`SELECT id FROM roh_categories WHERE slug = ? AND active = 0`, [slug]);
            if (existingInactive.length > 0) {
                const categoryId = existingInactive[0].id;
                await connection.query(
                    `UPDATE roh_categories SET name=?, description=?, active=1, cate_available=?,  edit_id=?, parent_category_id=?, cat_img_id=?
                    WHERE id=?`, [name, description, cate_available, edit_id, parent_category_id || null, cat_img_id, categoryId]
                );
                await connection.commit();
                connection.release();
                return GLOBAL_SUCCESS_RESPONSE("Category reactivated successfully.", {}, res);
            }

            //  3. Insert new category record
            const [insertResult] = await connection.query(
            `
            INSERT INTO roh_categories
            (name, description, active, cate_available, add_id, edit_id, parent_category_id, slug, cat_img_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                description,
                active,
                available,
                add_id,
                edit_id,
                parent_category_id || null,
                slug,
                cat_img_id
            ]
            );

            await connection.commit();
            connection.release();

            return GLOBAL_SUCCESS_RESPONSE("Category successfully created.", {
                category_id: insertResult.insertId,
                cat_img_id,
            }, res);
        } catch (err) {
            try { await connection.rollback(); } catch {}
            connection.release();
            console.error("❌ Category creation error:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Category list Coded by Raj Nov 04 2025 */
    this.categoryList = async (req, res) => {
        try {
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const offset = (page - 1) * limit;

            const categoryName = req.body.category_name || "";
            const categoryStatus = req.body.status || "";
            const categoryParent = req.body.parent_category_id || "";

            //  JOIN roh_media_gallery to include image info
            let sql = `
                SELECT
                c.id,
                c.name,
                c.description,
                c.slug,
                c.parent_category_id,
                c.active,
                p.name AS parent_category_name,
                m.file_name AS image_name,
                m.file_path AS image_path
                FROM roh_categories c
                LEFT JOIN roh_categories p ON c.parent_category_id = p.id
                LEFT JOIN roh_media_gallery m ON c.cat_img_id = m.id

            `;

            const queryParams = [];

            if (categoryName) {
                sql += ` AND c.name LIKE ?`;
                queryParams.push(`%${categoryName}%`);
            }
            if (categoryStatus) {
                sql += ` AND c.active LIKE ?`;
                queryParams.push(`${categoryStatus}`);
            }
            if (categoryParent) {
                sql += ` AND c.parent_category_id LIKE ?`;
                queryParams.push(`${categoryParent}`);
            }

            sql += ` ORDER BY c.add_date DESC`;

            const [categoryList] = await pool.query(sql, queryParams);

            const total = categoryList.length;
            const totalPages = Math.ceil(total / limit);

            if (total == 0 || page > totalPages) {
                return GLOBAL_SUCCESS_RESPONSE("No categories found.", {
                categoryList: [],
                page,
                limit,
                total,
                totalPages,
                }, res);
            }

            const paginatedCategories = categoryList.slice(offset, offset + limit);

            //  Format image URL for frontend (optional)
            const formatted = paginatedCategories.map(cat => ({
                ...cat,
                image_url: cat.image_name ? `${cat.image_path}${cat.image_name}` : null,
            }));

            return GLOBAL_SUCCESS_RESPONSE("Categories fetched successfully", {
                category: formatted,
                page,
                limit,
                total,
                totalPages,
            }, res);
        } catch (error) {
        console.error("❌ Error in categoryList:", error);
        return GLOBAL_ERROR_RESPONSE("Internal server error", error, res);
        }
    };

    /** Details Category Coded by Raj Nov 04 2025 */
    this.categoryDetail = async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return GLOBAL_ERROR_RESPONSE("Category ID is required", {}, res);
            }

            const sql = `
                SELECT
                c.id,
                c.name,
                c.description,
                c.active,
                c.slug,
                c.cat_singular_name,
                c.parent_category_id,
                c.cate_available,
                p.name AS parent_category_name,
                m.file_name AS image_name,
                m.file_path AS image_path
                FROM roh_categories c
                LEFT JOIN roh_categories p ON c.parent_category_id = p.id
                LEFT JOIN roh_media_gallery m ON c.cat_img_id = m.id
                WHERE c.id = ?
                LIMIT 1
            `;

            const [rows] = await pool.query(sql, [id]);
            if (rows.length === 0) {
                return GLOBAL_ERROR_RESPONSE("Category not found.", {}, res);
            }

            const cat = rows[0];
            const formatted = {
                id: cat.id,
                name: cat.name,
                description: cat.description,
                slug: cat.slug,
                cat_singular_name: cat.cat_singular_name,
                active: cat.active,
                parent_category_id: cat.parent_category_id,
                cate_available: cat.cate_available,
                parent_category_name: cat.parent_category_name || null,
                image_url: cat.image_name ? `${cat.image_path}${cat.image_name}` : null,
            };

            return GLOBAL_SUCCESS_RESPONSE("Category details fetched successfully.", formatted, res);
        } catch (error) {
            console.error("❌ Error fetching category details:", error);
            return GLOBAL_ERROR_RESPONSE("Internal server error.", error, res);
        }
    };

    /** Update category - Refined for Uniqueness */
    this.updateCategory = async (req, res) => {
        const connection = await pool.getConnection();

        try {
            const {
                id,
                name,
                slug,
                sin_name,
                description,
                parent_category_id,
                edit_id,
                active,
                cate_available,
                category_picture_file
            } = req.body;

            if (!id) {
                connection.release();
                return GLOBAL_ERROR_RESPONSE("Category ID is required.", {}, res);
            }

            await connection.beginTransaction();

            /* 1. CHECK DUPLICATE SLUG ACROSS BOTH TABLES */
            // Check if this slug is used by another category in categories table
            const [catDup] = await connection.query(
                `SELECT id FROM roh_categories WHERE slug = ? AND id != ? LIMIT 1`,
                [slug, id]
            );

            // Check if this slug is used in the global slugs table by a different entity
            const [slugTableDup] = await connection.query(
                `SELECT id FROM roh_slugs WHERE slug = ? AND (entity_id != ? OR type != 'category') LIMIT 1`,
                [slug, id]
            );

            if (catDup.length > 0 || slugTableDup.length > 0) {
                await connection.rollback();
                connection.release();
                return GLOBAL_ERROR_RESPONSE("This slug is already in use by another category or page.", {}, res);
            }

            /* 2. CATEGORY UPDATE LOGIC */
            let cat_img_id = null;

            if (category_picture_file) {
                // Logic for handling new image
                const fileExtension = path.extname(category_picture_file);
                const fileType = fileExtension.slice(1);
                const filePath = `/uploads/media/category/`;

                const [mediaResult] = await connection.query(
                    `
                    INSERT INTO roh_media_gallery
                    (file_name, file_path, file_type, active)
                    VALUES (?, ?, ?, ?)
                    `,
                    [category_picture_file, filePath, fileType, 1]
                );

                cat_img_id = mediaResult.insertId;

                await connection.query(
                    `
                    UPDATE roh_categories
                    SET name = ?,
                        slug = ?,
                        cat_singular_name = ?,
                        description = ?,
                        parent_category_id = ?,
                        active = ?,
                        cate_available = ?, 
                        edit_id = ?,
                        cat_img_id = ?,
                        edit_date = NOW()
                    WHERE id = ?
                    `,
                    [name, slug, sin_name, description, parent_category_id || null, active, cate_available ?? 1, edit_id, cat_img_id, id]
                );
            } else {
                // Update without changing image
                await connection.query(
                    `
                    UPDATE roh_categories
                    SET name = ?,
                        slug = ?,
                        cat_singular_name = ?,
                        description = ?,
                        parent_category_id = ?,
                        active = ?,
                        cate_available = ?, 
                        edit_id = ?,
                        edit_date = NOW()
                    WHERE id = ?
                    `,
                    [name, slug, sin_name, description, parent_category_id || null, active, cate_available ?? 1,  edit_id, id]
                );
            }

            /* 3. SLUG TABLE UPSERT (Syncing roh_slugs table) */
            const SLUG_TYPE = 'category';
            const slugStatus = active == 1 ? 'active' : 'inactive';

            const [existingSlug] = await connection.query(
                `SELECT id FROM roh_slugs WHERE entity_id = ? AND type = ? LIMIT 1`,
                [id, SLUG_TYPE]
            );

            if (existingSlug.length > 0) {
                // Sync existing record
                await connection.query(
                    `
                    UPDATE roh_slugs
                    SET slug = ?,
                        cat_singular_name = ?,
                        status = ?,
                        updated_at = NOW()
                    WHERE entity_id = ? AND type = ?
                    `,
                    [slug, sin_name, slugStatus, id, SLUG_TYPE]
                );
            } else {
                // Create record if it didn't exist in slug table
                await connection.query(
                    `
                    INSERT INTO roh_slugs
                    (slug, cat_singular_name, type, entity_id, status, created_at)
                    VALUES (?, ?, ?, ?, ?, NOW())
                    `,
                    [slug, sin_name, SLUG_TYPE, id, slugStatus]
                );
            }

            /* 4. FINAL COMMIT */
            await connection.commit();
            connection.release();

            return GLOBAL_SUCCESS_RESPONSE("Category updated successfully.", {}, res);

        } catch (err) {
            if (connection) {
                await connection.rollback();
                connection.release();
            }
            console.error("❌ Error updating category:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error.", err, res);
        }
    };

    /** Getting the parent categories list for dropdown Coded by Raj July 27 2025 */
    this.parentCategoryDropdown = async (req, res) => {
        try {
            const sql = `SELECT id, name FROM roh_categories WHERE active = 1 AND parent_category_id IS NULL ORDER BY name ASC`;
            const [categoryList] = await pool.query(sql);

            return GLOBAL_SUCCESS_RESPONSE("Categories fetched successfully", {
                categories: categoryList
            }, res);

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Geting the all active categories Coded by Vishnu Oct 11 2025 */
    this.admingetAllActiveCate = async (req, res) => {
        try {
            const sql = `SELECT id, name, slug FROM roh_categories WHERE active = 1`;
            const [categoryList] = await pool.query(sql);

            return GLOBAL_SUCCESS_RESPONSE("Categories fetched successfully", {
                categories: categoryList
            }, res);

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Get sub-categories by parent category - Coded by Raj Oct 2025 */
    this.getSubCategories = async (req, res) => {
        try {
            const { parent_category_id } = req.body;

            // Validate
            if (!parent_category_id) {
                return GLOBAL_ERROR_RESPONSE("parent_category_id is required.", {}, res);
            }

            //  Fetch all active sub-categories
            const [rows] = await pool.query(
                `SELECT id, name
                FROM roh_categories
                WHERE parent_category_id = ?
                AND active = 1
                ORDER BY name ASC`,
                [parent_category_id]
            );

            if (rows.length === 0) {
                return GLOBAL_SUCCESS_RESPONSE("No sub-categories found.", { sub_categories: [] }, res);
            }

            return GLOBAL_SUCCESS_RESPONSE("Sub-categories fetched successfully.", {
                sub_categories: rows,
            }, res);
        } catch (err) {
            console.error("❌ Error fetching sub-categories:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /**  Get all active main categories with their subcategories - Coded by Raj Oct 31 2025 */
    this.getAllActiveWithChildren = async (req, res) => {
        try {
        const [categories] = await pool.query(`
            SELECT
            c.id AS cat_id,
            c.name AS cat_name,
            c.parent_category_id,
            c.active,
            p.name AS parent_name
            FROM roh_categories c
            LEFT JOIN roh_categories p ON c.parent_category_id = p.id
            WHERE c.active = 1
            ORDER BY c.parent_category_id, c.name ASC
        `);

        if (categories.length === 0) {
            return GLOBAL_SUCCESS_RESPONSE("No categories found.", { mainCats: [] }, res);
        }

        //  Group into main + subcategories
        const mainCats = categories
            .filter((cat) => cat.parent_category_id === null)
            .map((main) => ({
            ...main,
            subcategories: categories.filter(
                (sub) => sub.parent_category_id === main.cat_id
            ),
            }));

        return GLOBAL_SUCCESS_RESPONSE("Categories with children fetched successfully.", {
            mainCats,
        }, res);
        } catch (error) {
        console.error("❌ Error fetching active categories with children:", error);
        return GLOBAL_ERROR_RESPONSE("Internal server error.", error, res);
        }
    };
}
module.exports = new CategoryApi();
