import React from 'react';

const Button = ({ children, onClick, type = 'button' }) => {
  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#b30c00'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#ff003365'}
    >
      {children}
    </button>
  );
};

export default Button;