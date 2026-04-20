const { pool } = require('../../../config/connection');
const path = require('path');

function PostsApi() {

    /** Add new post in roh_posts table - Coded by Vishnu Oct 11, 2025 */
    this.AddnewPost = async (req, res) => {
    try {
        const {
        post_title,
        post_slug,
        dynamic_slug,
        dynamic_cat_id, 
        dynamic_loc_id, 
        description,
        post_excerpt,
        post_status,
        add_id
        } = req.body;

        let postImageName = null;
        let postImagePath = null;
        let postImageType = null;

        /* ===============================
        HANDLE IMAGE (IF PROVIDED)
        =============================== */
        if (req.body.post_picture_url) {
        const fileExtension = path.extname(req.body.post_picture_url);
        postImageName = req.body.post_picture_url;
        postImagePath = `/uploads/media/post/`;
        postImageType = fileExtension.slice(1);
        }

        /* ===============================
        IMAGE EXISTS → SAVE MEDIA
        =============================== */
        if (postImageName) {
        const mediaQuery = `
            INSERT INTO roh_media_gallery
            (file_name, file_path, file_type, active)
            VALUES (?, ?, ?, ?)
        `;

        const mediaValues = [
            postImageName,
            postImagePath,
            postImageType,
            1
        ];

        pool.execute(mediaQuery, mediaValues, (err, mediaResult) => {
            if (err) {
            console.error("Error inserting media:", err);
            return GLOBAL_ERROR_RESPONSE(
                "Error saving image",
                err,
                res
            );
            }

            const postQuery = `
            INSERT INTO roh_posts
            (
                post_title,
                post_slug,
                dynamic_slug,
                dynamic_cat_id,
                dynamic_loc_id,
                description,
                post_excerpt,
                post_status,
                post_img_id,
                add_id,
                edit_id,
                add_date,
                edit_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NOW(), NOW())
            `;

            const postValues = [
            post_title,
            post_slug,
            dynamic_slug || null,
            dynamic_cat_id || null,
            dynamic_loc_id || null,
            description,
            post_excerpt,
            post_status || "draft",
            mediaResult.insertId,
            add_id || null
            ];

            pool.execute(postQuery, postValues, (err, result) => {
            if (err) {
                console.error("Error inserting post:", err);
                return GLOBAL_ERROR_RESPONSE(
                "Please check your input values",
                err,
                res
                );
            }

            return GLOBAL_SUCCESS_RESPONSE(
                "Post added successfully",
                { id: result.insertId },
                res
            );
            });
        });
        }

        /* ===============================
        NO IMAGE CASE
        =============================== */
        else {
        const postQuery = `
            INSERT INTO roh_posts
            (
            post_title,
            post_slug,
            dynamic_slug,
            dynamic_cat_id,
            dynamic_loc_id,
            description,
            post_excerpt,
            post_status,
            post_img_id,
            add_id,
            edit_id,
            add_date,
            edit_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, NULL, NOW(), NOW())
        `;

        const postValues = [
            post_title,
            post_slug,
            dynamic_slug || null,
            dynamic_cat_id || null,
            dynamic_loc_id || null,
            description,
            post_excerpt,
            post_status || "draft",
            add_id || null
        ];

        pool.execute(postQuery, postValues, (err, result) => {
            if (err) {
            console.error("Error inserting post:", err);
            return GLOBAL_ERROR_RESPONSE(
                "Please check your input values",
                err,
                res
            );
            }

            return GLOBAL_SUCCESS_RESPONSE(
            "Post added successfully",
            { id: result.insertId },
            res
            );
        });
        }

    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE(
        "Internal server error",
        err,
        res
        );
    }
    };



    /** List all posts with pagination and search - Coded by Vishnu Oct 11, 2025 */
    this.ListAllPosts = async (req, res) => {
    try {
        /* ===========================
        PAGINATION
        =========================== */
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        /* ===========================
        FILTER INPUTS
        =========================== */
        const searchTitle = (req.query.title || "").trim();
        const searchStatus = (req.query.status || "").trim();
        const categorySlug = (req.query.category_slug || "").trim();
        const locationSlug = (req.query.location_slug || "").trim();

        let whereClauses = [];
        let params = [];

        /* ===========================
        TITLE FILTER
        =========================== */
        if (searchTitle) {
        whereClauses.push(`p.post_title LIKE ?`);
        params.push(`%${searchTitle}%`);
        }

        /* ===========================
        STATUS FILTER
        =========================== */
        if (searchStatus) {
        whereClauses.push(`p.post_status = ?`);
        params.push(searchStatus);
        }

        /* ===========================
        CATEGORY / LOCATION FILTER
        (FAQ STYLE PRIORITY)
        =========================== */
        if (categorySlug && locationSlug) {
        whereClauses.push(`p.dynamic_slug = ?`);
        params.push(`${categorySlug}/${locationSlug}`);
        } 
        else if (categorySlug) {
        whereClauses.push(`p.dynamic_slug = ?`);
        params.push(categorySlug);
        } 
        else if (locationSlug) {
        whereClauses.push(`p.dynamic_slug = ?`);
        params.push(locationSlug);
        }

        const whereSQL = whereClauses.length
        ? `WHERE ${whereClauses.join(" AND ")}`
        : "";

        /* ===========================
        MAIN QUERY
        =========================== */
        const listQuery = `
        SELECT 
            p.id,
            p.post_title,
            p.post_slug,
            p.dynamic_slug,
            p.description,
            p.post_excerpt,
            p.post_status,
            p.add_date,
            p.edit_date,
            m.file_name AS post_image_name,
            m.file_path AS post_image_path
        FROM roh_posts p
        LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
        ${whereSQL}
        ORDER BY p.add_date DESC
        LIMIT ? OFFSET ?
        `;

        params.push(limit, offset);

        /* ===========================
        COUNT QUERY
        =========================== */
        const countQuery = `
        SELECT COUNT(*) AS total
        FROM roh_posts p
        ${whereSQL}
        `;

        const [rows] = await pool.promise().query(listQuery, params);
        const [countRows] = await pool
        .promise()
        .query(countQuery, params.slice(0, params.length - 2));

        const totalPosts = countRows[0].total;
        const totalPages = Math.ceil(totalPosts / limit);

        /* ===========================
        FORMAT RESPONSE
        =========================== */
        const formattedResults = rows.map((post) => ({
        id: post.id,
        post_title: post.post_title,
        post_slug: post.post_slug,
        dynamic_slug: post.dynamic_slug,
        description: post.description,
        post_excerpt: post.post_excerpt,
        post_status: post.post_status,
        add_date: post.add_date,
        edit_date: post.edit_date,
        post_image_url: post.post_image_name
            ? post.post_image_path + post.post_image_name
            : null,
        }));

        return res.status(200).json({
        status: true,
        message: "Posts fetched successfully",
        data: formattedResults,
        pagination: {
            currentPage: page,
            totalPages,
            totalPosts,
            limit,
        },
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };



    /** View single post - Optimized - Coded by Vishnu Oct 12, 2025 */
    this.ViewSinglePost = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
        return GLOBAL_ERROR_RESPONSE("Post ID is required", null, res);
        }

        /* ===========================
        VIEW QUERY (UPDATED)
        =========================== */
        const viewQuery = `
        SELECT 
            p.id,
            p.post_title,
            p.post_slug,
            p.dynamic_slug,
            p.description,
            p.post_excerpt,
            p.post_status,
            p.add_date,
            p.edit_date,
            m.file_name AS post_image_name,
            m.file_path AS post_image_path
        FROM roh_posts p
        LEFT JOIN roh_media_gallery m ON p.post_img_id = m.id
        WHERE p.id = ?
        LIMIT 1
        `;

        pool.execute(viewQuery, [id], (err, results) => {
        if (err) {
            console.error("Error fetching post:", err);
            return GLOBAL_ERROR_RESPONSE(
            "Error fetching post details",
            err,
            res
            );
        }

        if (!results || results.length === 0) {
            return GLOBAL_ERROR_RESPONSE("Post not found", null, res);
        }

        const post = results[0];

        const formattedPost = {
            id: post.id,
            post_title: post.post_title,
            post_slug: post.post_slug,
            dynamic_slug: post.dynamic_slug, 
            description: post.description,
            post_excerpt: post.post_excerpt,
            post_status: post.post_status,
            add_date: post.add_date,
            edit_date: post.edit_date,
            post_image_url: post.post_image_name
            ? post.post_image_path + post.post_image_name
            : null,
        };

        return GLOBAL_SUCCESS_RESPONSE(
            "Post details fetched successfully",
            formattedPost,
            res
        );
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE(
        "Internal server error",
        err,
        res
        );
    }
    };


    /** Update single post - Coded by Vishnu Oct 12, 2025 */
    this.UpdateSinglePost = async (req, res) => {
    try {
        const {
        id,
        post_title,
        post_slug,
        dynamic_slug,
        dynamic_cat_id,   
        dynamic_loc_id,   
        description,
        post_excerpt,
        post_status,
        edit_id
        } = req.body;

        if (!id) {
        return GLOBAL_ERROR_RESPONSE("Post ID is required", null, res);
        }

        let postImageName = null;
        let postImagePath = null;
        let postImageType = null;

        /* ===========================
        IMAGE HANDLING
        =========================== */
        if (req.body.post_picture_url) {
        const fileExtension = path.extname(req.body.post_picture_url);
        postImageName = req.body.post_picture_url;
        postImagePath = `/uploads/media/post/`;
        postImageType = fileExtension.slice(1);
        }

        /* ===========================
        IF NEW IMAGE UPLOADED
        =========================== */
        if (postImageName) {
        const mediaQuery = `
            INSERT INTO roh_media_gallery
            (file_name, file_path, file_type, active)
            VALUES (?, ?, ?, ?)
        `;

        const mediaValues = [
            postImageName,
            postImagePath,
            postImageType,
            1
        ];

        pool.execute(mediaQuery, mediaValues, (err, mediaResult) => {
            if (err) {
            console.error("Error inserting media:", err);
            return GLOBAL_ERROR_RESPONSE(
                "Error saving new image",
                err,
                res
            );
            }

            const updateQuery = `
            UPDATE roh_posts
            SET
                post_title = ?,
                post_slug = ?,
                dynamic_slug = ?,
                dynamic_cat_id = ?,     
                dynamic_loc_id = ?,     
                description = ?,
                post_excerpt = ?,
                post_status = ?,
                post_img_id = ?,
                edit_id = ?,
                edit_date = NOW()
            WHERE id = ?
            `;

            const updateValues = [
            post_title,
            post_slug,
            dynamic_slug || null,
            dynamic_cat_id || null,
            dynamic_loc_id || null,
            description,
            post_excerpt,
            post_status || "draft",
            mediaResult.insertId,
            edit_id || null,
            id
            ];

            pool.execute(updateQuery, updateValues, (err) => {
            if (err) {
                console.error("Error updating post:", err);
                return GLOBAL_ERROR_RESPONSE(
                "Error updating post",
                err,
                res
                );
            }

            return GLOBAL_SUCCESS_RESPONSE(
                "Post updated successfully",
                {},
                res
            );
            });
        });
        }

        /* ===========================
        NO NEW IMAGE
        =========================== */
        else {
        const updateQuery = `
            UPDATE roh_posts
            SET
            post_title = ?,
            post_slug = ?,
            dynamic_slug = ?,
            dynamic_cat_id = ?,     
            dynamic_loc_id = ?,     
            description = ?,
            post_excerpt = ?,
            post_status = ?,
            edit_id = ?,
            edit_date = NOW()
            WHERE id = ?
        `;

        const updateValues = [
            post_title,
            post_slug,
            dynamic_slug || null,
            dynamic_cat_id || null,
            dynamic_loc_id || null,
            description,
            post_excerpt,
            post_status || "draft",
            edit_id || null,
            id
        ];

        pool.execute(updateQuery, updateValues, (err) => {
            if (err) {
            console.error("Error updating post:", err);
            return GLOBAL_ERROR_RESPONSE(
                "Error updating post",
                err,
                res
            );
            }

            return GLOBAL_SUCCESS_RESPONSE(
            "Post updated successfully",
            {},
            res
            );
        });
        }

    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE(
        "Internal server error",
        err,
        res
        );
    }
    };





}

module.exports = new PostsApi();
