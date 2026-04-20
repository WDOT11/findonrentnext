const { pool } = require('../../../config/connection');

function DashboardApi() {
    /** Get dashboard stats - Coded by Vishnu April 14 2026 */
    this.getStats = async (req, res) => {
        try {
            // 1. Total Categories
            const [categories] = await pool.promise().query('SELECT COUNT(*) as total FROM roh_categories WHERE active = 1');
            
            // 2. Total Users
            const [users] = await pool.promise().query('SELECT COUNT(*) as total FROM roh_users WHERE active = 1');
            
            // 3. Total Products (Vehicles)
            const [products] = await pool.promise().query('SELECT COUNT(*) as total FROM roh_vehicle_details');
            
            // 4. Pending Vehicle Requests
            const [pendingVehicles] = await pool.promise().query('SELECT COUNT(*) as total FROM roh_vehicle_details WHERE admin_item_status = 2');
            
            // 5. Recent Users
            const [recentUsers] = await pool.promise().query(`
                SELECT first_name, last_name, email, add_date 
                FROM roh_users 
                ORDER BY add_date DESC 
                LIMIT 5
            `);
            
            // 6. Recent Products
            const [recentProducts] = await pool.promise().query(`
                SELECT item_name, add_date 
                FROM roh_vehicle_details 
                ORDER BY add_date DESC 
                LIMIT 5
            `);

            return res.status(200).json({
                success: true,
                stats: {
                    totalCategories: categories[0].total,
                    totalUsers: users[0].total,
                    totalProducts: products[0].total,
                    pendingRequests: pendingVehicles[0].total
                },
                recentActivity: {
                    users: recentUsers,
                    products: recentProducts
                }
            });

        } catch (err) {
            console.error('Dashboard Stats Error:', err);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: err
            });
        }
    };
}

module.exports = new DashboardApi();
