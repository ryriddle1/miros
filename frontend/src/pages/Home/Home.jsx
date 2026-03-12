import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

const Home = () => {
  const navigate = useNavigate();

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '3rem',
    marginBottom: '20px',
    animation: 'fadeIn 2s'
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Добро пожаловать в магазин!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Лучшие товары по лучшим ценам
      </p>
      <Button onClick={() => navigate('/catalog')}>
        Перейти в каталог
      </Button>
    </div>
  );
};

export default Home;