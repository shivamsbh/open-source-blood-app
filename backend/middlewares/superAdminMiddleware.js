const userModel = require("../models/userModel");

// Super Admin middleware - only allows existing admins to create new admins
module.exports = async (req, res, next) => {
  try {
    // Check if this is an admin registration request
    if (req.body.role === "admin") {
      // For admin registration, we need to verify the requester is already an admin
      const requesterId = req.body.requesterId; // This should be passed from frontend
      
      if (!requesterId) {
        return res.status(401).json({
          success: false,
          message: "Admin registration requires authorization from existing admin",
        });
      }

      const requester = await userModel.findById(requesterId);
      
      if (!requester || requester.role !== "admin") {
        return res.status(401).json({
          success: false,
          message: "Only existing admins can create new admin accounts",
        });
      }
    }
    
    next();
  } catch (error) {
    console.error("Super Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization check failed",
      error: error.message,
    });
  }
};