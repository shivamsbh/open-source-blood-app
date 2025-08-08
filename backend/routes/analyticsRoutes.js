const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  bloodGroupDetailsController,
  getTrendAnalyticsController,
  getUserStatsController,
  getSummaryStatsController,
} = require("../controllers/analyticsController");

const router = express.Router();

//routes

//GET BLOOD DATA
router.get("/bloodGroups-data", authMiddleware, bloodGroupDetailsController);

//GET TREND ANALYTICS
router.get("/trends", authMiddleware, getTrendAnalyticsController);

//GET USER STATISTICS
router.get("/user-stats", authMiddleware, getUserStatsController);

//GET SUMMARY STATISTICS
router.get("/summary", authMiddleware, getSummaryStatsController);

module.exports = router;
