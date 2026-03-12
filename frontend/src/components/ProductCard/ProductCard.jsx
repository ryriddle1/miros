import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px',
    width: '250px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'white'
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px'
  };

  const titleStyle = {
    margin: '10px 0',
    fontSize: '18px',
    fontWeight: 'bold'
  };

  const priceStyle = {
    fontSize: '20px',
    color: '#2ecc71',
    fontWeight: 'bold'
  };

  return (
    <div 
      style={cardStyle}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <img 
        src={product.image || 'https://via.placeholder.com/200'} 
        alt={product.name}
        style={imageStyle}
      />
      <h3 style={titleStyle}>{product.name}</h3>
      <p style={priceStyle}>{product.price} ₽</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;