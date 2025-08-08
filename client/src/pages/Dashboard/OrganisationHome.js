import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { useSelector } from "react-redux";

const OrganisationHome = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    bloodGroup: "All Blood Groups",
    donationType: "All Types",
    email: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalSubscribers: 0,
    totalHospitals: 0,
    monthlyDonations: 0
  });

  // Get donations from subscribers only
  const getDonations = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/donation/organisation-donations");
      if (data?.success) {
        setData(data?.donations);
        setStats(prev => ({ ...prev, totalDonations: data?.donations?.length || 0 }));
        
        // Calculate monthly donations (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const monthlyDonations = data?.donations?.filter(donation => 
          new Date(donation.donationDate) >= thirtyDaysAgo
        ).length || 0;
        setStats(prev => ({ ...prev, monthlyDonations }));
        
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get organization stats
  const getOrganisationStats = async () => {
    try {
      // Get subscribers count
      const subscribersResponse = await API.get("/subscription/my-subscribers");
      if (subscribersResponse.data?.success) {
        setStats(prev => ({ ...prev, totalSubscribers: subscribersResponse.data?.subscribers?.length || 0 }));
      }

      // Get hospital subscribers count
      const hospitalSubscribersResponse = await API.get("/subscription/hospital-subscribers");
      if (hospitalSubscribersResponse.data?.success) {
        setStats(prev => ({ ...prev, totalHospitals: hospitalSubscribersResponse.data?.hospitals?.length || 0 }));
      }
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  // Get filtered donations
  const getFilteredDonations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Only add non-default filter values
      if (filters.bloodGroup !== "All Blood Groups") {
        queryParams.append("bloodGroup", filters.bloodGroup);
      }
      if (filters.donationType !== "All Types") {
        queryParams.append("donationType", filters.donationType);
      }
      if (filters.email.trim()) {
        queryParams.append("donorEmail", filters.email.trim());
      }
      if (filters.startDate) {
        queryParams.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append("endDate", filters.endDate);
      }

      const { data } = await API.get(`/donation/filtered-donations?${queryParams.toString()}`);
      if (data?.success) {
        setData(data?.donations);
        console.log("Filtered data:", data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    getFilteredDonations();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      bloodGroup: "All Blood Groups",
      donationType: "All Types",
      email: "",
      startDate: "",
      endDate: "",
    });
    getDonations(); // Load all donations
  };

  useEffect(() => {
    getDonations();
    getOrganisationStats();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <i className="fa-solid fa-building-ngo me-3" style={{ color: 'var(--primary-color)' }}></i>
            Organisation Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.organisationName || user?.name}! Manage your subscriber donations and network.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalDonations}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Donations</p>
                <small style={{ opacity: 0.7, fontSize: '0.8rem' }}>From subscribers</small>
              </div>
              <i className="fa-solid fa-droplet" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
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
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.monthlyDonations}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>This Month</p>
                <small style={{ opacity: 0.7, fontSize: '0.8rem' }}>Recent donations</small>
              </div>
              <i className="fa-solid fa-calendar-days" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
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
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalSubscribers}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Donor Subscribers</p>
                <small style={{ opacity: 0.7, fontSize: '0.8rem' }}>Active donors</small>
              </div>
              <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalHospitals}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Partner Hospitals</p>
                <small style={{ opacity: 0.7, fontSize: '0.8rem' }}>Subscribed hospitals</small>
              </div>
              <i className="fa-solid fa-hospital" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn"
              onClick={() => window.location.href = '/donor-management'}
              style={{
                background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
                border: "none",
                borderRadius: "25px",
                padding: "12px 24px",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(23, 162, 184, 0.4)",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
                color: "white"
              }}
            >
              <i className="fa-solid fa-users me-2"></i>
              Manage Subscribers
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => window.location.href = '/hospital-management'}
              style={{
                background: "linear-gradient(135deg, #ffc107 0%, #e0a800 100%)",
                border: "none",
                borderRadius: "25px",
                padding: "12px 24px",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(255, 193, 7, 0.4)",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
                color: "#212529"
              }}
            >
              <i className="fa-solid fa-hospital me-2"></i>
              Manage Hospitals
            </button>
          </div>
          
          <button
            type="button"
            className="btn"
            onClick={() => window.location.href = '/organisation-subscription'}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "25px",
              padding: "12px 30px",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              color: "white"
            }}
          >
            <i className="fa-solid fa-network-wired me-2"></i>
            Manage Network
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-container" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
            <i className="fa-solid fa-filter me-2"></i>
            Filter Donations
          </h5>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <select
              className="form-select"
              value={filters.bloodGroup}
              onChange={(e) => handleFilterChange("bloodGroup", e.target.value)}
              style={{
                border: "2px solid var(--primary-color)",
                borderRadius: "10px",
                padding: "0.75rem"
              }}
            >
              <option>All Blood Groups</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
            <select
              className="form-select"
              value={filters.donationType}
              onChange={(e) => handleFilterChange("donationType", e.target.value)}
              style={{
                border: "2px solid var(--success-color)",
                borderRadius: "10px",
                padding: "0.75rem"
              }}
            >
              <option>All Types</option>
              <option>whole_blood</option>
              <option>plasma</option>
              <option>platelets</option>
              <option>red_cells</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              style={{
                border: "2px solid var(--accent-color)",
                borderRadius: "10px",
                padding: "0.75rem"
              }}
            />
            <input
              type="date"
              className="form-control"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              style={{
                border: "2px solid var(--warning-color)",
                borderRadius: "10px",
                padding: "0.75rem"
              }}
            />
            <input
              type="date"
              className="form-control"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              style={{
                border: "2px solid var(--warning-color)",
                borderRadius: "10px",
                padding: "0.75rem"
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn"
              onClick={applyFilters}
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                border: "none",
                borderRadius: "10px",
                padding: "0.75rem 1.5rem",
                fontWeight: "bold",
                color: "white"
              }}
            >
              {loading ? "Filtering..." : "Apply Filters"}
            </button>
            <button
              className="btn"
              onClick={resetFilters}
              disabled={loading}
              style={{
                background: "var(--secondary-color)",
                border: "none",
                borderRadius: "10px",
                padding: "0.75rem 1.5rem",
                fontWeight: "bold",
                color: "white"
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h6 style={{ color: "var(--primary-color)", margin: 0, fontSize: '1.1rem' }}>
              {loading ? "Loading..." : `Showing ${data?.length || 0} donations`}
            </h6>
            {(filters.bloodGroup !== "All Blood Groups" || 
              filters.donationType !== "All Types" || 
              filters.email || 
              filters.startDate || 
              filters.endDate) && (
              <small style={{ color: "var(--secondary-light)" }}>
                <i className="fa-solid fa-filter me-1"></i>
                Filters applied
              </small>
            )}
          </div>
        </div>

        {/* Modern Table */}
        <div className="modern-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--secondary-light)' }}>Loading donations...</p>
            </div>
          ) : (
            <table className="modern-table">
              <thead>
                <tr>
                  <th scope="col">Blood Group</th>
                  <th scope="col">Donation Type</th>
                  <th scope="col">Quantity (ML)</th>
                  <th scope="col">Donor</th>
                  <th scope="col">Donation Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((donation) => (
                    <tr key={donation._id}>
                      <td>
                        <span className="blood-group-badge">
                          {donation.bloodGroup}
                        </span>
                      </td>
                      <td>
                        <span className={`donation-type-badge ${donation.donationType}`}>
                          {donation.donationType?.replace('_', ' ') || 'whole blood'}
                        </span>
                      </td>
                      <td>
                        <span className="quantity-display">
                          {donation.quantity} ML
                        </span>
                      </td>
                      <td style={{ color: 'var(--secondary-light)' }}>
                        {donation.donor?.name || donation.donor?.email || 'N/A'}
                      </td>
                      <td style={{ color: 'var(--secondary-light)', fontSize: '0.9rem' }}>
                        {moment(donation.donationDate).format("DD/MM/YYYY hh:mm A")}
                      </td>
                      <td>
                        <span className={`status-badge ${donation.status}`}>
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-droplet" style={{ marginRight: '0.5rem', fontSize: '1.5rem' }}></i>
                        <br />
                        <strong>No donations found</strong>
                        <br />
                        <small>
                          {(filters.bloodGroup !== "All Blood Groups" || 
                            filters.donationType !== "All Types" || 
                            filters.email || 
                            filters.startDate || 
                            filters.endDate) 
                            ? "Try adjusting your filters to see more results." 
                            : "Donations will appear here when subscribers donate blood!"}
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrganisationHome;