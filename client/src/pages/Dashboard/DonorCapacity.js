import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import moment from "moment";

const DonorCapacity = () => {
  const { user } = useSelector((state) => state.auth);
  const [capacity, setCapacity] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    totalCapacity: 500,
    donationFrequency: "quarterly",
    healthStatus: "good",
    restrictions: [],
    notes: "",
  });

  // Get donor capacity
  const getCapacity = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/capacity/my-capacity");
      if (data?.success) {
        setCapacity(data?.capacity);
        setShowSetupForm(false);
      } else {
        setShowSetupForm(true);
      }
    } catch (error) {
      console.error("Error fetching capacity:", error);
      if (error.response?.status === 404) {
        setShowSetupForm(true);
      } else {
        toast.error("Error fetching capacity information");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get capacity statistics
  const getCapacityStats = async () => {
    try {
      const { data } = await API.get("/capacity/capacity-stats");
      if (data?.success) {
        setStats(data?.stats);
      }
    } catch (error) {
      console.error("Error fetching capacity stats:", error);
    }
  };

  // Set/Update capacity
  const handleSetCapacity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/capacity/set-capacity", formData);
      if (data?.success) {
        toast.success(data.message);
        getCapacity();
        getCapacityStats();
      }
    } catch (error) {
      console.error("Error setting capacity:", error);
      toast.error(error.response?.data?.message || "Error setting capacity");
    } finally {
      setLoading(false);
    }
  };

  // Reset capacity
  const handleResetCapacity = async () => {
    if (window.confirm("Are you sure you want to reset your capacity? This will restore your full donation capacity.")) {
      try {
        const { data } = await API.post("/capacity/reset-capacity");
        if (data?.success) {
          toast.success("Capacity reset successfully!");
          getCapacity();
          getCapacityStats();
        }
      } catch (error) {
        console.error("Error resetting capacity:", error);
        toast.error(error.response?.data?.message || "Error resetting capacity");
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (user?.role === "donor") {
      getCapacity();
      getCapacityStats();
    }
  }, [user]);

  // Pre-fill form with existing capacity data
  useEffect(() => {
    if (capacity && !showSetupForm) {
      setFormData({
        bloodGroup: capacity.bloodGroup || "",
        totalCapacity: capacity.totalCapacity || 500,
        donationFrequency: capacity.donationFrequency || "quarterly",
        healthStatus: capacity.healthStatus || "good",
        restrictions: capacity.restrictions || [],
        notes: capacity.notes || "",
      });
    }
  }, [capacity, showSetupForm]);

  if (loading && !capacity) {
    return (
      <Layout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Donation Capacity</h1>
          <p className="dashboard-subtitle">
            Manage your blood donation capacity and track your availability
          </p>
        </div>

        {showSetupForm ? (
          /* Setup Form */
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card modern-card">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4">
                    <i className="fa-solid fa-heart-pulse me-2" style={{ color: 'var(--primary-color)' }}></i>
                    Set Your Donation Capacity
                  </h5>
                  <form onSubmit={handleSetCapacity}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Blood Group *</label>
                        <select
                          name="bloodGroup"
                          className="form-select"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Total Capacity (ml) *</label>
                        <input
                          type="number"
                          name="totalCapacity"
                          className="form-control"
                          value={formData.totalCapacity}
                          onChange={handleInputChange}
                          min="100"
                          max="2000"
                          step="50"
                          required
                        />
                        <div className="form-text">Between 100ml and 2000ml</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Donation Frequency</label>
                        <select
                          name="donationFrequency"
                          className="form-select"
                          value={formData.donationFrequency}
                          onChange={handleInputChange}
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly (3 months)</option>
                          <option value="biannual">Biannual (6 months)</option>
                          <option value="annual">Annual (12 months)</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Health Status</label>
                        <select
                          name="healthStatus"
                          className="form-select"
                          value={formData.healthStatus}
                          onChange={handleInputChange}
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="restricted">Restricted</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notes (Optional)</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional notes about your donation capacity or health..."
                        maxLength="500"
                      ></textarea>
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{
                          background: 'var(--gradient-primary)',
                          border: 'none',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--spacing-md) var(--spacing-xl)'
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Setting Capacity...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-check me-2"></i>
                            Set My Capacity
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Capacity Dashboard */
          <>
            {/* Capacity Overview Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card modern-card">
                  <div className="card-body text-center">
                    <div style={{
                      background: 'var(--gradient-primary)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <i className="fa-solid fa-flask" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                    </div>
                    <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>{capacity?.totalCapacity}ml</h3>
                    <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Total Capacity</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card modern-card">
                  <div className="card-body text-center">
                    <div style={{
                      background: 'var(--gradient-success)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <i className="fa-solid fa-droplet" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                    </div>
                    <h3 style={{ color: 'var(--success-color)', margin: 0 }}>{capacity?.availableCapacity}ml</h3>
                    <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Available</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card modern-card">
                  <div className="card-body text-center">
                    <div style={{
                      background: 'var(--gradient-warning)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <i className="fa-solid fa-chart-pie" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                    </div>
                    <h3 style={{ color: 'var(--warning-color)', margin: 0 }}>{capacity?.utilizationPercentage}%</h3>
                    <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Utilized</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card modern-card">
                  <div className="card-body text-center">
                    <div style={{
                      background: capacity?.isEligible ? 'var(--gradient-success)' : 'var(--gradient-danger)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <i className={`fa-solid ${capacity?.isEligible ? 'fa-check' : 'fa-clock'}`} style={{ color: 'white', fontSize: '1.5rem' }}></i>
                    </div>
                    <h3 style={{ 
                      color: capacity?.isEligible ? 'var(--success-color)' : 'var(--danger-color)', 
                      margin: 0,
                      fontSize: '1rem'
                    }}>
                      {capacity?.isEligible ? 'Eligible' : `${capacity?.daysUntilEligible} days`}
                    </h3>
                    <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card modern-card">
                  <div className="card-body">
                    <h5 className="card-title">Capacity Utilization</h5>
                    <div className="progress mb-3" style={{ height: '20px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${capacity?.utilizationPercentage}%`,
                          background: 'var(--gradient-primary)'
                        }}
                        aria-valuenow={capacity?.utilizationPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {capacity?.utilizationPercentage}%
                      </div>
                    </div>
                    <div className="row text-center">
                      <div className="col-4">
                        <small className="text-muted">Donated</small>
                        <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                          {capacity?.donatedAmount}ml
                        </div>
                      </div>
                      <div className="col-4">
                        <small className="text-muted">Available</small>
                        <div style={{ fontWeight: '600', color: 'var(--success-color)' }}>
                          {capacity?.availableCapacity}ml
                        </div>
                      </div>
                      <div className="col-4">
                        <small className="text-muted">Total</small>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-dark)' }}>
                          {capacity?.totalCapacity}ml
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Details */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card modern-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fa-solid fa-info-circle me-2" style={{ color: 'var(--primary-color)' }}></i>
                      Capacity Details
                    </h5>
                    <div className="row">
                      <div className="col-6">
                        <strong>Blood Group:</strong>
                        <div className="badge bg-primary ms-2">{capacity?.bloodGroup}</div>
                      </div>
                      <div className="col-6">
                        <strong>Frequency:</strong>
                        <div style={{ textTransform: 'capitalize' }}>{capacity?.donationFrequency}</div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-6">
                        <strong>Health Status:</strong>
                        <div style={{ textTransform: 'capitalize', color: 'var(--success-color)' }}>
                          {capacity?.healthStatus}
                        </div>
                      </div>
                      <div className="col-6">
                        <strong>Last Donation:</strong>
                        <div>
                          {capacity?.lastDonationDate 
                            ? moment(capacity.lastDonationDate).format("DD/MM/YYYY")
                            : "Never"
                          }
                        </div>
                      </div>
                    </div>
                    {capacity?.notes && (
                      <>
                        <hr />
                        <strong>Notes:</strong>
                        <p className="mt-2 mb-0">{capacity.notes}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card modern-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fa-solid fa-cogs me-2" style={{ color: 'var(--primary-color)' }}></i>
                      Actions
                    </h5>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowSetupForm(true)}
                        style={{ borderRadius: 'var(--radius-lg)' }}
                      >
                        <i className="fa-solid fa-edit me-2"></i>
                        Update Capacity
                      </button>
                      <button
                        className="btn btn-outline-success"
                        onClick={handleResetCapacity}
                        disabled={capacity?.availableCapacity === capacity?.totalCapacity}
                        style={{ borderRadius: 'var(--radius-lg)' }}
                      >
                        <i className="fa-solid fa-refresh me-2"></i>
                        Reset Capacity
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => window.location.href = '/donation'}
                        disabled={!capacity?.isEligible}
                        style={{
                          background: 'var(--gradient-primary)',
                          border: 'none',
                          borderRadius: 'var(--radius-lg)'
                        }}
                      >
                        <i className="fa-solid fa-plus me-2"></i>
                        Log New Donation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DonorCapacity;