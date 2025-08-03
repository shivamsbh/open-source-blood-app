import React, { useState, useEffect } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "./../../services/API";
import moment from "moment";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const colors = [
    "#884A39",
    "#C38154",
    "#FFC26F",
    "#4F709C",
    "#4942E4",
    "#0079FF",
    "#FF0060",
    "#22A699",
  ];
  //GET BLOOD GROUP DATA
  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
        // console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //lifrecycle method
  useEffect(() => {
    getBloodGroupData();
  }, []);

  //get function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-recent-inventory");
      if (data?.success) {
        setInventoryData(data?.inventory);
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
    <>
      <Header />
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
            <div style={{ 
              background: 'var(--gradient-primary)', 
              borderRadius: '50%', 
              padding: 'var(--spacing-md)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)'
            }} className="animate-float">
              <i className="fa-solid fa-chart-line" style={{ color: 'white', fontSize: '1.5rem' }}></i>
            </div>
            <h1 className="dashboard-title">Blood Bank Analytics</h1>
          </div>
          <p className="dashboard-subtitle">
            Real-time insights and blood inventory statistics
          </p>
        </div>

        {/* Blood Group Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--spacing-xl)', 
          marginBottom: 'var(--spacing-2xl)' 
        }}>
          {data?.map((record, i) => (
            <div
              key={i}
              className="modern-card hover-lift"
              style={{
                background: `linear-gradient(135deg, ${colors[i]}15 0%, ${colors[i]}25 100%)`,
                border: `2px solid ${colors[i]}30`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '4rem', color: `${colors[i]}20` }}>
                <i className="fa-solid fa-droplet"></i>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: colors[i],
                  borderRadius: 'var(--radius-lg)',
                  color: 'white'
                }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                    {record.bloodGroup}
                  </h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--success-color)', fontSize: '1.5rem', fontWeight: '700' }}>
                      {record.totalIn}
                    </div>
                    <div style={{ color: 'var(--secondary-light)', fontSize: '0.9rem' }}>
                      Total In (ML)
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--error-color)', fontSize: '1.5rem', fontWeight: '700' }}>
                      {record.totalOut}
                    </div>
                    <div style={{ color: 'var(--secondary-light)', fontSize: '0.9rem' }}>
                      Total Out (ML)
                    </div>
                  </div>
                </div>

                <div style={{ 
                  textAlign: 'center', 
                  padding: 'var(--spacing-md)',
                  background: 'var(--gradient-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
                    {record.availabeBlood}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Available (ML)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="modern-table-container">
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ 
              color: 'var(--secondary-color)', 
              fontSize: '1.8rem', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--primary-color)' }}></i>
              Recent Blood Transactions
            </h2>
          </div>
          
          <table className="modern-table">
            <thead>
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Email</th>
                <th scope="col">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData?.length > 0 ? (
                inventoryData.map((record) => (
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
                      No recent transactions found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Analytics;
