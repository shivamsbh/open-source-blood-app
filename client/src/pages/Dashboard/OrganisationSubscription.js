import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import moment from "moment";

const OrganisationSubscription = () => {
  const { user } = useSelector((state) => state.auth);
  const [subscribedOrgs, setSubscribedOrgs] = useState([]);
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("subscribed");

  // Get donor's subscriptions
  const getSubscriptions = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/subscription/my-subscriptions");
      if (data?.success) {
        setSubscribedOrgs(data?.subscriptions || []);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Error fetching subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Get available organizations
  const getAvailableOrganisations = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/subscription/available-organisations");
      if (data?.success) {
        setAvailableOrgs(data?.organisations || []);
      }
    } catch (error) {
      console.error("Error fetching available organisations:", error);
      toast.error("Error fetching available organisations");
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to organization
  const handleSubscribe = async (organisationId) => {
    try {
      const { data } = await API.post("/subscription/subscribe", {
        organisationId,
      });
      if (data?.success) {
        toast.success("Successfully subscribed to organisation!");
        // Refresh both lists
        getSubscriptions();
        getAvailableOrganisations();
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error(error.response?.data?.message || "Error subscribing to organisation");
    }
  };

  // Unsubscribe from organization
  const handleUnsubscribe = async (organisationId) => {
    if (window.confirm("Are you sure you want to unsubscribe from this organisation?")) {
      try {
        const { data } = await API.post("/subscription/unsubscribe", {
          organisationId,
        });
        if (data?.success) {
          toast.success("Successfully unsubscribed from organisation!");
          // Refresh both lists
          getSubscriptions();
          getAvailableOrganisations();
        }
      } catch (error) {
        console.error("Error unsubscribing:", error);
        toast.error(error.response?.data?.message || "Error unsubscribing from organisation");
      }
    }
  };

  useEffect(() => {
    if (user) {
      // Support both donors and hospitals as subscribers
      getSubscriptions();
      getAvailableOrganisations();
    }
  }, [user]);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Organisation Network</h1>
          <p className="dashboard-subtitle">
            Manage your subscriptions to blood bank organisations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4">
          <ul className="nav nav-tabs" style={{ borderBottom: '2px solid var(--primary-color)' }}>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "subscribed" ? "active" : ""}`}
                onClick={() => setActiveTab("subscribed")}
                style={{
                  background: activeTab === "subscribed" ? "var(--primary-color)" : "transparent",
                  color: activeTab === "subscribed" ? "white" : "var(--primary-color)",
                  border: "none",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  fontWeight: "600",
                }}
              >
                <i className="fa-solid fa-check-circle me-2"></i>
                My Subscriptions ({subscribedOrgs.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "available" ? "active" : ""}`}
                onClick={() => setActiveTab("available")}
                style={{
                  background: activeTab === "available" ? "var(--primary-color)" : "transparent",
                  color: activeTab === "available" ? "white" : "var(--primary-color)",
                  border: "none",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  fontWeight: "600",
                }}
              >
                <i className="fa-solid fa-plus-circle me-2"></i>
                Available Organizations ({availableOrgs.length})
              </button>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Subscribed Organizations Tab */}
            {activeTab === "subscribed" && (
              <div className="modern-table-container">
                {subscribedOrgs.length > 0 ? (
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th scope="col">Organisation Name</th>
                        <th scope="col">Contact Info</th>
                        <th scope="col">Address</th>
                        <th scope="col">Subscribed Since</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribedOrgs.map((subscription) => (
                        <tr key={subscription._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                background: 'var(--gradient-success)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <i className="fa-solid fa-building" style={{ color: 'white' }}></i>
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                  {subscription.organisation?.organisationName}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-light)' }}>
                                  Active Subscription
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                                <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}></i>
                                <span style={{ fontSize: '0.9rem' }}>{subscription.organisation?.email}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <i className="fa-solid fa-phone" style={{ color: 'var(--success-color)', fontSize: '0.8rem' }}></i>
                                <span style={{ fontSize: '0.9rem' }}>{subscription.organisation?.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <i className="fa-solid fa-map-marker-alt" style={{ color: 'var(--warning-color)' }}></i>
                              <span style={{ fontSize: '0.9rem' }}>{subscription.organisation?.address}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge" style={{
                              background: 'var(--gradient-info)',
                              color: 'white',
                              padding: 'var(--spacing-xs) var(--spacing-sm)',
                              borderRadius: 'var(--radius-sm)'
                            }}>
                              {moment(subscription.subscribedAt).format("DD/MM/YYYY")}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleUnsubscribe(subscription.organisation?._id)}
                              style={{
                                borderRadius: 'var(--radius-sm)',
                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <i className="fa-solid fa-times"></i>
                              Unsubscribe
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-5">
                    <i className="fa-solid fa-building" style={{ fontSize: '4rem', color: 'var(--secondary-light)', marginBottom: '1rem' }}></i>
                    <h4 style={{ color: 'var(--secondary-light)', marginBottom: '0.5rem' }}>No Subscriptions Yet</h4>
                    <p style={{ color: 'var(--secondary-light)', marginBottom: '1.5rem' }}>
                      Subscribe to organizations to start your blood donation journey!
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setActiveTab("available")}
                      style={{
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-sm) var(--spacing-lg)'
                      }}
                    >
                      <i className="fa-solid fa-plus me-2"></i>
                      Browse Organizations
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Available Organizations Tab */}
            {activeTab === "available" && (
              <div className="modern-table-container">
                {availableOrgs.length > 0 ? (
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th scope="col">Organisation Name</th>
                        <th scope="col">Contact Info</th>
                        <th scope="col">Address</th>
                        <th scope="col">Website</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableOrgs.map((organisation) => (
                        <tr key={organisation._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                background: 'var(--gradient-primary)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <i className="fa-solid fa-building" style={{ color: 'white' }}></i>
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                  {organisation.organisationName}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-light)' }}>
                                  Available for Subscription
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                                <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}></i>
                                <span style={{ fontSize: '0.9rem' }}>{organisation.email}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <i className="fa-solid fa-phone" style={{ color: 'var(--success-color)', fontSize: '0.8rem' }}></i>
                                <span style={{ fontSize: '0.9rem' }}>{organisation.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <i className="fa-solid fa-map-marker-alt" style={{ color: 'var(--warning-color)' }}></i>
                              <span style={{ fontSize: '0.9rem' }}>{organisation.address}</span>
                            </div>
                          </td>
                          <td>
                            {organisation.website ? (
                              <a
                                href={organisation.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: 'var(--primary-color)',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <i className="fa-solid fa-external-link-alt"></i>
                                Visit Website
                              </a>
                            ) : (
                              <span style={{ color: 'var(--secondary-light)' }}>N/A</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSubscribe(organisation._id)}
                              style={{
                                background: 'var(--gradient-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <i className="fa-solid fa-plus"></i>
                              Subscribe
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-5">
                    <i className="fa-solid fa-check-circle" style={{ fontSize: '4rem', color: 'var(--success-color)', marginBottom: '1rem' }}></i>
                    <h4 style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }}>All Caught Up!</h4>
                    <p style={{ color: 'var(--secondary-light)' }}>
                      You're subscribed to all available organizations.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrganisationSubscription;