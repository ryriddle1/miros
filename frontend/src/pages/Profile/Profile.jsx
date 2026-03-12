import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user) {
    navigate('/');
    return null;
  }

  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover'
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#333'
  };

  const emailStyle = {
    fontSize: '16px',
    color: '#666',
    margin: 0
  };

  const sectionStyle = {
    marginBottom: '25px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333'
  };

  const orderCardStyle = {
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '10px',
    backgroundColor: '#fafafa'
  };

  const orderHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontWeight: 'bold'
  };

  const statusStyle = {
    padding: '4px 8px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px'
  };

  // Пример истории заказов (потом заменится на реальные данные)
  const orders = [
    {
      id: 1,
      date: '10.03.2026',
      total: 25490,
      status: 'Доставлен',
      items: 2
    },
    {
      id: 2,
      date: '05.03.2026',
      total: 45990,
      status: 'В пути',
      items: 1
    }
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <img 
            src={user.avatar || 'https://via.placeholder.com/100'} 
            alt={user.name}
            style={avatarStyle}
          />
          <div>
            <h1 style={nameStyle}>{user.name}</h1>
            <p style={emailStyle}>{user.email}</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📊 Статистика</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>3</div>
              <div style={{ color: '#666' }}>Всего заказов</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>71 480 ₽</div>
              <div style={{ color: '#666' }}>Потрачено всего</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📦 История заказов</h2>
          {orders.map(order => (
            <div key={order.id} style={orderCardStyle}>
              <div style={orderHeaderStyle}>
                <span>Заказ №{order.id}</span>
                <span style={statusStyle}>{order.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Дата: {order.date}</span>
                <span>Товаров: {order.items}</span>
                <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                  {order.total.toLocaleString()} ₽
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>⚙️ Настройки</h2>
          <button 
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => alert('Функция в разработке')}
          >
            Редактировать профиль
          </button>
          <button 
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={logout}
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;