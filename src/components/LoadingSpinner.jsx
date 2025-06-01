import React from 'react';

const LoadingSpinner = ({ size = 40, color = '#3B82F6' }) => {
  return (
    <div 
      className="inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        borderColor: `${color} transparent ${color} transparent`
      }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
