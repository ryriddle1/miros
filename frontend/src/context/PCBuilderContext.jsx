import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PCBuilderContext = createContext();

export const usePCBuilder = () => {
  const context = useContext(PCBuilderContext);
  if (!context) {
    throw new Error('usePCBuilder должен использоваться внутри PCBuilderProvider');
  }
  return context;
};

export const PCBuilderProvider = ({ children }) => {
  const { user } = useAuth();
  const [builds, setBuilds] = useState([]);
  const [currentBuild, setCurrentBuild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // Загружаем сборки пользователя из localStorage
  useEffect(() => {
    if (user) {
      const savedBuilds = localStorage.getItem(`pc_builds_${user.id}`);
      if (savedBuilds) {
        setBuilds(JSON.parse(savedBuilds));
      }
    }
  }, [user]);

  // Сохраняем сборки в localStorage
  useEffect(() => {
    if (user && builds.length > 0) {
      localStorage.setItem(`pc_builds_${user.id}`, JSON.stringify(builds));
    }
  }, [builds, user]);

  // Создание новой сборки
  const createBuild = (name = 'Моя сборка') => {
    const newBuild = {
      id: Date.now(),
      name,
      userId: user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      components: {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        powerSupply: null,
        case: null,
        cooling: null
      },
      totalPrice: 0,
      compatibility: {
        isCompatible: true,
        warnings: []
      }
    };
    setCurrentBuild(newBuild);
    return newBuild;
  };

  // Сохранение сборки
  const saveBuild = (build) => {
    setBuilds(prev => {
      const existing = prev.find(b => b.id === build.id);
      if (existing) {
        return prev.map(b => b.id === build.id ? { ...build, updatedAt: new Date().toISOString() } : b);
      } else {
        return [...prev, { ...build, updatedAt: new Date().toISOString() }];
      }
    });
  };

  // Загрузка сборки
  const loadBuild = (buildId) => {
    const build = builds.find(b => b.id === buildId);
    if (build) {
      setCurrentBuild(build);
    }
    return build;
  };

  // Удаление сборки
  const deleteBuild = (buildId) => {
    setBuilds(prev => prev.filter(b => b.id !== buildId));
    if (currentBuild?.id === buildId) {
      setCurrentBuild(null);
    }
  };

  // Обновление компонента в сборке
  const updateComponent = (componentType, component) => {
    setCurrentBuild(prev => {
      if (!prev) return prev;
      
      const updated = {
        ...prev,
        components: {
          ...prev.components,
          [componentType]: component
        },
        updatedAt: new Date().toISOString()
      };
      
      // Пересчитываем цену
      updated.totalPrice = calculateTotalPrice(updated.components);
      
      // Проверяем совместимость
      updated.compatibility = checkCompatibility(updated.components);
      
      return updated;
    });
  };

  // Расчет общей цены
  const calculateTotalPrice = (components) => {
    return Object.values(components).reduce((sum, comp) => {
      return sum + (comp?.price || 0);
    }, 0);
  };

  // Проверка совместимости (базовая версия)
  const checkCompatibility = (components) => {
    const warnings = [];
    
    // Проверка совместимости CPU и материнской платы
    if (components.cpu && components.motherboard) {
      if (components.cpu.socket !== components.motherboard.socket) {
        warnings.push('Сокет процессора не совместим с материнской платой');
      }
    }
    
    // Проверка оперативной памяти
    if (components.ram && components.motherboard) {
      if (components.ram.type !== components.motherboard.ramType) {
        warnings.push('Тип оперативной памяти не совместим с материнской платой');
      }
    }
    
    // Проверка блока питания
    if (components.powerSupply && components.gpu) {
      const totalPower = calculateTotalPower(components);
      if (totalPower > components.powerSupply.wattage) {
        warnings.push('Блок питания недостаточной мощности');
      }
    }
    
    return {
      isCompatible: warnings.length === 0,
      warnings
    };
  };

  // Расчет энергопотребления
  const calculateTotalPower = (components) => {
    let total = 0;
    if (components.cpu) total += components.cpu.tdp || 0;
    if (components.gpu) total += components.gpu.tdp || 0;
    if (components.ram) total += 10; // Примерно
    if (components.storage) total += 10;
    return total + 100; // Запас для остальных компонентов
  };

  // Запрос к нейросети (заглушка для будущего)
  const getAISuggestions = async (build) => {
    setLoading(true);
    
    // Здесь будет реальный запрос к нейросети
    // Пока имитируем задержку и возвращаем тестовые данные
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = {
          cpu: {
            name: 'AMD Ryzen 5 7600X',
            reason: 'Лучшее соотношение цены и производительности для ваших задач'
          },
          gpu: {
            name: 'NVIDIA RTX 4060 Ti',
            reason: 'Отлично подходит для игр в 1080p и начального 1440p'
          },
          ram: {
            name: 'DDR5 32GB 6000MHz',
            reason: 'Достаточно для большинства современных игр и задач'
          }
        };
        setAiSuggestions(suggestions);
        setLoading(false);
        resolve(suggestions);
      }, 2000);
    });
  };

  // Очистка текущей сборки
  const clearCurrentBuild = () => {
    setCurrentBuild(null);
  };

  const value = {
    builds,
    currentBuild,
    loading,
    aiSuggestions,
    createBuild,
    saveBuild,
    loadBuild,
    deleteBuild,
    updateComponent,
    getAISuggestions,
    clearCurrentBuild
  };

  return (
    <PCBuilderContext.Provider value={value}>
      {children}
    </PCBuilderContext.Provider>
  );
};