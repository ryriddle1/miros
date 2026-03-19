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
    createBuild, 
    saveBuild, 
    loadBuild,
    deleteBuild,
    updateComponent,
    getAISuggestions,
    clearCurrentBuild 
  } = usePCBuilder();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.unauthorized}>
          <h2>🔒 Требуется авторизация</h2>
          <p>Для использования конструктора ПК необходимо войти в аккаунт</p>
          <button 
            className={styles.loginButton}
            onClick={() => navigate('/')}
          >
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price || 0) + ' ₽';
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
              <button 
                className={styles.newBuildButton}
                onClick={() => createBuild()}
              >
                Новая сборка
              </button>
              {currentBuild && (
                <button 
                  className={styles.saveBuildButton}
                  onClick={() => setShowSaveModal(true)}
                >
                  💾 Сохранить
                </button>
              )}
            </div>
          </div>

          {currentBuild ? (
            <div className={styles.componentsList}>
              {/* Процессор */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Процессор</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.cpu ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.cpu.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.cpu.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбран</div>
                )}
              </div>

              {/* Материнская плата */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Материнская плата</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.motherboard ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.motherboard.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.motherboard.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбрана</div>
                )}
              </div>

              {/* Оперативная память */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Оперативная память</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.ram ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.ram.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.ram.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбрана</div>
                )}
              </div>

              {/* Видеокарта */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Видеокарта</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.gpu ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.gpu.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.gpu.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбрана</div>
                )}
              </div>

              {/* Накопитель */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Накопитель</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.storage ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.storage.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.storage.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбран</div>
                )}
              </div>

              {/* Блок питания */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Блок питания</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.powerSupply ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.powerSupply.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.powerSupply.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбран</div>
                )}
              </div>

              {/* Корпус */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Корпус</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.case ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.case.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.case.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбран</div>
                )}
              </div>

              {/* Охлаждение */}
              <div className={styles.componentItem}>
                <div className={styles.componentHeader}>
                  <span className={styles.componentName}>Охлаждение</span>
                  <button className={styles.selectButton}>Выбрать</button>
                </div>
                {currentBuild.components.cooling ? (
                  <div className={styles.selectedComponent}>
                    <span>{currentBuild.components.cooling.name}</span>
                    <span className={styles.componentPrice}>
                      {formatPrice(currentBuild.components.cooling.price)}
                    </span>
                  </div>
                ) : (
                  <div className={styles.emptyComponent}>Не выбрано</div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyBuild}>
              <p>Начните новую сборку или загрузите сохраненную</p>
              <button 
                className={styles.startBuildButton}
                onClick={() => createBuild()}
              >
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
                {currentBuild.compatibility.isCompatible ? (
                  <p className={styles.compatible}>Все компоненты совместимы</p>
                ) : (
                  <div className={styles.warnings}>
                    {currentBuild.compatibility.warnings.map((warning, index) => (
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
              onChange={(e) => setBuildName(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button 
                className={styles.modalSaveButton}
                onClick={handleSaveBuild}
              >
                Сохранить
              </button>
              <button 
                className={styles.modalCancelButton}
                onClick={() => setShowSaveModal(false)}
              >
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