import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import Button from '../../components/Button/Button';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Товар не найден</h2>
        <Button onClick={() => navigate('/catalog')}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`✅ ${product.name} добавлен в корзину!`);
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px'
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginTop: '30px'
  };

  const imageStyle = {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px'
  };

  const priceStyle = {
    fontSize: '32px',
    color: '#2ecc71',
    fontWeight: 'bold',
    margin: '20px 0'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  };

  return (
    <div style={containerStyle}>
      <Button onClick={() => navigate('/catalog')}>
        ← Назад в каталог
      </Button>

      <div style={contentStyle}>
        <img 
          src={product.image || 'https://via.placeholder.com/500'} 
          alt={product.name}
          style={imageStyle}
        />
        
        <div>
          <h1>{product.name}</h1>
          <p style={priceStyle}>{formatPrice(product.price)}</p>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            {product.description}
          </p>
          
          <div style={buttonGroupStyle}>
            <Button onClick={handleAddToCart}>
              🛒 Добавить в корзину
            </Button>
            <Button onClick={() => navigate('/cart')}>
              Перейти в корзину
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;