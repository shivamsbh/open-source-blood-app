const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  subscribeToOrganisationController,
  unsubscribeFromOrganisationController,
  getDonorSubscriptionsController,
  getOrganisationSubscribersController,
  getAvailableOrganisationsController,
  checkSubscriptionStatusController,
} = require("../controllers/subscriptionController");

const router = express.Router();

// SUBSCRIPTION ROUTES

// SUBSCRIBE TO ORGANISATION || POST
router.post("/subscribe", authMiddleware, subscribeToOrganisationController);

// UNSUBSCRIBE FROM ORGANISATION || POST
router.post("/unsubscribe", authMiddleware, unsubscribeFromOrganisationController);

// GET DONOR'S SUBSCRIPTIONS || GET
router.get("/my-subscriptions", authMiddleware, getDonorSubscriptionsController);

// GET ORGANISATION'S SUBSCRIBERS || GET
router.get("/my-subscribers", authMiddleware, getOrganisationSubscribersController);

// GET AVAILABLE ORGANISATIONS FOR SUBSCRIPTION || GET
router.get("/available-organisations", authMiddleware, getAvailableOrganisationsController);

// CHECK SUBSCRIPTION STATUS || GET
router.get("/check-status", authMiddleware, checkSubscriptionStatusController);

module.exports = router;