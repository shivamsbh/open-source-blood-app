import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";

const Donor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Find subscriber records
  const getSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/subscription/my-subscribers");
      
      if (data?.success) {
        setData(data?.subscribers || []);
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
          <h1 className="dashboard-title">Subscribed Donors</h1>
          <p className="dashboard-subtitle">
            View and manage donors subscribed to your organisation
          </p>
        </div>

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
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-users" style={{ marginRight: '0.5rem' }}></i>
                        No subscribers found. Donors can subscribe to your organisation!
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
