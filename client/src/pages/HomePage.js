import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";

const HomePage = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  //get function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
        // console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);
  return (
    <Layout>
      {user?.role === "admin" && navigate("/admin")}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="dashboard-container">
          {/* Modern Dashboard Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Blood Bank Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage and track blood inventory with real-time updates
            </p>
          </div>

          {/* Add Inventory Button */}
          <button
            className="add-inventory-btn"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <i className="fa-solid fa-plus"></i>
            Add New Inventory
          </button>

          {/* Modern Table Container */}
          <div className="modern-table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th scope="col">Blood Group</th>
                  <th scope="col">Type</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Donor Email</th>
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
                      <td>{record.email}</td>
                      <td>
                        {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{ color: 'var(--secondary-light)', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-droplet" style={{ marginRight: '0.5rem' }}></i>
                        No blood inventory records found. Add your first record!
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal />
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
