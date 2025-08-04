import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import moment from "moment";

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [donationHistory, setDonationHistory] = useState([]);
  const [subscribedOrgs, setSubscribedOrgs] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalQuantity: 0,
    lastDonation: null,
    organizationsCount: 0
  });

  // Get donor's donation history
  const getDonationHistory = async () => {
    try {
      setLoading(true);
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "in",
          donor: user?._id,
        },
      });
      if (data?.success) {
        const donations = data?.inventory || [];
        setDonationHistory(donations);
        
        // Calculate stats
        const totalQuantity = donations.reduce((sum, donation) => sum + donation.quantity, 0);
        const lastDonation = donations.length > 0 ? donations[0] : null;
        const uniqueOrgs = [...new Set(donations.map(d => d.organisation?._id))];
        
        setStats({
          totalDonations: donations.length,
          totalQuantity,
          lastDonation,
          organizationsCount: subscribedOrgs.length || uniqueOrgs.length
        });
      }
    } catch (error) {
      console.error("Error fetching donation history:", error);
      toast.error("Error fetching donation history");
    } finally {
      setLoading(false);
    }
  };

  // Get subscribed organizations
  const getSubscribedOrganizations = async () => {
    try {
      const { data } = await API.get("/subscription/my-subscriptions");
      if (data?.success) {
        setSubscribedOrgs(data?.subscriptions || []);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Error fetching subscriptions");
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
      // Don't show error toast as capacity might not be set yet
    }
  };

  useEffect(() => {
    getDonationHistory();
    getSubscribedOrganizations();
    getDonorCapacity();
  }, [user]);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome back, {user?.name}! 🩸
          </h1>
          <p className="dashboard-subtitle">
            Your blood donations are saving lives. Thank you for being a hero!
          </p>
        </div>

        {/* Stats Cards */}
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
                  <i className="fa-solid fa-droplet" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>{stats.totalDonations}</h3>
                <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Total Donations</p>
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
                  <i className="fa-solid fa-flask" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ color: 'var(--success-color)', margin: 0 }}>{stats.totalQuantity}ml</h3>
                <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Total Volume</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card modern-card">
              <div className="card-body text-center">
                <div style={{ 
                  background: capacity ? 'var(--gradient-warning)' : 'var(--gradient-secondary)', 
                  borderRadius: '50%', 
                  width: '60px', 
                  height: '60px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <i className="fa-solid fa-heart-pulse" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                </div>
                <h3 style={{ color: capacity ? 'var(--warning-color)' : 'var(--secondary-light)', margin: 0 }}>
                  {capacity ? `${capacity.availableCapacity}ml` : 'Not Set'}
                </h3>
                <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Available Capacity</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card modern-card">
              <div className="card-body text-center">
                <div style={{ 
                  background: capacity?.isEligible ? 'var(--gradient-success)' : 'var(--gradient-info)', 
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
                  color: capacity?.isEligible ? 'var(--success-color)' : 'var(--info-color)', 
                  margin: 0, 
                  fontSize: '1rem' 
                }}>
                  {capacity ? (capacity.isEligible ? 'Eligible' : `${capacity.daysUntilEligible} days`) : 'Unknown'}
                </h3>
                <p style={{ color: 'var(--secondary-light)', margin: 0 }}>Donation Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card modern-card">
              <div className="card-body">
                <h5 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-bolt" style={{ color: 'var(--primary-color)' }}></i>
                  Quick Actions
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => window.location.href = '/donation'}
                      style={{ 
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                      Log New Donation
                    </button>
                  </div>
                  <div className="col-md-6 mb-2">
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => window.location.href = '/donor-capacity'}
                      style={{ 
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className="fa-solid fa-heart-pulse"></i>
                      Manage Capacity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="row">
          <div className="col-12">
            <div className="card modern-card">
              <div className="card-body">
                <h5 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-history" style={{ color: 'var(--primary-color)' }}></i>
                  Recent Donations
                </h5>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : donationHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Blood Group</th>
                          <th>Quantity</th>
                          <th>Organization</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donationHistory.slice(0, 5).map((donation) => (
                          <tr key={donation._id}>
                            <td>
                              <span className="badge" style={{ 
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                borderRadius: 'var(--radius-sm)'
                              }}>
                                {donation.bloodGroup}
                              </span>
                            </td>
                            <td>{donation.quantity}ml</td>
                            <td>{donation.organisation?.organisationName || 'N/A'}</td>
                            <td>{moment(donation.createdAt).format("DD/MM/YYYY")}</td>
                            <td>
                              <span className="badge bg-success">Completed</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fa-solid fa-droplet" style={{ fontSize: '3rem', color: 'var(--secondary-light)', marginBottom: '1rem' }}></i>
                    <p style={{ color: 'var(--secondary-light)' }}>
                      No donations yet. Start your journey of saving lives!
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = '/donation'}
                      style={{ 
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)'
                      }}
                    >
                      Make Your First Donation
                    </button>
                  </div>
                )}
                
                {donationHistory.length > 5 && (
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => window.location.href = '/donation'}
                      style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                      View All Donations
                    </button>
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

export default DonorDashboard;