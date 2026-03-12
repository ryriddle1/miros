import React from 'react';

const Button = ({ children, onClick, type = 'button' }) => {
  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
    >
      {children}
    </button>
  );
};

export default Button;