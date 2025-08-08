import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";
import { toast } from "react-toastify";

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hospitalStats, setHospitalStats] = useState({});
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"

  // Fetch all hospitals that have requested blood from this organization
  const getAllHospitals = async () => {
    try {
      const { data } = await API.get("/inventory/get-hospital");
      if (data?.success) {
        setHospitals(data.hospitals || []);
        
        // Get request stats for each hospital
        const stats = {};
        await Promise.all(
          data.hospitals.map(async (hospital) => {
            try {
              const { data: inventoryData } = await API.get(`/inventory/get-filtered-inventory?email=${hospital.email}&inventoryType=out`);
              if (inventoryData?.success) {
                const requests = inventoryData.inventory || [];
                const last30Days = requests.filter(req => 
                  moment(req.createdAt).isAfter(moment().subtract(30, 'days'))
                );
                
                stats[hospital._id] = {
                  totalRequests: requests.length,
                  totalQuantity: requests.reduce((sum, item) => sum + item.quantity, 0),
                  lastRequest: requests.length > 0 ? requests[0].createdAt : null,
                  bloodGroups: [...new Set(requests.map(item => item.bloodGroup))],
                  recentRequests: last30Days.length,
                  recentQuantity: last30Days.reduce((sum, item) => sum + item.quantity, 0),
                  isActive: moment(requests[0]?.createdAt).isAfter(moment().subtract(90, 'days'))
                };
              }
            } catch (error) {
              console.error(`Error fetching stats for hospital ${hospital._id}:`, error);
            }
          })
        );
        setHospitalStats(stats);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast.error("Failed to fetch hospital data");
    }
  };

  // Fetch hospital details with request history
  const getHospitalDetails = async (hospital) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/inventory/get-filtered-inventory?email=${hospital.email}&inventoryType=out`);
      if (data?.success) {
        setSelectedHospital({
          ...hospital,
          requestHistory: data.inventory || []
        });
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      toast.error("Failed to fetch hospital details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAllHospitals();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter hospitals based on search term and status
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.phone?.includes(searchTerm);
    
    if (!matchesSearch) return false;
    
    if (filterStatus === "all") return true;
    
    const stats = hospitalStats[hospital._id];
    if (filterStatus === "active") {
      return stats?.isActive;
    } else if (filterStatus === "inactive") {
      return !stats?.isActive;
    }
    
    return true;
  });

  // Calculate summary statistics
  const totalRequests = Object.values(hospitalStats).reduce((sum, stat) => sum + (stat.totalRequests || 0), 0);
  const totalVolume = Object.values(hospitalStats).reduce((sum, stat) => sum + (stat.totalQuantity || 0), 0);
  const activeHospitals = Object.values(hospitalStats).filter(stat => stat.isActive).length;
  const recentRequests = Object.values(hospitalStats).reduce((sum, stat) => sum + (stat.recentRequests || 0), 0);

  if (loading && hospitals.length === 0) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: "#6c757d" }}>Loading hospital management...</p>
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
                  <i className="fa-solid fa-hospital me-3" style={{ color: "#dc3545" }}></i>
                  Hospital Management
                </h2>
                <p style={{ color: "#6c757d", margin: 0 }}>
                  Manage hospital relationships, track blood requests, and analyze consumption patterns
                </p>
              </div>
              <div className="d-flex gap-3">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="all">All Hospitals</option>
                  <option value="active">Active (90 days)</option>
                  <option value="inactive">Inactive</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search hospitals..."
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
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-hospital fa-2x mb-3"></i>
                <h4>{hospitals.length}</h4>
                <p className="mb-0">Total Hospitals</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-heartbeat fa-2x mb-3"></i>
                <h4>{activeHospitals}</h4>
                <p className="mb-0">Active Hospitals</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-clipboard-list fa-2x mb-3"></i>
                <h4>{totalRequests}</h4>
                <p className="mb-0">Total Requests</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%)" }}>
              <div className="card-body text-white text-center">
                <i className="fa-solid fa-flask fa-2x mb-3"></i>
                <h4>{totalVolume} ML</h4>
                <p className="mb-0">Total Volume</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-chart-line me-2" style={{ color: "#007bff" }}></i>
                  Recent Activity (Last 30 Days)
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="border-end">
                      <h3 style={{ color: "#007bff" }}>{recentRequests}</h3>
                      <p className="text-muted mb-0">Recent Requests</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border-end">
                      <h3 style={{ color: "#28a745" }}>{Object.values(hospitalStats).reduce((sum, stat) => sum + (stat.recentQuantity || 0), 0)} ML</h3>
                      <p className="text-muted mb-0">Recent Volume</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h3 style={{ color: "#dc3545" }}>{Object.values(hospitalStats).filter(stat => stat.recentRequests > 0).length}</h3>
                    <p className="text-muted mb-0">Active This Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital List */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="fa-solid fa-list me-2" style={{ color: "#dc3545" }}></i>
                  Hospital Directory ({filteredHospitals.length})
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        <th>Hospital Info</th>
                        <th>Contact</th>
                        <th>Request Stats</th>
                        <th>Recent Activity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHospitals.map((hospital, index) => {
                        const stats = hospitalStats[hospital._id] || {};
                        
                        return (
                          <tr key={hospital._id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <div style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "1.2rem"
                                  }}>
                                    <i className="fa-solid fa-hospital"></i>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="mb-1" style={{ color: "#495057" }}>{hospital.hospitalName || "N/A"}</h6>
                                  <div className="d-flex gap-2">
                                    {stats.bloodGroups?.slice(0, 3).map(bg => (
                                      <span key={bg} className="badge bg-danger">{bg}</span>
                                    ))}
                                    {stats.bloodGroups?.length > 3 && (
                                      <span className="badge bg-secondary">+{stats.bloodGroups.length - 3}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="mb-1">
                                  <i className="fa-solid fa-envelope me-2" style={{ color: "#6c757d" }}></i>
                                  <small>{hospital.email}</small>
                                </div>
                                <div>
                                  <i className="fa-solid fa-phone me-2" style={{ color: "#6c757d" }}></i>
                                  <small>{hospital.phone || "N/A"}</small>
                                </div>
                                <div>
                                  <i className="fa-solid fa-map-marker-alt me-2" style={{ color: "#6c757d" }}></i>
                                  <small>{hospital.address || "N/A"}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="mb-1">
                                  <strong style={{ color: "#007bff" }}>{stats.totalRequests || 0}</strong>
                                  <small className="text-muted"> total requests</small>
                                </div>
                                <div>
                                  <strong style={{ color: "#dc3545" }}>{stats.totalQuantity || 0} ML</strong>
                                  <small className="text-muted"> total volume</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="mb-1">
                                  <strong style={{ color: "#28a745" }}>{stats.recentRequests || 0}</strong>
                                  <small className="text-muted"> this month</small>
                                </div>
                                <div>
                                  {stats.lastRequest ? (
                                    <small className="text-muted">
                                      Last: {moment(stats.lastRequest).fromNow()}
                                    </small>
                                  ) : (
                                    <small className="text-muted">No requests yet</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${stats.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                <i className={`fa-solid ${stats.isActive ? 'fa-check-circle' : 'fa-clock'} me-1`}></i>
                                {stats.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => getHospitalDetails(hospital)}
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
                  
                  {filteredHospitals.length === 0 && (
                    <div className="text-center py-5">
                      <i className="fa-solid fa-hospital fa-3x mb-3" style={{ color: "#dee2e6" }}></i>
                      <h5 style={{ color: "#6c757d" }}>No hospitals found</h5>
                      <p style={{ color: "#6c757d" }}>
                        {searchTerm ? "Try adjusting your search criteria" : 
                         "No hospitals have requested blood from your organization yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Details Modal */}
        {showDetails && selectedHospital && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header" style={{ background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)", color: "white" }}>
                  <h5 className="modal-title">
                    <i className="fa-solid fa-hospital me-2"></i>
                    Hospital Details - {selectedHospital.hospitalName}
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
                      <h6 style={{ color: "#495057" }}>Hospital Information</h6>
                      <p><strong>Name:</strong> {selectedHospital.hospitalName}</p>
                      <p><strong>Email:</strong> {selectedHospital.email}</p>
                      <p><strong>Phone:</strong> {selectedHospital.phone || "N/A"}</p>
                      <p><strong>Address:</strong> {selectedHospital.address || "N/A"}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 style={{ color: "#495057" }}>Request Summary</h6>
                      <p><strong>Total Requests:</strong> {selectedHospital.requestHistory.length}</p>
                      <p><strong>Total Volume:</strong> {selectedHospital.requestHistory.reduce((sum, r) => sum + r.quantity, 0)} ML</p>
                      <p><strong>Member Since:</strong> {moment(selectedHospital.createdAt).format("MMM DD, YYYY")}</p>
                      <p><strong>Blood Groups:</strong> {[...new Set(selectedHospital.requestHistory.map(r => r.bloodGroup))].join(", ")}</p>
                    </div>
                  </div>
                  
                  <h6 style={{ color: "#495057" }}>Request History</h6>
                  <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Blood Group</th>
                          <th>Quantity</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedHospital.requestHistory.map((request, index) => (
                          <tr key={index}>
                            <td>{moment(request.createdAt).format("MMM DD, YYYY")}</td>
                            <td>
                              <span className="badge bg-danger">{request.bloodGroup}</span>
                            </td>
                            <td>{request.quantity} ML</td>
                            <td>
                              <span className="badge bg-success">Fulfilled</span>
                            </td>
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

export default HospitalManagement;