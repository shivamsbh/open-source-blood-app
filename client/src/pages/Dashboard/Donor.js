import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";

const Donor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Find donor records
  const getDonors = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/inventory/get-donors");
      
      if (data?.success) {
        setData(data?.donors || []);
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

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Donor Records</h1>
          <p className="dashboard-subtitle">
            View and manage all registered blood donors
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
                  <th scope="col">Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fa-solid fa-user" style={{ color: 'var(--primary-color)' }}></i>
                          {record.name || 
                           record.organisationName ? `${record.organisationName} (ORG)` : 
                           "N/A"}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-users" style={{ marginRight: '0.5rem' }}></i>
                        No donor records found. Start adding donors!
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
