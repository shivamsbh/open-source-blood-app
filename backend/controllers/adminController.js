const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

//GET DONOR LIST
const getDonorsListController = async (req, res) => {
  try {
    const donorData = await userModel
      .find({ role: { $in: ["donor", "donar"] } })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalCount: donorData.length,
      message: "Donor List Fetched Successfully",
      donorData,
    });
  } catch (error) {
    console.error("Error in donor list API:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Donor List API",
      error: error.message,
    });
  }
};

//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalCount: hospitalData.length,
      message: "Hospital List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};

//GET ORG LIST
const getOrgListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalCount: orgData.length,
      message: "Organization List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG List API",
      error,
    });
  }
};

// =======================================

//DELETE USER (DONOR/HOSPITAL/ORG)
const deleteUserController = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User record deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting user:", error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting user",
      error: error.message,
    });
  }
};

// NEW: CREATE ADMIN ACCOUNT (Only accessible by existing admins)
const createAdminController = async (req, res) => {
  try {
    const { email, password, name, address, phone, website } = req.body;

    // Validation
    if (!email || !password || !name || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields for admin creation",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user data
    const adminData = {
      email,
      password: hashedPassword,
      role: "admin",
      name,
      address,
      phone,
      website,
    };

    // Create and save admin user
    const adminUser = new userModel(adminData);
    await adminUser.save();

    // Remove password from response
    const adminResponse = adminUser.toObject();
    delete adminResponse.password;

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin: adminResponse,
    });
  } catch (error) {
    console.error("Create admin error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during admin creation",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// GET ALL ADMINS (Only accessible by existing admins)
const getAdminListController = async (req, res) => {
  try {
    const adminData = await userModel
      .find({ role: "admin" })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      totalCount: adminData.length,
      message: "Admin List Fetched Successfully",
      adminData,
    });
  } catch (error) {
    console.error("Error in admin list API:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Admin List API",
      error: error.message,
    });
  }
};

//EXPORT
module.exports = {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteUserController,
  createAdminController,
  getAdminListController,
};