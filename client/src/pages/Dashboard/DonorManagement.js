import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";
import { toast } from "react-toastify";

const DonorManagement = () => {
  const [donors, setDonors] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "subscribers"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [donorStats, setDonorStats] = useState({});

  // Fetch all donors who have donated to this organization
  const getAllDonors = async () => {
    try {
      const { data } = await API.get("/inventory/get-donors");
      if (data?.success) {
        setDonors(data.donors || []);
        
        // Get donation stats for each donor
        const stats = {};
        await Promise.all(
          data.donors.map(async (donor) => {
            try {
              const { data: inventoryData } = await API.get(`/inventory/get-filtered-inventory?email=${donor.email}&inventoryType=in`);
              if (inventoryData?.success) {
                const donations = inventoryData.inventory || [];
                stats[donor._id] = {
                  totalDonations: donations.length,
                  totalQuantity: donations.reduce((sum, item) => sum + item.quantity, 0),
                  lastDonation: donations.length > 0 ? donations[0].createdAt : null,
                  bloodGroups: [...new Set(donations.map(item => item.bloodGroup))]
                };
              }
            } catch (error) {
              console.error(`Error fetching stats for donor ${donor._id}:`, error);
            }
          })
        );
        setDonorStats(stats);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Failed to fetch donor data");
    }
  };

  // Fetch subscribers
  const getSubscribers = async () => {
    try {
      const { data } = await API.get("/subscription/my-subscribers");
      if (data?.success) {
        setSubscribers(data.subscribers || []);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to fetch subscriber data");
    }
  };

  // Fetch donor details with donation history
  const getDonorDetails = async (donor) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/inventory/get-filtered-inventory?email=${donor.email}&inventoryType=in`);
      if (data?.success) {
        setSelectedDonor({
          ...donor,
          donationHistory: data.inventory || []
        });
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching donor details:", error);
      toast.error("Failed to fetch donor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getAllDonors(), getSubscribers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter donors based on search term
  const filteredDonors = donors.filter(donor =>
    donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.phone?.includes(searchTerm)
  );

  const filteredSubscribers = subscribers.filter(sub =>
    sub.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.donor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.donor?.phone?.includes(searchTerm)
  );

  if (loading && donors.length === 0) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: "#6c757d" }}>Loading donor management...</p>
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
                  <i className="fa-solid fa-users me-3" style={{ color: "#28a745" }}></i>
                  Donor Management
                </h2>
                <p style={{ color: "#6c757d", margin: 0 }}>
                  Manage donors, track donations, and analyze donor relationships
                </p>
              </div>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "250px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-users fa-2x mb-3"></i>
                <h4>{donors.length}</h4>
                <p className="mb-0">Total Donors</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-heart fa-2x mb-3"></i>
                <h4>{subscribers.length}</h4>
                <p className="mb-0">Subscribers</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-droplet fa-2x mb-3"></i>
                <h4>{Object.values(donorStats).reduce((sum, stat) => sum + stat.totalDonations, 0)}</h4>
                <p className="mb-0">Total Donations</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-flask fa-2x mb-3"></i>
                <h4>{Object.values(donorStats).reduce((sum, stat) => sum + stat.totalQuantity, 0)} ML</h4>
                <p className="mb-0">Total Volume</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                  style={{
                    background: activeTab === "all" ? "linear-gradient(135deg, #007bff 0%, #0056b3 100%)" : "transparent",
                    color: activeTab === "all" ? "white" : "#007bff",
                    border: "2px solid #007bff",
                    fontWeight: "bold"
                  }}
                >
                  <i className="fa-solid fa-users me-2"></i>
                  All Donors ({filteredDonors.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "subscribers" ? "active" : ""}`}
                  onClick={() => setActiveTab("subscribers")}
                  style={{
                    background: activeTab === "subscribers" ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)" : "transparent",
                    color: activeTab === "subscribers" ? "white" : "#28a745",
                    border: "2px solid #28a745",
                    fontWeight: "bold"
                  }}
                >
                  <i className="fa-solid fa-heart me-2"></i>
                  Subscribers ({filteredSubscribers.length})
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Donor List */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className={`fa-solid ${activeTab === "all" ? "fa-users" : "fa-heart"} me-2`} 
                     style={{ color: activeTab === "all" ? "#007bff" : "#28a745" }}></i>
                  {activeTab === "all" ? "All Donors" : "Subscribed Donors"}
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        <th>Donor Info</th>
                        <th>Contact</th>
                        <th>Donation Stats</th>
                        <th>Last Activity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTab === "all" ? filteredDonors : filteredSubscribers.map(sub => sub.donor)).map((donor, index) => {
                        const stats = donorStats[donor._id] || {};
                        const isSubscriber = subscribers.some(sub => sub.donor?._id === donor._id);
                        
                        return (
                          <tr key={donor._id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <div style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "1.2rem"
                                  }}>
                                    {donor.name?.charAt(0)?.toUpperCase() || "D"}
                                  </div>
                                </div>
                                <div>
                                  <h6 className="mb-1" style={{ color: "#495057" }}>{donor.name || "N/A"}</h6>
                                  <div className="d-flex gap-2">
                                    {isSubscriber && (
                                      <span className="badge bg-success">
                                        <i className="fa-solid fa-heart me-1"></i>Subscriber
                                      </span>
                                    )}
                                    {stats.bloodGroups?.map(bg => (
                                      <span key={bg} className="badge bg-primary">{bg}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="mb-1">
                                  <i className="fa-solid fa-envelope me-2" style={{ color: "#6c757d" }}></i>
                                  <small>{donor.email}</small>
                                </div>
                                <div>
                                  <i className="fa-solid fa-phone me-2" style={{ color: "#6c757d" }}></i>
                                  <small>{donor.phone || "N/A"}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="mb-1">
                                  <strong style={{ color: "#28a745" }}>{stats.totalDonations || 0}</strong>
                                  <small className="text-muted"> donations</small>
                                </div>
                                <div>
                                  <strong style={{ color: "#dc3545" }}>{stats.totalQuantity || 0} ML</strong>
                                  <small className="text-muted"> total</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              {stats.lastDonation ? (
                                <div>
                                  <div className="mb-1">
                                    <small style={{ color: "#495057" }}>
                                      {moment(stats.lastDonation).format("MMM DD, YYYY")}
                                    </small>
                                  </div>
                                  <div>
                                    <small className="text-muted">
                                      {moment(stats.lastDonation).fromNow()}
                                    </small>
                                  </div>
                                </div>
                              ) : (
                                <small className="text-muted">No donations yet</small>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => getDonorDetails(donor)}
                                style={{ borderRadius: "20px" }}
                              >
                                <i className="fa-solid fa-eye me-1"></i>
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {(activeTab === "all" ? filteredDonors : filteredSubscribers).length === 0 && (
                    <div className="text-center py-5">
                      <i className="fa-solid fa-users fa-3x mb-3" style={{ color: "#dee2e6" }}></i>
                      <h5 style={{ color: "#6c757d" }}>No donors found</h5>
                      <p style={{ color: "#6c757d" }}>
                        {searchTerm ? "Try adjusting your search criteria" : 
                         activeTab === "all" ? "No donors have donated to your organization yet" : 
                         "No donors have subscribed to your organization yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donor Details Modal */}
        {showDetails && selectedDonor && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                  <h5 className="modal-title">
                    <i className="fa-solid fa-user me-2"></i>
                    Donor Details - {selectedDonor.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowDetails(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 style={{ color: "#495057" }}>Contact Information</h6>
                      <p><strong>Email:</strong> {selectedDonor.email}</p>
                      <p><strong>Phone:</strong> {selectedDonor.phone || "N/A"}</p>
                      <p><strong>Address:</strong> {selectedDonor.address || "N/A"}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 style={{ color: "#495057" }}>Donation Summary</h6>
                      <p><strong>Total Donations:</strong> {selectedDonor.donationHistory.length}</p>
                      <p><strong>Total Volume:</strong> {selectedDonor.donationHistory.reduce((sum, d) => sum + d.quantity, 0)} ML</p>
                      <p><strong>Member Since:</strong> {moment(selectedDonor.createdAt).format("MMM DD, YYYY")}</p>
                    </div>
                  </div>
                  
                  <h6 style={{ color: "#495057" }}>Donation History</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Blood Group</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDonor.donationHistory.map((donation, index) => (
                          <tr key={index}>
                            <td>{moment(donation.createdAt).format("MMM DD, YYYY")}</td>
                            <td>
                              <span className="badge bg-primary">{donation.bloodGroup}</span>
                            </td>
                            <td>{donation.quantity} ML</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DonorManagement;