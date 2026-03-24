import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    alert(`✅ ${product.name} добавлен в корзину!`);
  };

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

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s'
  };

  const featureStyle = {
    fontSize: '12px',
    color: '#666',
    margin: '5px 0'
  };

  return (
    <div
      style={cardStyle}
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
        src={product.picture || 'https://via.placeholder.com/200'}
        alt={product.name}
        style={imageStyle}
        onClick={() => navigate(`/product/${product.id}`)}
      />
      <h3 style={titleStyle} onClick={() => navigate(`/product/${product.id}`)}>
        {product.name}
      </h3>

      <p style={priceStyle}>{formatPrice(product.cost)}</p>
      {product.features && Object.keys(product.features).slice(0, 3).map(key => (
        <p key={key} style={featureStyle}>
          {key}: {product.features[key]}
        </p>
      ))}

      <button
        style={buttonStyle}
        onClick={handleAddToCart}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        🛒 В корзину
      </button>
    </div>
  );
};

export default ProductCard;