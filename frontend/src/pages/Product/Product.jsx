import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button/Button';
import productsService from '../../services/products.service';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productsService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        setError('Не удалось загрузить товар');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, 1);
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
    color: '#1e8449',
    fontWeight: 'bold',
    margin: '20px 0'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  };

  const featuresStyle = {
    marginTop: '40px',
    borderTop: '2px solid #d8ffca',
    paddingTop: '30px'
  };

  const featuresTitleStyle = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333'
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    backgroundColor: '#ddf9e1',
    padding: '20px',
    borderRadius: '12px'
  };

  const featureItemStyle = {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  };

  const featureItemHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(30, 132, 73, 0.1)'
  };

  const featureKeyStyle = {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    display: 'block'
  };

  const featureValueStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    wordBreak: 'break-word'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3', 
            borderTop: '5px solid #1e8449', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={containerStyle}>
        <h2>Товар не найден</h2>
        <Button onClick={() => navigate('/catalog')}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Button onClick={() => navigate('/catalog')}>
        ← Назад в каталог
      </Button>

      <div style={contentStyle}>
        <img
          src={product.picture || 'https://via.placeholder.com/500?text=No+Image'}
          alt={product.name}
          style={imageStyle}
        />
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '15px' }}>{product.name}</h1>
          <p style={priceStyle}>{formatPrice(product.cost)}</p>
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

      {product.features && Object.keys(product.features).length > 0 && (
        <div style={featuresStyle}>
          <h2 style={featuresTitleStyle}>📋 Характеристики</h2>
          <div style={featuresGridStyle}>
            {Object.entries(product.features).map(([key, value]) => (
              <div 
                key={key} 
                style={featureItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 132, 73, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={featureKeyStyle}>{key}</span>
                <span style={featureValueStyle}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Product;