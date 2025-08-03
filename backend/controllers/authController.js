const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { email, password, role, name, organisationName, hospitalName, address, phone, website } = req.body;

    // Validation
    if (!email || !password || !role || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
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

    // Create user data object
    const userData = {
      email,
      password: hashedPassword,
      role,
      address,
      phone,
      website,
    };

    // Add role-specific fields
    if (role === "donor" || role === "admin") {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required for donor and admin roles",
        });
      }
      userData.name = name;
    }

    if (role === "organisation") {
      if (!organisationName) {
        return res.status(400).json({
          success: false,
          message: "Organisation name is required for organisation role",
        });
      }
      userData.organisationName = organisationName;
    }

    if (role === "hospital") {
      if (!hospitalName) {
        return res.status(400).json({
          success: false,
          message: "Hospital name is required for hospital role",
        });
      }
      userData.hospitalName = hospitalName;
    }

    // Create and save user
    const user = new userModel(userData);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Register error:", error);
    
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
      message: "Internal server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Login controller
const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password, and role",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check role (handle both old and new spelling)
    const normalizedUserRole = user.role === 'donar' ? 'donor' : user.role;
    const normalizedLoginRole = role === 'donar' ? 'donor' : role;
    
    if (normalizedUserRole !== normalizedLoginRole) {
      return res.status(401).json({
        success: false,
        message: "Role doesn't match",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "7d", // Extended to 7 days for better UX
      }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get current user controller
const currentUserController = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to get current user",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { 
  registerController, 
  loginController, 
  currentUserController 
};
