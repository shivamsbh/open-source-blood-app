import React from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div style={{ 
                  background: 'var(--gradient-primary)', 
                  borderRadius: '50%', 
                  padding: 'var(--spacing-md)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'heartbeat 2s infinite'
                }}>
                  <i className="fa-solid fa-droplet" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                </div>
                <span style={{ 
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px'
                }}>
                  LifeFlow Bank
                </span>
              </div>
              <h2 className="auth-title">Join LifeFlow</h2>
              <p className="auth-subtitle">Create your account and start saving lives today</p>
            </div>
            <Form
              formTitle={"Register"}
              submitBtn={"Register"}
              formType={"register"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
