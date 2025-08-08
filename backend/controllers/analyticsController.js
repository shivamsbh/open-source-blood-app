const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
//GET BLOOD DATA
const bloodGroupDetailsController = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    //get single blood group
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        //COunt TOTAL IN
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //COunt TOTAL OUT
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //CALCULATE TOTAL
        const availabeBlood =
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        //PUSH DATA
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availabeBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: "Blood Group Data Fetch Successfully",
      bloodGroupData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Bloodgroup Data Analytics API",
      error,
    });
  }
};

// GET TREND ANALYTICS - Daily/Weekly/Monthly trends
const getTrendAnalyticsController = async (req, res) => {
  try {
    const { period = "7" } = req.query; // Default to 7 days
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    const days = parseInt(period);
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get daily trends
    const trendData = await inventoryModel.aggregate([
      {
        $match: {
          organisation,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$inventoryType"
          },
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    return res.status(200).send({
      success: true,
      message: "Trend analytics fetched successfully",
      trendData,
      period: days
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in trend analytics API",
      error
    });
  }
};

// GET DONOR/HOSPITAL STATISTICS
const getUserStatsController = async (req, res) => {
  try {
    const organisation = new mongoose.Types.ObjectId(req.body.userId);

    // Get top donors
    const topDonors = await inventoryModel.aggregate([
      {
        $match: {
          organisation,
          inventoryType: "in"
        }
      },
      {
        $group: {
          _id: "$email",
          totalDonated: { $sum: "$quantity" },
          donationCount: { $sum: 1 },
          lastDonation: { $max: "$createdAt" }
        }
      },
      {
        $sort: { totalDonated: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get top hospitals
    const topHospitals = await inventoryModel.aggregate([
      {
        $match: {
          organisation,
          inventoryType: "out"
        }
      },
      {
        $group: {
          _id: "$email",
          totalRequested: { $sum: "$quantity" },
          requestCount: { $sum: 1 },
          lastRequest: { $max: "$createdAt" }
        }
      },
      {
        $sort: { totalRequested: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get blood group distribution
    const bloodGroupDistribution = await inventoryModel.aggregate([
      {
        $match: { organisation }
      },
      {
        $group: {
          _id: {
            bloodGroup: "$bloodGroup",
            type: "$inventoryType"
          },
          total: { $sum: "$quantity" }
        }
      }
    ]);

    return res.status(200).send({
      success: true,
      message: "User statistics fetched successfully",
      topDonors,
      topHospitals,
      bloodGroupDistribution
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in user stats API",
      error
    });
  }
};

// GET SUMMARY STATISTICS
const getSummaryStatsController = async (req, res) => {
  try {
    const organisation = new mongoose.Types.ObjectId(req.body.userId);

    // Total statistics
    const totalStats = await inventoryModel.aggregate([
      {
        $match: { organisation }
      },
      {
        $group: {
          _id: "$inventoryType",
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 }
        }
      }
    ]);

    // This month's statistics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await inventoryModel.aggregate([
      {
        $match: {
          organisation,
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: "$inventoryType",
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Low stock alerts (blood groups with less than 1000ml available)
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const lowStockAlerts = [];

    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);

        const available = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
        
        if (available < 1000) {
          lowStockAlerts.push({
            bloodGroup,
            available,
            status: available < 500 ? "critical" : "low"
          });
        }
      })
    );

    return res.status(200).send({
      success: true,
      message: "Summary statistics fetched successfully",
      totalStats,
      monthlyStats,
      lowStockAlerts
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in summary stats API",
      error
    });
  }
};

module.exports = { 
  bloodGroupDetailsController,
  getTrendAnalyticsController,
  getUserStatsController,
  getSummaryStatsController
};
