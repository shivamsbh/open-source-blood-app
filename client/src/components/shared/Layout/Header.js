import React from "react";
import { BiDonateBlood, BiUserCircle } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  // logout handler
  const handleLogout = () => {
    localStorage.clear();
    // Immediate redirect to prevent flicker
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="container-fluid ">
          <div className="navbar-brand h1" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div style={{ 
              background: 'var(--gradient-primary)', 
              borderRadius: '50%', 
              padding: 'var(--spacing-sm)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              animation: 'pulse 2s infinite'
            }}>
              <i className="fa-solid fa-droplet" style={{ color: 'white', fontSize: '1.2rem' }}></i>
            </div>
            <span style={{ 
              background: 'linear-gradient(45deg, #fff, #f8f9fa)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              LifeFlow Bank
            </span>
          </div>
          <ul className="navbar-nav flex-row">
            <li className="nav-item mx-3">
              <div className="nav-link" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-sm)',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  borderRadius: '50%', 
                  padding: 'var(--spacing-xs)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}>
                  <i className="fa-solid fa-user" style={{ color: 'white', fontSize: '0.9rem' }}></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Welcome</span>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                    {user?.name || user?.hospitalName || user?.organisationName}
                  </span>
                </div>
                <span className="badge" style={{ 
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'capitalize'
                }}>
                  {user?.role}
                </span>
              </div>
            </li>
            {location.pathname === "/" ||
            location.pathname === "/donor" ||
            location.pathname === "/hospital" ? (
              <li className="nav-item mx-3">
                <Link to="/analytics" className="nav-link" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-xs)' 
                }}>
                  <i className="fa-solid fa-chart-line"></i>
                  Analytics
                </Link>
              </li>
            ) : (
              <li className="nav-item mx-3">
                <Link to="/" className="nav-link" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-xs)' 
                }}>
                  <i className="fa-solid fa-home"></i>
                  Home
                </Link>
              </li>
            )}
            <li className="nav-item mx-3">
              <button 
                className="btn btn-danger" 
                onClick={handleLogout}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-xs)',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  fontWeight: '600',
                  transition: 'var(--transition-normal)'
                }}
              >
                <i className="fa-solid fa-sign-out-alt"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
