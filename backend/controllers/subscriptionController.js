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

    // Check if donor exists
    const donor = await userModel.findOne({
      _id: donorId,
      role: "donor",
    });

    if (!donor) {
      return res.status(404).send({
        success: false,
        message: "Donor not found",
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

// GET DONOR'S SUBSCRIPTIONS
const getDonorSubscriptionsController = async (req, res) => {
  try {
    const donorId = req.body.userId;

    const subscriptions = await subscriptionModel
      .find({
        donor: donorId,
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

module.exports = {
  subscribeToOrganisationController,
  unsubscribeFromOrganisationController,
  getDonorSubscriptionsController,
  getOrganisationSubscribersController,
  getAvailableOrganisationsController,
  checkSubscriptionStatusController,
};