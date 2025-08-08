import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";

const Donor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    recentSubscriptions: 0
  });

  // Find subscriber records
  const getSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/subscription/my-subscribers");
      
      if (data?.success) {
        const subscribers = data?.subscribers || [];
        setData(subscribers);
        
        // Calculate stats
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const recentSubs = subscribers.filter(sub => 
          new Date(sub.subscribedAt) >= thirtyDaysAgo
        );
        
        setStats({
          totalSubscribers: subscribers.length,
          activeSubscribers: subscribers.filter(sub => sub.status === 'active').length,
          recentSubscriptions: recentSubs.length
        });
      } else {
        toast.error("Failed to fetch subscriber records");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Error fetching subscriber records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <i className="fa-solid fa-users me-3" style={{ color: 'var(--primary-color)' }}></i>
            Subscribed Donors
          </h1>
          <p className="dashboard-subtitle">
            View and manage donors subscribed to your organisation. Build your donor network!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalSubscribers}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Subscribers</p>
              </div>
              <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(67, 233, 123, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeSubscribers}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Active Subscribers</p>
              </div>
              <i className="fa-solid fa-heart-pulse" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.recentSubscriptions}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>New This Month</p>
              </div>
              <i className="fa-solid fa-calendar-plus" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
            </div>
          </div>
        </div>

        {/* Information Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(23, 162, 184, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <i className="fa-solid fa-info-circle" style={{ fontSize: '1.5rem' }}></i>
            <h5 style={{ margin: 0 }}>Understanding Donors vs Subscribers</h5>
          </div>
          <p style={{ margin: 0, opacity: 0.9, lineHeight: '1.6' }}>
            <strong>Subscribers</strong> are donors who have specifically chosen to follow your organization for updates and notifications. 
            <br />
            <strong>Inventory Donors</strong> are all donors who have contributed blood to your organization (they may or may not be subscribers).
            <br />
            <em>Note: Donors can contribute blood without subscribing to your organization.</em>
          </p>
        </div>

        {/* Action Buttons */}
        {data?.length === 0 && !loading && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            textAlign: 'center',
            marginBottom: '2rem',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
          }}>
            <i className="fa-solid fa-bullhorn" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h4>Grow Your Subscriber Network!</h4>
            <p style={{ margin: '1rem 0', opacity: 0.9 }}>
              No subscribers yet? Encourage donors to subscribe for updates and build a stronger community!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <button 
                className="btn"
                onClick={() => window.location.href = '/donor-management'}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid white',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 'bold'
                }}
              >
                <i className="fa-solid fa-users me-2"></i>
                View All Donors
              </button>
              <button 
                className="btn"
                onClick={() => window.location.href = '/comprehensive-analytics'}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid white',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 'bold'
                }}
              >
                <i className="fa-solid fa-chart-line me-2"></i>
                View Analytics
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loader-container" style={{ height: '400px' }}>
            <div className="loader"></div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th scope="col">Donor Name</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Address</th>
                  <th scope="col">Subscribed Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((subscription) => (
                    <tr key={subscription._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            background: 'var(--gradient-primary)',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fa-solid fa-user" style={{ color: 'white', fontSize: '0.9rem' }}></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                              {subscription.donor?.name || "N/A"}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary-light)' }}>
                              Active Subscriber
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-color)' }}></i>
                          {subscription.donor?.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-phone" style={{ color: 'var(--success-color)' }}></i>
                          {subscription.donor?.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-map-marker-alt" style={{ color: 'var(--warning-color)' }}></i>
                          {subscription.donor?.address}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{
                          background: 'var(--gradient-success)',
                          color: 'white',
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {moment(subscription.subscribedAt).format("DD/MM/YYYY")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-users" style={{ marginRight: '0.5rem', fontSize: '2rem', display: 'block', marginBottom: '1rem' }}></i>
                        <strong>No subscribers found</strong>
                        <br />
                        <small style={{ marginTop: '0.5rem', display: 'block' }}>
                          Encourage donors to subscribe for updates and notifications!
                          <br />
                          <em>Remember: Donors can contribute blood without subscribing.</em>
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Donor;
