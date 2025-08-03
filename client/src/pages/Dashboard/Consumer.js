import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { useSelector } from "react-redux";

const Consumer = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  //find donor records
  const getConsumerRecords = async () => {
    try {
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "out",
          hospital: user?._id,
        },
      });
      if (data?.success) {
        setData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConsumerRecords();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Consumer Records</h1>
          <p className="dashboard-subtitle">
            Track blood consumption and outgoing inventory
          </p>
        </div>

        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Consumer Email</th>
                <th scope="col">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <span className="blood-group-badge">
                        {record.bloodGroup}
                      </span>
                    </td>
                    <td>
                      <span className="inventory-type-badge">
                        {record.inventoryType}
                      </span>
                    </td>
                    <td>
                      <span className="quantity-display">
                        {record.quantity} ML
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-color)' }}></i>
                        {record.email}
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
                      <i className="fa-solid fa-chart-line" style={{ marginRight: '0.5rem' }}></i>
                      No consumer records found. No blood has been consumed yet.
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

export default Consumer;
