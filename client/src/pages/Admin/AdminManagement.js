import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import { toast } from "react-toastify";
import moment from "moment";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    website: ""
  });

  // Fetch all admins
  const getAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/admin-list");
      
      if (data?.success) {
        setAdmins(data?.adminData || []);
      } else {
        toast.error("Failed to fetch admin list");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Error fetching admin list");
    } finally {
      setLoading(false);
    }
  };

  // Create new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/admin/create-admin", formData);
      
      if (data?.success) {
        toast.success("Admin account created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          website: ""
        });
        setShowCreateForm(false);
        getAdmins(); // Refresh the list
      } else {
        toast.error(data?.message || "Failed to create admin account");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(error.response?.data?.message || "Error creating admin account");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Management</h1>
          <p className="dashboard-subtitle">
            Manage administrator accounts and create new admin users
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ marginTop: '1rem' }}
          >
            <i className="fa-solid fa-plus" style={{ marginRight: '0.5rem' }}></i>
            {showCreateForm ? 'Cancel' : 'Create New Admin'}
          </button>
        </div>

        {/* Create Admin Form */}
        {showCreateForm && (
          <div className="modern-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>
              <i className="fa-solid fa-user-plus" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
              Create New Administrator
            </h3>
            <form onSubmit={handleCreateAdmin}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength="6"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-8 mb-3">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Website (Optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Admin Account'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admin List */}
        {loading ? (
          <div className="loader-container" style={{ height: '400px' }}>
            <div className="loader"></div>
          </div>
        ) : (
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th scope="col">Admin Name</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Address</th>
                  <th scope="col">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {admins?.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-user-shield" style={{ color: 'var(--primary-color)' }}></i>
                          {admin.name}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-color)' }}></i>
                          {admin.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-phone" style={{ color: 'var(--success-color)' }}></i>
                          {admin.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-map-marker-alt" style={{ color: 'var(--warning-color)' }}></i>
                          {admin.address}
                        </div>
                      </td>
                      <td>
                        <span className="inventory-type-badge">
                          {moment(admin.createdAt).format("DD/MM/YYYY hh:mm A")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-user-shield" style={{ marginRight: '0.5rem' }}></i>
                        No admin accounts found.
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

export default AdminManagement;