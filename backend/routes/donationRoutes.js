const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createDonationController,
  getOrganisationDonationsController,
  getFilteredDonationsController,
  getDonorDonationsController,
  getDonationAnalyticsController,
} = require("../controllers/donationController");

const router = express.Router();

// Routes for donations

// CREATE DONATION || POST
router.post("/create", authMiddleware, createDonationController);

// GET ORGANISATION DONATIONS || GET
router.get("/organisation-donations", authMiddleware, getOrganisationDonationsController);

// GET FILTERED DONATIONS || GET
router.get("/filtered-donations", authMiddleware, getFilteredDonationsController);

// GET DONOR DONATIONS || GET
router.get("/donor-donations", authMiddleware, getDonorDonationsController);

// GET DONATION ANALYTICS || GET
router.get("/analytics", authMiddleware, getDonationAnalyticsController);

module.exports = router;