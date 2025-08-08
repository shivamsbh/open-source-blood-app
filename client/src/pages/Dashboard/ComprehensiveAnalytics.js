import React, { useState, useEffect } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ComprehensiveAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [summaryStats, setSummaryStats] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [bloodGroups, trends, users, summary] = await Promise.all([
        API.get("/analytics/bloodGroups-data"),
        API.get(`/analytics/trends?period=${selectedPeriod}`),
        API.get("/analytics/user-stats"),
        API.get("/analytics/summary")
      ]);

      if (bloodGroups.data?.success) setBloodGroupData(bloodGroups.data.bloodGroupData);
      if (trends.data?.success) setTrendData(trends.data.trendData);
      if (users.data?.success) setUserStats(users.data);
      if (summary.data?.success) setSummaryStats(summary.data);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  // Chart configurations
  const bloodGroupChartData = {
    labels: bloodGroupData.map(item => item.bloodGroup),
    datasets: [
      {
        label: 'Available Blood (ML)',
        data: bloodGroupData.map(item => item.availabeBlood),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Process trend data for line chart
  const processTrendData = () => {
    const dates = [...new Set(trendData.map(item => item._id.date))].sort();
    const inData = dates.map(date => {
      const dayData = trendData.find(item => item._id.date === date && item._id.type === 'in');
      return dayData ? dayData.totalQuantity : 0;
    });
    const outData = dates.map(date => {
      const dayData = trendData.find(item => item._id.date === date && item._id.type === 'out');
      return dayData ? dayData.totalQuantity : 0;
    });

    return {
      labels: dates.map(date => moment(date).format('MMM DD')),
      datasets: [
        {
          label: 'Donations (IN)',
          data: inData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Requests (OUT)',
          data: outData,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Blood Flow Trends (Last ${selectedPeriod} days)`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: "#6c757d" }}>Loading comprehensive analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 style={{ color: "#495057", fontWeight: "bold", margin: 0 }}>
                  <i className="fa-solid fa-chart-line me-3" style={{ color: "#007bff" }}></i>
                  Comprehensive Analytics Dashboard
                </h2>
                <p style={{ color: "#6c757d", margin: 0 }}>
                  Advanced insights and blood bank performance metrics
                </p>
              </div>
              <div>
                <select
                  className="form-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  style={{ width: "200px" }}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-droplet fa-2x mb-3"></i>
                <h4>{summaryStats.totalStats?.find(s => s._id === 'in')?.totalQuantity || 0} ML</h4>
                <p className="mb-0">Total Donations</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-hospital fa-2x mb-3"></i>
                <h4>{summaryStats.totalStats?.find(s => s._id === 'out')?.totalQuantity || 0} ML</h4>
                <p className="mb-0">Total Requests</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-chart-line fa-2x mb-3"></i>
                <h4>{summaryStats.monthlyStats?.find(s => s._id === 'in')?.totalQuantity || 0} ML</h4>
                <p className="mb-0">This Month Donations</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-exclamation-triangle fa-2x mb-3"></i>
                <h4>{summaryStats.lowStockAlerts?.length || 0}</h4>
                <p className="mb-0">Low Stock Alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row mb-4">
          {/* Trend Chart */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-chart-area me-2" style={{ color: "#007bff" }}></i>
                  Blood Flow Trends
                </h5>
              </div>
              <div className="card-body">
                {trendData.length > 0 ? (
                  <Line data={processTrendData()} options={chartOptions} />
                ) : (
                  <div className="text-center py-5">
                    <p style={{ color: "#6c757d" }}>No trend data available for selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blood Group Distribution */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-chart-pie me-2" style={{ color: "#007bff" }}></i>
                  Blood Group Distribution
                </h5>
              </div>
              <div className="card-body">
                {bloodGroupData.length > 0 ? (
                  <Doughnut 
                    data={bloodGroupChartData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-5">
                    <p style={{ color: "#6c757d" }}>No blood group data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {summaryStats.lowStockAlerts?.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="fa-solid fa-exclamation-triangle me-2"></i>
                    Low Stock Alerts
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {summaryStats.lowStockAlerts.map((alert, index) => (
                      <div key={index} className="col-md-3 mb-3">
                        <div className={`alert ${alert.status === 'critical' ? 'alert-danger' : 'alert-warning'} mb-0`}>
                          <strong>{alert.bloodGroup}</strong>
                          <br />
                          <small>{alert.available} ML available</small>
                          <br />
                          <span className={`badge ${alert.status === 'critical' ? 'bg-danger' : 'bg-warning'}`}>
                            {alert.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Performers */}
        <div className="row">
          {/* Top Donors */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-trophy me-2" style={{ color: "#28a745" }}></i>
                  Top Donors
                </h5>
              </div>
              <div className="card-body">
                {userStats.topDonors?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Email</th>
                          <th>Total Donated</th>
                          <th>Donations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userStats.topDonors.slice(0, 5).map((donor, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge bg-primary">#{index + 1}</span>
                            </td>
                            <td>{donor._id}</td>
                            <td><strong>{donor.totalDonated} ML</strong></td>
                            <td>{donor.donationCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p style={{ color: "#6c757d" }}>No donor data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Hospitals */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-hospital me-2" style={{ color: "#dc3545" }}></i>
                  Top Requesting Hospitals
                </h5>
              </div>
              <div className="card-body">
                {userStats.topHospitals?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Email</th>
                          <th>Total Requested</th>
                          <th>Requests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userStats.topHospitals.slice(0, 5).map((hospital, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge bg-danger">#{index + 1}</span>
                            </td>
                            <td>{hospital._id}</td>
                            <td><strong>{hospital.totalRequested} ML</strong></td>
                            <td>{hospital.requestCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p style={{ color: "#6c757d" }}>No hospital data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComprehensiveAnalytics;