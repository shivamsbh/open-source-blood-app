import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";

const DonorList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Find donor records
  const getDonors = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/donor-list");
      
      if (data?.success) {
        setData(data?.donorData || []);
      } else {
        toast.error("Failed to fetch donor records");
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast.error("Error fetching donor records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonors();
  }, []);

  // DELETE FUNCTION with better UX
  const handleDelete = async (id, donorName) => {
    try {
      const isConfirmed = window.confirm(
        `Are you sure you want to delete ${donorName}? This action cannot be undone.`
      );
      
      if (!isConfirmed) return;

      setDeleteLoading(id);
      const { data } = await API.delete(`/admin/delete-user/${id}`);
      
      if (data?.success) {
        toast.success(data?.message || "Donor deleted successfully");
        // Remove the deleted item from state instead of reloading
        setData(prevData => prevData.filter(item => item._id !== id));
      } else {
        toast.error(data?.message || "Failed to delete donor");
      }
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast.error("Error deleting donor");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-title">Donor Management</h1>
              <p className="dashboard-subtitle">
                Manage and oversee all registered blood donors
              </p>
            </div>
            <button 
              className="add-inventory-btn"
              onClick={getDonors}
              disabled={loading}
            >
              <i className="fa-solid fa-refresh"></i>
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
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
                  <th scope="col">Registration Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((record) => {
                    const displayName = record.name || 
                      (record.organisationName ? `${record.organisationName} (ORG)` : "N/A");
                    
                    return (
                      <tr key={record._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fa-solid fa-user" style={{ color: 'var(--primary-color)' }}></i>
                            {displayName}
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
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(record._id, displayName)}
                            disabled={deleteLoading === record._id}
                            style={{ 
                              background: 'var(--gradient-primary)', 
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              padding: 'var(--spacing-sm) var(--spacing-md)',
                              transition: 'var(--transition-normal)'
                            }}
                          >
                            {deleteLoading === record._id ? (
                              <>
                                <div className="loader" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-trash" style={{ marginRight: '0.5rem' }}></i>
                                Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-users" style={{ marginRight: '0.5rem' }}></i>
                        No donor records found. Donors will appear here once registered.
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

export default DonorList;
