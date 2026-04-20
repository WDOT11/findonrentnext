// controller.js
const pool = require('../../../config/connection');  /** Correct import of the promisePool */
const bcrypt = require('bcrypt');
const path = require("path");
const jwt = require('jsonwebtoken');

const axios = require("axios");

// const geoip = require("geoip-lite");

require('dotenv').config();
const nodemailer = require('nodemailer');
const saltRounds = 10;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function authApi() {

    /** Function method to register the user Coded by Raj July 08 2025 */
    this.userRegister = async (req, res) => {
        try {
            const {firstName, lastName, email, phone, altPhoneNumber, password, referralCode } = req.body;
            const active = 0;
            const user_role_id = 3;

            // NORMALIZE referral code (THIS FIXES LIVE ISSUE)
            const normalizedReferralCode =
            referralCode && referralCode.trim() !== ""
                ? referralCode.trim()
                : null;

            let passwordHash;
            try {
            passwordHash = await bcrypt.hash(password, saltRounds);
            } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Error hashing password.", err, res);
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const sql = `
            INSERT INTO roh_users
            (first_name, last_name, email, phone_number, alt_phone_number, password_hash, user_role_id, active, authorize_code, verified, referral_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const params = [
            firstName,
            lastName,
            email,
            phone,
            altPhoneNumber,
            passwordHash,
            user_role_id,
            active,
            otp,
            0,
            normalizedReferralCode /** FIXED */
            ];

            const [result] = await pool.query(sql, params);

            if (result.affectedRows === 1) {
            /** Send OTP Email via SendGrid */

                const html = `
                <div style="background:#f7f9fb;padding:40px 0;font-family:'Inter',Arial,sans-serif;">
                    <table style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e9f2;box-shadow:0 4px 14px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background:linear-gradient(90deg,#007BFF,#00B4D8);padding:20px 30px;color:#fff;">
                        <h2 style="margin:0;font-size:22px;">🔐 FindOnRent Verification Code</h2>
                        <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Secure login — One Time Password (OTP)</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;color:#333;">
                        <h3 style="margin:0 0 15px;color:#007BFF;">Hello ${firstName || "User"},</h3>
                        <p style="font-size:15px;line-height:1.7;margin:0 0 15px;">
                            Your One-Time Password (OTP) for verifying your account on
                            <strong>FindOnRent</strong> is:
                        </p>
                        <div style="text-align:center;margin:25px 0;">
                            <div style="display:inline-block;background:#007BFF;color:#fff;font-size:28px;letter-spacing:6px;font-weight:bold;padding:15px 35px;border-radius:10px;">
                            ${otp}
                            </div>
                        </div>
                        <p style="font-size:14px;color:#555;margin:10px 0;">
                            ⏰ This code will expire in <strong>10 minutes</strong>. Please do not share it with anyone.
                        </p>
                        <div style="margin-top:30px;">
                            <p style="font-size:13px;color:#555;line-height:1.5;">
                            Regards,<br/>
                            <strong>FindOnRent Team</strong><br/>
                            <a href="https://findonrent.com" style="color:#007BFF;text-decoration:none;">https://findonrent.com</a>
                            </p>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f1f1f1;text-align:center;padding:12px 10px;color:#666;font-size:12px;">
                        This is an automated message from <strong>FindOnRent</strong>. Please do not reply directly.
                        </td>
                    </tr>
                    </table>
                    <div style="text-align:center;margin-top:20px;font-size:12px;color:#999;">
                    © 2026 FindOnRent. All rights reserved.<br>
                    Powered by <strong style="color:#007BFF;">WebDevOps Pvt Ltd</strong>
                    </div>
                </div>
                `;

                // await sgMail.send({
                // to: email,
                // cc: process.env.CCEMAILS ? process.env.OTPCCEMAILS.split(',').filter(Boolean) : undefined,
                // from: process.env.FROM_EMAIL,
                // subject: "Your OTP Code - FindOnRent",
                // html,
                // });

                /** OTP success message here */

            /* ===============================
                💤 OLD GMAIL SMTP CODE (disabled)
                Uncomment to re-enable later
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
                from: process.env.SMTP_FROM || `"FindOnRent" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Your OTP Code - FindOnRent",
                html,
            });


            return GLOBAL_SUCCESS_RESPONSE("User registered successfully. OTP sent.", {}, res);
            } else {
            return GLOBAL_ERROR_RESPONSE("Failed to register user.", {}, res);
            }

        } catch (err) {
            let message = "Internal server error";
            if (err.code === "ER_DUP_ENTRY") {
            message = "Duplicate User Name Or Email.";
            }
            return GLOBAL_ERROR_RESPONSE(message, err, res);
        }
    };

    /** Function method to register the service provider Coded by Raj July 08 2025 */
    this.serviceProviderRegister = async (req, res) => {
        try {
            // const { userName, firstName, lastName, email, phone, password, address_1, landmark, city, state, pincode } = req.body;
            const { firstName, lastName, email, phone, password, address_1, landmark, city, state, pincode } = req.body;

            const active = 1;
            const user_role_id = 2; /** Need to use the role id for the service provider. */
            const profile_picture_url = "";

            let passwordHash;
            try {
                passwordHash = await bcrypt.hash(password, saltRounds);
            } catch (err) {
                return GLOBAL_ERROR_RESPONSE("Error hashing password.", err, res);
            }

            /** SQL query to insert data into the users table */
            // const sql = `INSERT INTO roh_users (user_name, first_name, last_name, email, phone_number, password_hash, user_role_id, profile_picture_url, active, address_1, landmark, state, city, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const sql = `INSERT INTO roh_users (first_name, last_name, email, phone_number, password_hash, user_role_id, profile_picture_url, active, address_1, landmark, state, city, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            /* Execute the query using the pool */
            // const [result] = await pool.query(sql, [ userName, firstName, lastName, email, phone, passwordHash, user_role_id, profile_picture_url, active, address_1, landmark, city, state, pincode]);
            const [result] = await pool.query(sql, [firstName, lastName, email, phone, passwordHash, user_role_id, profile_picture_url, active, address_1, landmark, city, state, pincode]);

            if (result.affectedRows === 1) {
                return GLOBAL_SUCCESS_RESPONSE(
                    "Service provider registered successfully.", {}, res
                );
            } else {
                return GLOBAL_ERROR_RESPONSE("Failed to register service provider.", {}, res);
            }

        } catch (err) {
            let message = "Internal server error";
            /** MySQL errors like duplicate entries for user */
            if (err.code === 'ER_DUP_ENTRY') {
                message = "Duplicate User Name Or Email.";
            }
            return GLOBAL_ERROR_RESPONSE(message, err, res);
        }
    };

    /** Function method to login the user - Coded by Raj July 09 2025 */
    /** Updated for Phone/Email Login Support */
    this.userLogin = async (req, res) => {
        try {
            // 1. Accept 'identifier' (new) or 'email' (old fallback)
            const { identifier, email, password } = req.body;

            // Determine which value to search for
            const loginValue = identifier || email;
            const panel = "User";

            if (!loginValue || !password) {
                return res.status(400).json({ message: "Please provide email/phone and password." });
            }

            /** Step 1: Check if user exists by Email OR Phone Number */
            const [userRows] = await pool.query(
                `SELECT user_id, email, first_name, last_name, password_hash, user_role_id, active, authorize_code, verified, is_service_provider, phone_number
                FROM roh_users
                WHERE email = ? OR phone_number = ?`,
                [loginValue, loginValue] // Pass the value twice for the two placeholders
            );

            if (userRows.length === 0) {
                await logLoginAttempt({
                    req,
                    panel,
                    loginValue,
                    success: 0,
                    passwordAttempt: password
                });

                return res.status(401).json({ message: "Invalid email or phone number." });
            }

            const user = userRows[0];

            /** admin will be not able to login from this API */
            if (user.user_role_id === 1) {
                await logLoginAttempt({
                    req,
                    panel,
                    loginValue,
                    userId: user.user_id,
                    success: 0,
                    passwordAttempt: null
                });

                return res.status(403).json({
                    message: "You are not allowed to access."
                });
            }

            /** Step 2: Check password */
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {

                await logLoginAttempt({
                    req,
                    panel,
                    loginValue,
                    userId: user.user_id,
                    success: 0,
                    passwordAttempt: password
                });

                return res.status(401).json({ message: "Invalid password." });
            }

            /** Step 3: OTP check (if not verified) */
            // Logic: If unverified, we MUST send OTP to their Email (fetched from DB), even if they logged in via Phone.
            // if (
            //     (!user.active || user.active === 0) ||
            //     user.verified === 0 ||
            //     (user.authorize_code !== null && user.verified !== 1)
            // ) {
            if (
                (!user.active || user.active == 0) ||
                (user.authorize_code !== null)
            ) {
                let otp = user.authorize_code;

                /** Generate & save OTP if missing */
                if (!otp) {
                    otp = Math.floor(100000 + Math.random() * 900000).toString();
                    await pool.query(
                        `UPDATE roh_users SET authorize_code = ? WHERE user_id = ?`,
                        [otp, user.user_id]
                    );
                }

                /** Prepare HTML Email */
                const html = `
                <div style="background:#f7f9fb;padding:40px 0;font-family:'Inter',Arial,sans-serif;">
                    <table style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e9f2;box-shadow:0 4px 14px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background:linear-gradient(90deg,#007BFF,#00B4D8);padding:20px 30px;color:#fff;">
                        <h2 style="margin:0;font-size:22px;">🔐 Account Verification (OTP)</h2>
                        <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">Secure your FindOnRent account</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;color:#333;">
                        <h3 style="margin:0 0 15px;color:#007BFF;">Hello ${user.first_name || "User"},</h3>
                        <p style="font-size:15px;line-height:1.7;margin:0 0 15px;">
                            Your One-Time Password (OTP) to verify your account on
                            <strong>FindOnRent</strong> is:
                        </p>
                        <div style="text-align:center;margin:25px 0;">
                            <div style="display:inline-block;background:#007BFF;color:#fff;font-size:28px;letter-spacing:6px;font-weight:bold;padding:15px 35px;border-radius:10px;">
                            ${otp}
                            </div>
                        </div>
                        <p style="font-size:14px;color:#555;margin:10px 0;">
                            ⏰ This code will expire in <strong>10 minutes</strong>. Please do not share it with anyone.
                        </p>
                        <div style="margin-top:30px;">
                            <p style="font-size:13px;color:#555;line-height:1.5;">
                            Regards,<br/>
                            <strong>FindOnRent Team</strong><br/>
                            <a href="https://findonrent.com" style="color:#007BFF;text-decoration:none;">https://findonrent.com</a>
                            </p>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f1f1f1;text-align:center;padding:12px 10px;color:#666;font-size:12px;">
                        This is an automated message from <strong>FindOnRent</strong>. Please do not reply directly.
                        </td>
                    </tr>
                    </table>
                    <div style="text-align:center;margin-top:20px;font-size:12px;color:#999;">
                    © 2026 FindOnRent. All rights reserved.<br>
                    Powered by <strong style="color:#007BFF;">WebDevOps Pvt Ltd</strong>
                    </div>
                </div>
                `;

                /** Send OTP via SendGrid */
                // try {
                //     await sgMail.send({
                //         to: user.email, // Always send to the email found in DB
                //         cc: process.env.CCEMAILS ? process.env.OTPCCEMAILS.split(',').filter(Boolean) : undefined,
                //         from: process.env.FROM_EMAIL,
                //         subject: "Your OTP Code - FindOnRent (Login Verification)",
                //         html,
                //     });
                // } catch (emailErr) {
                //     console.error("❌ Error sending login OTP via SendGrid:", emailErr.response?.body || emailErr);
                // }

                /** Send OTP via Gmail (Nodemailer) */
                try {
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
                        from: process.env.SMTP_FROM || `"FindOnRent" <${process.env.SMTP_USER}>`,
                        to: user.email,
                        subject: "Your OTP Code - FindOnRent (Login Verification)",
                        html,
                    });
                } catch(smtpErr) {
                    console.error("❌ Error sending login OTP via SMTP fallback:", smtpErr);
                    // If both fail, we might want to throw error or just return the JSON
                }

                await logLoginAttempt({
                    req,
                    panel,
                    loginValue,
                    userId: user.user_id,
                    success: 0,
                    passwordAttempt: password
                });

                /** Response back to frontend */
                return res.status(200).json({
                    message: "OTP verification required. Email sent successfully.",
                    otpRequired: true,
                    userId: user.user_id,
                    email: user.email, // Return email so frontend knows where it went
                });
            }

            /** Step 4: Normal login (verified user) */
            const token = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "15d" }
            );

            await logLoginAttempt({
                req,
                panel,
                loginValue,
                userId: user.user_id,
                success: 1,
                passwordAttempt: null // never store password on success
            });

            return res.status(200).json({
                message: "Login successful.",
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
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Internal Server error" });
        }
    };

    /** Function method to login the admin users - Coded by Raj July 10 2025 */
    this.adminUserLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            // const panel = "Admin";
            const loginValue = email;

            /* Query the user from 'roh_users' by email */
            const [rows] = await pool.query(
                'SELECT user_id, email, password_hash, user_role_id, first_name, last_name FROM roh_users WHERE email = ?',
                [email]
            );

            /* If user not found */
            if (rows.length == 0) {

                await logLoginAttempt({
                    req,
                    panel: "Admin",
                    loginValue,
                    success: 0,
                    passwordAttempt: password
                });

                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            const user = rows[0];

            /** only admin will be able to login from this API */
            if (user.user_role_id !== 1) {
                await logLoginAttempt({
                    req,
                    panel : "Admin",
                    loginValue,
                    userId: user.user_id,
                    success: 0,
                    passwordAttempt: null
                });

                return res.status(403).json({
                    message: "You are not allowed to access."
                });
            }

            /* Compare the password with the stored hash */
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {

                await logLoginAttempt({
                    req,
                    panel: "Admin",
                    loginValue,
                    userId: user.user_id,
                    success: 0,
                    passwordAttempt: password
                });

                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            /* Generate JWT */
            const token = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );

            /* Log successful login */
            await logLoginAttempt({
                req,
                panel: "Admin",
                loginValue,
                userId: user.user_id,
                success: 1,
                passwordAttempt: null
            });

            /* Respond with success */
            return res.status(200).json({
                message: 'Login successful.',
                token,
                user: {
                    id: user.user_id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role_id: user.user_role_id
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server error' });
        }
    };

    /** Helper function to create the login log - Coded by Raj Jan 28 2026 */
    const logLoginAttempt = async ({ req, panel, loginValue, userId = null, success = 0, passwordAttempt = null }) => {
        try {
            const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || null;
            const browser = req.headers['user-agent'] || null;

            // Use pool.promise() if you didn't change the import in Option 1
            await pool.query(
                `INSERT INTO roh_login_logs (ip_address, browser, panel, user_email, user_id, date, success, password_attempt)
                VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
                [ipAddress, browser, panel, loginValue, userId, success, passwordAttempt]
            );
        } catch (err) {
            console.error("Login log error:", err);
        }
    };

    /** Function method to check availability of user - Coded by Vishnu Aug 11 2025 */
    this.checkAvailability = async (req, res) => {
        try {
            const { userName, email } = req.body || {};
            const taken = { userName: false, email: false, phone: false };

            // Build dynamic WHEREs only for provided fields
            const checks = [];
            const params = [];
            // if (userName) { checks.push("user_name = ?"); params.push(userName); }
            if (email)    { checks.push("email = ?");     params.push(email); }

            if (!checks.length) {
            return GLOBAL_ERROR_RESPONSE("No fields to check.", {}, res);
            }

            // Single query for speed using OR, then inspect rows
            const sql = `SELECT email FROM roh_users WHERE ${checks.join(" OR ")} LIMIT 50`;
            const [rows] = await pool.query(sql, params);

            if (rows?.length) {
            for (const r of rows) {
                // if (userName && r.user_name === userName) taken.userName = true;
                if (email && r.email === email) taken.email = true;
            }
            }

            return GLOBAL_SUCCESS_RESPONSE("Availability fetched.", { taken }, res);
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Failed to check availability.", err, res);
        }
    };

    /** OTP Verification Endpoint - Coded by Vishnu Aug 12 2025 */
    this.signUpverifyOTP = async (req, res) => {
        try {
            const { email, otp } = req.body;
            const panel = "User";

            /* Get OTP */
            const [rows] = await pool.query("SELECT authorize_code FROM roh_users WHERE email = ?", [email]);

            if (!rows.length) {
                return GLOBAL_ERROR_RESPONSE("User not found", {}, res);
            }

            const dbOtp = String(rows[0].authorize_code).trim();
            const reqOtp = String(otp).trim();

            if (dbOtp !== reqOtp) {
                return GLOBAL_ERROR_RESPONSE("Invalid OTP", {}, res);
            }

            /* Activate user */
            await pool.query(`UPDATE roh_users SET active = 1, authorize_code = NULL, verified = 1 WHERE email = ?`, [email]);

            /* Fetch user data (same as login API) */
            const [userRows] = await pool.query(`SELECT user_id, email, user_role_id, first_name, last_name, phone_number, is_service_provider FROM roh_users WHERE email = ?`, [email]);

            const user = userRows[0];

            /* Generate JWT */
            const token = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '15d' }
            );

            /* Log login attempt */
            await logLoginAttempt({
                req,
                panel,
                loginValue: email,
                userId: user.user_id,
                success: 1
            });

            /* Respond as logged-in user */
            return GLOBAL_SUCCESS_RESPONSE(
                "OTP verified successfully. Logged in.",
                {
                    token,
                    user: {
                        id: user.user_id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        role_id: user.user_role_id,
                        is_service_provider: user.is_service_provider,
                    }
                },
                res
            );

        } catch (err) {
            console.error(err);
            return GLOBAL_ERROR_RESPONSE("OTP verification failed", err, res);
        }
    };

    /** Resend OTP Endpoint - Coded by Vishnu Aug 12 2025 */
    this.resendOTP = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
        return res.status(400).json({
            message: "Email or phone is required",
        });
        }

        /** Find user EXACTLY like login */
        const [userRows] = await pool.query(
        `SELECT user_id, email, first_name, authorize_code, active, verified
        FROM roh_users
        WHERE email = ? OR phone_number = ?`,
        [identifier, identifier]
        );

        if (userRows.length === 0) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        const user = userRows[0];

        if (!user.email) {
        return res.status(400).json({
            message: "User email not found",
        });
        }

        /** Generate / overwrite OTP (resend means NEW OTP) */
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await pool.query(
        `UPDATE roh_users SET authorize_code = ? WHERE user_id = ?`,
        [otp, user.user_id]
        );

        /** SAME EMAIL HTML (shortened here) */
        const html = `
            <div style="background:#f7f9fb;padding:40px 0;font-family:'Inter',Arial,sans-serif;">
            <table style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e9f2;box-shadow:0 4px 14px rgba(0,0,0,0.05);">

                <!-- Header -->
                <tr>
                <td style="background:linear-gradient(90deg,#007BFF,#00B4D8);padding:20px 30px;color:#fff;">
                    <h2 style="margin:0;font-size:22px;">🔐 New OTP for Account Verification</h2>
                    <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">
                    Your secure verification code from FindOnRent
                    </p>
                </td>
                </tr>

                <!-- Body -->
                <tr>
                <td style="padding:30px;color:#333;">
                    <h3 style="margin:0 0 15px;color:#007BFF;">
                    Hello ${user.first_name || "User"},
                    </h3>

                    <p style="font-size:15px;line-height:1.7;margin:0 0 15px;">
                    Your One-Time Password (OTP) for verifying your account on
                    <strong>FindOnRent</strong> is:
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center;margin:25px 0;">
                    <div style="
                        display:inline-block;
                        background:#007BFF;
                        color:#fff;
                        font-size:28px;
                        letter-spacing:6px;
                        font-weight:bold;
                        padding:15px 35px;
                        border-radius:10px;
                    ">
                        ${otp}
                    </div>
                    </div>

                    <p style="font-size:14px;color:#555;margin:10px 0;">
                    ⏰ This code will expire in <strong>10 minutes</strong>.
                    Please do not share it with anyone.
                    </p>

                    <div style="margin-top:30px;">
                    <p style="font-size:13px;color:#555;line-height:1.5;">
                        Regards,<br/>
                        <strong>FindOnRent Team</strong><br/>
                        <a href="https://findonrent.com"
                        style="color:#007BFF;text-decoration:none;">
                        https://findonrent.com
                        </a>
                    </p>
                    </div>
                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td style="background:#f1f1f1;text-align:center;padding:12px 10px;color:#666;font-size:12px;">
                    This is an automated message from <strong>FindOnRent</strong>.
                    Please do not reply directly.
                </td>
                </tr>
            </table>

            <div style="text-align:center;margin-top:20px;font-size:12px;color:#999;">
                © 2026 FindOnRent. All rights reserved.<br/>
                Powered by <strong style="color:#007BFF;">WebDevOps Pvt Ltd</strong>
            </div>
            </div>
            `;


        /** SAME NODEMAILER LOGIC AS LOGIN */
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
        from: process.env.SMTP_FROM || `"FindOnRent" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Your OTP Code - FindOnRent",
        html,
        });

        /** 5️⃣ Response */
        return res.status(200).json({
        message: "OTP resent successfully",
        otpRequired: true,
        userId: user.user_id,
        email: user.email,
        });

    } catch (err) {
        console.error("Resend OTP error:", err);
        return res.status(500).json({
        message: "Failed to resend OTP",
        });
    }
    };

    /** signInverifyOtp user login - Coded by Vishnu Aug 13 2025 */
    this.signInverifyOtp = async (req, res) => {
        try {
            const { userId, otp } = req.body;

            const [rows] = await pool.query(`
                SELECT user_id, authorize_code FROM roh_users
                WHERE user_id = ? AND verified = 0 AND (active = 0 OR active IS NULL)
            `, [userId]);

            if (rows.length === 0) {
                return res.status(400).json({ message: 'Invalid user or already verified.' });
            }

            const user = rows[0];

            if (user.authorize_code !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            await pool.query(`
                UPDATE roh_users
                SET authorize_code = NULL, active = 1, verified = 1
                WHERE user_id = ?
            `, [userId]);

            return res.status(200).json({
                message: 'OTP verified successfully. Please login again.'
            });
        } catch (error) {
            console.error('OTP verification error:', error);
            return res.status(500).json({ message: 'Internal Server error' });
        }
    };

    /** Api to User Forgot Password - Send Reset Token (Only user_role_id = 3) - Coded by Vishnu Dec 01 2025 */
    this.UserforgotPassword = async (req, res) => {
        try {
            const email = req.body.email?.trim();

            /** Check if email exists */
            const [rows] = await pool.query(
                `SELECT user_id, email, first_name, user_role_id
                FROM roh_users
                WHERE email = ?`,
                [email]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: "Invalid email address." });
            }

            const user = rows[0];

            /** Allow only normal users (role = 3) */
            if (user.user_role_id !== 3) {
                return res.status(403).json({ message: "Invalid email address." });
            }

            /** Generate reset token */
            const resetToken = jwt.sign(
                { userId: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            /** Save token in DB */
            await pool.query(
                `UPDATE roh_users SET auth_reset_token = ? WHERE user_id = ?`,
                [resetToken, user.user_id]
            );

            /** Reset Link */
            const resetLink = `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/reset-password/${resetToken}`;

            /** Email HTML */
            const html = `
            <div style="background:#f7f9fb;padding:40px;font-family:'Inter',Arial,sans-serif;">
                <table style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;border:1px solid #e5e9f2;">
                    <tr>
                        <td style="background:linear-gradient(90deg,#007BFF,#00B4D8);padding:20px 30px;color:#fff;">
                            <h2 style="margin:0;font-size:22px;">🔐 Password Reset</h2>
                            <p style="margin:5px 0 0;font-size:14px;">
                                Reset your FindOnRent account password
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;color:#333;">
                            <p>Hello ${user.first_name || "User"},</p>
                            <p>You requested to reset your password. Click below:</p>
                            <div style="text-align:center;margin:25px 0;">
                                <a href="${resetLink}"
                                style="background:#007BFF;color:#fff;padding:12px 25px;
                                        border-radius:6px;font-size:16px;text-decoration:none;">
                                    Reset Password
                                </a>
                            </div>
                            <p style="font-size:14px;color:#555;">
                                This link will expire in <strong>15 minutes</strong>.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            `;

            /** SendGrid (Commented) */
            // await sgMail.send({
            //     to: user.email,
            //     from: process.env.FROM_EMAIL,
            //     subject: "Reset Your Password - FindOnRent",
            //     html,
            // });

            /** Gmail SMTP */
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,          // smtp.gmail.com
                    port: Number(process.env.SMTP_PORT),  // 465
                    secure: true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: process.env.SMTP_FROM || `"FindOnRent" <${process.env.SMTP_USER}>`,
                    to: user.email,
                    subject: "Reset Your Password - FindOnRent",
                    html,
                });

                console.log("Password reset email sent via Gmail SMTP");

            } catch (smtpErr) {
                console.error("Error sending reset password email:", smtpErr);
                return res.status(500).json({
                    message: "Failed to send reset email. Please try again later."
                });
            }

            return res.status(200).json({
                message: "Password reset link sent to your email.",
                tokenSent: true
            });

        } catch (error) {
            console.error("Forgot password error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

    /** Api to User Reset Password (Using Token) - Coded by Vishnu Dec 01 2025 */
    this.UserResetPassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ message: "Missing token or password." });
            }

            /** Find user by token */
            const [rows] = await pool.query(
                `SELECT user_id, email, user_role_id, auth_reset_token
                FROM roh_users
                WHERE auth_reset_token = ?`,
                [token]
            );

            if (rows.length === 0) {
                return res.status(400).json({ message: "Invalid or expired token." });
            }

            const user = rows[0];

            /** Verify role_id = 3 only */
            if (user.user_role_id !== 3) {
                return res.status(403).json({ message: "Invalid access." });
            }

            /** Verify JWT token expiration */
            try {
                jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                return res.status(400).json({ message: "Token expired. Please request again." });
            }

            /**  */
            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            /** Update password & remove token */
            await pool.query(
                `UPDATE roh_users
                SET password_hash = ?, auth_reset_token = NULL
                WHERE user_id = ?`,
                [hashedPassword, user.user_id]
            );

            return res.status(200).json({
                message: "Password has been reset successfully."
            });

        } catch (error) {
            console.error("Reset password error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

    /** Api to check reset token (Only user_role_id = 3) - Coded by Vishnu Dec 01 2025 */
    this.UserCheckResetToken = async (req, res) => {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ valid: false, message: "Token missing" });
            }

            /** find token in DB */
            const [rows] = await pool.query(
                `SELECT user_id, auth_reset_token FROM roh_users WHERE auth_reset_token = ?`,
                [token]
            );

            if (rows.length === 0) {
                return res.status(400).json({ valid: false, message: "Invalid or expired token" });
            }

            /** verify JWT token expiry */
            try {
                jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(400).json({ valid: false, message: "Token expired" });
            }

            return res.status(200).json({ valid: true });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ valid: false, message: "Server error" });
        }
    };

    /** Auth section end */

    /** Agent vendor and business registration APIs START */

    /** Function method to check availability by phone/email - Coded by Raj Dec 31 2025 */
    this.checkPhoneAvailability = async (req, res) => {
        try {
            const { phone, email } = req.body || {};

            const taken = {
                phone: false,
                email: false,
            };

            const checks = [];
            const params = [];

            if (phone) {
                checks.push("phone_number = ?");
                params.push(phone);
            }

            if (email) {
                checks.push("email = ?");
                params.push(email);
            }

            if (!checks.length) {
            return GLOBAL_ERROR_RESPONSE("No fields to check.", {}, res);
            }

            const sql = `SELECT phone_number, email FROM roh_users WHERE ${checks.join(" OR ")}`;

            const [rows] = await pool.query(sql, params);

            if (rows?.length) {
                for (const r of rows) {
                    if (phone && r.phone_number == phone) taken.phone = true;
                    if (email && r.email === email) taken.email = true;
                }
            }

            // Dynamic message
            let message = "Available";
            if (taken.phone) message = "Phone number already exists.";
            else if (taken.email) message = "Email already exists.";

            return GLOBAL_SUCCESS_RESPONSE(message, { taken }, res);
        } catch (err) {
            return GLOBAL_ERROR_RESPONSE("Failed to check availability.", err, res);
        }
    };

    /** Function method to register the agent vendor - Updated for Multi-Items */
    this.agentRegisterVendor = async (req, res) => {
        const connection = await pool.getConnection();

        const slugify = (str) =>
            String(str || "")
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/gi, "-")
                .replace(/^-+|-+$/g, "");

        const generateUniqueKey = () => {
            const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            return `BUSN_${ymd}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        };

        try {
            await connection.beginTransaction();

            /* ==========================================================
                1. EXTRACT BODY DATA
            ========================================================== */

            const {
                user = {},
                business = {},
                categories = [],
                sub_categories = [],
                items = []
            } = req.body;

            const address = business.address || {};
            const now = new Date();

            if (!user.first_name || !user.phone_number || !user.password) {
                throw new Error("Required user fields missing");
            }

            if (!business.business_name || !address.city_slug) {
                throw new Error("Business data incomplete");
            }

            if (!items.length) {
                throw new Error("At least one vehicle is required");
            }

            /* ==========================================================
                2. ATTACH IMAGES TO ITEMS
            ========================================================== */

            if (req.files && Array.isArray(req.files)) {
                req.files.forEach(file => {
                    const match = file.fieldname.match(/^items\[(\d+)\]\[images\]\[\]$/);
                    if (match) {
                        const index = match[1];
                        if (items[index]) {
                            if (!items[index].images) items[index].images = [];
                            items[index].images.push(file);
                        }
                    }
                });
            }

            /* ==========================================================
                3. INSERT USER
            ========================================================== */

            const passwordHash = await bcrypt.hash(user.password, 10);

            const [userResult] = await connection.query(
                `INSERT INTO roh_users
                (first_name, last_name, email, phone_number, alt_phone_number, password_hash, user_role_id, verified, referral_code, is_service_provider, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    user.first_name,
                    user.last_name,
                    user.email,
                    user.phone_number,
                    user.alt_phone_number,
                    passwordHash,
                    3,
                    0,
                    user.referral_code,
                    1,
                    1
                ]
            );

            const userId = userResult.insertId;

            /* ==========================================================
                4. INSERT BUSINESS
            ========================================================== */

            const baseSlug = slugify(`${business.business_name} ${address.city_slug}`);
            let businessSlug = baseSlug;
            let suffix = 1;

            while (true) {
                const [rows] = await connection.query(
                    `SELECT id FROM roh_user_business WHERE business_slug = ?`,
                    [businessSlug]
                );
                if (!rows.length) break;
                businessSlug = `${baseSlug}-${++suffix}`;
            }

            const feedbackKey = generateUniqueKey();

            const [bizResult] = await connection.query(
                `INSERT INTO roh_user_business
                (user_id, business_name, business_description, business_slug, feedback_unique_key, gst_number, phone_number, alt_phone_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    business.business_name,
                    business.business_desc,
                    businessSlug,
                    feedbackKey,
                    business.gst_number,
                    user.phone_number,
                    user.alt_phone_number
                ]
            );

            const businessId = bizResult.insertId;

            /* ==========================================================
                5. INSERT BUSINESS ADDRESS
            ========================================================== */

            await connection.query(
                `INSERT INTO roh_user_business_address
                (user_id, street_address, landmark, city, state, pincode)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    address.street_address,
                    address.landmark,
                    address.city_slug,
                    address.state_slug,
                    address.pin_code
                ]
            );

            /* ==========================================================
                6. CATEGORY RELATION
            ========================================================== */

            const cateRows = [];

            categories.forEach(catId => {
                sub_categories.forEach(subId => {
                    cateRows.push([
                        userId,
                        businessId,
                        catId,
                        subId,
                        1,
                        1,
                        userId,
                        userId,
                        now,
                        now
                    ]);
                });
            });

            if (cateRows.length) {
                await connection.query(
                    `INSERT INTO roh_business_cate_relat
                    (user_id, business_id, category_id, sub_category_id, fleet_size, active, add_id, edit_id, created_at, updated_at)
                    VALUES ?`,
                    [cateRows]
                );
            }

            /* ==========================================================
            CITY SLUG VALIDATION (roh_slugs -> roh_cities)
            ========================================================== */

            if (!address.city_slug) {
                throw new Error("City slug is required");
            }

            // Check if city exists in roh_slugs
            const [slugRows] = await connection.query(
                `SELECT id FROM roh_slugs WHERE slug = ? AND type = 'location' LIMIT 1`,
                [address.city_slug]
            );

            if (!slugRows.length) {

                // If not found → search in roh_cities
                const [cityRows] = await connection.query(
                    `SELECT city_id, city_name FROM roh_cities WHERE city_slug = ? LIMIT 1`,
                    [address.city_slug]
                );

                if (!cityRows.length) {
                    throw new Error("City not found in roh_cities table");
                }

                const cityData = cityRows[0];

                // Insert into roh_slugs
                await connection.query(
                    `INSERT INTO roh_slugs
                    (slug, cat_singular_name, type, entity_id, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        address.city_slug,              // slug
                        cityData.city_name,             // cat_singular_name
                        'location',                     // type
                        cityData.city_id,               // entity_id
                        'active',                       // status
                        new Date(),
                        new Date()
                    ]
                );
            }

            /* ==========================================================
                7. PREFETCH MODEL DATA
            ========================================================== */

            const modelIds = [...new Set(items.map(i => i.model_id).filter(Boolean))];

            const modelTagMap = {};
            const modelImageMap = {};
            const modelDescMap = {};

            if (modelIds.length) {
                const [rows] = await connection.query(
                    `SELECT id, tag_id, model_img_id, description FROM roh_models WHERE id IN (?)`,
                    [modelIds]
                );

                rows.forEach(r => {
                    modelTagMap[r.id] = r.tag_id || null;
                    modelDescMap[r.id] = r.description || "";

                    try {
                        const parsed = typeof r.model_img_id === 'string'
                            ? JSON.parse(r.model_img_id)
                            : r.model_img_id;

                        modelImageMap[r.id] = Array.isArray(parsed)
                            ? parsed
                            : (parsed ? [parsed] : []);
                    } catch {
                        modelImageMap[r.id] = [];
                    }
                });
            }

            /* ==========================================================
                8. INSERT VEHICLES
            ========================================================== */

            const mediaQuery = `
                INSERT INTO roh_media_gallery
                (file_name, file_path, file_type, active)
                VALUES (?, ?, ?, ?)
            `;

            const staticPath = "/uploads/media/host/items/";

            for (const item of items) {

                const uploadedMediaIds = [];

                if (item.images?.length) {
                    for (const file of item.images) {

                        const ext =
                            file.mimetype?.split("/")[1] ||
                            path.extname(file.originalname)?.replace(".", "") ||
                            "bin";

                        const [mediaInsert] = await connection.query(mediaQuery, [
                            file.filename,
                            staticPath,
                            ext,
                            1
                        ]);

                        uploadedMediaIds.push(mediaInsert.insertId);
                    }
                }

                const finalMediaIds =
                    uploadedMediaIds.length > 0
                        ? uploadedMediaIds
                        : (modelImageMap[item.model_id] || []);

                const [vehicleResult] = await connection.query(
                    `INSERT INTO roh_vehicle_details
                    (service_provider_id, business_id, item_name, vehicle_description,
                        category_id, sub_cat_id, tag_id, brand_id, model_id,
                        image_ids, rate_per_km, price_per_day,
                        fleet_size, security_deposit,
                        availability_status, item_status, admin_item_status,
                        add_date, edit_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId,
                        businessId,
                        item.title,
                        modelDescMap[item.model_id] || item.description || "",
                        categories[0] || 1,
                        item.sub_category_id,
                        modelTagMap[item.model_id],
                        item.brand_id,
                        item.model_id,
                        JSON.stringify(finalMediaIds),
                        item.rate_per_km,
                        item.price_per_day,
                        1,
                        item.security_deposit,
                        'Available',
                        1,
                        1,
                        now,
                        now
                    ]
                );

                const vehicleId = vehicleResult.insertId;

                await connection.query(
                    `INSERT INTO roh_vehicle_attributes
                    (vehicle_id, address_1, landmark, item_state, city, pincode, transmission_type, engine_type)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        vehicleId,
                        address.street_address,
                        address.landmark,
                        address.state_slug,
                        address.city_slug,
                        address.pin_code,
                        item.transmission,
                        item.engine
                    ]
                );
            }

            /* ==========================================================
                9. ACTIVATE SUB CATEGORIES
            ========================================================== */

            const activateIds = [...new Set(items.map(i => i.sub_category_id).filter(Boolean))];

            if (activateIds.length) {
                await connection.query(
                    `UPDATE roh_categories SET cate_available = 1 WHERE id IN (?)`,
                    [activateIds]
                );
            }

            await connection.commit();
            connection.release();

            return GLOBAL_SUCCESS_RESPONSE(
                "Vendor and vehicles registered successfully",
                { user_id: userId, business_id: businessId, business_slug: businessSlug },
                res
            );

        } catch (err) {
            await connection.rollback();
            connection.release();
            console.error("Registration Error:", err);
            return GLOBAL_ERROR_RESPONSE(err.message || "Registration failed", err, res);
        }
    };
    /** Agent vendor and business registration APIs END */

    /** Api Get service provider details this APIs useing on the single products contact button - Coded by Vishnu August 31 2025 */
    this.getServiceProviderDetails = async (req, res) => {
        try {
            const { service_provider_id } = req.body;

            /**Fetch only required fields */
            const [result] = await pool.query(
                `SELECT user_id, first_name, last_name, phone_number, email FROM roh_users WHERE user_id = ?`, [service_provider_id]
            );

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Service provider not found" });
            }

            return res.status(200).json(result[0]);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    /** Api to get user recently viewed items - Coded by Vishnu Nov 10, 2025 */
    this.getRecentlyViewedItems = async (req, res) => {
        try {
            const { session_id, user_id } = req.body || {};

            let ip_address =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            null;

            if (!user_id && !session_id && !ip_address) {
            return res.status(400).json({ message: "No identifier found" });
            }

            const query = `
            SELECT
                ivt.item_id,
                MAX(ivt.last_viewed_at) AS last_viewed_at,
                SUM(ivt.view_count) AS view_count,
                vd.item_name,
                vd.price_per_day,
                vd.availability_status,

                -- SAFE extraction of first image id
                CAST(
                NULLIF(
                    SUBSTRING_INDEX(
                    REPLACE(REPLACE(vd.image_ids, '[', ''), ']', ''),
                    ',',
                    1
                    ),
                    ''
                ) AS UNSIGNED
                ) AS first_image_id,

                -- FIX: aggregated fields to avoid ONLY_FULL_GROUP_BY error
                MAX(mg.file_path) AS file_path,
                MAX(mg.file_name) AS file_name

            FROM roh_item_vw_track ivt
            JOIN roh_vehicle_details vd ON vd.id = ivt.item_id

            LEFT JOIN roh_media_gallery mg
                ON mg.id = CAST(
                NULLIF(
                    SUBSTRING_INDEX(
                    REPLACE(REPLACE(vd.image_ids, '[', ''), ']', ''),
                    ',',
                    1
                    ),
                    ''
                ) AS UNSIGNED
                )

            WHERE
                (ivt.user_id = ? AND ivt.user_id IS NOT NULL)
                OR (ivt.session_id = ? AND ivt.session_id IS NOT NULL)
                OR (ivt.ip_address = ? AND ivt.ip_address IS NOT NULL)

            GROUP BY ivt.item_id
            ORDER BY last_viewed_at DESC
            LIMIT 10;
            `;

            const [rows] = await pool.query(query, [user_id, session_id, ip_address]);

            const items = rows.map((row) => {
            const image_url =
                row.file_path && row.file_name
                ? `${row.file_path}${row.file_name}`
                : "";

            return {
                item_id: row.item_id,
                item_name: row.item_name,
                price_per_day: row.price_per_day,
                availability_status: row.availability_status,
                image_url,
                view_count: row.view_count,
                last_viewed_at: row.last_viewed_at,
            };
            });

            return res.status(200).json({ items });
        } catch (error) {
            console.error("getRecentlyViewedItems error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    /** Api to remove user recently viewed items - Coded by Vishnu Nov 11, 2025 */
    this.removeRecentlyViewedItem = async (req, res) => {
    try {
        const { item_id, session_id, user_id } = req.body;

        await pool.query(`
        UPDATE roh_item_vw_track
        SET user_id = NULL, session_id = NULL
        WHERE item_id = ? AND (user_id = ? OR session_id = ?)
        LIMIT 1
        `, [item_id, user_id, session_id]);

        return res.status(200).json({ message: "Removed (soft)" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
    };

    /** Api to restore user recently viewed items - Coded by Vishnu Nov 11, 2025 */
    this.restoreViewedItem = async (req, res) => {
    try {
        const { item_id, session_id, user_id } = req.body;

        await pool.query(`
        UPDATE roh_item_vw_track
        SET user_id = ?, session_id = ?
        WHERE item_id = ?
        LIMIT 1
        `, [user_id, session_id, item_id]);

        return res.status(200).json({ message: "Restored" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
    };

    /** Api to get service providers business details - Coded by Vishnu Nov 19, 2025 */
    this.getserBusinessDetails = async (req, res) => {
        const user_id = req.body.user_id;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id is required",
            });
        }

        try {
            /** BUSINESS DETAILS (clean response) */
            const businessSql = `
                SELECT
                    id,
                    user_id,
                    business_name,
                    business_slug,
                    gst_number,
                    phone_number
                FROM roh_user_business
                WHERE user_id = ?
            `;
            const [businessRows] = await pool.query(businessSql, [user_id]);
            const business = businessRows[0] || null;

            if (!business) {
                return res.status(404).json({
                    success: false,
                    message: "Business not found",
                });
            }

            /** ADDRESS DETAILS (clean response) */
            const addressSql = `
                SELECT
                    street_address,
                    landmark,
                    city,
                    state,
                    pincode
                FROM roh_user_business_address
                WHERE user_id = ?
            `;
            const [addressRows] = await pool.query(addressSql, [user_id]);
            const address = addressRows[0] || null;

            /** CATEGORY RELATION + CATEGORY/SUBCATEGORY NAME & SLUG */
            const categorySql = `
                SELECT
                    r.id,
                    r.category_id,
                    r.sub_category_id,
                    r.fleet_size,

                    c1.name AS category_name,
                    c1.slug AS category_slug,

                    c2.name AS subcategory_name,
                    c2.slug AS subcategory_slug

                FROM roh_business_cate_relat r
                LEFT JOIN roh_categories c1 ON r.category_id = c1.id
                LEFT JOIN roh_categories c2 ON r.sub_category_id = c2.id
                WHERE r.user_id = ?
                AND r.business_id = ?
                AND r.active = 1
            `;

            const [categoryRows] = await pool.query(categorySql, [
                user_id,
                business.id,
            ]);

            return res.status(200).json({
                success: true,
                business: business,
                address: address,
                categories: categoryRows, // array
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** Api to update service provider business details - Coded by Vishnu Nov 19, 2025 */
    this.updateSerBusinessDetails = async (req, res) => {
        const {
            user_id,
            business_name,
            business_slug,
            gst_number,
            phone_number,
            street_address,
            landmark,
            city,
            state,
            pincode,
            categories = []
        } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id is required",
            });
        }

        try {
            /* ------------------------------------------
                    UPDATE BUSINESS MAIN TABLE
            ------------------------------------------- */
            await pool.query(
                `
                UPDATE roh_user_business
                SET business_name=?, business_slug=?, gst_number=?, phone_number=?
                WHERE user_id=?
                `,
                [business_name, business_slug, gst_number, phone_number, user_id]
            );

            /* ------------------------------------------
                    FETCH BUSINESS ID
            ------------------------------------------- */
            const [bizRow] = await pool.query(
                `SELECT id FROM roh_user_business WHERE user_id=?`,
                [user_id]
            );

            const business_id = bizRow[0].id;

            /* ------------------------------------------
                    CHECK IF ADDRESS EXISTS
            ------------------------------------------- */
            const [addr] = await pool.query(
                `SELECT id FROM roh_user_business_address WHERE user_id=?`,
                [user_id]
            );

            if (addr.length > 0) {
                await pool.query(
                    `
                    UPDATE roh_user_business_address
                    SET street_address=?, landmark=?, city=?, state=?, pincode=?
                    WHERE user_id=?
                    `,
                    [street_address, landmark, city, state, pincode, user_id]
                );
            } else {
                await pool.query(
                    `
                    INSERT INTO roh_user_business_address
                    (user_id, street_address, landmark, city, state, pincode)
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [user_id, street_address, landmark, city, state, pincode]
                );
            }

            /* ------------------------------------------
                    CATEGORY HANDLING
                    UPDATE / INSERT / SOFT DELETE
            ------------------------------------------- */

            const [existingCats] = await pool.query(
                `
                SELECT id, category_id, sub_category_id, fleet_size
                FROM roh_business_cate_relat
                WHERE user_id=? AND business_id=?
                `,
                [user_id, business_id]
            );

            const existingMap = new Map(); // key → subcat ID
            existingCats.forEach((r) => {
                existingMap.set(r.sub_category_id, {
                    id: r.id,
                    fleet_size: r.fleet_size
                });
            });

            /* PROCESS ALL INCOMING (CHECKED) CATEGORIES */
            for (const c of categories) {
                const subCat = c.sub_category_id;
                const incomingFleetSize = c.fleet_size;

                if (existingMap.has(subCat)) {
                    // Already exists → UPDATE
                    const row = existingMap.get(subCat);

                    const useFleet =
                        incomingFleetSize === "" || incomingFleetSize == null
                            ? row.fleet_size
                            : incomingFleetSize;

                    await pool.query(
                        `
                        UPDATE roh_business_cate_relat
                        SET fleet_size=?, active=1
                        WHERE id=?
                        `,
                        [useFleet, row.id]
                    );

                    existingMap.delete(subCat);
                } else {
                    // Not exists → INSERT NEW
                    await pool.query(
                        `
                        INSERT INTO roh_business_cate_relat
                        (user_id, business_id, category_id, sub_category_id, fleet_size, active)
                        VALUES (?, ?, ?, ?, ?, 1)
                        `,
                        [
                            user_id,
                            business_id,
                            1,
                            subCat,
                            incomingFleetSize || null
                        ]
                    );
                }

                /* ACTIVATE VEHICLES FOR CHECKED CATEGORY */
                await pool.query(
                    `
                    UPDATE roh_vehicle_details
                    SET item_status = 1
                    WHERE service_provider_id=? AND sub_cat_id=?
                    `,
                    [user_id, subCat]
                );
            }

            /* SOFT DELETE UNCHECKED CATEGORIES */
            for (const [subCat, row] of existingMap.entries()) {
                await pool.query(
                    `
                    UPDATE roh_business_cate_relat
                    SET active=0
                    WHERE id=?
                    `,
                    [row.id]
                );

                /* DEACTIVATE VEHICLES FOR UNCHECKED CATEGORY */
                await pool.query(
                    `
                    UPDATE roh_vehicle_details
                    SET item_status = 0
                    WHERE service_provider_id=? AND sub_cat_id=?
                    `,
                    [user_id, subCat]
                );
            }

            return res.status(200).json({
                success: true,
                message: "Business details updated successfully",
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    /** API to track the IP and country of the request */
    this.trackRequest = async (req, res, next) => {
        try {  
            const referer = req.headers.referer || null;

            let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || null;

            // Clean IPv6 format
            if (ip && ip.includes("::ffff:")) {
                ip = ip.split("::ffff:")[1];
            }

            const { path, geoData } = req.body;

            let country = null;
            let region = null;
            let city = null;
            let timezone = null;
            let latitude = null;
            let longitude = null;
            let isBanned = true;
            let userAgent = null;

            /* ==============================
            If cookie geo data exists
            ============================== */
            if (geoData) {

                country = geoData.country || null;
                isBanned = geoData.isBanned ?? true;

            } else if (ip && ip.startsWith("66.249.79")) {
                country = "US";
            } else {

                /* ==============================
                Fetch live geo data
                ============================== */
                userAgent = req.headers["user-agent"] || null;

                const geoResponse = await axios.get(`https://ipwho.is/${ip}`);
                const geo = geoResponse.data;

                if (geo && geo.success) {
                    country = geo?.country_code || null;
                    region = geo?.region || null;
                    city = geo?.city || null;
                    timezone = geo?.timezone?.id || null;
                    latitude = geo?.latitude || null;
                    longitude = geo?.longitude || null;
                } else {
                    country = null;
                }
            }

            /* ==============================
            Get allowed countries
            ============================== */

            const [rows] = await pool.query(
                "SELECT roh_setting_value FROM roh_site_settings WHERE roh_setting_key = ?",
                ["allowed_countries"]
            );

            let allowedCountries = [];

            if (rows.length > 0 && rows[0].roh_setting_value) {
                allowedCountries = rows[0].roh_setting_value
                    .split(",")
                    .map((c) => c.trim().toUpperCase());
            }

            /* ==============================
            Check banned status
            ============================== */

            if (!country) {
                isBanned = true;
            } else {
                isBanned = !allowedCountries.includes(country);
            }

            /* ==============================
            Insert tracking
            ============================== */

            await pool.query(
                `INSERT INTO roh_request_tracking
                (ip_address, browser, country, region, city, timezone, latitude, longitude, route_ref, route, method, is_banned)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ip,
                    userAgent || null,
                    country,
                    region,
                    city,
                    timezone,
                    latitude,
                    longitude,
                    referer,
                    path,
                    req.method,
                    isBanned ? 1 : 0,
                ]
            );

            /* ==============================
            Return response
            ============================== */

            return res.status(200).json({
                success: true,
                country,
                region,
                city,
                timezone,
                latitude,
                longitude,
                isBanned,
            });

        } catch (err) {

            console.error("Geo tracking error:", err.message);

            return res.status(200).json({
                success: true,
                country: "",
                isBanned: false
            });
        }
    };

    /** API to get the total numbers of the items for a category */
    this.getCatListCount = async (req, res, next) => {
        try {

            const { categoryId } = req.params;

            if (!categoryId) {
                return res.status(400).json({
                    success: false,
                    message: "categoryId is required"
                });
            }

            const [rows] = await pool.query(
                `SELECT COUNT(*) AS total
                FROM roh_vehicle_details
                WHERE sub_cat_id = ?`,
                [categoryId]
            );

            const totalCount = rows[0]?.total || 0;

            return res.json({
                success: true,
                count: totalCount
            });

        } catch (error) {
            console.error("getCatListCount error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    /** API to get the total numbers of the items for a location */
    this.getLocationListCount = async (req, res, next) => {
        try {
            const { locationSlug } = req.params;

            if (!locationSlug) {
                return res.status(400).json({
                    success: false,
                    message: "locationSlug is required"
                });
            }

            const [rows] = await pool.query(
                `SELECT COUNT(*) AS total
                FROM roh_vehicle_attributes
                WHERE city = ?`,
                [locationSlug]
            );

            const totalCount = rows[0]?.total || 0;

            return res.json({
                success: true,
                count: totalCount
            });

        } catch (error) {
            console.error("getLocationListCount error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    /** API to get total vehicles for category + location */
    this.getCatLocationListCount = async (req, res, next) => {
        try {

            const { categoryId, locationSlug } = req.params;

            if (!categoryId || !locationSlug) {
                return res.status(400).json({
                    success: false,
                    message: "categoryId and locationSlug are required"
                });
            }

            const [rows] = await pool.query(
                `SELECT COUNT(*) AS total
                FROM roh_vehicle_details vd
                INNER JOIN roh_vehicle_attributes va
                    ON vd.id = va.vehicle_id
                WHERE vd.sub_cat_id = ?
                AND va.city = ?`,
                [categoryId, locationSlug]
            );

            const totalCount = rows[0]?.total || 0;

            return res.json({
                success: true,
                count: totalCount
            });

        } catch (error) {
            console.error("getCatLocationListCount error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    /** API to get total vehicles for category + model */
    this.getCategoryModelListCount = async (req, res, next) => {
        try {

            const { categoryId, modelSlug } = req.params;

            if (!categoryId || !modelSlug) {
                return res.status(400).json({
                    success: false,
                    message: "categoryId and modelSlug are required"
                });
            }

            // Get model_id from roh_models
            const [modelRows] = await pool.query(
                `SELECT id
                FROM roh_models
                WHERE model_slug = ?`,
                [modelSlug]
            );

            if (modelRows.length === 0) {
                return res.json({
                    success: true,
                    count: 0
                });
            }

            const modelId = modelRows[0].id;

            // Count vehicles in roh_vehicle_details
            const [rows] = await pool.query(
                `SELECT COUNT(*) AS total
                FROM roh_vehicle_details
                WHERE sub_cat_id = ?
                AND model_id = ?`,
                [categoryId, modelId]
            );

            const totalCount = rows[0]?.total || 0;

            return res.json({
                success: true,
                count: totalCount
            });

        } catch (error) {
            console.error("getCategoryModelListCount error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    /** API to get total vehicles for category + model + location */
    this.getCategoryModelLocationListingCount = async (req, res, next) => {
        try {
            const { categoryId, modelSlug, locationSlug } = req.params;

            if (!categoryId || !modelSlug || !locationSlug) {
            return res.status(400).json({
                success: false,
                message: "categoryId, modelSlug, and locationSlug are required"
            });
            }

            // Get model_id from roh_models
            const [modelRows] = await pool.query(
            `SELECT id
            FROM roh_models
            WHERE model_slug = ?`,
            [modelSlug]
            );

            if (modelRows.length === 0) {
            return res.json({ success: true, count: 0 });
            }

            const modelId = modelRows[0].model_id;

            // Count vehicles joined with attributes (city)
            const [rows] = await pool.query(
            `SELECT COUNT(*) AS total
            FROM roh_vehicle_details vd
            INNER JOIN roh_vehicle_attributes va
                ON vd.id = va.vehicle_id
            WHERE vd.sub_cat_id = ?
                AND vd.model_id = ?
                AND va.city = ?`,
            [categoryId, modelId, locationSlug]
            );

            const totalCount = rows[0]?.total || 0;

            return res.json({
            success: true,
            count: totalCount
            });

        } catch (error) {
            console.error("getCategoryModelLocationListingCount error:", error);
            return res.status(500).json({
            success: false,
            message: "Internal server error"
            });
        }
    };


    /** Refresh Admin Token - Sliding session implementation */
    this.refreshAdminToken = async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) return res.status(400).json({ message: "No token provided" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const [rows] = await pool.query(
                'SELECT user_role_id FROM roh_users WHERE user_id = ?',
                [decoded.id]
            );

            if (rows.length === 0 || rows[0].user_role_id !== 1) {
                 return res.status(403).json({ message: "Not an admin." });
            }

            const newToken = jwt.sign(
                { id: decoded.id, email: decoded.email },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );

            return res.status(200).json({ success: true, token: newToken });
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    };
}
module.exports = new authApi();
