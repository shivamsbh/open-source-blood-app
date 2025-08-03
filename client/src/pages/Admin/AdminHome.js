import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="dashboard-container">
        {/* Modern Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome Admin <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="dashboard-subtitle">
            Blood Bank Management System - Administrative Control Center
          </p>
        </div>

        {/* Admin Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
          <div className="modern-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: 'var(--spacing-md)' }}></i>
              <h4 style={{ color: 'var(--secondary-color)', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-lg)' }}>User Management</h4>
              <p style={{ color: 'var(--secondary-light)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                Manage donors, hospitals, and organizations efficiently.
              </p>
            </div>
          </div>

          <div className="modern-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fa-solid fa-chart-bar" style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}></i>
              <h4 style={{ color: 'var(--secondary-color)', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-lg)' }}>Analytics & Reports</h4>
              <p style={{ color: 'var(--secondary-light)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                Access comprehensive reports and system metrics.
              </p>
            </div>
          </div>

          <div className="modern-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fa-solid fa-shield-alt" style={{ fontSize: '2.5rem', color: 'var(--success-color)', marginBottom: 'var(--spacing-md)' }}></i>
              <h4 style={{ color: 'var(--secondary-color)', marginBottom: 'var(--spacing-sm)', fontSize: 'var(--text-lg)' }}>System Security</h4>
              <p style={{ color: 'var(--secondary-light)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                Maintain system integrity and compliance standards.
              </p>
            </div>
          </div>
        </div>

        {/* Admin Instructions */}
        <div className="modern-card">
          <h3 style={{ color: 'var(--secondary-color)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <i className="fa-solid fa-info-circle" style={{ color: 'var(--primary-color)' }}></i>
            Administrative Guidelines
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div>
              <h5 style={{ color: 'var(--primary-color)', marginBottom: 'var(--spacing-sm)' }}>Blood Inventory Management</h5>
              <p style={{ color: 'var(--secondary-light)', lineHeight: '1.6' }}>
                Monitor blood inventory levels, track donations, and ensure optimal blood distribution across all registered healthcare facilities.
              </p>
            </div>
            <div>
              <h5 style={{ color: 'var(--primary-color)', marginBottom: 'var(--spacing-sm)' }}>User Oversight</h5>
              <p style={{ color: 'var(--secondary-light)', lineHeight: '1.6' }}>
                Use the navigation menu to access donor lists, hospital management, and organization oversight tools for comprehensive user management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
