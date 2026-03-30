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
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6e9 100%)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(30, 132, 73, 0.15)',
    border: '1px solid rgba(30, 132, 73, 0.2)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(30, 132, 73, 0.3)'
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #1e8449',
    boxShadow: '0 5px 15px rgba(30, 132, 73, 0.2)'
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#0e4a2e'
  };

  const emailStyle = {
    fontSize: '16px',
    color: '#2c5e3a',
    margin: 0
  };

  const sectionStyle = {
    marginBottom: '25px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#0e4a2e'
  };

  const statCardStyle = {
    textAlign: 'center',
    padding: '15px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e8449'
  };

  const statLabelStyle = {
    color: '#666',
    marginTop: '5px'
  };

  const orderCardStyle = {
    padding: '15px',
    border: '1px solid rgba(30, 132, 73, 0.2)',
    borderRadius: '12px',
    marginBottom: '10px',
    background: 'white',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  };

  const orderHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontWeight: 'bold'
  };

  const statusStyle = {
    padding: '4px 12px',
    backgroundColor: '#e8f5e9',
    color: '#1e8449',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  };

  const editButtonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #1e8449 0%, #0e6251 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(30, 132, 73, 0.3)'
  };

  const logoutButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
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
            src={user.avatar || 'https://via.placeholder.com/100?text=👤'} 
            alt={user.name}
            style={avatarStyle}
          />
          <div>
            <h1 style={nameStyle}>{user.name}</h1>
            <p style={emailStyle}>{user.email}</p>
            <p style={{ color: '#2c5e3a', marginTop: '5px', fontSize: '14px' }}>
              🟢 Активен
            </p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📊 Статистика</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div 
              style={statCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 132, 73, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={statValueStyle}>3</div>
              <div style={statLabelStyle}>Всего заказов</div>
            </div>
            <div 
              style={statCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 132, 73, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={statValueStyle}>71 480 ₽</div>
              <div style={statLabelStyle}>Потрачено всего</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📦 История заказов</h2>
          {orders.map(order => (
            <div 
              key={order.id} 
              style={orderCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 132, 73, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={orderHeaderStyle}>
                <span>Заказ №{order.id}</span>
                <span style={statusStyle}>{order.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Дата: {order.date}</span>
                <span>Товаров: {order.items}</span>
                <span style={{ fontWeight: 'bold', color: '#1e8449' }}>
                  {order.total.toLocaleString()} ₽
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>⚙️ Настройки</h2>
          <div style={buttonGroupStyle}>
            <button 
              style={editButtonStyle}
              onClick={() => alert('Функция редактирования профиля в разработке')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 132, 73, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 132, 73, 0.3)';
              }}
            >
              ✏️ Редактировать профиль
            </button>
            <button 
              style={logoutButtonStyle}
              onClick={logout}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 53, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
              }}
            >
              🚪 Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;