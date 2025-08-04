import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../services/API";

const DonorHome = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get donor capacity to fetch blood group
  const getCapacity = async () => {
    try {
      const { data } = await API.get("/capacity/my-capacity");
      if (data?.success) {
        setCapacity(data?.capacity);
      }
    } catch (error) {
      console.error("Error fetching capacity:", error);
      // If no capacity set up yet, that's okay
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "donor") {
      getCapacity();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <Layout>
      <div className="container-fluid p-4">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <div className="card-body text-white p-4">
                <h2 className="mb-2">
                  <i className="fa-solid fa-heart text-danger me-3"></i>
                  Welcome, {user?.name || "Donor"}!
                </h2>
                <p className="mb-0 fs-5">Thank you for being a life-saving hero. Your donations make a difference!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-primary mb-2">
                  <i className="fa-solid fa-droplet fa-2x"></i>
                </div>
                <h5 className="card-title">Your Blood Type</h5>
                <h3 className="text-danger">
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    capacity?.bloodGroup || "Not Set"
                  )}
                </h3>
                {!capacity?.bloodGroup && !loading && (
                  <small className="text-muted">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate("/donor-capacity")}
                    >
                      Set up profile
                    </button>
                  </small>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-success mb-2">
                  <i className="fa-solid fa-calendar-check fa-2x"></i>
                </div>
                <h5 className="card-title">Total Donations</h5>
                <h3 className="text-success">12</h3>
                <small className="text-muted">Lifetime donations</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-warning mb-2">
                  <i className="fa-solid fa-clock fa-2x"></i>
                </div>
                <h5 className="card-title">Next Eligible</h5>
                <h3 className="text-warning">45 Days</h3>
                <small className="text-muted">Until next donation</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-info mb-2">
                  <i className="fa-solid fa-users fa-2x"></i>
                </div>
                <h5 className="card-title">Lives Saved</h5>
                <h3 className="text-info">36</h3>
                <small className="text-muted">Estimated impact</small>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h4 className="mb-0">
                  <i className="fa-solid fa-bolt text-warning me-2"></i>
                  Quick Actions
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <button 
                      className="btn btn-primary w-100 py-3"
                      onClick={() => navigate("/donor-new-donation")}
                      style={{ borderRadius: "15px" }}
                    >
                      <i className="fa-solid fa-plus-circle me-2"></i>
                      Schedule New Donation
                    </button>
                  </div>
                  <div className="col-md-4 mb-3">
                    <button 
                      className="btn btn-success w-100 py-3"
                      onClick={() => navigate("/donor-dashboard")}
                      style={{ borderRadius: "15px" }}
                    >
                      <i className="fa-solid fa-chart-line me-2"></i>
                      View Donation History
                    </button>
                  </div>
                  <div className="col-md-4 mb-3">
                    <button 
                      className="btn btn-info w-100 py-3"
                      onClick={() => navigate("/donor-organisation")}
                      style={{ borderRadius: "15px" }}
                    >
                      <i className="fa-solid fa-building me-2"></i>
                      Find Organizations
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-heart-pulse text-danger me-2"></i>
                  Health Tips for Donors
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    Stay hydrated - drink plenty of water
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    Eat iron-rich foods regularly
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    Get adequate rest before donation
                  </li>
                  <li className="mb-2">
                    <i className="fa-solid fa-check-circle text-success me-2"></i>
                    Avoid alcohol 24 hours before donation
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-info-circle text-primary me-2"></i>
                  Did You Know?
                </h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info border-0" style={{ borderRadius: "15px" }}>
                  <h6 className="alert-heading">Blood Donation Facts:</h6>
                  <p className="mb-2">• One donation can save up to 3 lives</p>
                  <p className="mb-2">• Your body replaces donated blood in 24-48 hours</p>
                  <p className="mb-2">• Only 3% of eligible people donate blood</p>
                  <p className="mb-0">• You can donate every 56 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)" }}>
              <div className="card-body text-white">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="fa-solid fa-exclamation-triangle fa-2x"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1">Urgent Blood Need Alert!</h5>
                    <p className="mb-2">Local hospitals are experiencing critical shortage of O- blood type.</p>
                    <button className="btn btn-light btn-sm">
                      <i className="fa-solid fa-phone me-1"></i>
                      Contact Emergency Donation Center
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonorHome;