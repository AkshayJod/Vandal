import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
