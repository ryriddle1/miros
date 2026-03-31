import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import builderService from '../services/builder.service';

const PCBuilderContext = createContext();

export const usePCBuilder = () => {
  const context = useContext(PCBuilderContext);
  if (!context) throw new Error('usePCBuilder must be used within PCBuilderProvider');
  return context;
};

// Вспомогательная функция: преобразовать массив компонентов в объект по типам
const componentsArrayToObject = (componentsArray) => {
  const obj = {
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    powerSupply: null,
    case: null,
    cooling: null
  };
  componentsArray.forEach(comp => {
    const type = comp.features?.Тип;
    if (type === 'Процессор') obj.cpu = comp;
    else if (type === 'Материнская плата') obj.motherboard = comp;
    else if (type === 'ОЗУ') obj.ram = comp;
    else if (type === 'Видеокарта') obj.gpu = comp;
    else if (type === 'SSD' || type === 'HDD' || type === 'SSD/HDD') obj.storage = comp;
    else if (type === 'Блок питания') obj.powerSupply = comp;
    else if (type === 'Корпус') obj.case = comp;
    else if (type === 'СЖО' || type === 'Кулер' || type === 'СЖО/Кулер') obj.cooling = comp;
  });
  return obj;
};

// Преобразовать объект компонентов в массив id для отправки на сервер
const componentsObjectToIds = (componentsObj) => {
  const ids = [];
  Object.values(componentsObj).forEach(comp => {
    if (comp && comp.id) ids.push(comp.id);
  });
  return ids;
};

