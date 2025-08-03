import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Form from "../../components/shared/Form/Form";
import SexyLoader from "../../components/shared/SexyLoader/SexyLoader";
import { useToast } from "../../components/shared/Toast/ToastManager";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const toast = useToast();

  // Handle error display with toast instead of alert
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  if (loading) {
    return <SexyLoader message="Signing you in..." />;
  }

  return (
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account and save lives</p>
        </div>
        <Form
          formTitle="Login to Blood Bank"
          submitBtn="Login"
          formType="login"
        />
      </div>
    </div>
  );
};

export default Login;
