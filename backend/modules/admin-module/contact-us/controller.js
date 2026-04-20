const { pool } = require('../../../config/connection');
const path = require('path');
const nodemailer = require("nodemailer");

function ContactUssApi() {


    /** Api to get contact us all entry - Coded by Vishnu Oct 14 2025 */
    this.getContactUsAllEntry = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;
        const search = (req.query.search || "").trim();

        let where = "";
        let params = [];

        if (search) {
        where = "WHERE email LIKE ? OR phone LIKE ?";
        params.push(`%${search}%`, `%${search}%`);
        }

        // Total count for pagination
        const [countRows] = await pool.promise().query(
        `SELECT COUNT(*) AS total FROM roh_contact_us ${where}`,
        params
        );
        const total = countRows[0].total;
        const totalPages = Math.ceil(total / limit);

        // Fetch paginated data
        const [rows] = await pool.promise().query(
        `
        SELECT
            id, full_name, email, phone, subject, email_status,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
        FROM roh_contact_us
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, limit, offset]
        );

        return res.status(200).json({
        success: true,
        message: "Entries fetched successfully",
        data: rows,
        totalPages,
        currentPage: page,
        });
    } catch (error) {
        console.error("❌ getContactUsAllEntry error:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };

    /** Api to view single contact us entry - Coded by Vishnu Oct 14 2025 */
    this.getSingleContactUsEntry = async (req, res) => {
    try {
        const { id } = req.body;

        const query = `
        SELECT
            id,
            full_name,
            email,
            phone,
            subject,
            message,
            email_status,
            ip_address,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
        FROM roh_contact_us
        WHERE id = ?
        `;

        const [result] = await pool.promise().query(query, [id]);

        return res.status(200).json({
        success: true,
        message: "Contact entry fetched successfully",
        data: result[0],
        });
    } catch (error) {
        console.error("❌ getSingleContactUsEntry error:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };

    /** Api to reply single contact us entry - Coded by Vishnu Feb 22 2026 */
    this.replyToContactUs = async (req, res) => {
    try {
        const { to, subject, message, contact_id } = req.body;

        if (!to || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "To, subject and message are required",
        });
        }

        // 🔹 SMTP transporter
        const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true, // 465 = true
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });

        // Mail options
        const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html: `
            <div>
            ${message.replace(/\n/g, "")}
            </div>
        `,
        };

        // Send mail
        await transporter.sendMail(mailOptions);

        // Update email_status using pool.promise().query
        if (contact_id) {
        await pool.promise().query(
            `UPDATE roh_contact_us 
            SET email_status = 'replied' 
            WHERE id = ?`,
            [contact_id]
        );
        }

        return res.status(200).json({
        success: true,
        message: "Reply sent successfully",
        });

    } catch (error) {
        console.error("replyToContactUs error:", error);
        return res.status(500).json({
        success: false,
        message: "Failed to send email",
        });
    }
    };

    /** Api to delete single contact us entry - Coded by Vishnu April 18 2026 */
    this.deleteContactUsEntry = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID is required",
                });
            }

            const query = "DELETE FROM roh_contact_us WHERE id = ?";
            const [result] = await pool.promise().query(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Entry not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Contact entry deleted permanently",
            });
        } catch (error) {
            console.error("❌ deleteContactUsEntry error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
}

module.exports = new ContactUssApi();
