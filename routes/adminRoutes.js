const router = require("express").Router();
const admin = require("../controllers/adminController");

// weekly dashboard stats
router.get("/weekly-stats", admin.getWeeklyStats);
router.get("/users", admin.getUsers);
router.get("/dashboard-data", admin.getDashboardData);

module.exports = router;
