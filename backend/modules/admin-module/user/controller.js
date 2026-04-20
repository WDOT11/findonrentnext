const { pool } = require('../../../config/connection');  /** Import the pool */
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');

function UsersApi() {
    /** Add new user in roh_users table Coded by Vishnu July 06 2025 */
    this.AddnewUser = async (req, res) => {
        try {
            const {
                user_name,
                first_name,
                last_name,
                email,
                phone_number,
                password_hash,
                user_role_id,
                profile_picture_url,
                address_1,
                landmark,
                state,
                city,
                pincode,
                add_id,
                edit_id
            } = req.body;


            /** If the user hasn't uploaded an image, set profile_picture_url to null */
            let profileImageName = null;
            let profileImagePath = null;
            let profileImageType = null;

            if (profile_picture_url) {
                /** If the profile_picture_url is provided, process it */
                const fileExtension = path.extname(profile_picture_url); /** e.g. '.webp', '.jpg' */
                profileImageName = profile_picture_url;  /** File name from request */
                profileImagePath = `/uploads/media/users/profile/`;
                profileImageType = fileExtension.slice(1);  /** Remove the dot (e.g. 'webp', 'jpg') */

            }

            /** Insert the image into the media gallery table only if an image is uploaded */
            if (profileImageName) {
                const mediaQuery = `INSERT INTO roh_media_gallery (file_name, file_path, file_type, active) VALUES (?, ?, ?, ?)`;
                const mediaValues = [profileImageName, profileImagePath, profileImageType, 1];

                pool.execute(mediaQuery, mediaValues, (err, mediaResult) => {
                    if (err) {
                        console.error('Error inserting into media gallery:', err);
                        return GLOBAL_ERROR_RESPONSE("Error saving image to media gallery", err, res);
                    }


                    /** Now insert the user data into the 'roh_users' table, using the media gallery id for the profile picture URL */
                    const userQuery = `INSERT INTO roh_users (user_name, first_name, last_name, email, phone_number, password_hash, user_role_id, profile_picture_url, address_1, landmark, state, city, pincode, verified, add_id, edit_id, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    const userValues = [user_name, first_name, last_name, email, phone_number, password_hash, user_role_id, mediaResult.insertId, address_1, landmark, state, city, pincode, 0, add_id, edit_id, 1];

                    pool.execute(userQuery, userValues, (err, result) => {
                        if (err) {
                            console.error('Error inserting user:', err);
                            // return GLOBAL_ERROR_RESPONSE("Error saving user", err, res);
                            return GLOBAL_ERROR_RESPONSE("Please check your inputs values", err, res);
                        }

                        return GLOBAL_SUCCESS_RESPONSE("User added successfully", { id: result.insertId }, res);
                    });
                });
            } else {
                /** If no image is uploaded, insert the user data without the profile picture */
                const userQuery = `INSERT INTO roh_users (user_name, first_name, last_name, email, phone_number, password_hash, user_role_id, profile_picture_url, address_1, landmark, state, city, pincode, verified, add_id, edit_id, active)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const userValues = [user_name, first_name, last_name, email, phone_number, password_hash, user_role_id, null, address_1, landmark, state, city, pincode, 0, add_id, edit_id, 1];

                pool.execute(userQuery, userValues, (err, result) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        // return GLOBAL_ERROR_RESPONSE("Error saving user", err, res);
                        return GLOBAL_ERROR_RESPONSE("Please check your inputs values", err, res);
                    }

                    return GLOBAL_SUCCESS_RESPONSE("User added successfully", { id: result.insertId }, res);
                });
            }

        } catch (err) {
            console.error('Unexpected error:', err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };


    /** Get all users in roh_users table Coded by Vishnu July 07 2025 */
    this.GetAllUsers = async (req, res) => {
        try {
            // pagination params (ensure integers)
            const page = Number(parseInt(req.body.page, 10)) || 1;
            const limit = Number(parseInt(req.body.limit, 100)) || 100;
            const offset = (page - 1) * limit;

            // filters
            const userName = (req.body.user_name || "").trim();
            const userRoleId = req.body.user_role_id ? String(req.body.user_role_id).trim() : "";
            // allow active to be 0/1 or boolean; if not provided, keep empty (no filter)
            const activeRaw = req.body.active;
            const active = (activeRaw === undefined || activeRaw === null || activeRaw === "") ? "" : (typeof activeRaw === "boolean" ? (activeRaw ? 1 : 0) : Number(activeRaw));

            const connection = pool.promise();

            // Base query
            let query = `SELECT user_id, user_name, first_name, last_name, email, phone_number, user_role_id, add_id, edit_id, add_date, is_service_provider, active FROM roh_users WHERE 1=1`;
            const queryParams = [];

            // Prepare likeValue early so we can re-use for count query
            let likeValue;
            if (userName) {
            likeValue = `%${userName}%`;
            query += ` AND (user_name LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)`;
            queryParams.push(likeValue, likeValue, likeValue, likeValue, likeValue);
            }

            if (userRoleId) {
            query += ` AND user_role_id = ?`;
            queryParams.push(userRoleId);
            }

            if (active !== "") {
            query += ` AND active = ?`;
            queryParams.push(active);
            }

            query += ` ORDER BY user_id DESC`;

            // Add pagination (safe because limit & offset are forced Numbers)
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            // Execute paginated query
            const [paginatedUsers] = await connection.execute(query, queryParams);

            // Build count query to get total
            let countQuery = `SELECT COUNT(*) AS total FROM roh_users WHERE 1=1`;
            const countQueryParams = [];

            if (userName) {
            // reuse likeValue declared above
            countQuery += ` AND (user_name LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)`;
            countQueryParams.push(likeValue, likeValue, likeValue, likeValue, likeValue);
            }

            if (userRoleId) {
            countQuery += ` AND user_role_id = ?`;
            countQueryParams.push(userRoleId);
            }

            if (active !== "") {
            countQuery += ` AND active = ?`;
            countQueryParams.push(active);
            }

            const [totalResult] = await connection.execute(countQuery, countQueryParams);
            const total = Number(totalResult?.[0]?.total || 0);
            const totalPages = Math.ceil(total / limit) || 1;

            // If no users or requested page out of range, return empty set
            if (total === 0 || page > totalPages) {
            return GLOBAL_SUCCESS_RESPONSE("No users found", {
                users: [],
                page,
                limit,
                total,
                totalPages
            }, res);
            }

            return GLOBAL_SUCCESS_RESPONSE("Users fetched successfully", {
            users: paginatedUsers,
            page,
            limit,
            total,
            totalPages,
            }, res);

        } catch (err) {
            console.error("GetAllUsers error:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };


    /** Update user in roh_users table Coded by Vishnu July 07 2025 */
    this.UpdateUser = async (req, res) => {
    try {
        const {
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_role_id,
        password_hash,           // plain text password input
        profile_picture_url,     // existing media id or null
        address_1,
        landmark,
        state,
        city,
        pincode,
        edit_id,
        } = req.body;

        if (!user_id) {
        return GLOBAL_ERROR_RESPONSE("user_id is required", null, res);
        }

        // Helper to normalize empty strings to null
        const toNullIfEmpty = (v) => (v === undefined || v === null || (typeof v === "string" && v.trim() === "") ? null : v);

        // Build dynamic update parts to avoid forcing empty strings into DB
        const setClauses = [];
        const params = [];

        const addSet = (clause, value) => {
        setClauses.push(clause);
        params.push(value);
        };

        if (first_name !== undefined) addSet("first_name = ?", toNullIfEmpty(first_name));
        if (last_name !== undefined) addSet("last_name = ?", toNullIfEmpty(last_name));
        if (email !== undefined) addSet("email = ?", toNullIfEmpty(email));
        if (phone_number !== undefined) addSet("phone_number = ?", toNullIfEmpty(phone_number));
        if (user_role_id !== undefined) addSet("user_role_id = ?", toNullIfEmpty(user_role_id));

        // Password hash only if provided and valid
        if (password_hash !== undefined && password_hash !== null && String(password_hash).trim() !== "") {
        const pwd = String(password_hash).trim();
        if (pwd.length < 8) {
            return GLOBAL_ERROR_RESPONSE("Password must be at least 8 characters long", null, res);
        }
        const hashedPassword = await bcrypt.hash(pwd, 10);
        addSet("password_hash = ?", hashedPassword);
        }

        // Handle profile picture:
        // - If new file uploaded -> insert into media gallery and use insertId
        // - Else, if profile_picture_url provided (could be null) -> set accordingly
        let finalProfileId = undefined;

        if (req.file) {
        const fileExtension = path.extname(req.file.filename);
        const mediaQuery = `INSERT INTO roh_media_gallery (file_name, file_path, file_type, active) VALUES (?, ?, ?, ?)`;
        const mediaValues = [req.file.filename, `/uploads/media/users/profile/`, fileExtension.slice(1), 1];
        const [mediaResult] = await pool.promise().query(mediaQuery, mediaValues);
        finalProfileId = mediaResult.insertId;
        } else if (profile_picture_url !== undefined) {
        // normalize: if empty string or "null" string, set to actual NULL
        const normalized =
            profile_picture_url === null ||
            (typeof profile_picture_url === "string" && profile_picture_url.trim().toLowerCase() === "null") ||
            (typeof profile_picture_url === "string" && profile_picture_url.trim() === "")
            ? null
            : profile_picture_url;
        finalProfileId = normalized;
        }

        if (finalProfileId !== undefined) {
        addSet("profile_picture_url = ?", finalProfileId);
        }

        // Optional address fields:
        // Use NULL when empty string; also guard numeric type for pincode
        if (address_1 !== undefined) addSet("address_1 = ?", toNullIfEmpty(address_1));
        if (landmark !== undefined) addSet("landmark = ?", toNullIfEmpty(landmark));
        if (state !== undefined) addSet("state = ?", toNullIfEmpty(state));
        if (city !== undefined) addSet("city = ?", toNullIfEmpty(city));

        if (pincode !== undefined) {
        let normalizedPin = toNullIfEmpty(pincode);
        // If provided and not null, coerce to number; if NaN, reject
        if (normalizedPin !== null) {
            const num = Number(normalizedPin);
            if (!Number.isInteger(num)) {
            return GLOBAL_ERROR_RESPONSE("Invalid pincode: must be an integer", null, res);
            }
            normalizedPin = num;
        }
        addSet("pincode = ?", normalizedPin);
        }

        if (edit_id !== undefined) addSet("edit_id = ?", toNullIfEmpty(edit_id));

        if (setClauses.length === 0) {
        return GLOBAL_SUCCESS_RESPONSE("Nothing to update", {}, res);
        }

        const sql = `
        UPDATE roh_users
        SET ${setClauses.join(", ")}
        WHERE user_id = ?
        `;

        params.push(user_id);

        const [result] = await pool.promise().query(sql, params);
        return GLOBAL_SUCCESS_RESPONSE("User updated successfully", result, res);
    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };



    /** Delete user in roh_users table Coded by Vishnu July 07 2025 */
    this.DeleteUser = async (req, res) => {
        try {
            const { user_id } = req.body;

            const query = `UPDATE roh_users SET active = 0 WHERE user_id = ?`;

            pool.query(query, [user_id], (err, result) => {
                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error deleting user", err, res);
                }

                if (result.affectedRows === 0) {
                    return GLOBAL_ERROR_RESPONSE("No user deleted", {}, res);
                }

                return GLOBAL_SUCCESS_RESPONSE("User deleted successfully", result, res);
            });

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** View user details in roh_users table Coded by Vishnu July 07 2025 */
    this.ViewUser = async (req, res) => {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return GLOBAL_ERROR_RESPONSE("User ID is required", {}, res);
            }

            /* Added a join to roh_user_business to get business_slug, Coded by Raj March 06,2026 */
            const query = `
            SELECT
                u.user_id,
                u.user_name,
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number,
                u.user_role_id,
                u.profile_picture_url,
                u.business_name,

                ub.business_slug,

                -- user table address
                u.address_1   AS user_address_1,
                u.landmark    AS user_landmark,
                u.state       AS user_state,
                u.city        AS user_city,
                u.pincode     AS user_pincode,

                u.verified,
                u.is_service_provider,
                u.active,

                -- media
                m.file_name,
                m.file_path,

                -- business address fallback
                ba.street_address AS ba_address_1,
                ba.landmark       AS ba_landmark,
                ba.state          AS ba_state,
                ba.city           AS ba_city,
                ba.pincode        AS ba_pincode

            FROM roh_users u
            LEFT JOIN roh_media_gallery m
                ON u.profile_picture_url = m.id
            LEFT JOIN roh_user_business_address ba
                ON ba.user_id = u.user_id
            LEFT JOIN roh_user_business ub
                ON ub.user_id = u.user_id
            WHERE u.user_id = ?
            `;

            pool.query(query, [user_id], (err, result) => {

                if (err) {
                    return GLOBAL_ERROR_RESPONSE("Error fetching user details", err, res);
                }

                if (!result || result.length === 0) {
                    return GLOBAL_ERROR_RESPONSE("User not found", {}, res);
                }

                const isEmpty = (val) =>
                    val === null || val === undefined || val === '';

                const u = result[0];

                const cleanData = [{
                    user_id: u.user_id,
                    user_name: u.user_name,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    email: u.email,
                    phone_number: u.phone_number,
                    user_role_id: u.user_role_id,
                    profile_picture_url: u.profile_picture_url,
                    business_name: u.business_name,
                    business_slug: u.business_slug,

                    // address fallback logic
                    address_1: !isEmpty(u.user_address_1)
                        ? u.user_address_1
                        : u.ba_address_1,

                    landmark: !isEmpty(u.user_landmark)
                        ? u.user_landmark
                        : u.ba_landmark,

                    state: !isEmpty(u.user_state)
                        ? u.user_state
                        : u.ba_state,

                    city: !isEmpty(u.user_city)
                        ? u.user_city
                        : u.ba_city,

                    pincode: !isEmpty(u.user_pincode)
                        ? u.user_pincode
                        : u.ba_pincode,

                    verified: u.verified,
                    is_service_provider: u.is_service_provider,
                    active: u.active,
                    file_name: u.file_name,
                    file_path: u.file_path
                }];

                return GLOBAL_SUCCESS_RESPONSE(
                    "User details fetched successfully",
                    cleanData,
                    res
                );
            });

        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

    /** Api to get all service providers - Coded by Vishnu Nov 20, 2025 */
    this.GetAllServiceProviders = async (req, res) => {
        try {
            const sql = `
                SELECT
                    user_id,
                    first_name,
                    last_name
                FROM roh_users
                WHERE is_service_provider = '1'
                ORDER BY first_name ASC
            `;

            const [rows] = await pool.promise().query(sql);

            return res.status(200).json({
                success: true,
                providers: rows
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    };

    /** Switch User (Impersonation) - Coded by Vishnu April 14, 2026 */
    this.SwitchUser = async (req, res) => {
        try {
            const { user_id } = req.body;

            const [rows] = await pool.promise().query(
                `SELECT user_id, email, first_name, last_name, user_role_id, is_service_provider, phone_number, active 
                 FROM roh_users 
                 WHERE user_id = ?`,
                [user_id]
            );

            if (rows.length === 0) {
                return GLOBAL_ERROR_RESPONSE("User not found", {}, res);
            }

            const user = rows[0];

            if (user.active === 0) {
                return GLOBAL_ERROR_RESPONSE("Cannot switch to an inactive user", {}, res);
            }

            // Generate JWT for the target user (15 days expiry as per public auth)
            const token = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "15d" }
            );

            return res.status(200).json({
                success: true,
                message: "User switched successfully",
                token,
                user: {
                    id: user.user_id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    phoneNumber: user.phone_number,
                    role_id: user.user_role_id,
                    is_service_provider: user.is_service_provider,
                },
            });

        } catch (err) {
            console.error("SwitchUser error:", err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };
}

module.exports = new UsersApi();

