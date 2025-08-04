import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import moment from "moment";

const NewDonation = () => {
  const { user } = useSelector((state) => state.auth);
  const [subscribedOrgs, setSubscribedOrgs] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organisationId: "",
    quantity: "",
    notes: "",
  });

  // Get subscribed organizations
  const getSubscribedOrganizations = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/subscription/my-subscriptions");
      if (data?.success) {
        setSubscribedOrgs(data?.subscriptions || []);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Error fetching subscribed organizations");
    } finally {
      setLoading(false);
    }
  };

  // Get donor capacity
  const getDonorCapacity = async () => {
    try {
      const { data } = await API.get("/capacity/my-capacity");
      if (data?.success) {
        setCapacity(data?.capacity);
      }
    } catch (error) {
      console.error("Error fetching capacity:", error);
      // Don't show error as capacity might not be set
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

  // Handle donation submission
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    if (!capacity) {
      toast.error("Please set your donation capacity first!");
      window.location.href = "/donor-capacity";
      return;
    }

    if (!capacity.isEligible) {
      toast.error(`You are not eligible to donate yet. Next eligible date: ${moment(capacity.nextEligibleDate).format("DD/MM/YYYY")}`);
      return;
    }

    const donationQuantity = parseInt(formData.quantity);
    
    if (donationQuantity > capacity.availableCapacity) {
      toast.error(`Insufficient capacity! Available: ${capacity.availableCapacity}ml, Requested: ${donationQuantity}ml`);
      return;
    }

    if (donationQuantity < 100) {
      toast.error("Minimum donation amount is 100ml");
      return;
    }

    try {
      setLoading(true);

      // Create donation record
      const donationData = {
        inventoryType: "in",
        bloodGroup: capacity.bloodGroup,
        quantity: donationQuantity,
        email: user.email,
        organisation: formData.organisationId,
        notes: formData.notes,
      };

      const { data } = await API.post("/inventory/create-inventory", donationData);
      
      if (data?.success) {
        // Update capacity after donation
        await API.post("/capacity/update-after-donation", {
          donorId: user._id,
          donatedAmount: donationQuantity,
        });

        toast.success("Donation logged successfully! Thank you for saving lives! 🩸");
        
        // Reset form
        setFormData({
          organisationId: "",
          quantity: "",
          notes: "",
        });
        
        // Refresh capacity
        getDonorCapacity();
        
        // Redirect to donation history after a delay
        setTimeout(() => {
          window.location.href = "/donation";
        }, 2000);
      }
    } catch (error) {
      console.error("Error logging donation:", error);
      toast.error(error.response?.data?.message || "Error logging donation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "donor") {
      getSubscribedOrganizations();
      getDonorCapacity();
    }
  }, [user]);

  if (loading && !subscribedOrgs.length) {
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
          <h1 className="dashboard-title">
            <i className="fa-solid fa-heart-pulse me-3" style={{ color: 'var(--primary-color)' }}></i>
            Log New Donation
          </h1>
          <p className="dashboard-subtitle">
            Record your blood donation and help save lives
          </p>
        </div>

        {/* Capacity Status Card */}
        {capacity && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card modern-card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                      <div style={{
                        background: capacity.isEligible ? 'var(--gradient-success)' : 'var(--gradient-warning)',
                        borderRadius: '50%',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <i className={`fa-solid ${capacity.isEligible ? 'fa-check' : 'fa-clock'}`} 
                           style={{ color: 'white', fontSize: '2rem' }}></i>
                      </div>
                    </div>
                    <div className="col-md-9">
                      <h5 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                        Donation Status: {capacity.isEligible ? 'Eligible' : 'Not Eligible'}
                      </h5>
                      <div className="row">
                        <div className="col-md-4">
                          <small className="text-muted">Blood Group</small>
                          <div className="badge bg-primary ms-2">{capacity.bloodGroup}</div>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">Available Capacity</small>
                          <div style={{ fontWeight: '600', color: 'var(--success-color)' }}>
                            {capacity.availableCapacity}ml
                          </div>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">Next Eligible</small>
                          <div style={{ fontWeight: '600' }}>
                            {capacity.isEligible ? 'Now' : moment(capacity.nextEligibleDate).format("DD/MM/YYYY")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            {!capacity ? (
              /* No Capacity Set */
              <div className="card modern-card text-center">
                <div className="card-body py-5">
                  <i className="fa-solid fa-exclamation-triangle" 
                     style={{ fontSize: '4rem', color: 'var(--warning-color)', marginBottom: '1rem' }}></i>
                  <h4 style={{ color: 'var(--warning-color)', marginBottom: '1rem' }}>
                    Capacity Not Set
                  </h4>
                  <p style={{ color: 'var(--secondary-light)', marginBottom: '2rem' }}>
                    You need to set your donation capacity before logging donations.
                  </p>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => window.location.href = '/donor-capacity'}
                    style={{
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--spacing-md) var(--spacing-xl)'
                    }}
                  >
                    <i className="fa-solid fa-heart-pulse me-2"></i>
                    Set My Capacity
                  </button>
                </div>
              </div>
            ) : subscribedOrgs.length === 0 ? (
              /* No Subscriptions */
              <div className="card modern-card text-center">
                <div className="card-body py-5">
                  <i className="fa-solid fa-building" 
                     style={{ fontSize: '4rem', color: 'var(--info-color)', marginBottom: '1rem' }}></i>
                  <h4 style={{ color: 'var(--info-color)', marginBottom: '1rem' }}>
                    No Subscriptions Found
                  </h4>
                  <p style={{ color: 'var(--secondary-light)', marginBottom: '2rem' }}>
                    You need to subscribe to organizations before you can donate.
                  </p>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => window.location.href = '/organisation'}
                    style={{
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--spacing-md) var(--spacing-xl)'
                    }}
                  >
                    <i className="fa-solid fa-building me-2"></i>
                    Browse Organizations
                  </button>
                </div>
              </div>
            ) : !capacity.isEligible ? (
              /* Not Eligible */
              <div className="card modern-card text-center">
                <div className="card-body py-5">
                  <i className="fa-solid fa-clock" 
                     style={{ fontSize: '4rem', color: 'var(--warning-color)', marginBottom: '1rem' }}></i>
                  <h4 style={{ color: 'var(--warning-color)', marginBottom: '1rem' }}>
                    Not Eligible to Donate
                  </h4>
                  <p style={{ color: 'var(--secondary-light)', marginBottom: '1rem' }}>
                    You can donate again on: <strong>{moment(capacity.nextEligibleDate).format("DD/MM/YYYY")}</strong>
                  </p>
                  <p style={{ color: 'var(--secondary-light)', marginBottom: '2rem' }}>
                    Days remaining: <strong>{capacity.daysUntilEligible}</strong>
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => window.location.href = '/donor-dashboard'}
                    style={{ borderRadius: 'var(--radius-lg)' }}
                  >
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              /* Donation Form */
              <div className="card modern-card">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4">
                    <i className="fa-solid fa-droplet me-2" style={{ color: 'var(--primary-color)' }}></i>
                    Record Your Donation
                  </h5>
                  
                  <form onSubmit={handleDonationSubmit}>
                    <div className="mb-4">
                      <label className="form-label">Select Organization *</label>
                      <select
                        name="organisationId"
                        className="form-select"
                        value={formData.organisationId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose an organization...</option>
                        {subscribedOrgs.map((subscription) => (
                          <option key={subscription._id} value={subscription.organisation._id}>
                            {subscription.organisation.organisationName}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        You can only donate to organizations you're subscribed to
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Donation Quantity (ml) *</label>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="100"
                        max={capacity.availableCapacity}
                        step="50"
                        required
                        placeholder="Enter donation amount"
                      />
                      <div className="form-text">
                        Available capacity: {capacity.availableCapacity}ml | Blood Group: {capacity.bloodGroup}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Notes (Optional)</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional notes about this donation..."
                        maxLength="500"
                      ></textarea>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-3"
                        onClick={() => window.location.href = '/donor-dashboard'}
                        style={{ borderRadius: 'var(--radius-lg)' }}
                      >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Cancel
                      </button>
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
                            Logging Donation...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-heart me-2"></i>
                            Log Donation
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewDonation;