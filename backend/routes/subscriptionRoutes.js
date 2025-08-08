const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  subscribeToOrganisationController,
  unsubscribeFromOrganisationController,
  getDonorSubscriptionsController,
  getOrganisationSubscribersController,
  getAvailableOrganisationsController,
  checkSubscriptionStatusController,
  getHospitalSubscribersController,
  subscribeToHospitalController,
  unsubscribeFromHospitalController,
  getOrganisationHospitalSubscriptionsController,
  getAvailableHospitalsController,
  getHospitalOrganisationSubscribersController,
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

// GET HOSPITAL SUBSCRIBERS || GET
router.get("/hospital-subscribers", authMiddleware, getHospitalSubscribersController);

// GET AVAILABLE ORGANISATIONS FOR SUBSCRIPTION || GET
router.get("/available-organisations", authMiddleware, getAvailableOrganisationsController);

// CHECK SUBSCRIPTION STATUS || GET
router.get("/check-status", authMiddleware, checkSubscriptionStatusController);

// ===== ORG <-> HOSPITAL SUBSCRIPTION (NEW) =====
// ORG subscribes to Hospital
router.post("/subscribe-hospital", authMiddleware, subscribeToHospitalController);
// ORG unsubscribes from Hospital
router.post("/unsubscribe-hospital", authMiddleware, unsubscribeFromHospitalController);
// ORG's hospital subscriptions
router.get("/my-hospital-subscriptions", authMiddleware, getOrganisationHospitalSubscriptionsController);
// Available hospitals for org to subscribe
router.get("/available-hospitals", authMiddleware, getAvailableHospitalsController);
// Hospital -> list organisations subscribed to it
router.get("/organisation-subscribers", authMiddleware, getHospitalOrganisationSubscribersController);

module.exports = router;