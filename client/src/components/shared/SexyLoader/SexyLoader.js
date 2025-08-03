import React from 'react';
import './SexyLoader.css';

const SexyLoader = ({ message = "Processing...", size = "large" }) => {
  return (
    <div className="sexy-loader-overlay">
      <div className="sexy-loader-container">
        <div className={`sexy-loader ${size}`}>
          <div className="blood-drop-1"></div>
          <div className="blood-drop-2"></div>
          <div className="blood-drop-3"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring-2"></div>
        </div>
        <div className="loader-text">
          <h3 className="loader-title">{message}</h3>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SexyLoader;