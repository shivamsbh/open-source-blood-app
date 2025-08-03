import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../styles/Layout.css";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Helper function to check if menu item is active
  const isActive = (path) => location.pathname === path;

  // Menu items configuration
  const menuItems = {
    organisation: [
      {
        path: "/",
        icon: "fa-solid fa-warehouse",
        label: "Inventory",
      },
      {
        path: "/donor",
        icon: "fa-solid fa-hand-holding-medical",
        label: "Donors",
      },
      {
        path: "/hospital",
        icon: "fa-solid fa-hospital",
        label: "Hospitals",
      },
      {
        path: "/analytics",
        icon: "fa-solid fa-chart-line",
        label: "Analytics",
      },
    ],
    admin: [
      {
        path: "/admin",
        icon: "fa-solid fa-user-shield",
        label: "Dashboard",
      },
      {
        path: "/donor-list",
        icon: "fa-solid fa-users",
        label: "Donors",
      },
      {
        path: "/hospital-list",
        icon: "fa-solid fa-hospital",
        label: "Hospitals",
      },
      {
        path: "/org-list",
        icon: "fa-solid fa-building",
        label: "Organizations",
      },
    ],
    donor: [
      {
        path: "/organisation",
        icon: "fa-solid fa-building-ngo",
        label: "Organisations",
      },
      {
        path: "/donation",
        icon: "fa-solid fa-hand-holding-heart",
        label: "My Donations",
      },
    ],
    hospital: [
      {
        path: "/organisation",
        icon: "fa-solid fa-building-ngo",
        label: "Organisations",
      },
      {
        path: "/consumer",
        icon: "fa-solid fa-clipboard-list",
        label: "Blood Requests",
      },
    ],
  };

  const currentUserMenuItems = menuItems[user?.role] || [];

  return (
    <div className="sidebar">
      {/* Sidebar Logo */}
      <div style={{ 
        padding: 'var(--spacing-xl)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-md)',
          justifyContent: 'center'
        }}>
          <div style={{ 
            background: 'var(--gradient-primary)', 
            borderRadius: '50%', 
            padding: 'var(--spacing-sm)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            animation: 'pulse 3s infinite',
            width: '40px',
            height: '40px'
          }}>
            <i className="fa-solid fa-droplet" style={{ color: 'white', fontSize: '1.1rem' }}></i>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ 
              fontSize: 'var(--text-xl)',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '0.5px',
              lineHeight: '1.2'
            }}>
              LifeFlow
            </span>
            <span style={{ 
              fontSize: 'var(--text-xs)',
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '1px',
              lineHeight: '1'
            }}>
              BANK
            </span>
          </div>
        </div>
      </div>

      {/* User Role Badge */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 'var(--spacing-xl)',
        padding: '0 var(--spacing-lg)'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <span style={{ 
            color: 'var(--primary-light)',
            fontSize: '0.9rem',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {user?.role} Dashboard
          </span>
        </div>
      </div>

      <div className="menu">
        {currentUserMenuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${isActive(item.path) ? "active" : ""}`}
          >
            <i className={item.icon}></i>
            <Link to={item.path}>{item.label}</Link>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div style={{ 
        position: 'absolute',
        bottom: 'var(--spacing-lg)',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        width: '90%'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-md)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8rem',
            marginBottom: 'var(--spacing-xs)'
          }}>
            Saving Lives Together
          </div>
          <div style={{ 
            color: 'var(--primary-light)',
            fontSize: '0.7rem',
            fontWeight: '500'
          }}>
            © 2024 LifeFlow Bank
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
