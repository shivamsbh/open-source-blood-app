const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  setDonorCapacityController,
  getDonorCapacityController,
  getDonorsWithCapacityController,
  updateCapacityAfterDonationController,
  resetDonorCapacityController,
  getCapacityStatsController,
} = require("../controllers/donorCapacityController");

const router = express.Router();

// DONOR CAPACITY ROUTES

// SET/UPDATE DONOR CAPACITY || POST
router.post("/set-capacity", authMiddleware, setDonorCapacityController);

// GET DONOR CAPACITY || GET
router.get("/my-capacity", authMiddleware, getDonorCapacityController);

// GET ALL DONORS WITH CAPACITY (FOR ORGANIZATIONS) || GET
router.get("/donors-with-capacity", authMiddleware, getDonorsWithCapacityController);

// UPDATE CAPACITY AFTER DONATION || POST
router.post("/update-after-donation", authMiddleware, updateCapacityAfterDonationController);

// RESET DONOR CAPACITY || POST
router.post("/reset-capacity", authMiddleware, resetDonorCapacityController);

// GET CAPACITY STATISTICS || GET
router.get("/capacity-stats", authMiddleware, getCapacityStatsController);

module.exports = router;