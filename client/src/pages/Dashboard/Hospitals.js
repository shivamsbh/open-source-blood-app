import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";

const Hospitals = () => {
  const [data, setData] = useState([]);
  //find hospital records
  const getHospitals = async () => {
    try {
      const { data } = await API.get("/inventory/get-hospitals");
      //   console.log(data);
      if (data?.success) {
        setData(data?.hospitals);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  useEffect(() => {
    getHospitals();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Hospital Network</h1>
          <p className="dashboard-subtitle">
            Manage and view all registered hospitals in the network
          </p>
        </div>

        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th scope="col">Hospital Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Address</th>
                <th scope="col">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-hospital" style={{ color: 'var(--primary-color)' }}></i>
                        {record.hospitalName}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-map-marker-alt" style={{ color: 'var(--warning-color)' }}></i>
                        {record.address}
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-hospital" style={{ marginRight: '0.5rem' }}></i>
                      No hospitals registered yet. Start building your network!
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

export default Hospitals;
