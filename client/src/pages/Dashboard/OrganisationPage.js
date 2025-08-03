import React, { useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import { useSelector } from "react-redux";
import API from "../../services/API";

const OrganisationPage = () => {
  // get current user
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  //find org records
  const getOrg = async () => {
    try {
      if (user?.role === "donor") {
        const { data } = await API.get("/inventory/get-organisation");
        //   console.log(data);
        if (data?.success) {
          setData(data?.organisations);
        }
      }
      if (user?.role === "hospital") {
        const { data } = await API.get(
          "/inventory/get-organisation-for-hospital"
        );
        //   console.log(data);
        if (data?.success) {
          setData(data?.organisations);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrg();
  }, [user]);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Organisation Network</h1>
          <p className="dashboard-subtitle">
            View and manage blood bank organisations in your network
          </p>
        </div>

        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th scope="col">Organisation Name</th>
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
                      <i className="fa-solid fa-building" style={{ marginRight: '0.5rem' }}></i>
                      No organisations found. Connect with blood bank organisations!
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

export default OrganisationPage;
