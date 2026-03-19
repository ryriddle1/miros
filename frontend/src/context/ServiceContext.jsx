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
  const [allRequests, setAllRequests] = useState({}); // Объект с заявками для всех пользователей
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  // Загружаем все заявки из localStorage при запуске
  useEffect(() => {
    const savedRequests = localStorage.getItem('all_service_requests');
    if (savedRequests) {
      setAllRequests(JSON.parse(savedRequests));
    } else {
      // Если нет, создаем пустой объект
      setAllRequests({});
    }
  }, []);

  // Сохраняем все заявки в localStorage при изменении
  useEffect(() => {
    if (Object.keys(allRequests).length > 0) {
      localStorage.setItem('all_service_requests', JSON.stringify(allRequests));
    }
  }, [allRequests]);

  // Получаем заявки только текущего пользователя
  const getUserRequests = () => {
    if (!user) return [];
    return allRequests[user.id] || [];
  };

  // Создание новой заявки
  const createRequest = (requestData) => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest = {
          id: Date.now(),
          ...requestData,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          status: 'pending',
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

        // Добавляем заявку только для текущего пользователя
        setAllRequests(prev => ({
          ...prev,
          [user.id]: [...(prev[user.id] || []), newRequest]
        }));

        setLoading(false);
        resolve(newRequest);
      }, 1000);
    });
  };

  // Обновление статуса заявки
  const updateRequestStatus = (requestId, newStatus, comment = '') => {
    if (!user) return;

    setAllRequests(prev => {
      const userRequests = prev[user.id] || [];
      const updatedRequests = userRequests.map(request => {
        if (request.id === requestId) {
          return {
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
        }
        return request;
      });

      return {
        ...prev,
        [user.id]: updatedRequests
      };
    });
  };

  // Добавление комментария к заявке
  const addComment = (requestId, comment) => {
    if (!user) return;

    setAllRequests(prev => {
      const userRequests = prev[user.id] || [];
      const updatedRequests = userRequests.map(request => {
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
      });

      return {
        ...prev,
        [user.id]: updatedRequests
      };
    });
  };

  // Отмена заявки
  const cancelRequest = (requestId) => {
    updateRequestStatus(requestId, 'cancelled', 'Заявка отменена пользователем');
  };

  // Получение заявки по ID (только из заявок текущего пользователя)
  const getRequestById = (requestId) => {
    if (!user) return null;
    const userRequests = allRequests[user.id] || [];
    return userRequests.find(r => r.id === requestId);
  };

  // Фильтрация заявок текущего пользователя
  const getFilteredRequests = () => {
    const userRequests = getUserRequests();
    
    switch (filter) {
      case 'active':
        return userRequests.filter(r => ['pending', 'in_progress'].includes(r.status));
      case 'completed':
        return userRequests.filter(r => ['completed', 'cancelled'].includes(r.status));
      default:
        return userRequests;
    }
  };

  // Статистика для текущего пользователя
  const getStats = () => {
    const userRequests = getUserRequests();
    
    return {
      total: userRequests.length,
      pending: userRequests.filter(r => r.status === 'pending').length,
      inProgress: userRequests.filter(r => r.status === 'in_progress').length,
      completed: userRequests.filter(r => r.status === 'completed').length,
      cancelled: userRequests.filter(r => r.status === 'cancelled').length
    };
  };

  const value = {
    requests: getUserRequests(), // Только заявки текущего пользователя
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