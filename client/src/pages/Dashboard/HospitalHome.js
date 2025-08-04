import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { useSelector } from "react-redux";

const HospitalHome = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  // Get function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
        console.log(data);
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
      <div className="container-fluid">
        <h4
          className="ms-4"
          style={{
            color: "#495057",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          Hospital Dashboard - Blood Bank Inventory
        </h4>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div
            className="filters ms-4"
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <select
              className="form-select"
              style={{
                width: "150px",
                border: "2px solid #007bff",
                borderRadius: "8px",
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
              style={{
                width: "150px",
                border: "2px solid #28a745",
                borderRadius: "8px",
              }}
            >
              <option>All Types</option>
              <option>in</option>
              <option>out</option>
            </select>
          </div>
        </div>

        <div className="table-responsive ms-4 me-4">
          <table className="table table-hover">
            <thead
              className="table-dark"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Inventory Type</th>
                <th scope="col">Quantity (ML)</th>
                <th scope="col">Donor Email</th>
                <th scope="col">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr
                  key={record._id}
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.parentNode.style.backgroundColor = "#f8f9fa";
                    e.target.parentNode.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.parentNode.style.backgroundColor = "";
                    e.target.parentNode.style.transform = "scale(1)";
                  }}
                >
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {record.bloodGroup}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        record.inventoryType === "out"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "15px",
                        fontSize: "11px",
                      }}
                    >
                      {record.inventoryType}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "#495057" }}>
                      {record.quantity} ML
                    </strong>
                  </td>
                  <td style={{ color: "#6c757d" }}>{record.email}</td>
                  <td style={{ color: "#6c757d", fontSize: "14px" }}>
                    {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalHome;