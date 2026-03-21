import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authMode, 
    setAuthMode,
    login,
    register 
  } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
          password
        });
      }
      setShowAuthModal(false);
      // Очищаем форму
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
    } catch (err) {
      console.error('Auth error:', err);
      console.log('Response data:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                       err.response?.data?.email?.[0] ||
                       err.response?.data?.phone_number?.[0] ||
                       err.response?.data?.username?.[0] ||
                       err.message || 'Ошибка';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '15px'
  };

  const toggleStyle = {
    textAlign: 'center',
    color: '#007bff',
    cursor: 'pointer',
    marginTop: '10px'
  };

  const errorStyle = {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px'
  };

  return (
    <div style={modalOverlayStyle} onClick={() => setShowAuthModal(false)}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button 
          style={closeButtonStyle}
          onClick={() => setShowAuthModal(false)}
        >
          ✕
        </button>

        <h2 style={titleStyle}>
          {authMode === 'login' ? 'Вход' : 'Регистрация'}
        </h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Имя *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="text"
                placeholder="Фамилия *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="tel"
                placeholder="Телефон *"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={inputStyle}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Пароль *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : (authMode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div style={toggleStyle}>
          {authMode === 'login' ? (
            <span onClick={() => setAuthMode('register')}>
              Нет аккаунта? Зарегистрируйтесь
            </span>
          ) : (
            <span onClick={() => setAuthMode('login')}>
              Уже есть аккаунт? Войдите
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;