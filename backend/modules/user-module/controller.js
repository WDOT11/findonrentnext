const pool = require('../../config/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function userModuleApi() {

    /** Get user detiles coded by vishnu August 14 2025 */
    this.getUserDetails = async (req, res, next) => {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return res.status(400).json({ message: 'user_id is required' });
            }

            const [rows] = await pool.query(
                `SELECT
                    u.user_id,
                    u.user_name,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.phone_number,
                    u.user_role_id,
                    u.profile_picture_url,   -- This contains the media ID
                    u.is_service_provider,
                    u.address_1,
                    u.landmark,
                    u.state,
                    u.city,
                    u.pincode,
                    u.add_date,

                    -- Media details
                    m.file_name AS profile_file_name,
                    m.file_path AS profile_file_path

                FROM roh_users u
                LEFT JOIN roh_media_gallery m
                    ON m.id = u.profile_picture_url   -- Match with media ID

                WHERE u.user_id = ?`,
                [user_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(rows[0]);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };


    /** Edit user detiles coded by vishnu August 14 2025 */
    this.editUserDetails = async (req, res, next) => {
        try {
            const { user_id, first_name, last_name, phone_number, address_1, landmark, state, city, pincode } = req.body;

            if (!user_id) {
                return res.status(400).json({ message: 'user_id is required' });
            }

            let uploadedMediaId = null;

            /** ===============================
             *  IF FILE IS UPLOADED → Save to media table
             *  =============================== */
            if (req.file) {
                const fileName = req.file.filename;
                const filePath = `/uploads/media/users/profile/`;
                const fileType = req.file.mimetype.split("/")[1];

                const [mediaResult] = await pool.query(
                    `INSERT INTO roh_media_gallery
                        (file_name, file_path, file_type, active)
                    VALUES (?, ?, ?, 1)`,
                    [fileName, filePath, fileType]
                );

                uploadedMediaId = mediaResult.insertId;
            }

            /** ===============================
             *  UPDATE USER DETAILS
             *  =============================== */

            let sql = `
                UPDATE roh_users
                SET first_name = ?,
                    last_name = ?,
                    phone_number = ?,
                    address_1 = ?,
                    landmark = ?,
                    state = ?,
                    city = ?,
                    pincode = ?
            `;

            let params = [first_name, last_name, phone_number, address_1, landmark, state, city, pincode];

            // If image uploaded → update profile_picture_url
            if (uploadedMediaId) {
                sql += `, profile_picture_url = ?`;
                params.push(uploadedMediaId);
            }

            sql += ` WHERE user_id = ?`;
            params.push(user_id);

            const [updateResult] = await pool.query(sql, params);

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json({
                message: "User details updated successfully",
                new_profile_media_id: uploadedMediaId || null
            });

        } catch (error) {
            console.error("User Update Error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}

module.exports = new userModuleApi();
