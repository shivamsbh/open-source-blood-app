const mongoose = require("mongoose");
const donorCapacityModel = require("../models/donorCapacityModel");
const userModel = require("../models/userModel");
const inventoryModel = require("../models/inventoryModel");

// CREATE OR UPDATE DONOR CAPACITY
const setDonorCapacityController = async (req, res) => {
  try {
    const donorId = req.body.userId;
    const { 
      bloodGroup, 
      totalCapacity, 
      donationFrequency, 
      healthStatus, 
      restrictions, 
      notes 
    } = req.body;

    // Validation
    if (!bloodGroup || !totalCapacity) {
      return res.status(400).send({
        success: false,
        message: "Blood group and total capacity are required",
      });
    }

    if (totalCapacity < 100 || totalCapacity > 2000) {
      return res.status(400).send({
        success: false,
        message: "Total capacity must be between 100ml and 2000ml",
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

    // Check if capacity already exists
    let capacity = await donorCapacityModel.findOne({ donor: donorId });

    if (capacity) {
      // Update existing capacity
      const oldTotalCapacity = capacity.totalCapacity;
      const oldAvailableCapacity = capacity.availableCapacity;
      const donatedAmount = oldTotalCapacity - oldAvailableCapacity;

      capacity.bloodGroup = bloodGroup;
      capacity.totalCapacity = totalCapacity;
      capacity.availableCapacity = Math.max(0, totalCapacity - donatedAmount);
      capacity.donationFrequency = donationFrequency || capacity.donationFrequency;
      capacity.healthStatus = healthStatus || capacity.healthStatus;
      capacity.restrictions = restrictions || capacity.restrictions;
      capacity.notes = notes || capacity.notes;

      await capacity.save();

      return res.status(200).send({
        success: true,
        message: "Donor capacity updated successfully",
        capacity,
      });
    } else {
      // Create new capacity
      const newCapacity = new donorCapacityModel({
        donor: donorId,
        bloodGroup,
        totalCapacity,
        availableCapacity: totalCapacity, // Initially, all capacity is available
        donationFrequency: donationFrequency || "quarterly",
        healthStatus: healthStatus || "good",
        restrictions: restrictions || [],
        notes: notes || "",
      });

      await newCapacity.save();

      return res.status(201).send({
        success: true,
        message: "Donor capacity created successfully",
        capacity: newCapacity,
      });
    }
  } catch (error) {
    console.error("Error in set donor capacity:", error);
    return res.status(500).send({
      success: false,
      message: "Error setting donor capacity",
      error: error.message,
    });
  }
};

// GET DONOR CAPACITY
const getDonorCapacityController = async (req, res) => {
  try {
    const donorId = req.body.userId;

    const capacity = await donorCapacityModel
      .findOne({ donor: donorId })
      .populate("donor", "name email phone");

    if (!capacity) {
      return res.status(404).send({
        success: false,
        message: "Donor capacity not found. Please set your capacity first.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Donor capacity fetched successfully",
      capacity,
    });
  } catch (error) {
    console.error("Error in get donor capacity:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching donor capacity",
      error: error.message,
    });
  }
};

// GET ALL DONORS WITH CAPACITY (FOR ORGANIZATIONS)
const getDonorsWithCapacityController = async (req, res) => {
  try {
    const { bloodGroup, minCapacity, onlyEligible } = req.query;

    // Build filter
    let filter = { isActive: true };
    
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }
    
    if (minCapacity) {
      filter.availableCapacity = { $gte: parseInt(minCapacity) };
    }

    if (onlyEligible === 'true') {
      filter.availableCapacity = { $gt: 0 };
      filter.$or = [
        { nextEligibleDate: { $exists: false } },
        { nextEligibleDate: null },
        { nextEligibleDate: { $lte: new Date() } }
      ];
    }

    const donorsWithCapacity = await donorCapacityModel
      .find(filter)
      .populate("donor", "name email phone address")
      .sort({ availableCapacity: -1 });

    return res.status(200).send({
      success: true,
      message: "Donors with capacity fetched successfully",
      donors: donorsWithCapacity,
    });
  } catch (error) {
    console.error("Error in get donors with capacity:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching donors with capacity",
      error: error.message,
    });
  }
};

// UPDATE CAPACITY AFTER DONATION
const updateCapacityAfterDonationController = async (req, res) => {
  try {
    const { donorId, donatedAmount } = req.body;

    if (!donorId || !donatedAmount) {
      return res.status(400).send({
        success: false,
        message: "Donor ID and donated amount are required",
      });
    }

    const capacity = await donorCapacityModel.findOne({ donor: donorId });

    if (!capacity) {
      return res.status(404).send({
        success: false,
        message: "Donor capacity not found",
      });
    }

    if (capacity.availableCapacity < donatedAmount) {
      return res.status(400).send({
        success: false,
        message: `Insufficient capacity. Available: ${capacity.availableCapacity}ml, Requested: ${donatedAmount}ml`,
      });
    }

    await capacity.updateAfterDonation(donatedAmount);

    return res.status(200).send({
      success: true,
      message: "Capacity updated after donation",
      capacity,
    });
  } catch (error) {
    console.error("Error in update capacity after donation:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating capacity after donation",
      error: error.message,
    });
  }
};

