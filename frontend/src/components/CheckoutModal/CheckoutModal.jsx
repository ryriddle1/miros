import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';
import ordersService from '../../services/orders.service';

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Введите адрес доставки');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        comment: comment
      };
      await ordersService.createOrder(orderData);
      onSuccess(); // уведомляем родителя об успешном оформлении
      onClose();   // закрываем модалку
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      setError(err.response?.data?.error || 'Не удалось оформить заказ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Оформление заказа</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Адрес доставки *</label>
            <input
              type="text"
              placeholder="Улица, дом, квартира"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Способ оплаты</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="card">Банковская карта онлайн</option>
              <option value="cash">Наличными при получении</option>
              <option value="sbp">СБП (система быстрых платежей)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Комментарий к заказу (необязательно)</label>
            <textarea
              rows="3"
              placeholder="Укажите дополнительные пожелания"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Оформление...' : 'Подтвердить заказ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;