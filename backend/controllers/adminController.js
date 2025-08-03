const userModel = require("../models/userModel");

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

//EXPORT
module.exports = {
  getDonorsListController,
  getHospitalListController,
  getOrgListController,
  deleteUserController,
};
