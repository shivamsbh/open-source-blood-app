const mongoose = require("mongoose");
const subscriptionModel = require("../models/subscriptionModel");
const userModel = require("../models/userModel");

// SUBSCRIBE TO ORGANISATION
const subscribeToOrganisationController = async (req, res) => {
  try {
    const { organisationId } = req.body;
    const donorId = req.body.userId;

    // Validation
    if (!organisationId) {
      return res.status(400).send({
        success: false,
        message: "Organisation ID is required",
      });
    }

    // Check if organisation exists and is valid
    const organisation = await userModel.findOne({
      _id: organisationId,
      role: "organisation",
    });

    if (!organisation) {
      return res.status(404).send({
        success: false,
        message: "Organisation not found",
      });
    }

    // Check if subscriber exists (donor or hospital)
    const subscriber = await userModel.findOne({
      _id: donorId,
      role: { $in: ["donor", "hospital"] },
    });

    if (!subscriber) {
      return res.status(404).send({
        success: false,
        message: "Subscriber not found (only donors and hospitals can subscribe)",
      });
    }

    // Check if subscription already exists
    const existingSubscription = await subscriptionModel.findOne({
      donor: donorId,
      organisation: organisationId,
    });

    if (existingSubscription) {
      if (existingSubscription.status === "active") {
        return res.status(400).send({
          success: false,
          message: "Already subscribed to this organisation",
        });
      } else {
        // Reactivate subscription
        existingSubscription.status = "active";
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();
        
        return res.status(200).send({
          success: true,
          message: "Subscription reactivated successfully",
          subscription: existingSubscription,
        });
      }
    }

    // Create new subscription
    const newSubscription = new subscriptionModel({
      donor: donorId,
      organisation: organisationId,
      status: "active",
    });

    await newSubscription.save();

    // Populate the subscription with organisation details
    const populatedSubscription = await subscriptionModel
      .findById(newSubscription._id)
      .populate("organisation", "organisationName email phone address");

    return res.status(201).send({
      success: true,
      message: "Successfully subscribed to organisation",
      subscription: populatedSubscription,
    });
  } catch (error) {
    console.error("Error in subscribe to organisation:", error);
    return res.status(500).send({
      success: false,
      message: "Error in subscription",
      error: error.message,
    });
  }
};

// UNSUBSCRIBE FROM ORGANISATION
const unsubscribeFromOrganisationController = async (req, res) => {
  try {
    const { organisationId } = req.body;
    const donorId = req.body.userId;

    // Find and update subscription
    const subscription = await subscriptionModel.findOneAndUpdate(
      {
        donor: donorId,
        organisation: organisationId,
        status: "active",
      },
      {
        status: "inactive",
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).send({
        success: false,
        message: "Active subscription not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Successfully unsubscribed from organisation",
    });
  } catch (error) {
    console.error("Error in unsubscribe:", error);
    return res.status(500).send({
      success: false,
      message: "Error in unsubscription",
      error: error.message,
    });
  }
};

// GET CURRENT USER'S SUBSCRIPTIONS (Donor or Hospital)
const getDonorSubscriptionsController = async (req, res) => {
  try {
    const subscriberId = req.body.userId;

    const subscriptions = await subscriptionModel
      .find({
        donor: subscriberId,
        status: "active",
      })
      .populate("organisation", "organisationName email phone address website")
      .sort({ subscribedAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Donor subscriptions fetched successfully",
      subscriptions,
    });
  } catch (error) {
    console.error("Error in get donor subscriptions:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching subscriptions",
      error: error.message,
    });
  }
};

// GET ORGANISATION'S SUBSCRIBERS
const getOrganisationSubscribersController = async (req, res) => {
  try {
    const organisationId = req.body.userId;

    const subscriptions = await subscriptionModel
      .find({
        organisation: organisationId,
        status: "active",
      })
      .populate("donor", "name email phone address")
      .sort({ subscribedAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Organisation subscribers fetched successfully",
      subscribers: subscriptions,
    });
  } catch (error) {
    console.error("Error in get organisation subscribers:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching subscribers",
      error: error.message,
    });
  }
};

// GET ALL AVAILABLE ORGANISATIONS FOR SUBSCRIPTION
const getAvailableOrganisationsController = async (req, res) => {
  try {
    const donorId = req.body.userId;

    // Get all organisations
    const allOrganisations = await userModel.find({
      role: "organisation",
    }).select("organisationName email phone address website");

    // Get donor's current subscriptions
    const currentSubscriptions = await subscriptionModel.find({
      donor: donorId,
      status: "active",
    }).select("organisation");

    const subscribedOrgIds = currentSubscriptions.map(sub => sub.organisation.toString());

    // Filter out already subscribed organisations
    const availableOrganisations = allOrganisations.filter(
      org => !subscribedOrgIds.includes(org._id.toString())
    );

    return res.status(200).send({
      success: true,
      message: "Available organisations fetched successfully",
      organisations: availableOrganisations,
    });
  } catch (error) {
    console.error("Error in get available organisations:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching available organisations",
      error: error.message,
    });
  }
};

