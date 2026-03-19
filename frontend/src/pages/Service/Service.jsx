import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useService } from '../../context/ServiceContext';
import styles from './Service.module.css';

const Service = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    requests, 
    loading, 
    filter, 
    setFilter,
    createRequest,
    cancelRequest,      
    getFilteredRequests,
    getStats 
  } = useService();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    issue: '',
    description: '',
    urgency: 'normal'
  });

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.unauthorized}>
          <h2>🔒 Требуется авторизация</h2>
          <p>Для создания заявки на ремонт необходимо войти в аккаунт</p>
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

  const stats = getStats();
  const filteredRequests = getFilteredRequests();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRequest(formData);
    setShowForm(false);
    setFormData({
      deviceType: '',
      brand: '',
      model: '',
      issue: '',
      description: '',
      urgency: 'normal'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Ожидает', class: styles.statusPending },
      in_progress: { text: 'В работе', class: styles.statusProgress },
      completed: { text: 'Выполнен', class: styles.statusCompleted },
      cancelled: { text: 'Отменён', class: styles.statusCancelled }
    };
    return badges[status] || badges.pending;
  };

  const getUrgencyLabel = (urgency) => {
    const labels = {
      low: 'Низкая',
      normal: 'Средняя',
      high: 'Высокая',
      urgent: 'Срочная'
    };
    return labels[urgency] || labels.normal;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🔧 Сервисный центр</h1>
        <p className={styles.subtitle}>
          {user?.name}, здесь вы можете отслеживать свои заявки на ремонт
        </p>
      </div>

      {/* Статистика пользователя */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Всего заявок</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statLabel}>Ожидают</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.inProgress}</div>
          <div className={styles.statLabel}>В работе</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.completed}</div>
          <div className={styles.statLabel}>Выполнено</div>
        </div>
      </div>

      {/* Кнопка создания заявки */}
      <div className={styles.actionBar}>
        <button 
          className={styles.createButton}
          onClick={() => setShowForm(true)}
        >
          + Новая заявка
        </button>

        {/* Фильтры */}
        <div className={styles.filters}>
          <button 
            className={`${styles.filterButton} ${filter === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'active' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('active')}
          >
            Активные
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'completed' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('completed')}
          >
            Завершённые
          </button>
        </div>
      </div>

      {/* Форма создания заявки */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <h2>Новая заявка на ремонт</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Тип устройства *</label>
                <select 
                  name="deviceType" 
                  value={formData.deviceType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите тип</option>
                  <option value="phone">Смартфон</option>
                  <option value="tablet">Планшет</option>
                  <option value="laptop">Ноутбук</option>
                  <option value="pc">Компьютер</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Бренд *</label>
                  <input 
                    type="text" 
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Например: Apple, Samsung"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Модель *</label>
                  <input 
                    type="text" 
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Например: iPhone 13"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Проблема *</label>
                <input 
                  type="text" 
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  placeholder="Кратко опишите проблему"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Подробное описание</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Опишите проблему подробнее..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Срочность</label>
                <select 
                  name="urgency" 
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="low">Низкая</option>
                  <option value="normal">Средняя</option>
                  <option value="high">Высокая</option>
                  <option value="urgent">Срочная</option>
                </select>
              </div>

              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>
                  Отправить заявку
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Список заявок пользователя */}
      <div className={styles.requestsList}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : filteredRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <p>У вас пока нет заявок на ремонт</p>
            <button 
              className={styles.createFirstButton}
              onClick={() => setShowForm(true)}
            >
              Создать первую заявку
            </button>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <div>
                  <span className={styles.requestId}>Заявка №{request.id}</span>
                  <span className={`${styles.statusBadge} ${getStatusBadge(request.status).class}`}>
                    {getStatusBadge(request.status).text}
                  </span>
                </div>
                <span className={styles.requestDate}>
                  {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <div className={styles.requestBody}>
                <div className={styles.deviceInfo}>
                  <h3>{request.brand} {request.model}</h3>
                  <p className={styles.deviceType}>{request.deviceType}</p>
                </div>

                <div className={styles.issueInfo}>
                  <strong>Проблема:</strong>
                  <p>{request.issue}</p>
                </div>

                {request.description && (
                  <div className={styles.descriptionInfo}>
                    <strong>Описание:</strong>
                    <p>{request.description}</p>
                  </div>
                )}

                <div className={styles.metaInfo}>
                  <span className={`${styles.urgencyBadge} ${styles[`urgency${request.urgency}`]}`}>
                    Срочность: {getUrgencyLabel(request.urgency)}
                  </span>
                </div>
              </div>

              <div className={styles.requestFooter}>
                <button 
                  className={styles.detailsButton}
                  onClick={() => navigate(`/service/${request.id}`)}
                >
                  Подробнее
                </button>
                {request.status === 'pending' && (
                  <button 
                    className={styles.cancelRequestButton}
                    onClick={() => {
                      if (window.confirm('Отменить заявку?')) {
                        cancelRequest(request.id);
                      }
                    }}
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Service;