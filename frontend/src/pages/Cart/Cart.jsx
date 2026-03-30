import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '../../components/CheckoutModal/CheckoutModal';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, formatPrice } = useCart();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleOrderSuccess = () => {
    clearCart(); // очищаем корзину
    setShowCheckoutModal(false);
    alert('Заказ успешно оформлен! Спасибо за покупку!');
    // опционально: редирект на страницу заказов или на главную
    navigate('/profile'); // если у вас есть страница профиля с заказами
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '32px',
    margin: 0
  };

  const clearButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const emptyCartStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const cartItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '15px',
    backgroundColor: 'white'
  };

  const itemImageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '20px'
  };

  const itemInfoStyle = {
    flex: 1
  };

  const itemNameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const itemPriceStyle = {
    fontSize: '20px',
    color: '#2ecc71',
    fontWeight: 'bold',
    margin: '0'
  };

  const quantityControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginRight: '20px'
  };

  const quantityButtonStyle = {
    width: '30px',
    height: '30px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const quantitySpanStyle = {
    minWidth: '30px',
    textAlign: 'center'
  };

  const removeButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const summaryStyle = {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'right'
  };

  const totalStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px 0'
  };

  const checkoutButtonStyle = {
    padding: '15px 40px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold'
  };

  const continueShoppingStyle = {
    padding: '15px 40px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    marginRight: '15px'
  };

  if (cart.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyCartStyle}>
          <h2>🛒 Корзина пуста</h2>
          <p>Добавьте товары в корзину, чтобы оформить заказ</p>
          <button
            style={checkoutButtonStyle}
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Корзина</h1>
        <button
          style={clearButtonStyle}
          onClick={() => {
            if (window.confirm('Очистить корзину?')) {
              clearCart();
            }
          }}
        >
          Очистить корзину
        </button>
      </div>

      <div>
        {cart.map(item => (
          <div key={item.id} style={cartItemStyle}>
            <img
              src={item.product.picture || 'https://via.placeholder.com/100'}
              alt={item.product.name}
              style={itemImageStyle}
            />
            <div style={itemInfoStyle}>
              <h3 style={itemNameStyle}>{item.product.name}</h3>
              <p style={itemPriceStyle}>{formatPrice(item.product.cost)}</p>
            </div>
            <div style={quantityControlStyle}>
              <button
                style={quantityButtonStyle}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >-</button>
              <span style={quantitySpanStyle}>{item.quantity}</span>
              <button
                style={quantityButtonStyle}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >+</button>
            </div>
            <div>
              <p style={itemPriceStyle}>
                {formatPrice(item.product.cost * item.quantity)}
              </p>
            </div>
            <button
              style={removeButtonStyle}
              onClick={() => removeFromCart(item.id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div style={summaryStyle}>
        <p style={totalStyle}>
          Итого: {formatPrice(getTotalPrice())}
        </p>
        <div>
          <button
            style={continueShoppingStyle}
            onClick={() => navigate('/catalog')}
          >
            Продолжить покупки
          </button>
          <button onClick={handleCheckout}>Оформить заказ</button>
          <CheckoutModal
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            onSuccess={handleOrderSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;