// CHECK SUBSCRIPTION STATUS
const checkSubscriptionStatusController = async (req, res) => {
  try {
    const { organisationId } = req.query;
    const donorId = req.body.userId;

    const subscription = await subscriptionModel.findOne({
      donor: donorId,
      organisation: organisationId,
      status: "active",
    });

    return res.status(200).send({
      success: true,
      isSubscribed: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Error in check subscription status:", error);
    return res.status(500).send({
      success: false,
      message: "Error checking subscription status",
      error: error.message,
    });
  }
};

// GET HOSPITAL SUBSCRIBERS FOR ORGANISATION (role-aware)
const getHospitalSubscribersController = async (req, res) => {
  try {
    const organisationId = req.body.userId;

    const subscriptions = await subscriptionModel
      .find({
        organisation: organisationId,
        status: "active",
      })
      .populate("donor", "hospitalName name email phone address role")
      .sort({ subscribedAt: -1 });

    // Filter only hospital subscribers
    const hospitalSubscriptions = subscriptions.filter(sub => 
      sub.donor && sub.donor.role === "hospital"
    );

    return res.status(200).send({
      success: true,
      message: "Hospital subscribers fetched successfully",
      hospitals: hospitalSubscriptions,
    });
  } catch (error) {
    console.error("Error in get hospital subscribers:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching hospital subscribers",
      error: error.message,
    });
  }
};

// ===== ORG <-> HOSPITAL SUBSCRIPTION (NEW) =====
// ORG subscribes to a HOSPITAL
const subscribeToHospitalController = async (req, res) => {
  try {
    const organisationId = req.body.userId; // current user is org
    const { hospitalId } = req.body;

    // Validate roles
    const organisation = await userModel.findOne({ _id: organisationId, role: "organisation" });
    const hospital = await userModel.findOne({ _id: hospitalId, role: "hospital" });
    if (!organisation || !hospital) {
      return res.status(400).send({ success: false, message: "Invalid organisation or hospital" });
    }

    // Represent org->hospital subscription by storing organisation in 'donor' field and hospital in 'organisation' field
    // This reuses the Subscription model without schema changes
    const existing = await subscriptionModel.findOne({ donor: organisationId, organisation: hospitalId });
    if (existing) {
      if (existing.status === "active") {
        return res.status(400).send({ success: false, message: "Already subscribed to this hospital" });
      }
      existing.status = "active";
      existing.subscribedAt = new Date();
      await existing.save();
      return res.status(200).send({ success: true, message: "Subscription reactivated", subscription: existing });
    }

    const created = await subscriptionModel.create({ donor: organisationId, organisation: hospitalId, status: "active" });
    const populated = await subscriptionModel.findById(created._id).populate("organisation", "hospitalName email phone address");
    return res.status(201).send({ success: true, message: "Subscribed to hospital", subscription: populated });
  } catch (error) {
    console.error("Error in subscribeToHospital:", error);
    return res.status(500).send({ success: false, message: "Error in subscribe to hospital", error: error.message });
  }
};

// ORG unsubscribes from a HOSPITAL
const unsubscribeFromHospitalController = async (req, res) => {
  try {
    const organisationId = req.body.userId;
    const { hospitalId } = req.body;

    const updated = await subscriptionModel.findOneAndUpdate(
      { donor: organisationId, organisation: hospitalId, status: "active" },
      { status: "inactive" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send({ success: false, message: "Active subscription not found" });
    }

    return res.status(200).send({ success: true, message: "Unsubscribed from hospital" });
  } catch (error) {
    console.error("Error in unsubscribeFromHospital:", error);
    return res.status(500).send({ success: false, message: "Error in unsubscribe from hospital", error: error.message });
  }
};

// ORG's hospital subscriptions
const getOrganisationHospitalSubscriptionsController = async (req, res) => {
  try {
    const organisationId = req.body.userId;

    const subs = await subscriptionModel
      .find({ donor: organisationId, status: "active" })
      .populate("organisation", "hospitalName email phone address role")
      .sort({ subscribedAt: -1 });

    // Only keep ones where populated organisation is a hospital
    const hospitalSubs = subs.filter(s => s.organisation && s.organisation.role === "hospital");

    return res.status(200).send({ success: true, message: "Org hospital subscriptions fetched", subscriptions: hospitalSubs });
  } catch (error) {
    console.error("Error in getOrganisationHospitalSubscriptions:", error);
    return res.status(500).send({ success: false, message: "Error fetching org hospital subscriptions", error: error.message });
  }
};

// Available hospitals for org to subscribe to
const getAvailableHospitalsController = async (req, res) => {
  try {
    const organisationId = req.body.userId;

    const allHospitals = await userModel.find({ role: "hospital" }).select("hospitalName email phone address website role");
    const current = await subscriptionModel.find({ donor: organisationId, status: "active" }).select("organisation");
    const subscribedIds = new Set(current.map(s => s.organisation.toString()));
    const available = allHospitals.filter(h => !subscribedIds.has(h._id.toString()));

    return res.status(200).send({ success: true, message: "Available hospitals fetched", hospitals: available });
  } catch (error) {
    console.error("Error in getAvailableHospitals:", error);
    return res.status(500).send({ success: false, message: "Error fetching available hospitals", error: error.message });
  }
};

// Hospital -> list organisations subscribed to it
const getHospitalOrganisationSubscribersController = async (req, res) => {
  try {
    const hospitalId = req.body.userId;

    const subs = await subscriptionModel
      .find({ organisation: hospitalId, status: "active" })
      .populate("donor", "organisationName email phone address role")
      .sort({ subscribedAt: -1 });

    const orgSubs = subs.filter(s => s.donor && s.donor.role === "organisation");

    return res.status(200).send({ success: true, message: "Hospital organisation subscribers fetched", organisations: orgSubs });
  } catch (error) {
    console.error("Error in getHospitalOrganisationSubscribers:", error);
    return res.status(500).send({ success: false, message: "Error fetching hospital organisation subscribers", error: error.message });
  }
};

module.exports = {
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
};