import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { toast } from "react-toastify";

const OrgList = () => {
  const [data, setData] = useState([]);
  //find organization records
  const getOrganizations = async () => {
    try {
      const { data } = await API.get("/admin/org-list");
      // console.log(data); // Debug log
      if (data?.success) {
        setData(data?.orgData);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  //DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      let answer = window.prompt(
        "Are you sure you want to delete this organisation?",
        "Sure"
      );
      if (!answer) return;
      const { data } = await API.delete(`/admin/delete-user/${id}`);
      toast.success(data?.message || "Organization deleted successfully");
      getOrganizations(); // Refresh data instead of reloading page
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Error deleting organization");
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Organisation Management</h1>
          <p className="dashboard-subtitle">
            Manage and oversee all registered blood bank organisations
          </p>
        </div>

        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th scope="col">Organisation Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Registration Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-building" style={{ color: 'var(--primary-color)' }}></i>
                        {record.organisationName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-color)' }}></i>
                        {record.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-phone" style={{ color: 'var(--success-color)' }}></i>
                        {record.phone}
                      </div>
                    </td>
                    <td>
                      <span className="inventory-type-badge">
                        {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(record._id)}
                        style={{ 
                          background: 'var(--gradient-primary)', 
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          transition: 'var(--transition-normal)'
                        }}
                      >
                        <i className="fa fa-trash" style={{ marginRight: '0.5rem' }}></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-building" style={{ marginRight: '0.5rem' }}></i>
                      No organisations registered yet. Organisations will appear here once registered.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default OrgList;
