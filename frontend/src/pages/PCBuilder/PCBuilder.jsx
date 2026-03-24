import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePCBuilder } from '../../context/PCBuilderContext';
import styles from './PCBuilder.module.css';

const PCBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    builds,
    currentBuild,
    loading,
    aiSuggestions,
    components,               // список всех товаров из бэкенда
    createBuild,
    saveBuild,
    loadBuild,
    deleteBuild,
    updateComponent,
    getAISuggestions,
    clearCurrentBuild
  } = usePCBuilder();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Маппинг категорий (ключ -> отображаемое имя -> тип в БД)
  const categories = [
    { key: 'cpu', label: 'Процессор', types: ['Процессор'] },
    { key: 'motherboard', label: 'Материнская плата', types: ['Материнская плата'] },
    { key: 'ram', label: 'Оперативная память', types: ['ОЗУ'] },
    { key: 'gpu', label: 'Видеокарта', types: ['Видеокарта'] },
    { key: 'storage', label: 'Накопитель', types: ['SSD', 'HDD', 'SSD/HDD'] }, // несколько типов
    { key: 'powerSupply', label: 'Блок питания', types: ['Блок питания'] },
    { key: 'case', label: 'Корпус', types: ['Корпус'] },
    { key: 'cooling', label: 'Охлаждение', types: ['СЖО', 'Кулер', 'СЖО/Кулер'] }
  ];
  // Фильтруем компоненты по типу для выбранной категории
  const filteredComponents = selectedCategory
    ? components.filter(c => {
        const allowedTypes = categories.find(cat => cat.key === selectedCategory)?.types || [];
        return allowedTypes.includes(c.features?.Тип);
      })
    : [];

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.unauthorized}>
          <h2>🔒 Требуется авторизация</h2>
          <p>Для использования конструктора ПК необходимо войти в аккаунт</p>
          <button className={styles.loginButton} onClick={() => navigate('/')}>
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const handleAISuggestions = async () => {
    setAiLoading(true);
    await getAISuggestions(currentBuild);
    setAiLoading(false);
  };

  const handleSaveBuild = () => {
    if (currentBuild) {
      const updatedBuild = {
        ...currentBuild,
        name: buildName || currentBuild.name
      };
      saveBuild(updatedBuild);
      setShowSaveModal(false);
      setBuildName('');
    }
  };

  const openComponentModal = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setShowComponentModal(true);
  };

  const handleSelectComponent = (component) => {
    if (selectedCategory) {
      updateComponent(selectedCategory, component);
      setShowComponentModal(false);
      setSelectedCategory(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(parseFloat(price) || 0) + ' ₽';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🖥️ Конструктор ПК</h1>
        <p className={styles.subtitle}>
          Соберите компьютер своей мечты с помощью нейросети
        </p>
      </div>

      <div className={styles.builderLayout}>
        {/* Левая панель - компоненты */}
        <div className={styles.componentsPanel}>
          <div className={styles.panelHeader}>
            <h2>Компоненты</h2>
            <div className={styles.headerActions}>
              <button className={styles.newBuildButton} onClick={() => createBuild()}>
                Новая сборка
              </button>
              {currentBuild && (
                <button className={styles.saveBuildButton} onClick={() => setShowSaveModal(true)}>
                  💾 Сохранить
                </button>
              )}
            </div>
          </div>

          {currentBuild ? (
            <div className={styles.componentsList}>
              {categories.map(cat => {
                const selectedComp = currentBuild.components[cat.key];
                return (
                  <div key={cat.key} className={styles.componentItem}>
                    <div className={styles.componentHeader}>
                      <span className={styles.componentName}>{cat.label}</span>
                      <button
                        className={styles.selectButton}
                        onClick={() => openComponentModal(cat.key)}
                      >
                        Выбрать
                      </button>
                    </div>
                    {selectedComp ? (
                      <div className={styles.selectedComponent}>
                        <span>{selectedComp.name}</span>
                        <span className={styles.componentPrice}>
                          {formatPrice(selectedComp.cost)}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.emptyComponent}>Не выбран</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyBuild}>
              <p>Начните новую сборку или загрузите сохраненную</p>
              <button className={styles.startBuildButton} onClick={() => createBuild()}>
                Начать сборку
              </button>
            </div>
          )}
        </div>

        {/* Правая панель - информация и AI */}
        <div className={styles.infoPanel}>
          {currentBuild && (
            <>
              <div className={styles.totalPrice}>
                <h3>Итого:</h3>
                <div className={styles.priceValue}>{formatPrice(currentBuild.totalPrice)}</div>
              </div>

              {/* Совместимость */}
              <div className={styles.compatibility}>
                <h3>✅ Совместимость</h3>
                {currentBuild.compatibility?.isCompatible ? (
                  <p className={styles.compatible}>Все компоненты совместимы</p>
                ) : (
                  <div className={styles.warnings}>
                    {currentBuild.compatibility?.warnings?.map((warning, index) => (
                      <p key={index} className={styles.warning}>⚠️ {warning}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Нейросеть */}
              <div className={styles.aiSection}>
                <h3>🤖 Нейросеть рекомендует</h3>
                <button
                  className={styles.aiButton}
                  onClick={handleAISuggestions}
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Анализ...' : 'Получить рекомендации'}
                </button>
                {aiSuggestions && (
                  <div className={styles.aiSuggestions}>
                    {Object.entries(aiSuggestions).map(([key, suggestion]) => (
                      <div key={key} className={styles.aiSuggestion}>
                        <strong>{suggestion.name}</strong>
                        <p>{suggestion.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Сохраненные сборки */}
              {builds.length > 0 && (
                <div className={styles.savedBuilds}>
                  <h3>📁 Мои сборки</h3>
                  <div className={styles.buildsList}>
                    {builds.map(build => (
                      <div key={build.id} className={styles.buildItem}>
                        <div className={styles.buildInfo}>
                          <strong>{build.name}</strong>
                          <span>{formatPrice(build.totalPrice)}</span>
                        </div>
                        <div className={styles.buildActions}>
                          <button
                            className={styles.loadBuildButton}
                            onClick={() => loadBuild(build.id)}
                          >
                            Загрузить
                          </button>
                          <button
                            className={styles.deleteBuildButton}
                            onClick={() => deleteBuild(build.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Модальное окно сохранения */}
      {showSaveModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Сохранить сборку</h3>
            <input
              type="text"
              placeholder="Название сборки"
              value={buildName}
              onChange={e => setBuildName(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button className={styles.modalSaveButton} onClick={handleSaveBuild}>
                Сохранить
              </button>
              <button className={styles.modalCancelButton} onClick={() => setShowSaveModal(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбора компонента */}
      {showComponentModal && selectedCategory && (
        <div className={styles.modalOverlay} onClick={() => setShowComponentModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Выберите {categories.find(cat => cat.key === selectedCategory)?.label}</h3>
            <div className={styles.componentsListModal}>
              {filteredComponents.length === 0 ? (
                <p>Нет доступных компонентов этой категории</p>
              ) : (
                filteredComponents.map(comp => (
                  <div key={comp.id} className={styles.componentOption} onClick={() => handleSelectComponent(comp)}>
                    <div>
                      <strong>{comp.name}</strong>
                      <div className={styles.componentOptionPrice}>{formatPrice(comp.cost)}</div>
                    </div>
                    <button className={styles.selectOptionButton}>Выбрать</button>
                  </div>
                ))
              )}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelButton} onClick={() => setShowComponentModal(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCBuilder;