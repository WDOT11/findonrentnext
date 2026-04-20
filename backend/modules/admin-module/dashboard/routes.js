const DashboardController = require('./controller');
const authMiddleware = require('../../../middleware/authMiddleware');

/** Dashboard stats route - Coded by Vishnu April 14 2026 */
app.get(ADMIN_NAME + '/dashboard/stats', authMiddleware, (req, res) => {
    DashboardController.getStats(req, res);
});
