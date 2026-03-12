import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' или 'register'

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Функция входа
  const login = (email, password) => {
    // Имитация запроса к серверу
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Для демо принимаем любые данные
        if (email && password) {
          const userData = {
            id: 1,
            email,
            name: email.split('@')[0],
            avatar: 'https://via.placeholder.com/100'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Заполните все поля'));
        }
      }, 1000);
    });
  };

  // Функция регистрации
  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const userData = {
            id: Date.now(),
            name,
            email,
            avatar: 'https://via.placeholder.com/100'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Заполните все поля'));
        }
      }, 1000);
    });
  };

  // Выход из аккаунта
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};