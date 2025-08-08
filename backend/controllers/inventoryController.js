const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const subscriptionModel = require("../models/subscriptionModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donor") {
    //   throw new Error("Not a donor account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT Blood Quantity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.error("Error in create inventory:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error: error.message,
    });
  }
};

// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donor")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Get all records successfully",
      inventory,
    });
  } catch (error) {
    console.error("Error in get inventory:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error: error.message,
    });
  }
};

// GET FILTERED BLOOD RECORDS
const getFilteredInventoryController = async (req, res) => {
  try {
    const { bloodGroup, inventoryType, email, startDate, endDate } = req.query;
    
    // Build filter object
    const filters = {
      organisation: req.body.userId,
    };

    // Add blood group filter
    if (bloodGroup && bloodGroup !== "All Blood Groups") {
      filters.bloodGroup = bloodGroup;
    }

    // Add inventory type filter
    if (inventoryType && inventoryType !== "All Types") {
      filters.inventoryType = inventoryType;
    }

    // Add email filter (partial match)
    if (email) {
      filters.email = { $regex: email, $options: "i" };
    }

    // Add date range filter
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filters.createdAt.$lte = new Date(endDate);
      }
    }

    const inventory = await inventoryModel
      .find(filters)
      .populate("donor")
      .populate("hospital")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Filtered records retrieved successfully",
      inventory,
      filters: req.query, // Return applied filters for frontend reference
    });
  } catch (error) {
    console.error("Error in get filtered inventory:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Get Filtered Inventory",
      error: error.message,
    });
  }
};
// GET Hospital BLOOD RECORS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer Inventory",
      error,
    });
  }
};

// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};

// GET DONOR RECORDS
const getDonorsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donors
    const donorId = await inventoryModel.distinct("donor", {
      organisation,
    });
    // console.log(donorId);
    const donors = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donor Record Fetched Successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donor records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;

    // 1) Hospitals linked via inventory transactions with this organisation
    const invHospitalIds = await inventoryModel.distinct("hospital", { organisation });

    // 2) Hospitals that this organisation has subscribed to (org -> hospital)
    const orgSubToHospIds = await subscriptionModel.distinct("organisation", {
      donor: organisation,
      status: "active",
    });
    // Ensure they are actually hospitals
    const orgSubToHospitals = await userModel.find({
      _id: { $in: orgSubToHospIds },
      role: "hospital",
    }).select("_id");
    const orgSubToHospitalsIds = orgSubToHospitals.map(h => h._id);

    // 3) Hospitals that have subscribed to this organisation (hospital -> org)
    const hospSubToOrgIds = await subscriptionModel.distinct("donor", {
      organisation,
      status: "active",
    });
    const hospitalSubscribers = await userModel.find({
      _id: { $in: hospSubToOrgIds },
      role: "hospital",
    }).select("_id");
    const hospitalSubscriberIds = hospitalSubscribers.map(h => h._id);

    // Union of all sources
    const allIdStrings = new Set([
      ...invHospitalIds.map(id => id?.toString()),
      ...orgSubToHospitalsIds.map(id => id?.toString()),
      ...hospitalSubscriberIds.map(id => id?.toString()),
    ].filter(Boolean));

    let hospitals = [];
    if (allIdStrings.size > 0) {
      const uniqueIds = Array.from(allIdStrings).map(id => new mongoose.Types.ObjectId(id));
      hospitals = await userModel.find({ _id: { $in: uniqueIds } });
    } else {
      // Fallback: show all hospitals for discovery if no relationship exists yet
      hospitals = await userModel.find({ role: "hospital" });
    }

    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
      counts: {
        fromInventory: invHospitalIds.length,
        organisationSubscribed: orgSubToHospitalsIds.length,
        hospitalSubscribed: hospitalSubscriberIds.length,
        total: hospitals.length,
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Hospital API",
      error,
    });
  }
};

// GET ORG PROFILES
const getOrganisationController = async (req, res) => {
  try {
    const donor = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donor });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
      error,
    });
  }
};
// GET ORG for Hospital
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;

    // 1) Organisations linked via inventory transactions
    const invOrgIds = await inventoryModel.distinct("organisation", { hospital });

    // 2) Organisations the hospital subscribed to (subscriptions store subscriber in donor field)
    const hosSubToOrgIds = await subscriptionModel.distinct("organisation", {
      donor: hospital,
      status: "active",
    });

    // 3) Organisations that subscribed to this hospital (reverse direction)
    const orgSubscriberIds = await subscriptionModel.distinct("donor", {
      organisation: hospital,
      status: "active",
    });
    // Filter those donor ids to only organisations
    const orgSubscribers = await userModel.find({
      _id: { $in: orgSubscriberIds },
      role: "organisation",
    }).select("_id");
    const orgSubscriberOrgIds = orgSubscribers.map(o => o._id);

    // Union of all sources
    const allIdStrings = new Set([
      ...invOrgIds.map((id) => id.toString()),
      ...hosSubToOrgIds.map((id) => id.toString()),
      ...orgSubscriberOrgIds.map((id) => id.toString()),
    ]);
    let uniqueIds = Array.from(allIdStrings).map((id) => new mongoose.Types.ObjectId(id));

    let organisations = [];
    if (uniqueIds.length > 0) {
      organisations = await userModel.find({ _id: { $in: uniqueIds } });
    } else {
      // Fallback: show all organisations so hospital can discover/connect
      organisations = await userModel.find({ role: "organisation" });
    }

    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
      counts: {
        fromInventory: invOrgIds.length,
        hospitalSubscribed: hosSubToOrgIds.length,
        orgSubscribedToHospital: orgSubscriberOrgIds.length,
        unique: uniqueIds.length,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital ORG API",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getFilteredInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