// RESET DONOR CAPACITY
const resetDonorCapacityController = async (req, res) => {
  try {
    const donorId = req.body.userId;

    const capacity = await donorCapacityModel.findOne({ donor: donorId });

    if (!capacity) {
      return res.status(404).send({
        success: false,
        message: "Donor capacity not found",
      });
    }

    await capacity.resetCapacity();

    return res.status(200).send({
      success: true,
      message: "Donor capacity reset successfully",
      capacity,
    });
  } catch (error) {
    console.error("Error in reset donor capacity:", error);
    return res.status(500).send({
      success: false,
      message: "Error resetting donor capacity",
      error: error.message,
    });
  }
};

// GET CAPACITY STATISTICS
const getCapacityStatsController = async (req, res) => {
  try {
    const donorId = req.body.userId;

    // Get donor's capacity
    const capacity = await donorCapacityModel.findOne({ donor: donorId });

    if (!capacity) {
      return res.status(404).send({
        success: false,
        message: "Donor capacity not found",
      });
    }

    // Get donation history
    const donations = await inventoryModel.find({
      donor: donorId,
      inventoryType: "in",
    }).sort({ createdAt: -1 });

    // Calculate stats
    const totalDonations = donations.length;
    const totalDonated = donations.reduce((sum, donation) => sum + donation.quantity, 0);
    const averageDonation = totalDonations > 0 ? Math.round(totalDonated / totalDonations) : 0;
    const lastDonation = donations.length > 0 ? donations[0] : null;

    const stats = {
      capacity: {
        total: capacity.totalCapacity,
        available: capacity.availableCapacity,
        donated: capacity.donatedAmount,
        utilizationPercentage: capacity.utilizationPercentage,
      },
      donations: {
        total: totalDonations,
        totalVolume: totalDonated,
        averageVolume: averageDonation,
        lastDonation: lastDonation ? {
          date: lastDonation.createdAt,
          amount: lastDonation.quantity,
          organization: lastDonation.organisation,
        } : null,
      },
      eligibility: {
        isEligible: capacity.isEligible,
        nextEligibleDate: capacity.nextEligibleDate,
        daysUntilEligible: capacity.daysUntilEligible,
        healthStatus: capacity.healthStatus,
      },
    };

    return res.status(200).send({
      success: true,
      message: "Capacity statistics fetched successfully",
      stats,
    });
  } catch (error) {
    console.error("Error in get capacity stats:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching capacity statistics",
      error: error.message,
    });
  }
};

module.exports = {
  setDonorCapacityController,
  getDonorCapacityController,
  getDonorsWithCapacityController,
  updateCapacityAfterDonationController,
  resetDonorCapacityController,
  getCapacityStatsController,
};