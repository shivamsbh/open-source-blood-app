const donationModel = require("../models/donationModel");
const subscriptionModel = require("../models/subscriptionModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

// Create a new donation (only for subscribed donors)
const createDonationController = async (req, res) => {
  try {
    const { organisationId, bloodGroup, quantity, donationType, notes } = req.body;
    const donorId = req.body.userId; // From auth middleware

    // Validate required fields
    if (!organisationId || !bloodGroup || !quantity) {
      return res.status(400).send({
        success: false,
        message: "Organisation, blood group, and quantity are required",
      });
    }

    // Check if donor has active subscription to this organisation
    const subscription = await subscriptionModel.findOne({
      donor: donorId,
      organisation: organisationId,
      status: "active"
    });

    if (!subscription) {
      return res.status(403).send({
        success: false,
        message: "You must be subscribed to this organisation to donate",
      });
    }

    // Create donation
    const donation = new donationModel({
      donor: donorId,
      organisation: organisationId,
      subscription: subscription._id,
      bloodGroup,
      quantity,
      donationType: donationType || "whole_blood",
      notes,
      status: "completed"
    });

    await donation.save();

    res.status(201).send({
      success: true,
      message: "Donation recorded successfully",
      donation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error recording donation",
      error: error.message,
    });
  }
};

// Get all donations for an organisation
const getOrganisationDonationsController = async (req, res) => {
  try {
    const organisationId = req.body.userId; // From auth middleware

    const donations = await donationModel
      .find({ organisation: organisationId })
      .populate("donor", "name email bloodGroup")
      .populate("subscription")
      .sort({ donationDate: -1 });

    res.status(200).send({
      success: true,
      message: "Donations fetched successfully",
      donations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching donations",
      error: error.message,
    });
  }
};

// Get filtered donations for an organisation
const getFilteredDonationsController = async (req, res) => {
  try {
    const organisationId = req.body.userId;
    const { bloodGroup, donationType, donorEmail, startDate, endDate } = req.query;

    // Build filter object
    let filter = { organisation: organisationId };

    if (bloodGroup && bloodGroup !== "All Blood Groups") {
      filter.bloodGroup = bloodGroup;
    }

    if (donationType && donationType !== "All Types") {
      filter.donationType = donationType;
    }

    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) {
        filter.donationDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.donationDate.$lte = new Date(endDate);
      }
    }

    let donations = await donationModel
      .find(filter)
      .populate("donor", "name email bloodGroup")
      .populate("subscription")
      .sort({ donationDate: -1 });

    // Filter by donor email if provided
    if (donorEmail && donorEmail.trim()) {
      donations = donations.filter(donation => 
        donation.donor?.email?.toLowerCase().includes(donorEmail.toLowerCase()) ||
        donation.donor?.name?.toLowerCase().includes(donorEmail.toLowerCase())
      );
    }

    res.status(200).send({
      success: true,
      message: "Filtered donations fetched successfully",
      donations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching filtered donations",
      error: error.message,
    });
  }
};

// Get donations for a specific donor
const getDonorDonationsController = async (req, res) => {
  try {
    const donorId = req.body.userId;

    const donations = await donationModel
      .find({ donor: donorId })
      .populate("organisation", "organisationName email")
      .populate("subscription")
      .sort({ donationDate: -1 });

    res.status(200).send({
      success: true,
      message: "Donor donations fetched successfully",
      donations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching donor donations",
      error: error.message,
    });
  }
};

// Get donation analytics for organisation
const getDonationAnalyticsController = async (req, res) => {
  try {
    const organisationId = req.body.userId;

    // Get total donations
    const totalDonations = await donationModel.countDocuments({ 
      organisation: organisationId 
    });

    // Get donations by blood group
    const donationsByBloodGroup = await donationModel.aggregate([
      { $match: { organisation: new mongoose.Types.ObjectId(organisationId) } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 }, totalQuantity: { $sum: "$quantity" } } },
      { $sort: { count: -1 } }
    ]);

    // Get donations by type
    const donationsByType = await donationModel.aggregate([
      { $match: { organisation: new mongoose.Types.ObjectId(organisationId) } },
      { $group: { _id: "$donationType", count: { $sum: 1 }, totalQuantity: { $sum: "$quantity" } } },
      { $sort: { count: -1 } }
    ]);

    // Get monthly donations (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyDonations = await donationModel.aggregate([
      { 
        $match: { 
          organisation: new mongoose.Types.ObjectId(organisationId),
          donationDate: { $gte: twelveMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$donationDate" },
            month: { $month: "$donationDate" }
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Get recent donations
    const recentDonations = await donationModel
      .find({ organisation: organisationId })
      .populate("donor", "name email bloodGroup")
      .sort({ donationDate: -1 })
      .limit(10);

    res.status(200).send({
      success: true,
      message: "Donation analytics fetched successfully",
      analytics: {
        totalDonations,
        donationsByBloodGroup,
        donationsByType,
        monthlyDonations,
        recentDonations
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching donation analytics",
      error: error.message,
    });
  }
};

module.exports = {
  createDonationController,
  getOrganisationDonationsController,
  getFilteredDonationsController,
  getDonorDonationsController,
  getDonationAnalyticsController,
};