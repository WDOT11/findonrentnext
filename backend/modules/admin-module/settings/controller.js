const { pool } = require('../../../config/connection');
const path = require('path');

function RohAdminSettingApi() {

    /** Add new site setting - Coded by Vishnu Dec 23, 2025 */
    this.AddnewSettings = async (req, res) => {
    try {
        const { setting_key, setting_value } = req.body;

        if (!setting_key || typeof setting_key !== 'string') {
        return res.status(400).json({
            success: false,
            message: "Setting key is required",
        });
        }

        const normalizedKey = setting_key.trim().toLowerCase();

        // UPSERT: insert if not exists, else update
        const sql = `
        INSERT INTO roh_site_settings (roh_setting_key, roh_setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            roh_setting_value = VALUES(roh_setting_value)
        `;

        await pool.promise().query(sql, [
        normalizedKey,
        setting_value ?? "",
        ]);

        return res.json({
        success: true,
        message: "Site setting saved successfully",
        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
    }
    };


    /** API for get all site setting - Coded by Vishnu Jan 03, 2026 */
    this.GetallSettings = async (req, res) => {
        try {
          const query = "SELECT * FROM roh_site_settings";
          const [results] = await pool.promise().query(query);
          return GLOBAL_SUCCESS_RESPONSE("Site settings fetched successfully", results, res);
        } catch (err) {
          return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
      };


    /** API for sync site setting - Coded by Vishnu Jan 03, 2026 */
    this.SyncSiteSettings = async (req, res) => {
        try {
            const { settings } = req.body;
            
            if (!Array.isArray(settings)) {
                return res.status(400).json({
                    success: false, message: "Settings array is required",
                });
            }

            // Normalize keys
            const normalized = settings.filter(s => s.key && s.key.trim())
                .map(s => ({
                    key: s.key.trim().toLowerCase(),
                    value: s.value ?? "",
                })
            );

            const keys = normalized.map(s => s.key);

            /** Delete removed settings (except protected ones) */
            if (keys.length > 0) {
                await pool.promise().query(`DELETE FROM roh_site_settings WHERE roh_setting_key NOT IN (?) AND roh_setting_key != 'allow_search_indexing'`, [keys]);
            }

            /** UPSERT remaining settings */
            for (const item of normalized) {
                await pool.promise().query(
                    `
                    INSERT INTO roh_site_settings (roh_setting_key, roh_setting_value)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE
                    roh_setting_value = VALUES(roh_setting_value)
                    `,
                    [item.key, item.value]
                );
            }

            return res.json({
                success: true,
                message: "Site settings synced successfully",
            });

        } catch (err) {
            console.error(err);
            return GLOBAL_ERROR_RESPONSE("Internal server error", err, res);
        }
    };

}

module.exports = new RohAdminSettingApi();