export const PCBuilderProvider = ({ children }) => {
  const { user } = useAuth();
  const [components, setComponents] = useState([]); // все доступные товары
  const [builds, setBuilds] = useState([]);        // список сохранённых сборок (с сервера)
  const [currentBuild, setCurrentBuild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // Загружаем все компоненты (товары) из бэкенда
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        const data = await builderService.getComponents();
        setComponents(data);
      } catch (err) {
        console.error('Ошибка загрузки компонентов:', err);
      } finally {
        setLoading(false);
      }
    };
    loadComponents();
  }, []);

  // Загружаем сборки пользователя с сервера
  useEffect(() => {
    const loadBuilds = async () => {
      if (!user) {
        setBuilds([]);
        return;
      }
      setLoading(true);
      try {
        const data = await builderService.getBuilds();
        // Преобразуем total_price в число и добавляем поле totalPrice
        const formattedBuilds = data.map(build => ({
          ...build,
          totalPrice: parseFloat(build.total_price) || 0
        }));
        setBuilds(formattedBuilds);
      } catch (err) {
        console.error('Ошибка загрузки сборок:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBuilds();
  }, [user]);

  // Создание новой сборки (локально, без отправки на сервер)
  const createBuild = (name = 'Моя сборка') => {
    const newBuild = {
      id: null, // временный id, позже будет заменён на серверный
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
      compatibility: { isCompatible: true, warnings: [] }
    };
    setCurrentBuild(newBuild);
    return newBuild;
  };

  // Сохранение сборки на сервере
  const saveBuild = async (build) => {
    if (!user) {
      console.warn('Необходимо войти для сохранения сборки');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: build.name,
        component_ids: componentsObjectToIds(build.components)
      };
      const saved = await builderService.saveBuild(payload);
      const savedBuild = {
        ...saved,
        totalPrice: parseFloat(saved.total_price) || 0,
        total_price: undefined // убираем строковую версию, чтобы не путаться
      };
      setBuilds(prev => [...prev, savedBuild]);
      setCurrentBuild(savedBuild);
    } catch (err) {
      console.error('Ошибка сохранения сборки:', err);
      alert('Не удалось сохранить сборку');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка сборки с сервера по id
  const loadBuild = async (buildId) => {
    setLoading(true);
    try {
      const build = await builderService.getBuildById(buildId);
      const componentsObj = componentsArrayToObject(build.components);
      // Преобразуем cost в число при подсчёте
      const totalPrice = Object.values(componentsObj).reduce((sum, comp) => {
        return sum + (comp ? parseFloat(comp.cost) : 0);
      }, 0);
      const loadedBuild = {
        ...build,
        components: componentsObj,
        totalPrice,
        compatibility: checkCompatibility(componentsObj)
      };
      setCurrentBuild(loadedBuild);
    } catch (err) {
      console.error('Ошибка загрузки сборки:', err);
      alert('Не удалось загрузить сборку');
    } finally {
      setLoading(false);
    }
  };
  // Удаление сборки с сервера
  const deleteBuild = async (buildId) => {
    if (!user) return;
    setLoading(true);
    try {
      await builderService.deleteBuild(buildId);
      setBuilds(prev => prev.filter(b => b.id !== buildId));
      if (currentBuild?.id === buildId) setCurrentBuild(null);
    } catch (err) {
      console.error('Ошибка удаления сборки:', err);
      alert('Не удалось удалить сборку');
    } finally {
      setLoading(false);
    }
  };

  // Обновление компонента в текущей сборке
  const updateComponent = (componentType, component) => {
    setCurrentBuild(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        components: { ...prev.components, [componentType]: component },
        updatedAt: new Date().toISOString()
      };
      // Пересчёт цены с преобразованием в число
      updated.totalPrice = Object.values(updated.components).reduce((sum, comp) => {
        return sum + (comp ? parseFloat(comp.cost) : 0);
      }, 0);
      updated.compatibility = checkCompatibility(updated.components);
      return updated;
    });
  };

  // Проверка совместимости (расширенная)
  const checkCompatibility = (components) => {
    const warnings = [];
    // Проверка сокета
    if (components.cpu && components.motherboard) {
      const cpuSocket = components.cpu.features?.['Сокет'];
      const mbSocket = components.motherboard.features?.['Сокет'];
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        warnings.push(`Процессор (${cpuSocket}) не совместим с материнской платой (${mbSocket})`);
      }
    }
    // Проверка типа ОЗУ
    if (components.ram && components.motherboard) {
      const ramType = components.ram.features?.['Тип памяти'];
      const mbRamType = components.motherboard.features?.['Тип памяти'];
      if (ramType && mbRamType && ramType !== mbRamType) {
        warnings.push(`Тип памяти ${ramType} не поддерживается материнской платой (${mbRamType})`);
      }
    }
    // Проверка мощности блока питания
    if (components.powerSupply && components.gpu) {
      const psuWattage = components.powerSupply.features?.['Мощность'];
      const gpuPower = components.gpu.features?.['Потребляемая мощность'];
      if (psuWattage && gpuPower) {
        const psuValue = parseInt(psuWattage);
        const gpuValue = parseInt(gpuPower);
        if (psuValue < gpuValue + 100) {
          warnings.push(`Блок питания (${psuWattage} Вт) может быть недостаточен для видеокарты (${gpuPower} Вт)`);
        }
      }
    }
    return { isCompatible: warnings.length === 0, warnings };
  };

  // Запрос к нейросети (заглушка, можно оставить или заменить на реальный запрос)
  const getAISuggestions = async (build) => {
    setLoading(true);
    try {
      // Здесь можно вызвать builderService.getRecommendations, передав выбранные компоненты
      // Пока заглушка
      setTimeout(() => {
        setAiSuggestions({
          cpu: { name: 'AMD Ryzen 5 7600X', reason: 'Лучшее соотношение цены и производительности' },
          gpu: { name: 'NVIDIA RTX 4060 Ti', reason: 'Отлично подходит для игр в 1080p' }
        });
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const clearCurrentBuild = () => setCurrentBuild(null);

  const value = {
    components,
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

  return <PCBuilderContext.Provider value={value}>{children}</PCBuilderContext.Provider>;
};