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
    color: '#2ecc71',
    fontWeight: 'bold',
    margin: '20px 0'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  };

  if (loading) {
    return <div style={containerStyle}>Загрузка...</div>;
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
          src={product.picture || 'https://via.placeholder.com/500'}
          alt={product.name}
          style={imageStyle}
        />
        <div>
          <h1>{product.name}</h1>
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
    </div>
  );
};

export default Product;