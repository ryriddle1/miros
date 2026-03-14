import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ServiceContext = createContext();

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService должен использоваться внутри ServiceProvider');
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Загружаем заявки из localStorage при запуске
  useEffect(() => {
    if (user) {
      const savedRequests = localStorage.getItem(`service_requests_${user.id}`);
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      }
    }
  }, [user]);

  // Сохраняем заявки в localStorage
  useEffect(() => {
    if (user && requests.length > 0) {
      localStorage.setItem(`service_requests_${user.id}`, JSON.stringify(requests));
    }
  }, [requests, user]);

  // Создание новой заявки
  const createRequest = (requestData) => {
    setLoading(true);
    
    // Имитация отправки на сервер
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest = {
          id: Date.now(),
          ...requestData,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          status: 'pending', // pending, in_progress, completed, cancelled
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [
            {
              status: 'pending',
              date: new Date().toISOString(),
              comment: 'Заявка создана'
            }
          ]
        };

        setRequests(prev => [newRequest, ...prev]);
        setLoading(false);
        resolve(newRequest);
      }, 1000);
    });
  };

  // Обновление статуса заявки
  const updateRequestStatus = (requestId, newStatus, comment = '') => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const updatedRequest = {
          ...request,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          history: [
            ...request.history,
            {
              status: newStatus,
              date: new Date().toISOString(),
              comment
            }
          ]
        };
        return updatedRequest;
      }
      return request;
    }));
  };

  // Добавление комментария к заявке
  const addComment = (requestId, comment) => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          updatedAt: new Date().toISOString(),
          history: [
            ...request.history,
            {
              status: 'comment',
              date: new Date().toISOString(),
              comment
            }
          ]
        };
      }
      return request;
    }));
  };

  // Отмена заявки
  const cancelRequest = (requestId) => {
    updateRequestStatus(requestId, 'cancelled', 'Заявка отменена пользователем');
  };

  // Получение заявки по ID
  const getRequestById = (requestId) => {
    return requests.find(r => r.id === requestId);
  };

  // Фильтрация заявок
  const getFilteredRequests = () => {
    switch (filter) {
      case 'active':
        return requests.filter(r => ['pending', 'in_progress'].includes(r.status));
      case 'completed':
        return requests.filter(r => ['completed', 'cancelled'].includes(r.status));
      default:
        return requests;
    }
  };

  // Статистика
  const getStats = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      inProgress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length
    };
  };

  const value = {
    requests,
    loading,
    filter,
    setFilter,
    createRequest,
    updateRequestStatus,
    addComment,
    cancelRequest,
    getRequestById,
    getFilteredRequests,
    getStats
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};